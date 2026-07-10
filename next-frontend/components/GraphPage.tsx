'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CapabilitySpatialGraph } from './CapabilitySpatialGraph';
import {
  capabilityNodes,
  graphNodes,
  graphRelations,
  graphResourceLinks,
  learningNodeExperiences,
  projects
} from '@/lib/textbook-data';
import type { Navigate } from './types';

function nodeMatchesResource(nodeId: string, reference: string) {
  if (reference === nodeId) return true;
  const range = reference.match(/^(P\dT\d)-N(\d{2})-\1-N(\d{2})$/);
  if (!range) return false;
  const node = nodeId.match(/^(P\dT\d)-N(\d{2})$/);
  return Boolean(node && node[1] === range[1] && Number(node[2]) >= Number(range[2]) && Number(node[2]) <= Number(range[3]));
}

function defaultNodeId(projectId: string) {
  if (projectId === 'P4') return 'P4T2-N04';
  return learningNodeExperiences.find((item) => item.projectId === projectId)?.nodeId
    ?? capabilityNodes.find((item) => item.project === projectId)?.id
    ?? 'P4T2-N04';
}

const relationTypes = ['全部关系', ...new Set(graphRelations.map((relation) => relation.type))];

export function GraphPage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const [selectedNodeId, setSelectedNodeId] = useState(() => defaultNodeId(project.id));
  const [graphMode, setGraphMode] = useState<'neighborhood' | 'overview'>('neighborhood');
  const [relationType, setRelationType] = useState('全部关系');

  useEffect(() => {
    setSelectedNodeId(defaultNodeId(project.id));
    setGraphMode('neighborhood');
    setRelationType('全部关系');
  }, [project.id]);

  const projectNodes = useMemo(() => capabilityNodes.filter((node) => node.project === project.id), [project.id]);
  const selectedNode = projectNodes.find((node) => node.id === selectedNodeId) ?? projectNodes[0] ?? capabilityNodes.find((node) => node.id === 'P4T2-N04')!;
  const activeResources = graphResourceLinks.filter((resource) => nodeMatchesResource(selectedNode.id, resource.node));
  const projectResources = graphResourceLinks.filter((resource) => resource.project === project.id || resource.project === '全书');
  const activeRelations = graphRelations.filter((relation) => (relation.from === selectedNode.id || relation.to === selectedNode.id) && (relationType === '全部关系' || relation.type === relationType));
  const nodeExperience = learningNodeExperiences.find((item) => item.nodeId === selectedNode.id);
  const projectExperience = learningNodeExperiences.find((item) => item.projectId === project.id);

  return (
    <div className="view-stack graph-workspace">
      <section className="panel graph-hero-panel">
        <div>
          <p className="eyebrow">课程能力图谱 · {project.id} 项目视图</p>
          <h2>{project.id} {project.title}</h2>
          <p>图谱把任务节点、资源卡、学习活动、课堂端侧和评价产出放在同一条可追踪路径里。当前选中的项目会随左侧项目链切换，不再固定显示 P4。</p>
        </div>
        <button className="secondary-action" onClick={() => onNavigate('task')} type="button">进入学生学习页</button>
      </section>

      <section className="panel p4-graph-stage">
        <div className="graph-section-title"><h3>课程主链中的当前位置</h3><span>主链连接课程项目；下方展示当前项目的任务级能力节点。</span></div>
        <div className="p4-course-chain">
          {graphNodes.map((node) => (
            <div key={node.id} className={`p4-chain-node ${node.project === project.id ? 'is-p4' : ''} ${node.project === project.id ? 'is-active' : ''}`}>
              <small>{node.id}</small><strong>{node.title}</strong><span>{node.project === project.id ? '当前项目' : node.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="p4-graph-grid">
        <section className="spatial-graph-column">
          <div className="graph-section-title"><div><p className="eyebrow">第二层 · 重点项目路径</p><h3>{project.id} 能力节点关系空间</h3></div><span>按样张的“节点邻域优先”原则呈现，先看当前节点的一跳关系，再切到总览。</span></div>
          <div className="graph-spatial-toolbar" aria-label="图谱视图控制">
            <div className="graph-segmented"><button className={graphMode === 'neighborhood' ? 'is-active' : ''} onClick={() => setGraphMode('neighborhood')} type="button">节点邻域</button><button className={graphMode === 'overview' ? 'is-active' : ''} onClick={() => setGraphMode('overview')} type="button">关系总览</button></div>
            <div className="graph-relation-filters">{relationTypes.map((type) => <button key={type} className={relationType === type ? 'is-active' : ''} onClick={() => setRelationType(type)} type="button">{type}</button>)}</div>
          </div>
          <CapabilitySpatialGraph nodes={projectNodes} relations={graphRelations} selectedNodeId={selectedNode.id} onSelectNode={(nodeId) => { setSelectedNodeId(nodeId); setGraphMode('neighborhood'); }} mode={graphMode} relationType={relationType} />
        </section>

        <aside className="panel p4-node-detail">
          <p className="eyebrow">{selectedNode.id} · {selectedNode.task}</p>
          <h3>{selectedNode.label}</h3>
          <div className="p4-detail-list">
            <article><strong>学习活动</strong><span>{selectedNode.activity}</span></article>
            <article><strong>评价产出</strong><span>{selectedNode.output}</span></article>
            <article><strong>节点状态</strong><span>{selectedNode.status}</span></article>
          </div>
          <NodeEndpointLinks nodeId={nodeExperience?.nodeId ?? (project.id === 'P4' ? 'P4T2-N04' : projectExperience?.nodeId)} projectId={project.id} />
          <div className="p4-detail-block">
            <h4>资源挂接</h4>
            {(activeResources.length ? activeResources : projectResources.slice(0, 3)).map((resource) => (
              <div key={resource.id} className="p4-resource-chip"><strong>{resource.title}</strong><span>{resource.id} · {resource.type}</span><small>产出：{resource.output}</small></div>
            ))}
          </div>
          <div className="p4-detail-block">
            <h4>关系说明</h4>
            {activeRelations.length ? activeRelations.map((relation) => <div key={`${relation.from}-${relation.to}-${relation.type}`} className="p4-relation-row"><b>{relation.type}</b><span>{relation.from} → {relation.to}</span><p>{relation.text}</p></div>) : <p>当前节点先在本项目内完成学习活动与评价产出，后续关系会随学习记录继续沉淀。</p>}
          </div>
        </aside>
      </section>

      <section className="graph-resource-output-band">
        <div className="graph-section-title"><div><p className="eyebrow">第四层 · 资源卡与评价产出</p><h3>{selectedNode.id} 的资源与可交付结果</h3></div><span>资源不是附件，而是为当前节点学习活动和评价产出服务的材料。</span></div>
        <div className="graph-resource-output-grid">
          {(activeResources.length ? activeResources : projectResources.slice(0, 4)).map((resource) => <article key={resource.id}><span>{resource.type}</span><strong>{resource.title}</strong><p>{resource.id} · 挂接 {resource.node}</p><em>{resource.output}</em></article>)}
          <article className="graph-output-focus"><span>评价产出</span><strong>{selectedNode.output}</strong><p>完成节点活动后，学生端生成可被教师端讲评和投屏端展示的学习记录。</p><em>{selectedNode.status}</em></article>
        </div>
      </section>
    </div>
  );
}

function NodeEndpointLinks({ nodeId, projectId }: { nodeId?: string; projectId: string }) {
  if (!nodeId) return <div className="p4-endpoint-links empty"><span>本项目样章正在补充端侧页面。</span></div>;
  return <div className="p4-endpoint-links" aria-label="节点四端学习闭环入口">
    <Link href={`/learn/${nodeId}`}>学生自学</Link>
    <Link href={`/classroom/${nodeId}`}>课堂跟随</Link>
    <Link href={`/teacher/sessions/${nodeId}`}>教师端</Link>
    <Link href={`/present/${nodeId}`}>投屏端</Link>
    <Link href={`/game?project=${projectId}`}>卡牌互动</Link>
  </div>;
}
