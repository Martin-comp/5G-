package data

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresStore struct {
	pool *pgxpool.Pool
}

var postgresState = struct {
	sync.RWMutex
	store *PostgresStore
}{}

func ConfigurePostgres(ctx context.Context, databaseURL string) error {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return fmt.Errorf("create postgres pool: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return fmt.Errorf("ping postgres: %w", err)
	}
	store := &PostgresStore{pool: pool}
	if err := store.migrate(ctx); err != nil {
		pool.Close()
		return err
	}
	postgresState.Lock()
	postgresState.store = store
	postgresState.Unlock()
	return nil
}

func ClosePostgres() {
	postgresState.Lock()
	defer postgresState.Unlock()
	if postgresState.store != nil {
		postgresState.store.pool.Close()
		postgresState.store = nil
	}
}

func StorageMode() string {
	if currentPostgres() != nil {
		return "postgresql"
	}
	return "memory"
}

func currentPostgres() *PostgresStore {
	postgresState.RLock()
	defer postgresState.RUnlock()
	return postgresState.store
}

func (s *PostgresStore) migrate(ctx context.Context) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS classroom_sessions (
			class_id TEXT NOT NULL,
			node_id TEXT NOT NULL,
			slide_id TEXT NOT NULL,
			synced BOOLEAN NOT NULL DEFAULT FALSE,
			practice_pushed BOOLEAN NOT NULL DEFAULT FALSE,
			review_mode BOOLEAN NOT NULL DEFAULT FALSE,
			updated_at BIGINT NOT NULL,
			updated_by TEXT NOT NULL,
			PRIMARY KEY (class_id, node_id)
		)`,
		`CREATE INDEX IF NOT EXISTS classroom_sessions_active_idx ON classroom_sessions (class_id, synced, updated_at DESC)`,
		`CREATE TABLE IF NOT EXISTS classroom_tools (
			class_id TEXT NOT NULL,
			node_id TEXT NOT NULL,
			active_tool TEXT NOT NULL DEFAULT '',
			poll_open BOOLEAN NOT NULL DEFAULT FALSE,
			discussion_open BOOLEAN NOT NULL DEFAULT FALSE,
			group_task_open BOOLEAN NOT NULL DEFAULT FALSE,
			timer_running BOOLEAN NOT NULL DEFAULT FALSE,
			timer_seconds INTEGER NOT NULL DEFAULT 300,
			prompt TEXT NOT NULL DEFAULT '',
			poll_options JSONB NOT NULL DEFAULT '[]'::jsonb,
			updated_at BIGINT NOT NULL,
			PRIMARY KEY (class_id, node_id)
		)`,
		`CREATE TABLE IF NOT EXISTS classroom_submissions (
			id TEXT PRIMARY KEY,
			class_id TEXT NOT NULL,
			node_id TEXT NOT NULL,
			task_id TEXT NOT NULL,
			student_id TEXT NOT NULL,
			student_name TEXT NOT NULL,
			answer TEXT NOT NULL DEFAULT '',
			evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
			conclusion TEXT NOT NULL DEFAULT '',
			score INTEGER NOT NULL DEFAULT 0,
			selected_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
			tags JSONB NOT NULL DEFAULT '[]'::jsonb,
			created_at BIGINT NOT NULL
		)`,
		`CREATE INDEX IF NOT EXISTS classroom_submissions_node_idx ON classroom_submissions (class_id, node_id, created_at DESC)`,
		`CREATE INDEX IF NOT EXISTS classroom_submissions_student_idx ON classroom_submissions (class_id, student_id, created_at DESC)`,
		`CREATE TABLE IF NOT EXISTS self_study_progress (
			class_id TEXT NOT NULL,
			node_id TEXT NOT NULL,
			student_id TEXT NOT NULL,
			student_name TEXT NOT NULL,
			completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
			ability_score INTEGER NOT NULL DEFAULT 0,
			abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
			started_at BIGINT NOT NULL DEFAULT 0,
			time_spent_seconds INTEGER NOT NULL DEFAULT 0,
			practice_attempts INTEGER NOT NULL DEFAULT 0,
			practice_score INTEGER NOT NULL DEFAULT 0,
			wrong_knowledge_points JSONB NOT NULL DEFAULT '[]'::jsonb,
			review_status TEXT NOT NULL DEFAULT '',
			formal_test_attempts INTEGER NOT NULL DEFAULT 0,
			first_score INTEGER NOT NULL DEFAULT 0,
			best_score INTEGER NOT NULL DEFAULT 0,
			latest_score INTEGER NOT NULL DEFAULT 0,
			test_completed_at BIGINT NOT NULL DEFAULT 0,
			student_output TEXT NOT NULL DEFAULT '',
			output_submitted_at BIGINT NOT NULL DEFAULT 0,
			review_comment TEXT NOT NULL DEFAULT '',
			certified_at BIGINT NOT NULL DEFAULT 0,
			updated_at BIGINT NOT NULL,
			PRIMARY KEY (class_id, node_id, student_id)
		)`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS practice_attempts INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS practice_score INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS wrong_knowledge_points JSONB NOT NULL DEFAULT '[]'::jsonb`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS formal_test_attempts INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS first_score INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS best_score INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS latest_score INTEGER NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS test_completed_at BIGINT NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS student_output TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS output_submitted_at BIGINT NOT NULL DEFAULT 0`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS review_comment TEXT NOT NULL DEFAULT ''`,
		`ALTER TABLE self_study_progress ADD COLUMN IF NOT EXISTS certified_at BIGINT NOT NULL DEFAULT 0`,
		`CREATE INDEX IF NOT EXISTS self_study_progress_node_idx ON self_study_progress (class_id, node_id, updated_at DESC)`,
		`CREATE TABLE IF NOT EXISTS classroom_exits (
			id TEXT PRIMARY KEY,
			class_id TEXT NOT NULL,
			node_id TEXT NOT NULL,
			student_id TEXT NOT NULL,
			student_name TEXT NOT NULL,
			created_at BIGINT NOT NULL
		)`,
		`CREATE INDEX IF NOT EXISTS classroom_exits_node_idx ON classroom_exits (class_id, node_id, created_at DESC)`,
	}
	for _, statement := range statements {
		if _, err := s.pool.Exec(ctx, statement); err != nil {
			return fmt.Errorf("migrate postgres: %w", err)
		}
	}
	return nil
}

