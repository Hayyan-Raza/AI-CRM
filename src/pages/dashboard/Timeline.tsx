import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Phone, 
  Mail, 
  Users, 
  FileText, 
  TrendingUp, 
  Brain,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import type { Activity } from '@/types';

const activityIcons: Record<string, { icon: any; color: string; bg: string }> = {
  call: { icon: Phone, color: '#2d62ff', bg: '#2d62ff20' },
  email: { icon: Mail, color: '#dd23bb', bg: '#dd23bb20' },
  meeting: { icon: Users, color: '#22c55e', bg: '#22c55e20' },
  note: { icon: FileText, color: '#f59e0b', bg: '#f59e0b20' },
  task: { icon: CheckCircle2, color: '#8b5cf6', bg: '#8b5cf620' },
  deal_stage_change: { icon: TrendingUp, color: '#06b6d4', bg: '#06b6d420' },
  ai_insight: { icon: Brain, color: '#2d62ff', bg: '#2d62ff20' },
};

export default function TimelinePage() {
  const { activities } = useCRMStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getActivityIcon = (type: string) => {
    const config = activityIcons[type] || activityIcons.note;
    const Icon = config.icon;
    return (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-5 h-5" style={{ color: config.color }} />
      </div>
    );
  };

  const groupByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    activities.forEach(activity => {
      const date = new Date(activity.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    return groups;
  };

  const groupedActivities = groupByDate(filteredActivities);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Activity Timeline</h1>
          <p className="text-[#868686] mt-1">Track all customer interactions and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="bg-[#141414] border border-[#1f1f1f] flex-wrap h-auto gap-2 p-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="call" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Phone className="w-4 h-4 mr-2" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="meeting" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="deal_stage_change" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Deal Changes
          </TabsTrigger>
          <TabsTrigger value="ai_insight" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#1f1f1f]" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center z-10">
                      <Calendar className="w-5 h-5 text-[#868686]" />
                    </div>
                    <Badge variant="outline" className="border-[#1f1f1f] text-[#d2d2d2] px-3 py-1">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Badge>
                  </div>

                  {/* Activities for this date */}
                  <div className="space-y-4 ml-5">
                    {dateActivities.map((activity) => (
                      <Card 
                        key={activity.id} 
                        className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {getActivityIcon(activity.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium">{activity.title}</span>
                                <span className="text-xs text-[#868686]">
                                  {formatRelativeTime(activity.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-[#d2d2d2] mb-2">{activity.description}</p>
                              <div className="flex items-center gap-4">
                                {activity.relatedTo && (
                                  <Badge variant="outline" className="border-[#1f1f1f] text-[#868686]">
                                    {activity.relatedTo.type === 'lead' ? 'Lead' : 'Deal'}: {activity.relatedTo.name}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] text-white">
                                      {getInitials(activity.performedByName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-[#868686]">{activity.performedByName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-[#868686] mx-auto mb-4" />
                  <p className="text-[#868686]">No activities found</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
