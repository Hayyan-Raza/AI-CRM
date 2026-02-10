import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart3,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Deal, DealStage } from '@/types';

const stages: { id: DealStage; name: string; color: string; icon: any }[] = [
  { id: 'new_lead', name: 'New Lead', color: '#2d62ff', icon: Target },
  { id: 'contacted', name: 'Contacted', color: '#f59e0b', icon: AlertCircle },
  { id: 'qualified', name: 'Qualified', color: '#8b5cf6', icon: CheckCircle2 },
  { id: 'negotiation', name: 'Negotiation', color: '#dd23bb', icon: TrendingUp },
  { id: 'closed_won', name: 'Closed Won', color: '#22c55e', icon: CheckCircle2 },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ef4444', icon: XCircle },
];

export default function PipelinePage() {
  const { user, company } = useAuthStore();
  const { leads, deals, moveDealStage, addDeal } = useCRMStore();
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Form state
  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    value: '',
    stage: 'new_lead' as DealStage,
    leadId: '',
    expectedCloseDate: '',
  });

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stage) {
      moveDealStage(draggedDeal.id, stage);
      setDraggedDeal(null);
    }
  };

  const handleAddDeal = async () => {
    const lead = leads.find(l => l.id === dealForm.leadId);
    if (!lead) {
      alert('Please select a valid lead');
      return;
    }

    try {
      await addDeal({
        title: dealForm.title,
        description: dealForm.description,
        value: parseFloat(dealForm.value) || 0,
        currency: 'USD',
        stage: dealForm.stage,
        probability: dealForm.stage === 'closed_won' ? 100 : dealForm.stage === 'closed_lost' ? 0 : 25,
        leadId: lead.id,
        leadName: lead.name,
        assignedTo: user?.id,
        companyId: company?.id,
        expectedCloseDate: dealForm.expectedCloseDate ? new Date(dealForm.expectedCloseDate) : undefined,
      });
      setDealForm({
        title: '',
        description: '',
        value: '',
        stage: 'new_lead',
        leadId: '',
        expectedCloseDate: '',
      });
      setIsAddDealOpen(false);
    } catch (error: any) {
      console.error('Error adding deal:', error);
      alert('Failed to add deal: ' + (error.message || 'Unknown error'));
    }
  };

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + d.value, 0);

  const totalWonValue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-[#868686] mt-1">Track and manage your deals through every stage</p>
        </div>
        <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#141414] border-[#1f1f1f] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Deal Title</Label>
                <Input
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  placeholder="Enterprise Software License"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Description</Label>
                <Textarea
                  value={dealForm.description}
                  onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  placeholder="Deal details..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Value ($)</Label>
                  <Input
                    type="number"
                    value={dealForm.value}
                    onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Stage</Label>
                  <Select
                    value={dealForm.stage}
                    onValueChange={(v) => setDealForm({ ...dealForm, stage: v as DealStage })}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id} className="text-white">
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Related Lead</Label>
                  <Select
                    value={dealForm.leadId}
                    onValueChange={(v) => setDealForm({ ...dealForm, leadId: v })}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                      <SelectValue placeholder="Select lead" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                      {leads.length > 0 ? (
                        leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id} className="text-white">
                            {lead.name} - {lead.company}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled className="text-[#868686]">No leads found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Expected Close Date</Label>
                  <Input
                    type="date"
                    value={dealForm.expectedCloseDate}
                    onChange={(e) => setDealForm({ ...dealForm, expectedCloseDate: e.target.value })}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDeal}
                className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
              >
                Add Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2d62ff]/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[#2d62ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{deals.length}</p>
              <p className="text-sm text-[#868686]">Total Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#dd23bb]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#dd23bb]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalPipelineValue)}</p>
              <p className="text-sm text-[#868686]">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalWonValue)}</p>
              <p className="text-sm text-[#868686]">Closed Won</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageValue = getStageValue(stage.id);
            const StageIcon = stage.icon;

            return (
              <div
                key={stage.id}
                className="w-80 flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <Card className="bg-[#141414] border-[#1f1f1f] h-full">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${stage.color}20` }}
                        >
                          <StageIcon className="w-4 h-4" style={{ color: stage.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium text-white">{stage.name}</CardTitle>
                          <p className="text-xs text-[#868686]">
                            {stageDeals.length} deals · {formatCurrency(stageValue)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-[#1f1f1f] text-[#868686]">
                        {stageDeals.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        onClick={() => setSelectedDeal(deal)}
                        className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#2d62ff]/50 cursor-pointer transition-all hover:shadow-lg group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-white group-hover:text-[#2d62ff] transition-colors">
                            {deal.title}
                          </h4>
                          <MoreHorizontal className="w-4 h-4 text-[#868686] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-3 h-3 text-[#868686]" />
                          <span className="text-xs text-[#d2d2d2]">{deal.leadName}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(deal.value)}
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="text-xs text-[#868686]">{deal.probability}%</span>
                          </div>
                        </div>

                        {deal.expectedCloseDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-[#868686]">
                            <Calendar className="w-3 h-3" />
                            <span>Close: {formatDate(deal.expectedCloseDate)}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-[#868686]">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No deals in this stage</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal Detail Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="bg-[#141414] border-[#1f1f1f] max-w-lg">
          {selectedDeal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedDeal.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-[#0a0a0a]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#868686]">Deal Value</span>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(selectedDeal.value)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#868686]">Probability</span>
                    <span className="text-white">{selectedDeal.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#868686]">Stage</span>
                    <Badge
                      variant="outline"
                      className="border-[#2d62ff]/30 text-[#2d62ff]"
                    >
                      {stages.find(s => s.id === selectedDeal.stage)?.name}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-[#d2d2d2] mb-2">Description</h4>
                  <p className="text-sm text-[#868686]">
                    {selectedDeal.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-[#d2d2d2] mb-1">Lead</h4>
                    <p className="text-sm text-[#868686]">{selectedDeal.leadName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#d2d2d2] mb-1">Expected Close</h4>
                    <p className="text-sm text-[#868686]">
                      {selectedDeal.expectedCloseDate
                        ? formatDate(selectedDeal.expectedCloseDate)
                        : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedDeal.stage !== 'closed_won' && selectedDeal.stage !== 'closed_lost' && (
                    <>
                      <Button
                        className="flex-1 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white"
                        onClick={() => {
                          moveDealStage(selectedDeal.id, 'closed_won');
                          setSelectedDeal(null);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Won
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          moveDealStage(selectedDeal.id, 'closed_lost');
                          setSelectedDeal(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark Lost
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
