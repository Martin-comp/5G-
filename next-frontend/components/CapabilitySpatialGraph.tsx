'use client';

import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

type GraphNode = {
  id: string;
  label: string;
  task: string;
  activity: string;
  output: string;
  status: string;
};

type GraphRelation = {
  type: string;
  from: string;
  to: string;
  text: string;
};

type GraphMode = 'neighborhood' | 'overview';

type Position = [number, number, number];

const relationColors: Record<string, string> = {
  '直接递进': '#178a78',
  '任务内递进': '#178a78',
  '前置基础': '#2d6fcc',
  '支撑判断': '#c37a1f',
  '问题回流': '#c54852',
  '深度诊断': '#8158c9',
  '资源证据': '#6f7990'
};

export function CapabilitySpatialGraph({
  nodes,
  relations,
  selectedNodeId,
  onSelectNode,
  mode,
  relationType
}: {
  nodes: GraphNode[];
  relations: GraphRelation[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  mode: GraphMode;
  relationType: string;
}) {
  const { positions, visibleRelations, relatedNodeIds } = useMemo(() => {
    const nextPositions = new Map<string, Position>();
    const localNodeIds = new Set(nodes.map((node) => node.id));
    const typeMatched = relations.filter((relation) => relationType === '全部关系' || relation.type === relationType);
    const localRelations = typeMatched.filter((relation) => localNodeIds.has(relation.from) && localNodeIds.has(relation.to));
    const focusRelations = mode === 'neighborhood'
      ? localRelations.filter((relation) => relation.from === selectedNodeId || relation.to === selectedNodeId)
      : localRelations;
    const nextRelated = new Set<string>([selectedNodeId]);
    focusRelations.forEach((relation) => { nextRelated.add(relation.from); nextRelated.add(relation.to); });

    if (mode === 'neighborhood') {
      nextPositions.set(selectedNodeId, [0, 0, 0.7]);
      const connectedIds = [...nextRelated].filter((id) => id !== selectedNodeId);
      connectedIds.forEach((id, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(connectedIds.length, 3) - Math.PI / 2;
        nextPositions.set(id, [Math.cos(angle) * 4.1, Math.sin(angle) * 2.5, index % 2 ? 0.1 : 0.36]);
      });
      nodes.filter((node) => !nextRelated.has(node.id)).forEach((node, index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        nextPositions.set(node.id, [column ? 7.25 : -7.25, 3.35 - row * 1.35, -0.45]);
      });
    } else {
      const groups = new Map<string, GraphNode[]>();
      nodes.forEach((node) => groups.set(node.task, [...(groups.get(node.task) ?? []), node]));
      const taskEntries = [...groups.entries()];
      taskEntries.forEach(([, items], taskIndex) => {
        const x = (taskIndex - (taskEntries.length - 1) / 2) * 5.1;
        const offset = (items.length - 1) / 2;
        items.forEach((node, index) => nextPositions.set(node.id, [x, (offset - index) * 1.15, taskIndex % 2 === 0 ? -0.28 : 0.28]));
      });
    }
    return { positions: nextPositions, visibleRelations: focusRelations, relatedNodeIds: nextRelated };
  }, [mode, nodes, relationType, relations, selectedNodeId]);

  return <section className="capability-spatial-graph" aria-label="可交互课程能力图谱">
    <Canvas camera={{ position: [0, 0, 13], fov: 44 }} dpr={[1, 1.6]}>
      <color attach="background" args={['#f8fcfa']} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} />
      <SpatialGrid />
      {visibleRelations.map((relation) => {
        const from = positions.get(relation.from);
        const to = positions.get(relation.to);
        if (!from || !to) return null;
        return <RelationCurve key={`${relation.from}-${relation.to}-${relation.type}`} from={from} to={to} color={relationColors[relation.type] ?? '#6f7990'} focused={relation.from === selectedNodeId || relation.to === selectedNodeId} />;
      })}
      {nodes.map((node) => {
        const position = positions.get(node.id);
        if (!position) return null;
        return <SpatialNode key={node.id} node={node} position={position} selected={node.id === selectedNodeId} related={relatedNodeIds.has(node.id)} muted={mode === 'neighborhood' && !relatedNodeIds.has(node.id)} onSelect={onSelectNode} />;
      })}
      <OrbitControls enableRotate={false} enablePan enableZoom minDistance={7} maxDistance={20} target={[0, 0, 0]} />
    </Canvas>
    <div className="spatial-canvas-caption"><span>拖拽平移</span><span>滚轮缩放</span><span>点击节点聚焦关系</span></div>
  </section>;
}

