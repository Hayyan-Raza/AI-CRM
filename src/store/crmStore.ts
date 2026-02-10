import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead, Deal, Task, Activity, AIInsight, Conversation, DashboardStats, PipelineStats } from '@/types';
import { supabase } from '@/supabase';

interface CRMState {
  // Data
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  insights: AIInsight[];
  conversations: Conversation[];
  isLoading: boolean;

  // Actions - Initialization
  fetchData: () => Promise<void>;

  // Actions - Leads
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;

  // Actions - Deals
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDealStage: (id: string, newStage: Deal['stage']) => Promise<void>;
  getDealById: (id: string) => Deal | undefined;

  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;

  // Actions - Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;
  getActivitiesForLead: (leadId: string) => Activity[];
  getActivitiesForDeal: (dealId: string) => Activity[];

  // Actions - Conversations
  addConversation: (conversation: Omit<Conversation, 'id' | 'createdAt'>) => Promise<void>;
  getConversationsForLead: (leadId: string) => Conversation[];

  // Getters
  getDashboardStats: () => DashboardStats;
  getPipelineStats: () => PipelineStats[];
  getRecentActivities: (limit?: number) => Activity[];
  getOverdueTasks: () => Task[];
  getTasksDueToday: () => Task[];

  // Actions - Insights
  addInsight: (insight: Omit<AIInsight, 'id' | 'createdAt'>) => Promise<void>;
  clearInsights: () => Promise<void>;
}

// Mapping Helpers
const mapLeadFromDB = (l: any): Lead => ({
  id: l.id,
  name: l.name,
  email: l.email,
  phone: l.phone,
  company: l.company,
  title: l.title,
  source: l.source,
  status: l.status,
  assignedTo: l.assigned_to,
  notes: l.notes,
  createdAt: new Date(l.created_at),
  updatedAt: new Date(l.updated_at),
  lastContactedAt: l.last_contacted_at ? new Date(l.last_contacted_at) : undefined,
});

const mapDealFromDB = (d: any): Deal => ({
  id: d.id,
  title: d.title,
  description: d.description,
  value: Number(d.value),
  currency: d.currency,
  stage: d.stage,
  probability: Number(d.probability),
  leadId: d.lead_id,
  leadName: d.lead_name || 'Associated Lead',
  assignedTo: d.assigned_to,
  companyId: d.company_id,
  expectedCloseDate: d.expected_close_date ? new Date(d.expected_close_date) : undefined,
  actualCloseDate: d.actual_close_date ? new Date(d.actual_close_date) : undefined,
  closedLostReason: d.closed_lost_reason,
  competitorInfo: d.competitor_info,
  createdAt: new Date(d.created_at),
  updatedAt: new Date(d.updated_at),
});

const mapTaskFromDB = (t: any): Task => ({
  id: t.id,
  title: t.title,
  description: t.description,
  type: t.type,
  priority: t.priority,
  status: t.status,
  assignedTo: t.assigned_to,
  relatedTo: t.related_id ? { type: t.related_type, id: t.related_id, name: t.related_name || 'Related Item' } : undefined,
  dueDate: new Date(t.due_date),
  completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
  createdAt: new Date(t.created_at),
  updatedAt: new Date(t.updated_at),
});

const mapActivityFromDB = (a: any): Activity => ({
  id: a.id,
  type: a.type,
  title: a.title,
  description: a.description,
  performedBy: a.performed_by,
  performedByName: a.performed_by_name || 'System',
  relatedTo: { type: a.related_type, id: a.related_id, name: a.related_name || 'Related Item' },
  metadata: a.metadata,
  createdAt: new Date(a.created_at),
});

const mapInsightFromDB = (i: any): AIInsight => ({
  id: i.id,
  type: i.type,
  title: i.title,
  description: i.description,
  confidence: Number(i.confidence),
  relatedTo: i.related_id ? { type: i.related_type, id: i.related_id, name: i.related_name || 'Related Item' } : undefined,
  recommendedAction: i.recommended_action,
  createdAt: new Date(i.created_at),
});