func (s *PostgresStore) saveSession(ctx context.Context, state ClassroomSessionState) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if state.Synced {
		if _, err := tx.Exec(ctx, `UPDATE classroom_sessions SET synced=FALSE WHERE class_id=$1 AND node_id<>$2`, state.ClassID, state.NodeID); err != nil {
			return err
		}
	}
	_, err = tx.Exec(ctx, `INSERT INTO classroom_sessions
		(class_id, node_id, slide_id, synced, practice_pushed, review_mode, updated_at, updated_by)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
		ON CONFLICT (class_id, node_id) DO UPDATE SET
		slide_id=EXCLUDED.slide_id, synced=EXCLUDED.synced, practice_pushed=EXCLUDED.practice_pushed,
		review_mode=EXCLUDED.review_mode, updated_at=EXCLUDED.updated_at, updated_by=EXCLUDED.updated_by`,
		state.ClassID, state.NodeID, state.SlideID, state.Synced, state.PracticePushed, state.ReviewMode, state.UpdatedAt, state.UpdatedBy)
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (s *PostgresStore) session(ctx context.Context, classID, nodeID string) (ClassroomSessionState, bool, error) {
	var state ClassroomSessionState
	err := s.pool.QueryRow(ctx, `SELECT class_id,node_id,slide_id,synced,practice_pushed,review_mode,updated_at,updated_by
		FROM classroom_sessions WHERE class_id=$1 AND node_id=$2`, classID, nodeID).Scan(
		&state.ClassID, &state.NodeID, &state.SlideID, &state.Synced, &state.PracticePushed, &state.ReviewMode, &state.UpdatedAt, &state.UpdatedBy)
	if errors.Is(err, pgx.ErrNoRows) {
		return ClassroomSessionState{}, false, nil
	}
	return state, err == nil, err
}