function SpatialGrid() {
  const lines = useMemo(() => {
    const items: THREE.Vector3[][] = [];
    for (let x = -8; x <= 8; x += 2) items.push([new THREE.Vector3(x, -5, -0.8), new THREE.Vector3(x, 5, -0.8)]);
    for (let y = -4; y <= 4; y += 2) items.push([new THREE.Vector3(-9, y, -0.8), new THREE.Vector3(9, y, -0.8)]);
    return items;
  }, []);
  return <group>{lines.map((points, index) => <line key={index}><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(points.flatMap((point) => point.toArray())), 3]} /></bufferGeometry><lineBasicMaterial color="#dcece6" transparent opacity={0.8} /></line>)}</group>;
}

function RelationCurve({ from, to, color, focused }: { from: Position; to: Position; color: string; focused: boolean }) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(from[0], from[1], from[2]);
    const end = new THREE.Vector3(to[0], to[1], to[2]);
    const midpoint = start.clone().lerp(end, 0.5);
    midpoint.z += focused ? 0.9 : 0.45;
    return new THREE.QuadraticBezierCurve3(start, midpoint, end).getPoints(28);
  }, [focused, from, to]);
  return <group><line><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(points.flatMap((point) => point.toArray())), 3]} /></bufferGeometry><lineBasicMaterial color={color} transparent opacity={focused ? 0.95 : 0.38} linewidth={focused ? 2.5 : 1} /></line><mesh position={to}><sphereGeometry args={[focused ? 0.12 : 0.07, 16, 16]} /><meshStandardMaterial color={color} /></mesh></group>;
}

function SpatialNode({ node, position, selected, related, muted, onSelect }: { node: GraphNode; position: Position; selected: boolean; related: boolean; muted: boolean; onSelect: (nodeId: string) => void }) {
  const tone = selected ? '#0d927d' : related ? '#4aa992' : '#b5d9cf';
  return <group position={position}>
    {selected && <><mesh position={[0, 0, -0.08]}><circleGeometry args={[1.48, 36]} /><meshBasicMaterial color="#a7dfd0" transparent opacity={0.28} /></mesh><mesh position={[0, 0, -0.06]}><ringGeometry args={[1.18, 1.35, 36]} /><meshBasicMaterial color="#15917e" transparent opacity={0.7} /></mesh></>}
    <mesh onClick={(event) => { event.stopPropagation(); onSelect(node.id); }}>
      <boxGeometry args={[selected ? 3.45 : 2.9, selected ? 1.08 : 0.86, 0.22]} />
      <meshStandardMaterial color={selected ? '#e3f7f0' : '#ffffff'} roughness={0.86} metalness={0} transparent opacity={muted ? 0.32 : 1} />
    </mesh>
    <mesh position={[-1.18, 0, 0.14]}><sphereGeometry args={[0.15, 20, 20]} /><meshStandardMaterial color={tone} /></mesh>
    <Html center transform={false} position={[0, 0, 0.22]} style={{ pointerEvents: 'auto', opacity: muted ? 0.36 : 1 }}>
      <button className={`spatial-node-label ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(node.id)} type="button">
        <small>{node.id}</small><strong>{node.label}</strong><span>{node.output}</span>
      </button>
    </Html>
  </group>;
}
