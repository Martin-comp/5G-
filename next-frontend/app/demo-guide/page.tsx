const routes = [
  { href: '/course', title: '课程首页', desc: '项目链、推荐学习路径、任务摘要。' },
  { href: '/project', title: '项目四 / P4-T2', desc: '任务节点、证据输入、学习入口。' },
  { href: '/task', title: 'N04学生学习页', desc: '移动性指标讲解、课堂小任务、提交作答。' },
  { href: '/graph', title: '课程能力图谱', desc: '能力主链、局部节点、资源双向定位。' },
  { href: '/teacher', title: '教师授课端', desc: '课堂讲评、AI任务组织和同步学生端。' }
];

export default function DemoGuidePage() {
  return (
    <main className="guide-page">
      <section className="guide-card">
        <p className="eyebrow">演示主线</p>
        <h1>5G网络优化数字教材 Next.js 路由结构</h1>
        <p>当前版本已经拆成可单独访问的前端页面，后续可以逐页接入 Go 后端接口。</p>
        <div className="guide-grid">
          {routes.map((route) => (
            <a key={route.href} href={route.href}>
              <strong>{route.title}</strong>
              <span>{route.href}</span>
              <p>{route.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
