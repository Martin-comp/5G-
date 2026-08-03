import Link from 'next/link';
import { deliveryPackage, governanceGates, productionStages, publicResourceSummary } from '@/lib/sample-parity-data';

type PlatformSection = 'platform' | 'resources' | 'governance' | 'delivery';

const navItems: { id: PlatformSection; title: string; href: string }[] = [
  { id: 'platform', title: '生产链', href: '/platform' },
  { id: 'resources', title: '资源清单', href: '/resources' },
  { id: 'governance', title: '质量治理', href: '/governance' },
  { id: 'delivery', title: '交付包', href: '/delivery' }
];

function PublicHeader({ active }: { active: PlatformSection }) {
  return <header className="public-platform-topbar">
    <div><Link href="/platform">DG</Link><span><strong>DGBook 数字教材生产平台</strong><small>公开演示 · 只读边界</small></span></div>
    <nav>{navItems.map((item) => <Link className={active === item.id ? 'active' : ''} href={item.href} key={item.id}>{item.title}</Link>)}</nav>
    <Link className="public-login-link" href="/login">进入端侧登录</Link>
  </header>;
}

export function PublicPlatformPage({ section }: { section: PlatformSection }) {
  return <main className="public-platform-page"><PublicHeader active={section} />{section === 'platform' ? <PlatformOverview /> : section === 'resources' ? <ResourceOverview /> : section === 'governance' ? <GovernanceOverview /> : <DeliveryOverview />}</main>;
}

function PlatformOverview() {
  return <section className="public-platform-shell">
    <header className="public-platform-hero"><div><p className="eyebrow">数字教材端到端生产链</p><h1>从多源素材到可教学、可审核、可追溯的数字教材</h1><p>公开页只展示流程、结构与治理结果，不连接班级学习数据库，也不暴露受保护的原始素材。</p></div><aside><strong>8</strong><span>生产阶段</span><small>输入、生成、治理、教学、回流</small></aside></header>
    <section className="production-stage-grid">{productionStages.map((stage, index) => <article key={stage.id}><span>{stage.id}</span><div><strong>{stage.title}</strong><p>{stage.desc}</p></div>{index < productionStages.length - 1 ? <i>→</i> : null}</article>)}</section>
    <section className="platform-public-boundary"><div><p className="eyebrow">公开边界</p><h2>能看见什么</h2><p>流程、统计、资源类型、质量门禁与交付结构。</p></div><div><p className="eyebrow">受保护边界</p><h2>不会公开什么</h2><p>学生记录、教师批阅、账户身份、受限素材和服务密钥。</p></div><Link href="/resources">查看 P1 资源生产结果 →</Link></section>
  </section>;
}

function ResourceOverview() {
  return <section className="public-platform-shell">
    <header className="public-section-heading"><div><p className="eyebrow">P1 资源生产清单</p><h1>三项真实任务、十二个顺序节点</h1><p>资源按任务、节点、学习阶段、使用端和评价产出进行双向定位。</p></div><div><strong>12</strong><span>节点</span><strong>6</strong><span>互动</span></div></header>
    <section className="public-resource-task-grid">{publicResourceSummary.map((task, index) => <article key={task.title}><header><b>{String(index + 1).padStart(2, '0')}</b><span>任务资源包</span></header><h2>{task.title}</h2><dl><div><dt>顺序节点</dt><dd>{task.nodes}</dd></div><div><dt>互动活动</dt><dd>{task.interactions}</dd></div><div><dt>评价产出</dt><dd>{task.output}</dd></div></dl><footer><span>图文</span><span>语音</span><span>互动</span><span>测试</span><span>学习单</span></footer></article>)}</section>
    <section className="public-resource-summary"><article><strong>6</strong><span>课程项目</span></article><article><strong>18</strong><span>典型任务</span></article><article><strong>36</strong><span>互动活动</span></article><article><strong>353</strong><span>媒体引用</span></article><Link href="/governance">进入质量门禁 →</Link></section>
  </section>;
}

function GovernanceOverview() {
  return <section className="public-platform-shell">
    <header className="public-section-heading"><div><p className="eyebrow">发布前质量治理</p><h1>四类门禁共同决定资源能否进入教材</h1><p>任何必需资源未通过完整性、可用性、视觉质量或追溯检查，节点都不能标记为可交付。</p></div><div><strong>4</strong><span>门禁</span><strong>1</strong><span>待复核</span></div></header>
    <section className="governance-gate-grid">{governanceGates.map((gate) => <article key={gate.title}><header><span>{gate.title}</span><em className={gate.status === '通过' ? 'passed' : ''}>{gate.status}</em></header><ul>{gate.checks.map((check) => <li key={check}>{check}</li>)}</ul><footer><i><b style={{ width: gate.status === '通过' ? '100%' : '72%' }} /></i><small>{gate.status === '通过' ? '允许进入发布候选' : '需要人工确认后放行'}</small></footer></article>)}</section>
    <section className="version-flow"><div><p className="eyebrow">版本流</p><h2>素材 → 资源 → 节点 → 任务 → 整书</h2></div>{['素材 v1', '资源 v2', '节点 v1.3', '任务 v1.1', '整书候选'].map((item, index) => <span key={item}><b>{item}</b>{index < 4 ? <i>→</i> : null}</span>)}<Link href="/delivery">查看交付结构 →</Link></section>
  </section>;
}

function DeliveryOverview() {
  return <section className="public-platform-shell">
    <header className="public-section-heading"><div><p className="eyebrow">出版社资源交付包</p><h1>教材页面与生产资产同步交付</h1><p>该页展示交付结构，不提供匿名上传、在线生成或受限文件下载。</p></div><div><strong>1</strong><span>候选版本</span><strong>6</strong><span>交付分组</span></div></header>
    <section className="delivery-package-layout"><div className="delivery-book-preview"><span>DGBook</span><h2>5G网络优化<br />数字教材</h2><p>发布候选 · 2026.08</p><footer>项目任务导学 · 能力图谱 · 多资源学习</footer></div><div className="delivery-package-list"><h2>交付目录</h2>{deliveryPackage.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span><em>已封装</em></article>)}</div><aside><h2>交付说明</h2><p>数字教材成品直接包含学生端、教师端、课堂协同和学习数据接口说明。</p><dl><div><dt>质量状态</dt><dd>发布候选</dd></div><div><dt>资源定位</dt><dd>双向可追溯</dd></div><div><dt>数据边界</dt><dd>公开页不连接学习库</dd></div></dl><Link href="/student/projects/P1">查看端侧样章</Link></aside></section>
  </section>;
}
