import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  UserPlus, 
  Bell, 
  CheckSquare,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const workflows = [
  {
    title: 'Lead Capture & Assignment',
    description: 'Automatically capture and distribute leads to your sales team.',
    steps: [
      'Lead enters system via website form, email, or manual entry',
      'AI scores the lead based on quality and fit',
      'Lead is automatically assigned to available sales rep',
      'Assigned rep receives notification',
      'Follow-up task is created with due date',
    ],
    icon: UserPlus,
    color: '#2d62ff',
  },
  {
    title: 'Deal Stage Automation',
    description: 'Trigger actions when deals move through pipeline stages.',
    steps: [
      'Deal moves to "Qualified" stage',
      'Notification sent to sales manager',
      'Proposal template auto-generated',
      'Follow-up meeting scheduled',
      'Stakeholder analysis initiated',
    ],
    icon: TrendingUp,
    color: '#dd23bb',
  },
  {
    title: 'Follow-up Reminders',
    description: 'Never miss a follow-up with intelligent reminders.',
    steps: [
      'AI analyzes optimal follow-up timing',
      'Reminder created 24 hours before suggested time',
      'Email template suggested based on context',
      'If no response, escalation to manager',
      'Activity logged automatically',
    ],
    icon: Bell,
    color: '#f59e0b',
  },
  {
    title: 'Task Creation',
    description: 'Automatically create tasks based on activities.',
    steps: [
      'Call ends without next steps defined',
      'AI suggests follow-up actions',
      'Task created with appropriate priority',
      'Assigned to relevant team member',
      'Due date set based on urgency',
    ],
    icon: CheckSquare,
    color: '#22c55e',
  },
];

const useCases = [
  {
    title: 'SaaS Sales Team',
    description: 'Perfect for software companies with inbound and outbound sales.',
    features: [
      'Trial user to paid conversion tracking',
      'Feature adoption scoring',
      'Churn risk identification',
      'Expansion opportunity detection',
    ],
  },
  {
    title: 'Agency & Consulting',
    description: 'Ideal for service-based businesses managing multiple clients.',
    features: [
      'Project-based deal tracking',
      'Client communication history',
      'Proposal and contract management',
      'Retainer renewal reminders',
    ],
  },
  {
    title: 'Real Estate',
    description: 'Track properties, buyers, and sellers in one place.',
    features: [
      'Property listing management',
      'Buyer matching and alerts',
      'Showing schedule coordination',
      'Offer and negotiation tracking',
    ],
  },
];

export default function Workflows() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Workflow className="w-3 h-3 mr-1" />
          Workflows & Use Cases
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Workflows & Use Cases</h1>
        <p className="text-[#d2d2d2] text-lg">
          Automate your sales processes with intelligent workflows designed to save time 
          and increase efficiency.
        </p>
      </div>

      {/* Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Built-in Workflows</h2>
        <div className="space-y-4">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <Card key={workflow.title} className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${workflow.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: workflow.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{workflow.title}</h3>
                      <p className="text-sm text-[#868686] mb-4">{workflow.description}</p>
                      <div className="space-y-2">
                        {workflow.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#2d62ff]/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-[#2d62ff] font-medium">{i + 1}</span>
                            </div>
                            <span className="text-sm text-[#d2d2d2]">{step}</span>
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
      </div>

      {/* Use Cases */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Industry Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((useCase) => (
            <Card key={useCase.title} className="bg-[#141414] border-[#1f1f1f]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-sm text-[#868686] mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#d2d2d2]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Workflows */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white">Custom Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#d2d2d2] mb-4">
            Need a workflow specific to your business? Our Professional and Enterprise plans 
            include custom workflow creation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0a0a]">
              <h4 className="text-white font-medium mb-2">Workflow Builder</h4>
              <p className="text-sm text-[#868686]">
                Drag-and-drop interface to create custom automation rules
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a0a]">
              <h4 className="text-white font-medium mb-2">Trigger Conditions</h4>
              <p className="text-sm text-[#868686]">
                Set up triggers based on events, time, or data changes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
