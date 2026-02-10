import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCRMStore } from '@/store/crmStore';
import { useAIEmployeeStore } from '@/store/aiEmployeeStore';
import { cn, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Users,
  BarChart3,
  CheckSquare,
  Clock,
  Brain,
  FileText,
  Settings,
  BookOpen,
  Menu,
  ChevronDown,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Bot,
  Puzzle
} from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'CRM', path: '/dashboard/crm', icon: Users },
  { label: 'Pipeline', path: '/dashboard/pipeline', icon: BarChart3 },
  { label: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare, badge: 'tasks' },
  { label: 'AI Employees', path: '/dashboard/ai-employees', icon: Bot },
  { label: 'Timeline', path: '/dashboard/timeline', icon: Clock },
  { label: 'AI Insights', path: '/dashboard/ai-insights', icon: Brain },
  { label: 'Reports', path: '/dashboard/reports', icon: FileText },
  { label: 'Integrations', path: '/dashboard/settings?tab=integrations', icon: Puzzle },
];

const bottomNavItems = [
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  { label: 'Documentation', path: '/docs', icon: BookOpen },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getOverdueTasks, getTasksDueToday } = useCRMStore();
  const { notifications, markNotificationRead } = useAIEmployeeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const overdueTasks = getOverdueTasks();
  const todayTasks = getTasksDueToday();
  const totalTaskNotifications = overdueTasks.length + todayTasks.length;
  const unreadNotifications = notifications.filter(n => !n.read);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavBadge = (item: typeof navItems[0]) => {
    if (item.badge === 'tasks' && totalTaskNotifications > 0) {
      return (
        <Badge variant="destructive" className="ml-auto text-xs">
          {totalTaskNotifications}
        </Badge>
      );
    }
    return null;
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1f1f1f]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">NexusCRM</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const itemPath = item.path.split('?')[0];
            const itemQuery = item.path.split('?')[1];

            const isActive = location.pathname === itemPath &&
              (itemQuery ? location.search.includes(itemQuery) : location.pathname === item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-[#2d62ff]/20 to-transparent text-white border-l-2 border-[#2d62ff]'
                    : 'text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-[#2d62ff]')} />
                <span>{item.label}</span>
                {getNavBadge(item)}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <p className="px-3 text-xs font-semibold text-[#868686] uppercase tracking-wider mb-2">
            Support
          </p>
          <nav className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-[#2d62ff]/20 to-transparent text-white border-l-2 border-[#2d62ff]'
                      : 'text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-[#2d62ff]')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-[#1f1f1f]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#1b1b1b] transition-colors">
              <Avatar className="w-9 h-9 border-2 border-[#1f1f1f]">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] text-white text-sm">
                  {getInitials(user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-[#868686] capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#868686]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1b1b1b] border-[#1f1f1f]">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1f1f1f]" />
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/settings')}
              className="text-[#d2d2d2] hover:text-white hover:bg-[#2a2a2a] cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/docs')}
              className="text-[#d2d2d2] hover:text-white hover:bg-[#2a2a2a] cursor-pointer"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1f1f1f]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#141414] border-r border-[#1f1f1f] fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#141414] border-r border-[#1f1f1f]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1f1f1f]">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Left: Mobile Menu + Search */}
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
                <SheetContent side="left" className="w-64 p-0 bg-[#141414] border-r border-[#1f1f1f]">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141414] border border-[#1f1f1f]">
                <Search className="w-4 h-4 text-[#868686]" />
                <input
                  type="text"
                  placeholder="Search leads, deals, tasks..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#868686] w-64"
                />
                <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs text-[#868686] bg-[#0a0a0a] rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Notifications + Actions */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-[#d2d2d2] hover:text-white hover:bg-[#1b1b1b]"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-[#0a0a0a] border-[#1f1f1f]">
                  <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#1f1f1f]" />
                  <ScrollArea className="h-[300px]">
                    {unreadNotifications.length === 0 ? (
                      <div className="p-4 text-center text-[#868686] text-sm">
                        No new notifications
                      </div>
                    ) : (
                      unreadNotifications.map(notification => {
                        const colors = {
                          success: 'text-green-500',
                          warning: 'text-yellow-500',
                          error: 'text-red-500',
                          info: 'text-blue-500'
                        };
                        return (
                          <div
                            key={notification.id}
                            className="p-3 hover:bg-[#141414] cursor-pointer border-b border-[#1f1f1f] last:border-0"
                            onClick={() => {
                              markNotificationRead(notification.id);
                              navigate('/dashboard/ai-employees');
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Bell className={`w-4 h-4 mt-0.5 ${colors[notification.type]}`} />
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">{notification.title}</p>
                                <p className="text-[#868686] text-xs mt-1">{notification.message}</p>
                                <p className="text-[#666] text-[10px] mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </ScrollArea>
                  {unreadNotifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="bg-[#1f1f1f]" />
                      <DropdownMenuItem
                        className="text-center justify-center text-[#2d62ff] hover:text-[#2d62ff] hover:bg-[#141414] cursor-pointer"
                        onClick={() => navigate('/dashboard/ai-employees')}
                      >
                        View All
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white"
                  onClick={() => navigate('/dashboard/crm')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                  onClick={() => navigate('/dashboard/pipeline')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  New Deal
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