func (s *PostgresStore) activeSession(ctx context.Context, classID string) (ClassroomSessionState, bool, error) {
	var state ClassroomSessionState
	err := s.pool.QueryRow(ctx, `SELECT class_id,node_id,slide_id,synced,practice_pushed,review_mode,updated_at,updated_by
		FROM classroom_sessions WHERE class_id=$1 AND synced=TRUE ORDER BY updated_at DESC LIMIT 1`, classID).Scan(
		&state.ClassID, &state.NodeID, &state.SlideID, &state.Synced, &state.PracticePushed, &state.ReviewMode, &state.UpdatedAt, &state.UpdatedBy)
	if errors.Is(err, pgx.ErrNoRows) {
		return ClassroomSessionState{}, false, nil
	}
	return state, err == nil, err
}

func (s *PostgresStore) saveTools(ctx context.Context, state ClassroomToolState) error {
	options, _ := json.Marshal(state.PollOptions)
	_, err := s.pool.Exec(ctx, `INSERT INTO classroom_tools
		(class_id,node_id,active_tool,poll_open,discussion_open,group_task_open,timer_running,timer_seconds,prompt,poll_options,updated_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
		ON CONFLICT (class_id,node_id) DO UPDATE SET active_tool=EXCLUDED.active_tool,poll_open=EXCLUDED.poll_open,
		discussion_open=EXCLUDED.discussion_open,group_task_open=EXCLUDED.group_task_open,timer_running=EXCLUDED.timer_running,
		timer_seconds=EXCLUDED.timer_seconds,prompt=EXCLUDED.prompt,poll_options=EXCLUDED.poll_options,updated_at=EXCLUDED.updated_at`,
		state.ClassID, state.NodeID, state.ActiveTool, state.PollOpen, state.DiscussionOpen, state.GroupTaskOpen,
		state.TimerRunning, state.TimerSeconds, state.Prompt, options, state.UpdatedAt)
	return err
}

func (s *PostgresStore) tools(ctx context.Context, classID, nodeID string) (ClassroomToolState, bool, error) {
	var state ClassroomToolState
	var options []byte
	err := s.pool.QueryRow(ctx, `SELECT class_id,node_id,active_tool,poll_open,discussion_open,group_task_open,timer_running,timer_seconds,prompt,poll_options,updated_at
		FROM classroom_tools WHERE class_id=$1 AND node_id=$2`, classID, nodeID).Scan(
		&state.ClassID, &state.NodeID, &state.ActiveTool, &state.PollOpen, &state.DiscussionOpen, &state.GroupTaskOpen,
		&state.TimerRunning, &state.TimerSeconds, &state.Prompt, &options, &state.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return ClassroomToolState{}, false, nil
	}
	if err != nil {
		return ClassroomToolState{}, false, err
	}
	_ = json.Unmarshal(options, &state.PollOptions)
	return state, true, nil
}

func (s *PostgresStore) saveSubmission(ctx context.Context, item ClassroomSubmission) error {
	evidence, _ := json.Marshal(item.Evidence)
	selected, _ := json.Marshal(item.SelectedEvidence)
	tags, _ := json.Marshal(item.Tags)
	_, err := s.pool.Exec(ctx, `INSERT INTO classroom_submissions
		(id,class_id,node_id,task_id,student_id,student_name,answer,evidence,conclusion,score,selected_evidence,tags,created_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (id) DO NOTHING`,
		item.ID, item.ClassID, item.NodeID, item.TaskID, item.StudentID, item.StudentName, item.Answer,
		evidence, item.Conclusion, item.Score, selected, tags, item.CreatedAt)
	return err
}

