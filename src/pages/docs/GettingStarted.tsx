import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  UserPlus, 
  Settings, 
  Users, 
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up for a free 14-day trial. No credit card required.',
    icon: UserPlus,
    action: { label: 'Sign Up', path: '/signup' },
  },
  {
    number: '02',
    title: 'Set Up Your Company',
    description: 'Configure your company profile, team members, and preferences.',
    icon: Settings,
    action: { label: 'Learn More', path: '/docs/core-features' },
  },
  {
    number: '03',
    title: 'Add Your First Lead',
    description: 'Start building your pipeline by adding leads and contacts.',
    icon: Users,
    action: { label: 'Add Lead', path: '/dashboard/crm' },
  },
  {
    number: '04',
    title: 'Create Your First Deal',
    description: 'Track opportunities through your sales pipeline.',
    icon: Target,
    action: { label: 'Create Deal', path: '/dashboard/pipeline' },
  },
];

const features = [
  'Unlimited leads and contacts',
  'Visual sales pipeline',
  'AI-powered insights',
  'Team collaboration',
  'Mobile app access',
  'Email integration',
  'Custom reports',
  'API access (Pro)',
];

export default function GettingStarted() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Rocket className="w-3 h-3 mr-1" />
          Getting Started
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Getting Started with NexusCRM</h1>
        <p className="text-[#d2d2d2] text-lg">
          Welcome to NexusCRM! This guide will help you set up your account and start managing 
          your customer relationships like a pro.
        </p>
      </div>

      {/* Quick Start Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Quick Start in 4 Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-3xl font-bold text-[#2d62ff]/50">{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#2d62ff]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-[#868686] mb-4">{step.description}</p>
                      <Link to={step.action.path}>
                        <Button variant="outline" size="sm" className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b]">
                          {step.action.label}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* What's Included */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-[#dd23bb]" />
            <h2 className="text-xl font-semibold text-white">What's Included in Your Trial</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                <span className="text-[#d2d2d2]">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Next Steps</h2>
        <div className="space-y-3">
          <Link to="/docs/core-features">
            <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Explore Core Features</h3>
                  <p className="text-sm text-[#868686]">Learn about leads, deals, pipeline, and tasks</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#868686]" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/docs/ai-system">
            <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Discover AI Features</h3>
                  <p className="text-sm text-[#868686]">Understand AI-powered insights and predictions</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#868686]" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/docs/user-roles">
            <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Set Up Your Team</h3>
                  <p className="text-sm text-[#868686]">Configure user roles and permissions</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#868686]" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Help */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Need Help Getting Started?</h3>
              <p className="text-[#d2d2d2]">Our team is here to help you set up and succeed.</p>
            </div>
            <Link to="/docs/support">
              <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
