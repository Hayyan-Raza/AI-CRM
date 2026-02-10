// User & Authentication Types
export type UserRole = 'admin' | 'sales_manager' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  apiKey?: string;
  model?: string;
  googleAccessToken?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
}

// Lead Types
export type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'event' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

// Deal Types
export type DealStage = 'new_lead' | 'contacted' | 'qualified' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  leadId: string;
  leadName: string;
  assignedTo?: string;
  companyId?: string;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  closedLostReason?: string;
  competitorInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskType = 'follow_up' | 'meeting' | 'call' | 'email' | 'demo' | 'proposal' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  relatedTo?: {
    type: 'lead' | 'deal';
    id: string;
    name: string;
  };
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Activity/Timeline Types
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal_stage_change' | 'ai_insight';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  performedBy: string;
  performedByName: string;
  relatedTo: {
    type: 'lead' | 'deal';
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
}

// AI Insight Types
export type InsightType = 'lead_score' | 'deal_risk' | 'follow_up_suggestion' | 'sentiment_analysis' | 'trend_prediction' | 'revenue_forecast' | 'deal_prediction';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  relatedTo?: {
    type: 'lead' | 'deal';
    id: string;
    name: string;
  };
  recommendedAction?: string;
  createdAt: Date;
}

// Conversation Types
export interface Conversation {
  id: string;
  type: 'call' | 'email' | 'meeting';
  title: string;
  content: string;
  summary?: string;
  participantName: string;
  participantEmail?: string;
  relatedTo: {
    type: 'lead' | 'deal';
    id: string;
    name: string;
  };
  createdBy: string;
  createdAt: Date;
  duration?: number;
}

// Dashboard Types
export interface DashboardStats {
  totalLeads: number;
  newLeadsThisMonth: number;
  totalDeals: number;
  dealsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  conversionRate: number;
  activeTasks: number;
  overdueTasks: number;
}

export interface PipelineStats {
  stage: DealStage;
  count: number;
  value: number;
}

// Report Types
export interface SalesReport {
  period: string;
  totalRevenue: number;
  newDeals: number;
  lostDeals: number;
  conversionRate: number;
  averageDealValue: number;
  topPerformers: {
    userId: string;
    name: string;
    dealsClosed: number;
    revenue: number;
  }[];
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  allowedRoles?: UserRole[];
  badge?: number;
}

// Documentation Types
export interface DocSection {
  title: string;
  slug: string;
  content?: string;
  subsections?: DocSection[];
}
