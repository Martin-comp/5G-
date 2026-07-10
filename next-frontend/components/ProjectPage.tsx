'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { textbookApi, type ProjectDetailDTO } from '@/lib/api';
import { p4TaskFlow, p4Tasks, projectTaskMap, projects } from '@/lib/textbook-data';
import type { Navigate } from './types';

type SourceState = 'checking' | 'api' | 'local';

export function ProjectPage({ projectId, selectedTask, onSelectTask, onNavigate }: { projectId: string; selectedTask: string; onSelectTask: (id: string) => void; onNavigate: Navigate }) {
  const [apiDetail, setApiDetail] = useState<ProjectDetailDTO | null>(null);
  const [source, setSource] = useState<SourceState>('checking');

  useEffect(() => {
    let alive = true;
    setSource('checking');
    setApiDetail(null);

    textbookApi.project(projectId)
      .then((detail) => {
        if (!alive) return;
        setApiDetail(detail);
        setSource('api');
      })
      .catch(() => {
        if (!alive) return;
        setSource('local');
      });

    return () => {
      alive = false;
    };
  }, [projectId]);

  const localProject = projects.find((item) => item.id === projectId) ?? projects[3];
  const project = apiDetail?.project ?? localProject;
  const sourceLabel = source === 'checking' ? '数据检测中' : source === 'api' ? 'Go API 数据' : '本地演示数据';
  const sourceClass = source === 'api' ? 'api' : source === 'checking' ? 'checking' : 'local';

  const nonP4Tasks = useMemo(() => {
    if (apiDetail?.tasks?.length) {
      return apiDetail.tasks.map((task) => ({ ...task, status: task.active ? '当前任务' : '课程任务' }));
    }
    return projectTaskMap[project.id] ?? [];
  }, [apiDetail, project.id]);

  if (project.id !== 'P4') {
    return (
      <div className="view-stack">
        <section className="panel page-head project-overview-head">
          <div>
            <p className="eyebrow">{project.id} · 课程项目</p>
            <h2>{project.title}</h2>
            <p>{project.note}。本页用于展示整书项目链中该章节的任务结构，后续可继续扩展为完整学习页。</p>
            <DataSourceBadge label={sourceLabel} tone={sourceClass} />
          </div>
          <div className="project-status-card">
            <span>当前状态</span>
            <strong>{project.status}</strong>
            <p>{project.id === 'P2' ? '该项目向P4-T2提供测试数据与证据输入。' : '已接入项目链导航，可继续补充深度任务内容。'}</p>
          </div>
        </section>
        <section className="task-grid overview-task-grid">
          {nonP4Tasks.map((task) => (
            <article key={task.id} className="task-card readonly">
              <span>{task.id}</span>
              <strong>{task.title}</strong>
              <small>{task.desc}</small>
              <em>{'status' in task ? task.status : '课程任务'}</em>
            </article>
          ))}
        </section>
        <section className="panel evidence-panel">
          <h3>{project.id === 'P2' ? '与项目四的证据关系' : '后续扩展建议'}</h3>
          {project.id === 'P2' ? (
            <div className="evidence-flow">
              {(apiDetail?.evidenceFlow ?? ['P2-T3 测试数据分析', '输出覆盖/SINR/切换事件', '进入P4-T2结果验证', '形成验收依据']).map((item) => (
                <article key={item}><strong>{item}</strong></article>
              ))}
            </div>
          ) : (
            <p className="muted-copy">当前先完成项目链可进入与章节概览。后续可以按老师要求，把该项目继续扩展成任务级学习页、资源卡和评价产出。</p>
          )}
          <button className="primary-action" onClick={() => onNavigate('task')} type="button">进入{project.id}学习样章</button>
        </section>
      </div>
    );
  }

  const p4TaskCards = apiDetail?.tasks?.length ? apiDetail.tasks : p4Tasks;

  return (
    <div className="view-stack">
      <section className="panel page-head">
        <div>
          <p className="eyebrow">项目四 · 5G端到端网络优化</p>
          <h2>P4-T2 5G网络优化结果验证</h2>
          <p>通过优化前后多维KPI验证，判断优化是否真正达标并闭环，形成规范的验收结论。</p>
          <DataSourceBadge label={sourceLabel} tone={sourceClass} />
        </div>
        <div className="step-strip"><span>1 案例问题</span><span>2 指标解释</span><span>3 判断活动</span><span>4 结论表达</span><span>5 订正反馈</span></div>
      </section>
      <section className="task-grid">
        {p4TaskCards.map((task) => (
          <button key={task.id} className={selectedTask === task.id || task.active ? 'task-card active' : 'task-card'} onClick={() => onSelectTask(task.id)} type="button">
            <span>{task.id}</span>
            <strong>{task.title}</strong>
            <small>{task.desc}</small>
          </button>
        ))}
      </section>
      <section className="panel p4-node-entry-panel">
        <div><p className="eyebrow">P4 任务间关系</p><h3>实施交接 → 结果验证 → 报告输出</h3><p>每个交接节点都能进入自学、课堂跟随、教师授课和投屏端，P4-T2 的 N01-N08 构成完整验收闭环。</p></div>
        <div className="p4-task-flow-links">
          {p4TaskFlow.map((item, index) => <Link key={item.id} href={`/learn/${item.id}`}><span>{item.task}</span><strong>{item.title}</strong><small>{item.note}</small>{index < p4TaskFlow.length - 1 && <em>→</em>}</Link>)}
        </div>
      </section>
      <section className="panel p4-node-entry-panel">
        <div><p className="eyebrow">P4-T2 节点学习闭环</p><h3>从任一节点进入自学、课堂、教师与投屏</h3></div>
        <div className="p4-node-entry-links">
          {p4Tasks.map((task) => <Link key={task.id} href={`/learn/P4T2-${task.id}`}>{task.id} {task.title}</Link>)}
        </div>
      </section>
      <section className="panel evidence-panel">
        <h3>来自项目二 P2-T3 的证据输入</h3>
        <div className="evidence-flow">
          {(apiDetail?.evidenceFlow ?? ['P2-T3 测试数据分析', '输出数据', '支撑验证维度', '结果验证结论']).map((item) => (
            <article key={item}><strong>{item}</strong></article>
          ))}
        </div>
        <button className="primary-action" onClick={() => onNavigate('task')} type="button">进入N04读移动性指标</button>
      </section>
    </div>
  );
}

function DataSourceBadge({ label, tone }: { label: string; tone: string }) {
  return <span className={`data-source-badge ${tone}`}>{label}</span>;
}
