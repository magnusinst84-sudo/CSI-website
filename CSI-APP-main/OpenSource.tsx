import { useInView } from '@/hooks/useInView';
import { Github, GitPullRequest, GitCommit, Users, Star, CircleDot } from 'lucide-react';

const leaderboard = [
  { name: 'Alex Chen', commits: 342, prs: 28, issues: 15, streak: 45 },
  { name: 'Divya R', commits: 298, prs: 24, issues: 12, streak: 38 },
  { name: 'Vikram S', commits: 267, prs: 21, issues: 18, streak: 32 },
  { name: 'Ananya K', commits: 245, prs: 19, issues: 9, streak: 28 },
  { name: 'Rahul M', commits: 198, prs: 16, issues: 22, streak: 21 },
  { name: 'Sneha P', commits: 176, prs: 14, issues: 11, streak: 19 },
  { name: 'Karthik R', commits: 154, prs: 12, issues: 8, streak: 16 },
  { name: 'Meera K', commits: 132, prs: 10, issues: 14, streak: 14 },
];

const issues = [
  { title: 'Add dark mode toggle to dashboard', repo: 'csi-nextgen/web', labels: ['good first issue', 'enhancement'], difficulty: 'Easy' },
  { title: 'Fix mobile navigation overflow on iOS', repo: 'csi-nextgen/web', labels: ['bug', 'mobile'], difficulty: 'Medium' },
  { title: 'Implement Redis caching for API responses', repo: 'csi-nextgen/api', labels: ['performance', 'backend'], difficulty: 'Hard' },
  { title: 'Create unit tests for auth middleware', repo: 'csi-nextgen/api', labels: ['good first issue', 'testing'], difficulty: 'Easy' },
  { title: 'Design system: Add new button variants', repo: 'csi-nextgen/design', labels: ['design', 'ui'], difficulty: 'Medium' },
];

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

export default function OpenSource() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="open-source" ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-cyan mb-4 inline-block">Open Source</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            OSS Contribution Hub
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-[#a1a1aa]">
            Track contributions, find beginner-friendly issues, and climb the leaderboard.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: GitCommit, label: 'Total Commits', value: '12,450+' },
            { icon: GitPullRequest, label: 'Pull Requests', value: '1,280+' },
            { icon: Users, label: 'Contributors', value: '156' },
            { icon: Star, label: 'Repos Starred', value: '3,420+' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 text-center">
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-[#a1a1aa]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-cyan-400" />
                Contribution Leaderboard
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {leaderboard.map((user, i) => (
                <div
                  key={user.name}
                  className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                    isInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="w-8 text-center font-bold text-[#a1a1aa]">
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="flex gap-3 text-xs text-[#a1a1aa]">
                      <span className="flex items-center gap-1">
                        <GitCommit className="w-3 h-3" />
                        {user.commits}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3" />
                        {user.prs}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{user.streak}d</div>
                    <div className="text-xs text-amber-400">streak</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Issues */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-green-400" />
                Beginner-Friendly Issues
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {issues.map((issue, i) => (
                <div
                  key={issue.title}
                  className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                    isInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${i * 75}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                      {issue.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${difficultyColor[issue.difficulty]}`}>
                      {issue.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-[#a1a1aa] mb-2">{issue.repo}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {issue.labels.map((label) => (
                      <span key={label} className="skill-tag text-xs py-0.5">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
