import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bug, Zap, Shield } from 'lucide-react';

const releases = [
  {
    version: '2.1.0',
    date: 'February 2024',
    type: 'feature',
    changes: [
      'Added mobile app for iOS and Android',
      'New AI-powered conversation summaries',
      'Enhanced pipeline automation rules',
      'Improved email integration with Gmail',
    ],
  },
  {
    version: '2.0.0',
    date: 'January 2024',
    type: 'major',
    changes: [
      'Complete UI redesign with dark mode',
      'Gemini 3 AI integration',
      'New reporting dashboard',
      'Advanced workflow builder',
      'API v1 release',
    ],
  },
  {
    version: '1.9.2',
    date: 'December 2023',
    type: 'bugfix',
    changes: [
      'Fixed deal stage transition bug',
      'Improved task notification timing',
      'Resolved email sync issues',
      'Performance optimizations',
    ],
  },
  {
    version: '1.9.0',
    date: 'November 2023',
    type: 'feature',
    changes: [
      'Added custom fields for leads and deals',
      'New team performance reports',
      'Enhanced search functionality',
      'Bulk import/export improvements',
    ],
  },
  {
    version: '1.8.0',
    date: 'October 2023',
    type: 'security',
    changes: [
      'SOC 2 Type II certification achieved',
      'Enhanced two-factor authentication',
      'Improved audit logging',
      'Security vulnerability patches',
    ],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'major':
      return <Sparkles className="w-4 h-4" />;
    case 'feature':
      return <Zap className="w-4 h-4" />;
    case 'bugfix':
      return <Bug className="w-4 h-4" />;
    case 'security':
      return <Shield className="w-4 h-4" />;
    default:
      return <Zap className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'major':
      return 'bg-[#dd23bb]/20 text-[#dd23bb]';
    case 'feature':
      return 'bg-[#2d62ff]/20 text-[#2d62ff]';
    case 'bugfix':
      return 'bg-[#f59e0b]/20 text-[#f59e0b]';
    case 'security':
      return 'bg-[#22c55e]/20 text-[#22c55e]';
    default:
      return 'bg-[#2d62ff]/20 text-[#2d62ff]';
  }
};

export default function Changelog() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Releases & Changelog
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Releases & Changelog</h1>
        <p className="text-[#d2d2d2] text-lg">
          Stay up to date with the latest features, improvements, and bug fixes.
        </p>
      </div>

      {/* Releases */}
      <div className="space-y-4">
        {releases.map((release) => (
          <Card key={release.version} className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">v{release.version}</h3>
                  <Badge className={getTypeColor(release.type)}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(release.type)}
                      {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
                    </span>
                  </Badge>
                </div>
                <span className="text-sm text-[#868686]">{release.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#d2d2d2]">
                    <span className="text-[#2d62ff]">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Version Legend */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Version Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#dd23bb]/20 text-[#dd23bb]">
                <Sparkles className="w-3 h-3 mr-1" />
                Major
              </Badge>
              <span className="text-sm text-[#868686]">Significant new features or changes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#2d62ff]/20 text-[#2d62ff]">
                <Zap className="w-3 h-3 mr-1" />
                Feature
              </Badge>
              <span className="text-sm text-[#868686]">New functionality added</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#f59e0b]/20 text-[#f59e0b]">
                <Bug className="w-3 h-3 mr-1" />
                Bugfix
              </Badge>
              <span className="text-sm text-[#868686]">Issues resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#22c55e]/20 text-[#22c55e]">
                <Shield className="w-3 h-3 mr-1" />
                Security
              </Badge>
              <span className="text-sm text-[#868686]">Security improvements</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
