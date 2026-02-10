import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Target,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const dashboardCards = [
  {
    title: 'Total Revenue',
    value: '$285,000',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
    color: '#2d62ff',
  },
  {
    title: 'Active Deals',
    value: '24',
    change: '+5',
    trend: 'up',
    icon: Target,
    color: '#dd23bb',
  },
  {
    title: 'Conversion Rate',
    value: '28%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
    color: '#22c55e',
  },
  {
    title: 'Total Leads',
    value: '156',
    change: '+23',
    trend: 'up',
    icon: Users,
    color: '#f59e0b',
  },
];

const reportTypes = [
  {
    title: 'Sales Performance',
    description: 'Track revenue, deals closed, and conversion rates over time.',
    metrics: ['Revenue by period', 'Deals won/lost', 'Win rate', 'Average deal size'],
  },
  {
    title: 'Pipeline Analysis',
    description: 'Understand your pipeline health and identify bottlenecks.',
    metrics: ['Deals by stage', 'Pipeline value', 'Stage conversion', 'Velocity'],
  },
  {
    title: 'Team Performance',
    description: 'Compare individual and team performance metrics.',
    metrics: ['Activities per rep', 'Deals per rep', 'Revenue per rep', 'Conversion rates'],
  },
  {
    title: 'Lead Analysis',
    description: 'Analyze lead sources, quality, and conversion patterns.',
    metrics: ['Leads by source', 'Lead quality score', 'Time to convert', 'Cost per lead'],
  },
];

export default function DashboardsAnalytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <BarChart3 className="w-3 h-3 mr-1" />
          Dashboards & Analytics
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Dashboards & Analytics</h1>
        <p className="text-[#d2d2d2] text-lg">
          Get real-time insights into your sales performance with customizable dashboards 
          and comprehensive analytics.
        </p>
      </div>

      {/* Dashboard Preview */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Home Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              const TrendIcon = card.trend === 'up' ? ArrowUpRight : ArrowDownRight;
              const trendColor = card.trend === 'up' ? '#22c55e' : '#ef4444';
              return (
                <div key={card.title} className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#868686]">{card.title}</span>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
                    <span className="text-xs" style={{ color: trendColor }}>{card.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-[#868686]">
            The home dashboard provides a quick overview of your key metrics. 
            Click on any metric to see detailed reports.
          </p>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.title} className="bg-[#141414] border-[#1f1f1f]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                <p className="text-sm text-[#868686] mb-4">{report.description}</p>
                <div className="flex flex-wrap gap-2">
                  {report.metrics.map((metric) => (
                    <Badge 
                      key={metric}
                      variant="outline" 
                      className="border-[#1f1f1f] text-[#d2d2d2]"
                    >
                      {metric}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Overview */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Visualization Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, name: 'Line Charts', desc: 'Trends over time' },
              { icon: BarChart3, name: 'Bar Charts', desc: 'Comparisons' },
              { icon: PieChart, name: 'Pie Charts', desc: 'Distribution' },
              { icon: Activity, name: 'Funnels', desc: 'Conversion flow' },
            ].map((chart) => {
              const Icon = chart.icon;
              return (
                <div key={chart.name} className="text-center p-4 rounded-lg bg-[#0a0a0a]">
                  <Icon className="w-8 h-8 text-[#2d62ff] mx-auto mb-2" />
                  <h4 className="text-white font-medium">{chart.name}</h4>
                  <p className="text-xs text-[#868686]">{chart.desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white">Export & Share</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-[#d2d2d2]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Export reports as PDF, CSV, or Excel</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Schedule automated report delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Share dashboards with team members</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Embed reports in external tools</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