const mapConversationFromDB = (c: any): Conversation => ({
  id: c.id,
  type: c.type,
  title: c.title,
  content: c.content,
  summary: c.summary,
  participantName: c.participant_name,
  participantEmail: c.participant_email,
  relatedTo: { type: c.related_type, id: c.related_id, name: c.related_name || 'Related Item' },
  createdBy: c.created_by,
  createdAt: new Date(c.created_at),
  duration: Number(c.duration),
});

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      leads: [],
      deals: [],
      tasks: [],
      activities: [],
      insights: [],
      conversations: [],
      isLoading: false,

      fetchData: async () => {
        set({ isLoading: true });
        try {
          const [
            { data: leads },
            { data: deals },
            { data: tasks },
            { data: activities },
            { data: insights },
            { data: conversations }
          ] = await Promise.all([
            supabase.from('leads').select('*').order('created_at', { ascending: false }),
            supabase.from('deals').select('*').order('created_at', { ascending: false }),
            supabase.from('tasks').select('*').order('due_date', { ascending: true }),
            supabase.from('activities').select('*').order('created_at', { ascending: false }),
            supabase.from('ai_insights').select('*').order('created_at', { ascending: false }),
            supabase.from('conversations').select('*').order('created_at', { ascending: false })
          ]);

          set({
            leads: (leads || []).map(mapLeadFromDB),
            deals: (deals || []).map(mapDealFromDB),
            tasks: (tasks || []).map(mapTaskFromDB),
            activities: (activities || []).map(mapActivityFromDB),
            insights: (insights || []).map(mapInsightFromDB),
            conversations: (conversations || []).map(mapConversationFromDB),
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching CRM data:', error);
          set({ isLoading: false });
        }
      },

      // Lead Actions
      addLead: async (leadData) => {
        const { data, error } = await supabase
          .from('leads')
          .insert([{
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            company: leadData.company,
            title: leadData.title,
            source: leadData.source,
            status: leadData.status,
            assigned_to: leadData.assignedTo || null,
            notes: leadData.notes
          }])
          .select()
          .single();

        if (error) throw error;

        const newLead = mapLeadFromDB(data);
        set(state => ({ leads: [newLead, ...state.leads] }));

        await get().addActivity({
          type: 'note',
          title: 'New Lead Created',
          description: `Lead "${newLead.name}" was created`,
          performedBy: newLead.assignedTo || '',
          performedByName: 'System',
          relatedTo: { type: 'lead', id: newLead.id, name: newLead.name },
        });
      },

      updateLead: async (id, updates) => {
        const dbUpdates: any = { ...updates };
        if (updates.assignedTo) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.lastContactedAt) dbUpdates.last_contacted_at = updates.lastContactedAt;

        const { error } = await supabase
          .from('leads')
          .update({ ...dbUpdates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;

        set(state => ({
          leads: state.leads.map(lead =>
            lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
          ),
        }));
      },

      deleteLead: async (id) => {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
        set(state => ({ leads: state.leads.filter(lead => lead.id !== id) }));
      },

      getLeadById: (id) => get().leads.find(lead => lead.id === id),

      // Deal Actions
      addDeal: async (dealData) => {
        const { data, error } = await supabase
          .from('deals')
          .insert([{
            title: dealData.title,
            description: dealData.description,
            value: dealData.value,
            currency: dealData.currency,
            stage: dealData.stage,
            probability: dealData.probability,
            lead_id: dealData.leadId,
            assigned_to: dealData.assignedTo || null,
            company_id: dealData.companyId || null,
            expected_close_date: dealData.expectedCloseDate,
          }])
          .select()
          .single();

        if (error) throw error;

        const newDeal = mapDealFromDB(data);
        set(state => ({ deals: [newDeal, ...state.deals] }));

        await get().addActivity({
          type: 'deal_stage_change',
          title: 'New Deal Created',
          description: `Deal "${newDeal.title}" worth $${newDeal.value.toLocaleString()} was created`,
          performedBy: newDeal.assignedTo || '',
          performedByName: 'System',
          relatedTo: { type: 'deal', id: newDeal.id, name: newDeal.title },
        });
      },

      updateDeal: async (id, updates) => {
        const dbUpdates: any = { ...updates };
        if (updates.leadId) dbUpdates.lead_id = updates.leadId;
        if (updates.assignedTo) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.companyId) dbUpdates.company_id = updates.companyId;
        if (updates.expectedCloseDate) dbUpdates.expected_close_date = updates.expectedCloseDate;
        if (updates.actualCloseDate) dbUpdates.actual_close_date = updates.actualCloseDate;
        if (updates.closedLostReason) dbUpdates.closed_lost_reason = updates.closedLostReason;
        if (updates.competitorInfo) dbUpdates.competitor_info = updates.competitorInfo;

        const { error } = await supabase
          .from('deals')
          .update({ ...dbUpdates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;

        set(state => ({
          deals: state.deals.map(deal =>
            deal.id === id ? { ...deal, ...updates, updatedAt: new Date() } : deal
          ),
        }));
      },

      deleteDeal: async (id) => {
        const { error } = await supabase.from('deals').delete().eq('id', id);
        if (error) throw error;
        set(state => ({ deals: state.deals.filter(deal => deal.id !== id) }));
      },

      moveDealStage: async (id, newStage) => {
        const deal = get().deals.find(d => d.id === id);
        if (deal) {
          const oldStage = deal.stage;
          const updates: any = { stage: newStage };
          if (newStage === 'closed_won') updates.actualCloseDate = new Date();

          await get().updateDeal(id, updates);

          await get().addActivity({
            type: 'deal_stage_change',
            title: 'Deal Stage Changed',
            description: `Moved from "${oldStage}" to "${newStage}"`,
            performedBy: deal.assignedTo || '',
            performedByName: 'System',
            relatedTo: { type: 'deal', id: deal.id, name: deal.title },
            metadata: { oldStage, newStage },
          });
        }
      },

      getDealById: (id) => get().deals.find(deal => deal.id === id),

      // Task Actions
      addTask: async (taskData) => {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            title: taskData.title,
            description: taskData.description,
            type: taskData.type,
            priority: taskData.priority,
            status: taskData.status,
            assigned_to: taskData.assignedTo || null,
            related_type: taskData.relatedTo?.type,
            related_id: taskData.relatedTo?.id,
            due_date: taskData.dueDate,
          }])
          .select()
          .single();

        if (error) throw error;

        const newTask = mapTaskFromDB(data);
        set(state => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: async (id, updates) => {
        const dbUpdates: any = { ...updates };
        if (updates.assignedTo) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
        if (updates.completedAt) dbUpdates.completed_at = updates.completedAt;
        if (updates.relatedTo) {
          dbUpdates.related_type = updates.relatedTo.type;
          dbUpdates.related_id = updates.relatedTo.id;
        }

        const { error } = await supabase
          .from('tasks')
          .update({ ...dbUpdates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;

        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
          ),
        }));
      },

      deleteTask: async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
        set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
      },

      completeTask: async (id) => {
        await get().updateTask(id, {
          status: 'completed',
          completedAt: new Date()
        });
      },

      getTaskById: (id) => get().tasks.find(task => task.id === id),

      // Activity Actions
      addActivity: async (activityData) => {
        const { data, error } = await supabase
          .from('activities')
          .insert([{
            type: activityData.type,
            title: activityData.title,
            description: activityData.description,
            performed_by: activityData.performedBy || null,
            performed_by_name: activityData.performedByName,
            related_type: activityData.relatedTo?.type,
            related_id: activityData.relatedTo?.id,
            metadata: activityData.metadata
          }])
          .select()
          .single();

        if (error) throw error;

        const newActivity = mapActivityFromDB(data);
        set(state => ({ activities: [newActivity, ...state.activities] }));
      },

      getActivitiesForLead: (leadId) => {
        return get().activities.filter(
          activity => activity.relatedTo?.type === 'lead' && activity.relatedTo?.id === leadId
        );
      },

      getActivitiesForDeal: (dealId) => {
        return get().activities.filter(
          activity => activity.relatedTo?.type === 'deal' && activity.relatedTo?.id === dealId
        );
      },

      // Conversation Actions
      addConversation: async (conversationData) => {
        const { data, error } = await supabase
          .from('conversations')
          .insert([{
            type: conversationData.type,
            title: conversationData.title,
            content: conversationData.content,
            summary: conversationData.summary,
            participant_name: conversationData.participantName,
            participant_email: conversationData.participantEmail,
            related_type: conversationData.relatedTo?.type,
            related_id: conversationData.relatedTo?.id,
            created_by: conversationData.createdBy || null,
            duration: conversationData.duration
          }])
          .select()
          .single();

        if (error) throw error;

        const newConversation = mapConversationFromDB(data);
        set(state => ({ conversations: [newConversation, ...state.conversations] }));
      },

      getConversationsForLead: (leadId) => {
        return get().conversations.filter(
          conv => conv.relatedTo?.type === 'lead' && conv.relatedTo?.id === leadId
        );
      },

      // Getters
      getDashboardStats: () => {
        const { leads, deals, tasks } = get();
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const newLeadsThisMonth = leads.filter(l => {
          const d = new Date(l.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        const dealsThisMonth = deals.filter(d => {
          const date = new Date(d.createdAt);
          return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });

        const closedDeals = deals.filter(d => d.stage === 'closed_won');
        const totalRevenue = closedDeals.reduce((sum, d) => sum + d.value, 0);

        const revenueThisMonth = deals
          .filter(d => {
            if (d.stage !== 'closed_won') return false;
            const date = new Date(d.actualCloseDate || d.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
          })
          .reduce((sum, d) => sum + d.value, 0);

        const conversionRate = leads.length > 0
          ? Math.round((closedDeals.length / leads.length) * 100)
          : 0;

        const activeTasks = tasks.filter(t => t.status !== 'completed').length;
        const overdueTasks = tasks.filter(t =>
          t.status !== 'completed' && new Date(t.dueDate) < now
        ).length;

        return {
          totalLeads: leads.length,
          newLeadsThisMonth,
          totalDeals: deals.length,
          dealsThisMonth: dealsThisMonth.length,
          totalRevenue,
          revenueThisMonth,
          conversionRate,
          activeTasks,
          overdueTasks,
        };
      },

      getPipelineStats: () => {
        const { deals } = get();
        const stages: Deal['stage'][] = ['new_lead', 'contacted', 'qualified', 'negotiation', 'closed_won', 'closed_lost'];

        return stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          return {
            stage,
            count: stageDeals.length,
            value: stageDeals.reduce((sum, d) => sum + d.value, 0),
          };
        });
      },

      getRecentActivities: (limit = 10) => {
        return get().activities.slice(0, limit);
      },

      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(task => task.dueDate < now && task.status !== 'completed');
      },

      getTasksDueToday: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return get().tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate < tomorrow && task.status !== 'completed';
        });
      },

      addInsight: async (insightData) => {
        const { data, error } = await supabase
          .from('ai_insights')
          .insert([{
            type: insightData.type,
            title: insightData.title,
            description: insightData.description,
            confidence: insightData.confidence,
            related_type: insightData.relatedTo?.type,
            related_id: insightData.relatedTo?.id,
            recommended_action: insightData.recommendedAction
          }])
          .select()
          .single();

        if (error) throw error;

        const newInsight = mapInsightFromDB(data);
        set(state => ({ insights: [newInsight, ...state.insights] }));
      },

      clearInsights: async () => {
        await supabase.from('ai_insights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        set({ insights: [] });
      }
    }),
    {
      name: 'nexus-crm-storage',
      partialize: (state) => ({ insights: state.insights })
    }
  )
);
