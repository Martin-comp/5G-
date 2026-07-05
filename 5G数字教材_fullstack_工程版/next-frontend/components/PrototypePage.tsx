'use client';

import { useMemo, useState } from 'react';
import {
  ViewKey,
  classroomTasks,
  courseStats,
  graphNodes,
  mobilityMetrics,
  p4Tasks,
  projects,
  resourceCards,
  teacherSuggestions
} from '@/lib/textbook-data';

const tabs: { key: ViewKey; label: string }[] = [
  { key: 'course', label: '课程' },
  { key: 'project', label: '项目' },
  { key: 'task', label: 'N04学习' },
  { key: 'graph', label: '图谱' },
  { key: 'teacher', label: '教师' }
];

export default function HomePage() {
  const [view, setView] = useState<ViewKey>('course');
  const [selectedTask, setSelectedTask] = useState('N04');
  const [answer, setAnswer] = useState('');
  const activeTask = useMemo(() => p4Tasks.find((item) => item.id === selectedTask) ?? p4Tasks[3], [selectedTask]);

  return (
    <main className={`shell view-${view}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">5G</div>
          <div>
            <p>数字教材 · React + Next.js</p>
            <h1>5G网络优化教材（高级）</h1>
          </div>
        </div>
        <nav className="tabs" aria-label="主导航">
          {tabs.map((tab) => (
            <button key={tab.key} className={view === tab.key ? 'active' : ''} onClick={() => setView(tab.key)} type="button">
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="user-chip">学生端</div>
      </header>

      <section className="layout">
        <aside className="left-rail">
          <h2>课程项目链</h2>
          {projects.map((project) => (
            <button key={project.id} className={project.id === 'P4' ? 'rail-card active' : 'rail-card'} onClick={() => setView('project')} type="button">
              <span>{project.id}</span>
              <strong>{project.title}</strong>
              <small>{project.note}</small>
            </button>
          ))}
        </aside>

        <section className="workspace">
          {view === 'course' && <CourseView onEnterProject={() => setView('project')} />}
          {view === 'project' && <ProjectView selectedTask={selectedTask} onSelectTask={setSelectedTask} onEnterTask={() => setView('task')} />}
          {view === 'task' && <TaskView answer={answer} setAnswer={setAnswer} />}
          {view === 'graph' && <GraphView onOpenTask={() => setView('task')} />}
          {view === 'teacher' && <TeacherView />}
        </section>

        <aside className="context-panel">
          <h2>学习上下文</h2>
          <div className="context-card highlight">
            <small>当前节点</small>
            <strong>P4-T2 · {activeTask.title}</strong>
            <p>{activeTask.desc}</p>
          </div>
          <div className="context-card">
            <small>前置证据</small>
            <strong>P2-T3 测试数据</strong>
            <p>覆盖率、SINR、切换事件与投诉记录已经准备，可作为验证依据。</p>
          </div>
          <div className="context-card">
            <small>下一步</small>
            <strong>P4-T3 报告输出</strong>
            <p>整理验证结论，输出优化报告与后续建议。</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function CourseView({ onEnterProject }: { onEnterProject: () => void }) {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">推荐学习路径</p>
          <h2>P4-T2 5G网络优化结果验证</h2>
          <p>基于优化前后数据对比，验证优化效果是否达标，形成验收结论，为报告输出提供依据。</p>
          <button className="primary" onClick={onEnterProject} type="button">进入P4-T2任务学习</button>
        </div>
        <div className="target-visual" aria-hidden="true">
          <span />
          <strong>CG-05</strong>
          <small>结果验证</small>
        </div>
      </section>
      <section className="stat-grid">
        {courseStats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <p>{stat.note}</p>
          </article>
        ))}
      </section>
      <section className="chain-panel">
        <h3>任务链摘要</h3>
        <div className="task-flow three">
          <article><strong>P4-T1 优化实施</strong><p>制定并实施优化方案，完成参数调整与策略变更。</p></article>
          <article className="current"><strong>P4-T2 结果验证</strong><p>验证优化效果，确认是否达到目标并形成结论。</p></article>
          <article><strong>P4-T3 报告输出</strong><p>整理验证结论，提出后续优化建议。</p></article>
        </div>
      </section>
    </div>
  );
}

function ProjectView({ selectedTask, onSelectTask, onEnterTask }: { selectedTask: string; onSelectTask: (id: string) => void; onEnterTask: () => void }) {
  return (
    <div className="page-stack">
      <section className="section-head">
        <div>
          <p className="eyebrow">项目四 · 5G端到端网络优化</p>
          <h2>P4-T2 5G网络优化结果验证</h2>
          <p>通过对优化前后多维KPI验证，判断优化是否真正达标并闭环。</p>
        </div>
        <button className="ghost" type="button">任务说明</button>
      </section>
      <section className="task-grid">
        {p4Tasks.map((task) => (
          <button key={task.id} className={task.id === selectedTask ? 'task-card active' : 'task-card'} onClick={() => onSelectTask(task.id)} type="button">
            <span>{task.id}</span>
            <strong>{task.title}</strong>
            <small>{task.desc}</small>
          </button>
        ))}
      </section>
      <section className="evidence-panel">
        <h3>来自项目二 P2-T3 的证据输入</h3>
        <div className="evidence-flow">
          <article>测试数据分析</article>
          <article>输出数据</article>
          <article>支撑验证维度</article>
          <article>结果验证结论</article>
        </div>
        <button className="primary" onClick={onEnterTask} type="button">进入N04学习页</button>
      </section>
    </div>
  );
}

function TaskView({ answer, setAnswer }: { answer: string; setAnswer: (value: string) => void }) {
  return (
    <div className="page-stack">
      <section className="student-board">
        <div className="lesson-main">
          <p className="tag">P4T2-N04 · 当前讲授</p>
          <h2>覆盖达标后，为什么移动中仍会断？</h2>
          <div className="route-line">
            {['电梯口', 'A-B边界', '食堂入口', '就餐区'].map((label, index) => (
              <div key={label} className="route-node">
                <span>{index + 1}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
          <div className="conclusion">覆盖已改善，但移动性未闭环</div>
        </div>
        <div className="metric-stack">
          <h3>当前要看的三项移动性证据</h3>
          {mobilityMetrics.map((metric) => (
            <article key={metric.label} className={`metric-card ${metric.tone}`}>
              <div><strong>{metric.label}</strong><span>{metric.target}</span></div>
              <b>{metric.value}</b>
              <em>{metric.status}</em>
            </article>
          ))}
        </div>
      </section>
      <section className="answer-panel">
        <div>
          <h3>课堂小任务</h3>
          {classroomTasks.map((task, index) => <p key={task}><b>{index + 1}</b>{task}</p>)}
        </div>
        <label>
          我的边界结论
          <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="例如：覆盖指标达标，但A-B边界切换成功率低、重建次数偏多，因此移动性体验未闭环。" />
        </label>
        <button className="primary" type="button">提交作答</button>
      </section>
    </div>
  );
}

function GraphView({ onOpenTask }: { onOpenTask: () => void }) {
  return (
    <div className="page-stack graph-page">
      <section className="graph-panel">
        <h2>课程能力图谱</h2>
        <div className="graph-chain">
          {graphNodes.map((node) => (
            <button key={node.id} className={node.active ? 'graph-node active' : 'graph-node'} type="button">
              <span>{node.id}</span>
              <strong>{node.title}</strong>
            </button>
          ))}
        </div>
        <div className="local-graph">
          <article className="current-node"><strong>P4-T2</strong><span>移动性验证路径</span></article>
          <div className="subnodes">
            {p4Tasks.map((task) => <span key={task.id} className={task.active ? 'active' : ''}>{task.id}<br />{task.title.replace('读', '')}</span>)}
          </div>
        </div>
      </section>
      <section className="resource-panel">
        <h3>关联资源（双向定位）</h3>
        <div className="resource-grid">
          {resourceCards.map((card) => (
            <button key={card.title} className="resource-card" onClick={card.title.includes('学生') ? onOpenTask : undefined} type="button">
              <strong>{card.title}</strong>
              <small>{card.desc}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherView() {
  return (
    <div className="teacher-shell">
      <section className="teacher-stage">
        <p className="eyebrow">教师授课控制台</p>
        <h2>移动性验证黄金切片</h2>
        <div className="teacher-slide">
          <h3>覆盖达标后，为什么移动中仍会中断？</h3>
          <div className="dark-route"><span>1 电梯口</span><span>2 A-B边界</span><span>3 食堂入口</span><span>4 就餐区</span></div>
          <div className="dark-metrics">{mobilityMetrics.map((metric) => <b key={metric.label}>{metric.label}：{metric.value}</b>)}</div>
        </div>
      </section>
      <section className="teacher-side">
        <h3>AI预生成任务组织</h3>
        {teacherSuggestions.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </article>
        ))}
        <div className="teacher-actions">
          <button className="ghost dark" type="button">同步学生端</button>
          <button className="primary" type="button">开始讲评</button>
        </div>
      </section>
    </div>
  );
}
