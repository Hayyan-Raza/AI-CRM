import { create } from 'zustand';
import { supabase } from '@/supabase';

interface DashboardState {
  leads: any[];
  deals: any[];
  tasks: any[];
  stats: {
    revenue: number;
    activeDeals: number;
    conversionRate: number;
    totalLeads: number;
  };
  fetchDashboard: (companyId: string, userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  leads: [],
  deals: [],
  tasks: [],
  stats: {
    revenue: 0,
    activeDeals: 0,
    conversionRate: 0,
    totalLeads: 0,
  },

  fetchDashboard: async (companyId, userId) => {
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('company_id', companyId);

    const { data: deals } = await supabase
      .from('deals')
      .select('*')
      .eq('company_id', companyId);

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId);

    const revenue =
      deals?.reduce((sum, d: any) => sum + d.amount, 0) || 0;

    const activeDeals =
      deals?.filter((d: any) => d.stage !== 'closed').length || 0;

    const totalLeads = leads?.length || 0;

    const conversionRate = totalLeads
      ? Math.round((deals?.length || 0) / totalLeads * 100)
      : 0;

    set({
      leads: leads || [],
      deals: deals || [],
      tasks: tasks || [],
      stats: {
        revenue,
        activeDeals,
        conversionRate,
        totalLeads,
      },
    });
  },
}));
