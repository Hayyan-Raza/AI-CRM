import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Layers, 
  Brain, 
  Code, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Getting Started',
    description: 'Learn the basics and set up your account',
    icon: Rocket,
    path: '/docs/getting-started',
    color: '#2d62ff',
  },
  {
    title: 'Core Features',
    description: 'Explore leads, deals, pipeline, and tasks',
    icon: Layers,
    path: '/docs/core-features',
    color: '#dd23bb',
  },
  {
    title: 'AI System',
    description: 'Understand AI-powered insights and predictions',
    icon: Brain,
    path: '/docs/ai-system',
    color: '#22c55e',
  },
  {
    title: 'API Docs',
    description: 'Integrate with our REST API',
    icon: Code,
    path: '/docs/api',
    color: '#f59e0b',
  },
];

const docCategories = [
  {
    title: 'Authentication & Security',
    items: [
      { label: 'Authentication & Security', path: '/docs/authentication' },
      { label: 'User Roles & Permissions', path: '/docs/user-roles' },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'Core CRM Features', path: '/docs/core-features' },
      { label: 'AI System Overview', path: '/docs/ai-system' },
      { label: 'Dashboards & Analytics', path: '/docs/dashboards-analytics' },
    ],
  },
  {
    title: 'Advanced Topics',
    items: [
      { label: 'Workflows & Use Cases', path: '/docs/workflows' },
      { label: 'API Documentation', path: '/docs/api' },
      { label: 'Errors & Edge Cases', path: '/docs/errors' },
      { label: 'Security & Compliance', path: '/docs/security' },
    ],
  },
];

export default function DocsHome() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d62ff]/10 border border-[#2d62ff]/30 mb-6">
          <Sparkles className="w-4 h-4 text-[#2d62ff]" />
          <span className="text-sm text-[#2d62ff]">NexusCRM Documentation</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to the Documentation
        </h1>
        <p className="text-lg text-[#868686] max-w-2xl mx-auto">
          Everything you need to know about using NexusCRM effectively. 
          From getting started to advanced AI features.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.path} to={link.path}>
              <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-all group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${link.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: link.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#2d62ff] transition-colors">
                          {link.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-[#868686] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-[#868686]">{link.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* What's New */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-[#2d62ff]" />
            <h2 className="text-lg font-semibold text-white">What's New in v2.0</h2>
            <Badge className="bg-[#22c55e]/20 text-[#22c55e]">Latest</Badge>
          </div>
          <ul className="space-y-2 text-[#d2d2d2]">
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#dd23bb]" />
              Enhanced AI-powered lead scoring with 95% accuracy
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#dd23bb]" />
              New pipeline automation workflows
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#dd23bb]" />
              Advanced reporting with custom dashboards
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#dd23bb]" />
              Mobile app for iOS and Android
            </li>
          </ul>
          <Link to="/docs/changelog">
            <Badge variant="outline" className="mt-4 border-[#2d62ff]/30 text-[#2d62ff] cursor-pointer hover:bg-[#2d62ff]/10">
              View Full Changelog
            </Badge>
          </Link>
        </CardContent>
      </Card>

      {/* Documentation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docCategories.map((category) => (
          <Card key={category.title} className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white text-lg">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className="text-[#d2d2d2] hover:text-[#2d62ff] transition-colors flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Need Help */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#22c55e]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Need Help?</h3>
                <p className="text-sm text-[#868686]">Can't find what you're looking for?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/docs/faq">
                <Button variant="outline" className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b]">
                  View FAQ
                </Button>
              </Link>
              <Link to="/docs/support">
                <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