func scanSubmission(row pgx.Row) (ClassroomSubmission, error) {
	var item ClassroomSubmission
	var evidence, selected, tags []byte
	err := row.Scan(&item.ID, &item.ClassID, &item.NodeID, &item.TaskID, &item.StudentID, &item.StudentName,
		&item.Answer, &evidence, &item.Conclusion, &item.Score, &selected, &tags, &item.CreatedAt)
	if err != nil {
		return item, err
	}
	_ = json.Unmarshal(evidence, &item.Evidence)
	_ = json.Unmarshal(selected, &item.SelectedEvidence)
	_ = json.Unmarshal(tags, &item.Tags)
	return item, nil
}

func (s *PostgresStore) submissions(ctx context.Context, classID, nodeID string) ([]ClassroomSubmission, error) {
	rows, err := s.pool.Query(ctx, `SELECT id,class_id,node_id,task_id,student_id,student_name,answer,evidence,conclusion,score,selected_evidence,tags,created_at
		FROM classroom_submissions WHERE class_id=$1 AND node_id=$2 ORDER BY created_at DESC`, classID, nodeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ClassroomSubmission{}
	for rows.Next() {
		item, err := scanSubmission(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (s *PostgresStore) submissionsForClass(ctx context.Context, classID string) ([]ClassroomSubmission, error) {
	rows, err := s.pool.Query(ctx, `SELECT id,class_id,node_id,task_id,student_id,student_name,answer,evidence,conclusion,score,selected_evidence,tags,created_at
		FROM classroom_submissions WHERE class_id=$1 ORDER BY created_at DESC`, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ClassroomSubmission{}
	for rows.Next() {
		item, err := scanSubmission(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (s *PostgresStore) saveSelfStudy(ctx context.Context, progress SelfStudyProgress) error {
	steps, _ := json.Marshal(progress.CompletedSteps)
	abilities, _ := json.Marshal(progress.Abilities)
	wrongKnowledgePoints, _ := json.Marshal(progress.WrongKnowledgePoints)
	_, err := s.pool.Exec(ctx, `INSERT INTO self_study_progress
		(class_id,node_id,student_id,student_name,completed_steps,ability_score,abilities,started_at,time_spent_seconds,practice_attempts,practice_score,wrong_knowledge_points,review_status,formal_test_attempts,first_score,best_score,latest_score,test_completed_at,student_output,output_submitted_at,review_comment,certified_at,updated_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
		ON CONFLICT (class_id,node_id,student_id) DO UPDATE SET student_name=EXCLUDED.student_name,
		completed_steps=EXCLUDED.completed_steps,ability_score=EXCLUDED.ability_score,abilities=EXCLUDED.abilities,
		started_at=EXCLUDED.started_at,time_spent_seconds=EXCLUDED.time_spent_seconds,
		practice_attempts=EXCLUDED.practice_attempts,practice_score=EXCLUDED.practice_score,
		wrong_knowledge_points=EXCLUDED.wrong_knowledge_points,review_status=EXCLUDED.review_status,
		formal_test_attempts=EXCLUDED.formal_test_attempts,first_score=EXCLUDED.first_score,best_score=EXCLUDED.best_score,
		latest_score=EXCLUDED.latest_score,test_completed_at=EXCLUDED.test_completed_at,student_output=EXCLUDED.student_output,
		output_submitted_at=EXCLUDED.output_submitted_at,review_comment=EXCLUDED.review_comment,certified_at=EXCLUDED.certified_at,
		updated_at=EXCLUDED.updated_at`,
		progress.ClassID, progress.NodeID, progress.StudentID, progress.StudentName, steps, progress.AbilityScore,
		abilities, progress.StartedAt, progress.TimeSpentSeconds, progress.PracticeAttempts, progress.PracticeScore,
		wrongKnowledgePoints, progress.ReviewStatus, progress.FormalTestAttempts, progress.FirstScore, progress.BestScore,
		progress.LatestScore, progress.TestCompletedAt, progress.StudentOutput, progress.OutputSubmittedAt,
		progress.ReviewComment, progress.CertifiedAt, progress.UpdatedAt)
	return err
}

func scanSelfStudy(row pgx.Row) (SelfStudyProgress, error) {
	var progress SelfStudyProgress
	var steps, abilities, wrongKnowledgePoints []byte
	err := row.Scan(&progress.ClassID, &progress.NodeID, &progress.StudentID, &progress.StudentName, &steps,
		&progress.AbilityScore, &abilities, &progress.StartedAt, &progress.TimeSpentSeconds, &progress.PracticeAttempts,
		&progress.PracticeScore, &wrongKnowledgePoints, &progress.ReviewStatus, &progress.FormalTestAttempts,
		&progress.FirstScore, &progress.BestScore, &progress.LatestScore, &progress.TestCompletedAt,
		&progress.StudentOutput, &progress.OutputSubmittedAt, &progress.ReviewComment, &progress.CertifiedAt, &progress.UpdatedAt)
	if err != nil {
		return progress, err
	}
	_ = json.Unmarshal(steps, &progress.CompletedSteps)
	_ = json.Unmarshal(abilities, &progress.Abilities)
	_ = json.Unmarshal(wrongKnowledgePoints, &progress.WrongKnowledgePoints)
	return progress, nil
}

func (s *PostgresStore) selfStudy(ctx context.Context, classID, nodeID, studentID string) (SelfStudyProgress, bool, error) {
	progress, err := scanSelfStudy(s.pool.QueryRow(ctx, `SELECT class_id,node_id,student_id,student_name,completed_steps,ability_score,abilities,started_at,time_spent_seconds,practice_attempts,practice_score,wrong_knowledge_points,review_status,formal_test_attempts,first_score,best_score,latest_score,test_completed_at,student_output,output_submitted_at,review_comment,certified_at,updated_at
		FROM self_study_progress WHERE class_id=$1 AND node_id=$2 AND student_id=$3`, classID, nodeID, studentID))
	if errors.Is(err, pgx.ErrNoRows) {
		return SelfStudyProgress{}, false, nil
	}
	return progress, err == nil, err
}

func (s *PostgresStore) selfStudyForNode(ctx context.Context, classID, nodeID string) ([]SelfStudyProgress, error) {
	rows, err := s.pool.Query(ctx, `SELECT class_id,node_id,student_id,student_name,completed_steps,ability_score,abilities,started_at,time_spent_seconds,practice_attempts,practice_score,wrong_knowledge_points,review_status,formal_test_attempts,first_score,best_score,latest_score,test_completed_at,student_output,output_submitted_at,review_comment,certified_at,updated_at
		FROM self_study_progress WHERE class_id=$1 AND node_id=$2 ORDER BY updated_at DESC`, classID, nodeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []SelfStudyProgress{}
	for rows.Next() {
		item, err := scanSelfStudy(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (s *PostgresStore) saveExit(ctx context.Context, item ClassroomExit) error {
	_, err := s.pool.Exec(ctx, `INSERT INTO classroom_exits (id,class_id,node_id,student_id,student_name,created_at)
		VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`, item.ID, item.ClassID, item.NodeID, item.StudentID, item.StudentName, item.CreatedAt)
	return err
}

func (s *PostgresStore) exits(ctx context.Context, classID, nodeID string) ([]ClassroomExit, error) {
	rows, err := s.pool.Query(ctx, `SELECT id,class_id,node_id,student_id,student_name,created_at
		FROM classroom_exits WHERE class_id=$1 AND node_id=$2 ORDER BY created_at DESC LIMIT 50`, classID, nodeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ClassroomExit{}
	for rows.Next() {
		var item ClassroomExit
		if err := rows.Scan(&item.ID, &item.ClassID, &item.NodeID, &item.StudentID, &item.StudentName, &item.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
