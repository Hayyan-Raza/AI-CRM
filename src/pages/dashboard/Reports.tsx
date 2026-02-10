import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Target,
  Download,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Line
} from 'recharts';
import { formatCurrency } from '@/lib/utils';



export default function ReportsPage() {
  const { deals, leads, getPipelineStats } = useCRMStore();
  const [dateRange, setDateRange] = useState('30');

  const pipelineStats = getPipelineStats();

  // Revenue data
  const revenueData = [
    { name: 'Week 1', revenue: 12000, deals: 3 },
    { name: 'Week 2', revenue: 18000, deals: 5 },
    { name: 'Week 3', revenue: 15000, deals: 4 },
    { name: 'Week 4', revenue: 25000, deals: 6 },
  ];

  // Conversion funnel data
  const funnelData = [
    { name: 'Leads', value: leads.length, color: '#2d62ff' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'contacted' || l.status === 'qualified' || l.status === 'converted').length, color: '#f59e0b' },
    { name: 'Qualified', value: leads.filter(l => l.status === 'qualified' || l.status === 'converted').length, color: '#8b5cf6' },
    { name: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#22c55e' },
  ];

  // Deal stage data
  const stageData = pipelineStats
    .filter(s => s.count > 0)
    .map(s => ({
      name: s.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      deals: s.count,
      value: s.value,
    }));

  // Performance data
  const performanceData = [
    { name: 'Mon', calls: 12, emails: 25, meetings: 3 },
    { name: 'Tue', calls: 15, emails: 30, meetings: 4 },
    { name: 'Wed', calls: 10, emails: 20, meetings: 2 },
    { name: 'Thu', calls: 18, emails: 35, meetings: 5 },
    { name: 'Fri', calls: 14, emails: 28, meetings: 3 },
  ];

  const totalRevenue = deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + d.value, 0);
  const avgDealSize = deals.filter(d => d.stage === 'closed_won').length > 0 
    ? totalRevenue / deals.filter(d => d.stage === 'closed_won').length 
    : 0;
  const winRate = deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length > 0
    ? Math.round((deals.filter(d => d.stage === 'closed_won').length / deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost').length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-[#868686] mt-1">Track your sales performance and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-[#141414] border-[#1f1f1f] text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
              <SelectItem value="7" className="text-white">Last 7 days</SelectItem>
              <SelectItem value="30" className="text-white">Last 30 days</SelectItem>
              <SelectItem value="90" className="text-white">Last 90 days</SelectItem>
              <SelectItem value="365" className="text-white">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Total Revenue</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#2d62ff]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
              <span className="text-sm text-[#22c55e]">+12%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Deals Closed</p>
                <p className="text-xl font-bold text-white">
                  {deals.filter(d => d.stage === 'closed_won').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#dd23bb]/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#dd23bb]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
              <span className="text-sm text-[#22c55e]">+5</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Win Rate</p>
                <p className="text-xl font-bold text-white">{winRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#22c55e]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-4 h-4 text-[#ef4444]" />
              <span className="text-sm text-[#ef4444]">-2%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#868686]">Avg Deal Size</p>
                <p className="text-xl font-bold text-white">{formatCurrency(avgDealSize)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-[#22c55e]" />
              <span className="text-sm text-[#22c55e]">+8%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="bg-[#141414] border border-[#1f1f1f]">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <PieChart className="w-4 h-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="funnel" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Activity className="w-4 h-4 mr-2" />
            Funnel
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trends</CardTitle>
              <CardDescription className="text-[#868686]">Weekly revenue and deal count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
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
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue"
                      stroke="#2d62ff" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="deals" 
                      name="Deals"
                      stroke="#dd23bb" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Pipeline by Stage</CardTitle>
              <CardDescription className="text-[#868686]">Deals and value distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis dataKey="name" stroke="#868686" fontSize={11} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#868686" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1b1b1b', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="deals" name="Number of Deals" fill="#2d62ff" />
                    <Bar dataKey="value" name="Total Value" fill="#dd23bb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Conversion Funnel</CardTitle>
              <CardDescription className="text-[#868686]">Lead to customer conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={funnelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1b1b1b', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Team Activity</CardTitle>
              <CardDescription className="text-[#868686]">Calls, emails, and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                    <XAxis dataKey="name" stroke="#868686" fontSize={12} />
                    <YAxis stroke="#868686" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1b1b1b', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="calls" name="Calls" fill="#2d62ff" />
                    <Bar dataKey="emails" name="Emails" fill="#dd23bb" />
                    <Bar dataKey="meetings" name="Meetings" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
