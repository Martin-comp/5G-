import Link from 'next/link';
import { AuthGate } from '@/components/AuthGate';
import { p4NodeExperience } from '@/lib/textbook-data';

export default function ClassroomIndexPage() {
  return (
    <AuthGate role="student">
      <main className="node-index-page">
        <section>
          <p className="eyebrow">课堂跟随入口</p>
          <h1>P4-T2 课堂跟随</h1>
          <p>当前先开放 {p4NodeExperience.nodeId}：{p4NodeExperience.title}。学生进入后只跟随教师当前讲解，完成本页小任务。</p>
          <Link href={`/classroom/${p4NodeExperience.nodeId}`}>进入 {p4NodeExperience.nodeId} 课堂跟随</Link>
        </section>
      </main>
    </AuthGate>
  );
}
