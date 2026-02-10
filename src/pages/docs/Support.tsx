import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2,
  BookOpen,
  Video,
  Users
} from 'lucide-react';

const supportChannels = [
  {
    title: 'Email Support',
    description: 'Get a response within 24 hours',
    icon: Mail,
    contact: 'support@nexuscrm.com',
    available: '24/7',
    color: '#2d62ff',
  },
  {
    title: 'Live Chat',
    description: 'Instant help from our team',
    icon: MessageSquare,
    contact: 'Start Chat',
    available: 'Mon-Fri, 9am-6pm EST',
    color: '#dd23bb',
  },
  {
    title: 'Phone Support',
    description: 'Talk to a support specialist',
    icon: Phone,
    contact: '+1 (555) 123-4567',
    available: 'Mon-Fri, 9am-6pm EST',
    color: '#22c55e',
  },
];

const resources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and tutorials',
    icon: BookOpen,
    link: '/docs',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    icon: Video,
    link: '#',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: Users,
    link: '#',
  },
];

export default function Support() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <MessageSquare className="w-3 h-3 mr-1" />
          Support & Contact
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Support & Contact</h1>
        <p className="text-[#d2d2d2] text-lg">
          We&apos;re here to help! Reach out through any of our support channels.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title} className="bg-[#141414] border-[#1f1f1f]">
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${channel.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: channel.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{channel.title}</h3>
                <p className="text-sm text-[#868686] mb-3">{channel.description}</p>
                <p className="text-[#d2d2d2] font-medium mb-2">{channel.contact}</p>
                <div className="flex items-center gap-1 text-xs text-[#868686]">
                  <Clock className="w-3 h-3" />
                  {channel.available}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Form */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Send us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Name</Label>
                <Input 
                  placeholder="Your name"
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Email</Label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#d2d2d2]">Subject</Label>
              <Input 
                placeholder="How can we help?"
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#d2d2d2]">Message</Label>
              <Textarea 
                placeholder="Describe your issue or question..."
                rows={5}
                className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
              />
            </div>
            <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Self-Help Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <a key={resource.title} href={resource.link}>
                <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors h-full">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-[#2d62ff] mb-4" />
                    <h3 className="text-white font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-[#868686]">{resource.description}</p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>

      {/* Response Times */}
      <Card className="bg-gradient-to-br from-[#22c55e]/10 to-[#2d62ff]/10 border-[#22c55e]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            Our Commitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">&lt; 24h</p>
              <p className="text-sm text-[#d2d2d2]">Email Response</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">&lt; 5min</p>
              <p className="text-sm text-[#d2d2d2]">Chat Response</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-[#d2d2d2]">Uptime SLA</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
