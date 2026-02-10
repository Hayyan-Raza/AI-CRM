import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Target,
  Search,
  Filter,
  Building2,
  TrendingUp,
  Calendar,
  Trash2,
  Eye
} from 'lucide-react';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import type { LeadStatus, DealStage, LeadSource } from '@/types';

const leadStatuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'];
const dealStages: DealStage[] = ['new_lead', 'contacted', 'qualified', 'negotiation', 'closed_won', 'closed_lost'];
const leadSources: LeadSource[] = ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event', 'other'];

export default function CRMPage() {
  const { user, company } = useAuthStore();
  const { leads, deals, addLead, addDeal, deleteLead, deleteDeal } = useCRMStore();
  const [activeTab, setActiveTab] = useState('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website' as LeadSource,
    notes: '',
  });

  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    value: '',
    stage: 'new_lead' as DealStage,
    leadId: '',
    expectedCloseDate: '',
  });

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.leadName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = async () => {
    try {
      await addLead({
        ...leadForm,
        status: 'new',
        assignedTo: user?.id,
      });
      setLeadForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        source: 'website',
        notes: '',
      });
      setIsAddLeadOpen(false);
    } catch (error: any) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead: ' + (error.message || 'Unknown error'));
    }
  };

  const handleAddDeal = async () => {
    const lead = leads.find(l => l.id === dealForm.leadId);
    if (lead) {
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
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-[#2d62ff]/20 text-[#2d62ff] border-[#2d62ff]/30',
      contacted: 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30',
      qualified: 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30',
      unqualified: 'bg-[#868686]/20 text-[#868686] border-[#868686]/30',
      converted: 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30',
      lost: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
      new_lead: 'bg-[#2d62ff]/20 text-[#2d62ff] border-[#2d62ff]/30',
      negotiation: 'bg-[#dd23bb]/20 text-[#dd23bb] border-[#dd23bb]/30',
      closed_won: 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30',
      closed_lost: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
    };
    return styles[status] || 'bg-[#868686]/20 text-[#868686]';
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">CRM</h1>
          <p className="text-[#868686] mt-1">Manage your leads and deals in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#1f1f1f] bg-[#141414] text-[#d2d2d2] hover:bg-[#1b1b1b]">
                <Users className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141414] border-[#1f1f1f] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Name</Label>
                    <Input
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Email</Label>
                    <Input
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Phone</Label>
                    <Input
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Company</Label>
                    <Input
                      value={leadForm.company}
                      onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Title</Label>
                    <Input
                      value={leadForm.title}
                      onChange={(e) => setLeadForm({ ...leadForm, title: e.target.value })}
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Source</Label>
                    <Select
                      value={leadForm.source}
                      onValueChange={(v) => setLeadForm({ ...leadForm, source: v as LeadSource })}
                    >
                      <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                        {leadSources.map(source => (
                          <SelectItem key={source} value={source} className="text-white">
                            {formatStatus(source)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Notes</Label>
                  <Textarea
                    value={leadForm.notes}
                    onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleAddLead}
                  className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                >
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                <Target className="w-4 h-4 mr-2" />
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
                        {dealStages.map(stage => (
                          <SelectItem key={stage} value={stage} className="text-white">
                            {formatStatus(stage)}
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
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id} className="text-white">
                            {lead.name} - {lead.company}
                          </SelectItem>
                        ))}
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
                  disabled={!dealForm.leadId}
                  className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                >
                  Add Deal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2d62ff]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#2d62ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{leads.length}</p>
              <p className="text-sm text-[#868686]">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#dd23bb]/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#dd23bb]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{deals.length}</p>
              <p className="text-sm text-[#868686]">Active Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + d.value, 0))}
              </p>
              <p className="text-sm text-[#868686]">Won Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.expectedCloseDate && new Date(d.expectedCloseDate) > new Date()).length}
              </p>
              <p className="text-sm text-[#868686]">Upcoming Closes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-[#141414] border border-[#1f1f1f]">
            <TabsTrigger value="leads" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Leads ({filteredLeads.length})
            </TabsTrigger>
            <TabsTrigger value="deals" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Deals ({filteredDeals.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868686]" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#141414] border-[#1f1f1f] text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-[#141414] border-[#1f1f1f] text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                {(activeTab === 'leads' ? leadStatuses : dealStages).map(status => (
                  <SelectItem key={status} value={status} className="text-white">
                    {formatStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="leads" className="mt-0">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1f1f1f]">
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Lead</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Company</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Source</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Last Contact</th>
                      <th className="text-right p-4 text-sm font-medium text-[#868686]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-[#1f1f1f] hover:bg-[#1b1b1b] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.email}`} />
                              <AvatarFallback className="bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] text-white text-sm">
                                {getInitials(lead.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-white">{lead.name}</p>
                              <p className="text-xs text-[#868686]">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#868686]" />
                            <span className="text-sm text-[#d2d2d2]">{lead.company}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusBadge(lead.status)}>
                            {formatStatus(lead.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-[#d2d2d2]">{formatStatus(lead.source)}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-[#868686]">
                            {lead.lastContactedAt ? formatDate(lead.lastContactedAt) : 'Never'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/dashboard/timeline?lead=${lead.id}`}>
                              <Button variant="ghost" size="icon" className="text-[#868686] hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#868686] hover:text-red-400"
                              onClick={() => deleteLead(lead.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="mt-0">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1f1f1f]">
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Deal</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Lead</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Stage</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Value</th>
                      <th className="text-left p-4 text-sm font-medium text-[#868686]">Probability</th>
                      <th className="text-right p-4 text-sm font-medium text-[#868686]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((deal) => (
                      <tr key={deal.id} className="border-b border-[#1f1f1f] hover:bg-[#1b1b1b] transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-white">{deal.title}</p>
                            <p className="text-xs text-[#868686] truncate max-w-[200px]">{deal.description}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-[#d2d2d2]">{deal.leadName}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusBadge(deal.stage)}>
                            {formatStatus(deal.stage)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-white">
                            {formatCurrency(deal.value)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb]"
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-sm text-[#868686]">{deal.probability}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/dashboard/pipeline?deal=${deal.id}`}>
                              <Button variant="ghost" size="icon" className="text-[#868686] hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#868686] hover:text-red-400"
                              onClick={() => deleteDeal(deal.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
