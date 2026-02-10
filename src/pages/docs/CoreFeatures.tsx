import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Users, 
  Target, 
  BarChart3, 
  CheckSquare, 
  Clock,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    title: 'Lead Management',
    icon: Users,
    color: '#2d62ff',
    description: 'Capture, track, and nurture leads through your sales funnel.',
    capabilities: [
      'Lead capture from multiple sources (website, referrals, events)',
      'Custom lead fields and scoring',
      'Lead assignment and distribution',
      'Lead status tracking (New, Contacted, Qualified, etc.)',
      'Duplicate detection and merging',
      'Lead import/export',
    ],
  },
  {
    title: 'Deal & Opportunity Management',
    icon: Target,
    color: '#dd23bb',
    description: 'Track deals through your sales pipeline from start to close.',
    capabilities: [
      'Visual pipeline with customizable stages',
      'Deal value and probability tracking',
      'Expected close date forecasting',
      'Win/loss reason tracking',
      'Competitor analysis',
      'Deal activity timeline',
    ],
  },
  {
    title: 'Sales Pipeline',
    icon: BarChart3,
    color: '#22c55e',
    description: 'Visualize and manage your entire sales process.',
    capabilities: [
      'Drag-and-drop pipeline management',
      'Multiple pipeline views',
      'Stage-based automation',
      'Pipeline velocity tracking',
      'Conversion rate analysis',
      'Bottleneck identification',
    ],
  },
  {
    title: 'Tasks & Follow-ups',
    icon: CheckSquare,
    color: '#f59e0b',
    description: 'Never miss a follow-up with intelligent task management.',
    capabilities: [
      'Task creation and assignment',
      'Due date and priority setting',
      'Recurring tasks',
      'Task templates',
      'Overdue reminders',
      'Task-related to leads/deals',
    ],
  },
  {
    title: 'Activity Timeline',
    icon: Clock,
    color: '#8b5cf6',
    description: 'Complete history of all customer interactions.',
    capabilities: [
      'Chronological activity feed',
      'Call, email, and meeting logs',
      'Note taking and attachments',
      'Automatic activity capture',
      'Activity filtering and search',
      'Team activity visibility',
    ],
  },
  {
    title: 'Conversation Capture',
    icon: MessageSquare,
    color: '#06b6d4',
    description: 'Log and track all customer communications.',
    capabilities: [
      'Call notes and recordings',
      'Email integration and tracking',
      'Meeting notes and action items',
      'SMS logging',
      'Communication templates',
      'AI-powered conversation summaries',
    ],
  },
];

export default function CoreFeatures() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Layers className="w-3 h-3 mr-1" />
          Core CRM Features
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Core CRM Features</h1>
        <p className="text-[#d2d2d2] text-lg">
          NexusCRM provides a comprehensive set of features to manage your entire sales process, 
          from lead capture to deal closure.
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="bg-[#141414] border-[#1f1f1f]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-[#868686] mb-4">{feature.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {feature.capabilities.map((capability) => (
                        <div key={capability} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#d2d2d2]">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Deal Lifecycle */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Deal Lifecycle Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {['New Lead', 'Contacted', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost'].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 border-[#2d62ff]/30 text-[#d2d2d2]"
                >
                  {stage}
                </Badge>
                {i < 5 && (
                  <div className="w-4 h-0.5 bg-[#1f1f1f]" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#868686] mt-4">
            Deals progress through these stages in your pipeline. Each stage can have custom 
            fields, required activities, and automation rules.
          </p>
        </CardContent>
      </Card>

      {/* Lead Sources */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Supported Lead Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Event', 'Other'].map((source) => (
              <Badge 
                key={source}
                variant="outline" 
                className="px-3 py-1 border-[#1f1f1f] text-[#d2d2d2]"
              >
                {source}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-[#868686] mt-4">
            Track where your leads come from to optimize your marketing efforts and budget allocation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
