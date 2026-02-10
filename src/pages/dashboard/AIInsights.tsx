import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  MessageSquare,
  Zap,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Clock,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAIEmployeeStore } from '@/store/aiEmployeeStore';
import { useAuthStore } from '@/store/authStore';

const insightIcons: Record<string, { icon: any; color: string; bg: string }> = {
  lead_score: { icon: Target, color: '#22c55e', bg: '#22c55e20' },
  deal_risk: { icon: AlertTriangle, color: '#ef4444', bg: '#ef444420' },
  follow_up_suggestion: { icon: Clock, color: '#2d62ff', bg: '#2d62ff20' },
  sentiment_analysis: { icon: MessageSquare, color: '#dd23bb', bg: '#dd23bb20' },
  trend_prediction: { icon: TrendingUp, color: '#f59e0b', bg: '#f59e0b20' },
  revenue_forecast: { icon: BarChart3, color: '#8b5cf6', bg: '#8b5cf620' },
  deal_prediction: { icon: BarChart3, color: '#f59e0b', bg: '#f59e0b20' },
};

export default function AIInsightsPage() {
  const { insights, deals, leads, clearInsights } = useCRMStore();
  const { scanInbox, isScanning } = useAIEmployeeStore();
  const { user } = useAuthStore();

  const handleRefresh = async () => {
    try {
      toast.info("AI Analysis started. Checking your pipeline...", {
        description: "This may take a few moments."
      });
      // Pass token if we have it, otherwise scanInbox will handle the missing token for Google tasks
      await scanInbox(user?.googleAccessToken || '');
      toast.success("Analysis complete!", {
        description: "New insights have been generated."
      });
    } catch (err: any) {
      toast.error("Analysis failed", {
        description: err.message || "An unexpected error occurred."
      });
    }
  };

  const getInsightIcon = (type: string) => {
    const config = insightIcons[type] || insightIcons.lead_score;
    const Icon = config.icon;
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-6 h-6" style={{ color: config.color }} />
      </div>
    );
  };

  const getInsightTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lead_score: 'Lead Score',
      deal_risk: 'Deal Risk',
      follow_up_suggestion: 'Follow-up',
      sentiment_analysis: 'Sentiment',
      trend_prediction: 'Trend',
      revenue_forecast: 'Revenue Forecast',
      deal_prediction: 'Deal Prediction',
    };
    return labels[type] || type;
  };

  // Calculate some AI metrics
  const highProbabilityDeals = deals.filter(d => d.probability >= 70 && d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const atRiskDeals = deals.filter(d => d.probability < 30 && d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const conversionPrediction = leads.length > 0 ? Math.round((deals.filter(d => d.stage === 'closed_won').length / leads.length) * 100 * 1.15) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-[#868686] mt-1">AI-powered predictions and recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] px-3 py-1">
            <Zap className="w-4 h-4 mr-2" />
            Gemini 3 Powered
          </Badge>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-red-500 text-xs text-center">
        Nexus AI Engine Active v1.2.5 - Dynamic Insights Enabled
      </div>

      {/* AI Overview Cards */}

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#2d62ff]/20 to-[#dd23bb]/20 border-[#2d62ff]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#2d62ff]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{highProbabilityDeals.length}</p>
                <p className="text-sm text-[#d2d2d2]">High Probability Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{atRiskDeals.length}</p>
                <p className="text-sm text-[#868686]">Deals at Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{conversionPrediction}%</p>
                <p className="text-sm text-[#868686]">Predicted Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{insights.length}</p>
                <p className="text-sm text-[#868686]">Active Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#2d62ff]" />
              Recent Insights
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearInsights}
                className="h-8 border-[#1f1f1f] text-[#868686] hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isScanning}
                className="h-8 border-[#2d62ff]/20 text-[#2d62ff] hover:bg-[#2d62ff]/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                Re-analyze
              </Button>
            </div>
          </div>
          {insights.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[#1f1f1f] rounded-xl bg-[#0a0a0a]">
              <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-[#868686]" />
              </div>
              <h3 className="text-white font-medium">No Insights Found</h3>
              <p className="text-[#868686] text-sm mt-1 max-w-[280px] mx-auto">
                AI agents haven't discovered anything yet. Re-analyze your pipeline to generate real-time insights.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-[#2d62ff]/30 text-[#2d62ff] hover:bg-[#2d62ff]/10"
                onClick={handleRefresh}
              >
                Start Analysis
              </Button>
            </div>
          ) : (
            insights.map((insight) => (
              <Card
                key={insight.id}
                className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="border-[#2d62ff]/30 text-[#2d62ff] text-xs"
                        >
                          {getInsightTypeLabel(insight.type)}
                        </Badge>
                        <span className="text-xs text-[#868686]">
                          {formatRelativeTime(insight.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                      <p className="text-sm text-[#d2d2d2] mb-3">{insight.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-[#868686]">Confidence:</span>
                        <div className="flex-1 max-w-[100px]">
                          <Progress value={insight.confidence} className="h-1.5" />
                        </div>
                        <span className="text-xs text-[#2d62ff]">{insight.confidence}%</span>
                      </div>

                      {insight.recommendedAction && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#2d62ff]/10 border border-[#2d62ff]/20">
                          <Lightbulb className="w-4 h-4 text-[#2d62ff]" />
                          <span className="text-sm text-[#d2d2d2]">{insight.recommendedAction}</span>
                        </div>
                      )}

                      {insight.relatedTo && (
                        <div className="mt-3">
                          <Link
                            to={insight.relatedTo.type === 'lead' ? `/dashboard/crm` : `/dashboard/pipeline`}
                            className="inline-flex items-center text-sm text-[#2d62ff] hover:text-[#dd23bb] transition-colors"
                          >
                            View {insight.relatedTo.type === 'lead' ? 'Lead' : 'Deal'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* AI Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#dd23bb]" />
            AI Capabilities
          </h2>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#2d62ff]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Lead Scoring</h3>
                  <p className="text-sm text-[#868686]">
                    AI automatically scores leads based on engagement, demographics, and behavior patterns to prioritize your outreach.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#dd23bb]/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#dd23bb]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Deal Prediction</h3>
                  <p className="text-sm text-[#868686]">
                    Predict which deals are likely to close and which need attention based on historical data and current engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Smart Follow-ups</h3>
                  <p className="text-sm text-[#868686]">
                    Get recommendations on the best time to follow up with leads based on their response patterns and timezone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Sentiment Analysis</h3>
                  <p className="text-sm text-[#868686]">
                    Analyze email and call transcripts to understand customer sentiment and identify potential issues early.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Revenue Forecasting</h3>
                  <p className="text-sm text-[#868686]">
                    Get accurate revenue predictions based on your pipeline velocity, historical conversion rates, and deal stages.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">AI Assistant</CardTitle>
              <CardDescription className="text-[#868686]">
                Let AI help you prioritize your day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-[#141414] hover:bg-[#1b1b1b] text-[#d2d2d2]">
                <Target className="w-4 h-4 mr-3 text-[#2d62ff]" />
                Show me my hottest leads
              </Button>
              <Button className="w-full justify-start bg-[#141414] hover:bg-[#1b1b1b] text-[#d2d2d2]">
                <AlertTriangle className="w-4 h-4 mr-3 text-[#ef4444]" />
                Which deals need attention?
              </Button>
              <Button className="w-full justify-start bg-[#141414] hover:bg-[#1b1b1b] text-[#d2d2d2]">
                <Clock className="w-4 h-4 mr-3 text-[#f59e0b]" />
                What should I do today?
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
