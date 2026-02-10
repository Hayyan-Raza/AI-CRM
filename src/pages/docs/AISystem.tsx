import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

const aiFeatures = [
  {
    title: 'Lead Scoring',
    icon: Target,
    color: '#22c55e',
    description: 'AI automatically scores leads based on engagement, demographics, and behavior.',
    accuracy: 95,
    benefits: [
      'Prioritize high-quality leads',
      'Focus on leads most likely to convert',
      'Reduce time spent on cold leads',
      'Improve conversion rates',
    ],
  },
  {
    title: 'Deal Risk Assessment',
    icon: AlertTriangle,
    color: '#ef4444',
    description: 'Identify deals at risk before they slip away.',
    accuracy: 88,
    benefits: [
      'Early warning system for at-risk deals',
      'Recommended actions to save deals',
      'Activity pattern analysis',
      'Sentiment tracking',
    ],
  },
  {
    title: 'Smart Follow-ups',
    icon: Clock,
    color: '#2d62ff',
    description: 'Get recommendations on optimal follow-up timing.',
    accuracy: 82,
    benefits: [
      'Best time to contact recommendations',
      'Response pattern analysis',
      'Timezone-aware scheduling',
      'Follow-up reminders',
    ],
  },
  {
    title: 'Sentiment Analysis',
    icon: MessageSquare,
    color: '#dd23bb',
    description: 'Analyze email and call sentiment to gauge customer interest.',
    accuracy: 90,
    benefits: [
      'Email sentiment scoring',
      'Call transcript analysis',
      'Tone and engagement detection',
      'Early issue identification',
    ],
  },
  {
    title: 'Revenue Forecasting',
    icon: TrendingUp,
    color: '#f59e0b',
    description: 'Predict future revenue based on pipeline and historical data.',
    accuracy: 85,
    benefits: [
      'Accurate revenue predictions',
      'Pipeline velocity analysis',
      'Seasonal trend detection',
      'Quota planning assistance',
    ],
  },
];

export default function AISystem() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Brain className="w-3 h-3 mr-1" />
          AI System Overview
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">AI System Overview</h1>
        <p className="text-[#d2d2d2] text-lg">
          NexusCRM leverages Gemini 3 AI to provide intelligent insights, predictions, and 
          recommendations that help you close more deals faster.
        </p>
      </div>

      {/* AI Hero Card */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/20 to-[#dd23bb]/20 border-[#2d62ff]/30">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Powered by Gemini 3</h2>
              <p className="text-[#d2d2d2]">Advanced AI for modern sales teams</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-sm text-[#d2d2d2]">Lead Scoring Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">&lt;100ms</p>
              <p className="text-sm text-[#d2d2d2]">Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-[#d2d2d2]">Real-time Analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">AI Capabilities</h2>
        <div className="space-y-4">
          {aiFeatures.map((feature) => {
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
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#868686]">Accuracy:</span>
                          <span className="text-sm font-medium" style={{ color: feature.color }}>
                            {feature.accuracy}%
                          </span>
                        </div>
                      </div>
                      <Progress value={feature.accuracy} className="h-1.5 mb-4" />
                      <p className="text-[#868686] mb-4">{feature.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feature.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-[#d2d2d2]">{benefit}</span>
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

      {/* How It Works */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#f59e0b]" />
            How AI Insights Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Data Collection', desc: 'AI analyzes your CRM data, emails, calls, and activities' },
              { step: '2', title: 'Pattern Recognition', desc: 'Machine learning identifies patterns and trends' },
              { step: '3', title: 'Prediction', desc: 'AI generates predictions and recommendations' },
              { step: '4', title: 'Action', desc: 'You take action based on AI insights' },
            ].map((item) => (
              <div key={item.step} className="text-center p-4 rounded-lg bg-[#0a0a0a]">
                <div className="w-8 h-8 rounded-full bg-[#2d62ff]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#2d62ff] font-bold">{item.step}</span>
                </div>
                <h4 className="text-white font-medium mb-1">{item.title}</h4>
                <p className="text-xs text-[#868686]">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card className="bg-gradient-to-br from-[#22c55e]/10 to-[#2d62ff]/10 border-[#22c55e]/30">
        <CardHeader>
          <CardTitle className="text-white">Data Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-[#d2d2d2]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Your data is never used to train external AI models</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>All AI processing happens within our secure infrastructure</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>GDPR and SOC 2 compliant AI operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>You can disable AI features at any time</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
