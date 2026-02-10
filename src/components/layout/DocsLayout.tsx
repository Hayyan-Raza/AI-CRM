import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  BookOpen, 
  Search, 
  Menu, 
  ChevronRight,
  Home,
  Shield,
  Users,
  Layers,
  Brain,
  BarChart3,
  Workflow,
  Code,
  AlertTriangle,
  Lock,
  History,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const docSections = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Documentation Home', path: '/docs', icon: BookOpen },
      { label: 'Getting Started', path: '/docs/getting-started', icon: Home },
    ],
  },
  {
    title: 'Authentication & Security',
    items: [
      { label: 'Authentication & Security', path: '/docs/authentication', icon: Shield },
      { label: 'User Roles & Permissions', path: '/docs/user-roles', icon: Users },
    ],
  },
  {
    title: 'Core Features',
    items: [
      { label: 'Core CRM Features', path: '/docs/core-features', icon: Layers },
    ],
  },
  {
    title: 'AI & Analytics',
    items: [
      { label: 'AI System Overview', path: '/docs/ai-system', icon: Brain },
      { label: 'Dashboards & Analytics', path: '/docs/dashboards-analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Workflows & Use Cases', path: '/docs/workflows', icon: Workflow },
      { label: 'API Documentation', path: '/docs/api', icon: Code },
      { label: 'Errors & Edge Cases', path: '/docs/errors', icon: AlertTriangle },
      { label: 'Security & Compliance', path: '/docs/security', icon: Lock },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Releases & Changelog', path: '/docs/changelog', icon: History },
      { label: 'FAQ & Troubleshooting', path: '/docs/faq', icon: HelpCircle },
      { label: 'Support & Contact', path: '/docs/support', icon: MessageSquare },
    ],
  },
];

export default function DocsLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1f1f1f]">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">NexusCRM</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868686]" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0a0a0a] border-[#1f1f1f] text-white placeholder:text-[#868686]"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="px-4 pb-4">
          {docSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-[#868686] uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                          isActive
                            ? 'bg-[#2d62ff]/20 text-white border-l-2 border-[#2d62ff]'
                            : 'text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', isActive && 'text-[#2d62ff]')} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Back to Dashboard */}
      <div className="p-4 border-t border-[#1f1f1f]">
        <Link to="/dashboard">
          <Button variant="outline" className="w-full border-[#1f1f1f] bg-[#0a0a0a] text-[#d2d2d2] hover:bg-[#1b1b1b]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#141414] border-r border-[#1f1f1f] fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-[#141414] border-r border-[#1f1f1f]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1f1f1f]">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden text-[#d2d2d2] hover:text-white hover:bg-[#1b1b1b]"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-[#141414] border-r border-[#1f1f1f]">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <nav className="hidden md:flex items-center gap-2 text-sm text-[#868686]">
                <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">
                  {docSections.flatMap(s => s.items).find(i => i.path === location.pathname)?.label || 'Documentation'}
                </span>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b]">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 max-w-4xl">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1f1f1f] py-8 px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#868686]">
              © 2024 NexusCRM. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/docs/support" className="text-sm text-[#868686] hover:text-white transition-colors">
                Support
              </Link>
              <Link to="/docs/faq" className="text-sm text-[#868686] hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
