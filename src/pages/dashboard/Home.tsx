import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCRMStore } from '@/store/crmStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardStore } from '@/store/dashboardStore';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  BarChart3,
  Target,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

const COLORS = ['#2d62ff', '#dd23bb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function HomeDashboard() {
  const { user } = useAuthStore();
  const { 
    getDashboardStats, 
    getPipelineStats, 
    getRecentActivities,
    getOverdueTasks,
    getTasksDueToday,
    deals,
    leads 
  } = useCRMStore();
  
  const [stats, setStats] = useState(getDashboardStats());
  const [pipelineStats, setPipelineStats] = useState(getPipelineStats());
  const [recentActivities, setRecentActivities] = useState(getRecentActivities(5));
  const [overdueTasks, setOverdueTasks] = useState(getOverdueTasks());
  const [todayTasks, setTodayTasks] = useState(getTasksDueToday());

  useEffect(() => {
    setStats(getDashboardStats());
    setPipelineStats(getPipelineStats());
    setRecentActivities(getRecentActivities(5));
    setOverdueTasks(getOverdueTasks());
    setTodayTasks(getTasksDueToday());
  }, [deals, leads]);

  // Revenue chart data
  const revenueData = [
    { name: 'Jan', revenue: 45000, target: 50000 },
    { name: 'Feb', revenue: 52000, target: 55000 },
    { name: 'Mar', revenue: 48000, target: 50000 },
    { name: 'Apr', revenue: 61000, target: 60000 },
    { name: 'May', revenue: 55000, target: 58000 },
    { name: 'Jun', revenue: 67000, target: 65000 },
  ];

  // Pipeline data for pie chart
  const pipelineData = pipelineStats
    .filter(s => s.count > 0 && s.stage !== 'closed_won' && s.stage !== 'closed_lost')
    .map(s => ({
      name: s.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: s.count,
    }));



  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <div className="w-8 h-8 rounded-full bg-[#2d62ff]/20 flex items-center justify-center"><Users className="w-4 h-4 text-[#2d62ff]" /></div>;
      case 'email': return <div className="w-8 h-8 rounded-full bg-[#dd23bb]/20 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-[#dd23bb]" /></div>;
      case 'meeting': return <div className="w-8 h-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center"><Clock className="w-4 h-4 text-[#22c55e]" /></div>;
      case 'deal_stage_change': return <div className="w-8 h-8 rounded-full bg-[#f59e0b]/20 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-[#f59e0b]" /></div>;
      case 'ai_insight': return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d62ff]/20 to-[#dd23bb]/20 flex items-center justify-center"><Brain className="w-4 h-4 text-[#2d62ff]" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-[#868686]/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-[#868686]" /></div>;
    }
  };
 

const { fetchDashboard } = useDashboardStore();

useEffect(() => {
  if (user) {
    fetchDashboard(user.companyId, user.id);
  }
}, [user]);




  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-[#868686] mt-1">
            Here's what's happening with your sales today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/ai-insights">
            <Button variant="outline" className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b]">
              <Brain className="w-4 h-4 mr-2 text-[#2d62ff]" />
              AI Insights
            </Button>
          </Link>
          <Link to="/dashboard/reports">
            <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-sm text-[#22c55e]">+12%</span>
                  <span className="text-xs text-[#868686]">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2d62ff]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#2d62ff]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#dd23bb]/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Active Deals</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalDeals}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-sm text-[#22c55e]">+5</span>
                  <span className="text-xs text-[#868686]">new this week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dd23bb]/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#dd23bb]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#22c55e]/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Conversion Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.conversionRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-sm text-[#ef4444]">-2%</span>
                  <span className="text-xs text-[#868686]">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#22c55e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#f59e0b]/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Total Leads</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalLeads}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-sm text-[#22c55e]">+{stats.newLeadsThisMonth}</span>
                  <span className="text-xs text-[#868686]">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-[#141414] border-[#1f1f1f]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white">Revenue Overview</CardTitle>
              <CardDescription className="text-[#868686]">Monthly revenue vs target</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff]">
                <div className="w-2 h-2 rounded-full bg-[#2d62ff] mr-1" />
                Revenue
              </Badge>
              <Badge variant="outline" className="border-[#868686]/30 text-[#868686]">
                <div className="w-2 h-2 rounded-full bg-[#868686] mr-1" />
                Target
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d62ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2d62ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="name" stroke="#868686" fontSize={12} />
                  <YAxis stroke="#868686" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1b1b1b', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2d62ff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#868686" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardHeader>
            <CardTitle className="text-white">Pipeline Distribution</CardTitle>
            <CardDescription className="text-[#868686]">Deals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1b1b1b', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pipelineData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[#d2d2d2]">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-[#868686]">Latest updates from your team</CardDescription>
            </div>
            <Link to="/dashboard/timeline">
              <Button variant="ghost" size="sm" className="text-[#2d62ff] hover:text-[#dd23bb]">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1b1b1b] transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.title}</p>
                    <p className="text-xs text-[#868686] mt-0.5">{activity.description}</p>
                    <p className="text-xs text-[#868686] mt-1">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks & Alerts */}
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardHeader>
            <CardTitle className="text-white">Tasks & Alerts</CardTitle>
            <CardDescription className="text-[#868686]">What needs your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overdue" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#0a0a0a]">
                <TabsTrigger value="overdue" className="data-[state=active]:bg-[#1b1b1b]">
                  Overdue ({overdueTasks.length})
                </TabsTrigger>
                <TabsTrigger value="today" className="data-[state=active]:bg-[#1b1b1b]">
                  Today ({todayTasks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overdue" className="mt-4">
                {overdueTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto mb-3" />
                    <p className="text-[#868686]">No overdue tasks!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {overdueTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{task.title}</p>
                          <p className="text-xs text-red-400">
                            Due {formatRelativeTime(task.dueDate)}
                          </p>
                        </div>
                        <Link to="/dashboard/tasks">
                          <Button size="sm" variant="ghost" className="text-[#2d62ff]">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="today" className="mt-4">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-[#22c55e] mx-auto mb-3" />
                    <p className="text-[#868686]">No tasks due today!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#1b1b1b]">
                        <Clock className="w-5 h-5 text-[#f59e0b] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{task.title}</p>
                          <p className="text-xs text-[#868686]">
                            {task.relatedTo?.name}
                          </p>
                        </div>
                        <Link to="/dashboard/tasks">
                          <Button size="sm" variant="ghost" className="text-[#2d62ff]">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
