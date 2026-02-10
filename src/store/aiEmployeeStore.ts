import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GoogleService } from '@/services/googleService';
import GeminiService from '@/services/geminiService';

export interface WorkflowNode {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
    data?: any;
}

export interface AIEmployee {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'paused';
    type: 'email_manager' | 'customer_support' | 'research' | 'calendar_manager' | 'task_manager' | 'custom';
    tasksCompleted: number;
    efficiency: number;
    avatar: string;
    description: string;
    workflow?: WorkflowNode[];
    messages?: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
}

export interface LogEntry {
    id: string;
    employeeId?: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
}

interface AIEmployeeState {
    employees: AIEmployee[];
    logs: LogEntry[];
    notifications: Notification[];
    isScanning: boolean;
    lastScanTime: string | null;
    processedEmailIds: string[]; // Track which emails have been processed
    isRateLimited: boolean;
    rateLimitExpiry: number | null;

    // Actions
    addEmployee: (employee: Omit<AIEmployee, 'id'> & { id?: string }) => void;
    updateEmployee: (id: string, updates: Partial<AIEmployee>) => void;
    deleteEmployee: (id: string) => void;

    addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;

    scanInbox: (accessToken: string) => Promise<void>;
    sendMessage: (employeeId: string, message: string) => Promise<void>;
}

export const useAIEmployeeStore = create<AIEmployeeState>()(
    persist(
        (set, get) => ({
            employees: [
                {
                    id: '1',
                    name: "Sarah (Email Manager)",
                    role: "Elite Executive Assistant",
                    status: "active",
                    type: "email_manager",
                    tasksCompleted: 145,
                    efficiency: 98,
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
                    description: "Proactive email management, CRM pipeline analysis, and autonomous drafting.",
                    workflow: [
                        {
                            id: '1',
                            type: 'action',
                            label: 'Sync CRM Pipeline',
                            position: { x: 0, y: 0 },
                            data: { action: 'fetch_crm_data' }
                        },
                        {
                            id: '2',
                            type: 'action',
                            label: 'Analyze Tasks',
                            position: { x: 0, y: 1 },
                            data: { action: 'fetch_tasks' }
                        },
                        {
                            id: '3',
                            type: 'action',
                            label: 'Generate Pipeline Insights',
                            position: { x: 0, y: 2 },
                            data: { action: 'generate_insights' }
                        },
                        {
                            id: '4',
                            type: 'action',
                            label: 'Fetch New Emails',
                            position: { x: 0, y: 3 },
                            data: { action: 'fetch_emails', maxResults: 5 }
                        },
                        {
                            id: '5',
                            type: 'notification',
                            label: 'Notify on Urgent Findings',
                            position: { x: 0, y: 4 },
                            data: { action: 'notify_user' }
                        }
                    ]
                },
                {
                    id: '2',
                    name: "James (Calendar Manager)",
                    role: "Executive Scheduler",
                    status: "active",
                    type: "calendar_manager",
                    tasksCompleted: 89,
                    efficiency: 95,
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede",
                    description: "Manages your schedule, flags conflicts, and autonomous meeting coordination.",
                    workflow: [
                        {
                            id: 'c1',
                            type: 'action',
                            label: 'Fetch Calendar Events',
                            position: { x: 0, y: 0 },
                            data: { action: 'fetch_calendar', maxResults: 10 }
                        },
                        {
                            id: 'c2',
                            type: 'condition',
                            label: 'Analyze for conflicts or important meetings',
                            position: { x: 0, y: 1 },
                            data: { action: 'analyze_calendar' }
                        },
                        {
                            id: 'c3',
                            type: 'notification',
                            label: 'notify user of conflicts',
                            position: { x: 0, y: 2 },
                            data: { action: 'notify_user' }
                        }
                    ]
                },
                {
                    id: '3',
                    name: "Alex (Task Manager)",
                    role: "Operations Manager",
                    status: "active",
                    type: "task_manager",
                    tasksCompleted: 210,
                    efficiency: 94,
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf",
                    description: "Prioritizes your tasks, generates summaries, and ensures deadlines are met.",
                    workflow: [
                        {
                            id: 't1',
                            type: 'action',
                            label: 'Fetch Pending Tasks',
                            position: { x: 0, y: 0 },
                            data: { action: 'fetch_tasks' }
                        },
                        {
                            id: 't2',
                            type: 'condition',
                            label: 'Prioritize and summarize tasks',
                            position: { x: 0, y: 1 },
                            data: { action: 'analyze_tasks' }
                        },
                        {
                            id: 't3',
                            type: 'notification',
                            label: 'Send summary to user',
                            position: { x: 0, y: 2 },
                            data: { action: 'notify_user' }
                        }
                    ]
                },
                {
                    id: '4',
                    name: "Elena (Support Agent)",
                    role: "Customer Success Specialist",
                    status: "active",
                    type: "customer_support",
                    tasksCompleted: 45,
                    efficiency: 92,
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffcff1",
                    description: "Analyzes customer sentiment, drafts support tickets, and maintains satisfaction.",
                    workflow: [
                        { id: 's1', type: 'action', label: 'Fetch Support Emails', position: { x: 0, y: 0 }, data: { action: 'fetch_emails' } },
                        { id: 's2', type: 'condition', label: 'Analyze Sentiment and Draft Replies', position: { x: 0, y: 1 }, data: { action: 'analyze_support' } },
                        { id: 's3', type: 'notification', label: 'Alert team if customer is frustrated', position: { x: 0, y: 2 }, data: { action: 'notify_user' } }
                    ]
                },
                {
                    id: '5',
                    name: "Zoe (Research Agent)",
                    role: "Strategy & Insights Analyst",
                    status: "active",
                    type: "research",
                    tasksCompleted: 12,
                    efficiency: 91,
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=cfffd4",
                    description: "Analyzes CRM trends, identifies risks in the pipeline, and suggests strategy.",
                    workflow: [
                        { id: 'r1', type: 'action', label: 'Fetch Pipeline Data', position: { x: 0, y: 0 }, data: { action: 'fetch_crm_data' } },
                        { id: 'r2', type: 'condition', label: 'Generate Strategic Insights', position: { x: 0, y: 1 }, data: { action: 'generate_insights' } },
                        { id: 'r3', type: 'notification', label: 'Present findings to management', position: { x: 0, y: 2 }, data: { action: 'notify_user' } }
                    ]
                }
            ],
            logs: [],
            notifications: [],
            isScanning: false,
            lastScanTime: null,
            processedEmailIds: [],
            isRateLimited: false,
            rateLimitExpiry: null,

            addEmployee: (employee) => set((state) => ({
                employees: [...state.employees, { ...employee, id: employee.id || crypto.randomUUID() }]
            })),

            updateEmployee: (id, updates) => set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.id === id ? { ...emp, ...updates } : emp
                )
            })),

            deleteEmployee: (id) => set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id)
            })),

            addLog: (log) => set((state) => ({
                logs: [
                    { ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
                    ...state.logs
                ].slice(0, 100) // Keep last 100 logs
            })),

            addNotification: (notification) => set((state) => ({
                notifications: [
                    { ...notification, id: crypto.randomUUID(), read: false, timestamp: new Date().toISOString() },
                    ...state.notifications
                ]
            })),

            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            clearNotifications: () => set({ notifications: [] }),


            scanInbox: async (accessToken: string) => {
                const { isScanning, addLog, addNotification, employees, processedEmailIds, isRateLimited, rateLimitExpiry } = get();

                if (isScanning) return;

                // Check for active rate limit
                if (isRateLimited && rateLimitExpiry && Date.now() < rateLimitExpiry) {
                    const remainingTime = Math.ceil((rateLimitExpiry - Date.now()) / 1000);
                    if (remainingTime % 30 === 0) { // Log sparingly
                        addLog({ message: `Agent brain cooling down... (${remainingTime}s remaining)`, type: 'warning' });
                    }
                    return;
                }

                if (isRateLimited) {
                    set({ isRateLimited: false, rateLimitExpiry: null });
                }

                set({ isScanning: true });
                addLog({ message: "AI Engine powering up... Analyzing data sources.", type: 'info' });

                const { useAuthStore } = await import('@/store/authStore');
                const { user } = useAuthStore.getState();
                const userApiKey = user?.apiKey;

                if (!userApiKey) {
                    const errorMsg = "Gemini API Key not found. Please add it in Settings.";
                    addLog({ message: errorMsg, type: 'error' });
                    set({ isScanning: false });
                    throw new Error(errorMsg);
                }

                try {
                    // Force update Sarah if she's on the old 3-step workflow
                    const sarah = employees.find(e => e.id === '1');
                    if (sarah && (!sarah.workflow || sarah.workflow.length < 5)) {
                        console.log("Upgrading Sarah to 2026 Optimized Workflow...");
                        get().updateEmployee('1', {
                            description: "Proactive email management, CRM pipeline analysis, and autonomous drafting.",
                            workflow: [
                                { id: '1', type: 'action', label: 'Sync CRM Pipeline', position: { x: 0, y: 0 }, data: { action: 'fetch_crm_data' } },
                                { id: '2', type: 'action', label: 'Analyze Tasks', position: { x: 0, y: 1 }, data: { action: 'fetch_tasks' } },
                                { id: '3', type: 'action', label: 'Generate Pipeline Insights', position: { x: 0, y: 2 }, data: { action: 'generate_insights' } },
                                { id: '4', type: 'action', label: 'Fetch New Emails', position: { x: 0, y: 3 }, data: { action: 'fetch_emails', maxResults: 5 } },
                                { id: '5', type: 'notification', label: 'Notify on Urgent Findings', position: { x: 0, y: 4 }, data: { action: 'notify_user' } }
                            ]
                        });
                    }

                    // Re-fetch employees after potential upgrade
                    const activeEmployees = get().employees.filter(emp => emp.status === 'active');

                    if (activeEmployees.length === 0) {
                        addLog({ message: "No active AI employees found. Activate an agent in AI Employees tab.", type: 'warning' });
                        set({ isScanning: false });
                        return;
                    }

                    for (const employee of activeEmployees) {
                        // Add a small delay between employees to respect RPM limits
                        if (activeEmployees.indexOf(employee) > 0) {
                            await new Promise(r => setTimeout(r, 1000));
                        }

                        if (!employee.workflow || employee.workflow.length === 0) continue;

                        addLog({
                            message: `Starting autonomous cycle for ${employee.name}...`,
                            type: 'info',
                            employeeId: employee.id
                        });

                        let contextData: any = {
                            messages: [],
                            newMessages: [],
                            urgentItems: [],
                            calendarEvents: [],
                            tasks: [],
                            crmData: { leads: [], deals: [] },
                            summary: ""
                        };

                        for (const step of employee.workflow) {
                            addLog({ message: `Executing: ${step.label}`, type: 'info', employeeId: employee.id });

                            const gemini = userApiKey ? new GeminiService(userApiKey, user?.model) : null;
                            let stepAction = step.data?.action;

                            if (!stepAction && gemini) {
                                const interpretation = await gemini.interpretWorkflowStep(step.label);
                                stepAction = interpretation.action;
                            }

                            if (!stepAction) {
                                // Fallback keyword check if Gemini fails or isn't enabled
                                const label = step.label.toLowerCase();
                                if (label.includes('fetch') || label.includes('get')) {
                                    if (label.includes('calendar')) stepAction = 'fetch_calendar';
                                    else if (label.includes('task')) stepAction = 'fetch_tasks';
                                    else stepAction = 'fetch_emails';
                                } else if (label.includes('analyze') || label.includes('check') || label.includes('prioritize')) {
                                    if (label.includes('calendar')) stepAction = 'analyze_calendar';
                                    else if (label.includes('task')) stepAction = 'analyze_tasks';
                                    else stepAction = 'analyze_emails';
                                } else if (label.includes('notify') || label.includes('alert')) {
                                    stepAction = 'notify_user';
                                }
                            }

                            // Action Handlers
                            switch (stepAction) {
                                case 'fetch_emails':
                                    if (!accessToken) {
                                        addLog({ message: `Skipped ${step.label}: No Google account connected.`, type: 'warning', employeeId: employee.id });
                                        break;
                                    }
                                    const emailResults = await GoogleService.getGmailMessages(accessToken, step.data?.maxResults || 5);
                                    contextData.messages = emailResults;
                                    contextData.newMessages = emailResults.filter((msg: any) => !processedEmailIds.includes(msg.id));
                                    addLog({ message: `Fetched ${emailResults.length} emails, ${contextData.newMessages.length} new.`, type: 'success', employeeId: employee.id });
                                    break;

                                case 'fetch_calendar':
                                    if (!accessToken) {
                                        addLog({ message: `Skipped ${step.label}: No Google account connected.`, type: 'warning', employeeId: employee.id });
                                        break;
                                    }
                                    const calResults = await GoogleService.getCalendarEvents(accessToken, step.data?.maxResults || 10);
                                    contextData.calendarEvents = calResults.items || [];
                                    addLog({ message: `Fetched ${contextData.calendarEvents.length} calendar events.`, type: 'success', employeeId: employee.id });
                                    break;

                                case 'fetch_tasks':
                                    const { useCRMStore } = await import('@/store/crmStore');
                                    contextData.tasks = useCRMStore.getState().tasks.filter(t => t.status !== 'completed');
                                    addLog({ message: `Fetched ${contextData.tasks.length} pending tasks.`, type: 'success', employeeId: employee.id });
                                    break;

                                case 'analyze_emails':
                                    if (contextData.newMessages.length === 0) continue;

                                    // Mark as processed
                                    const newlyFetchedIds = contextData.newMessages.map((msg: any) => msg.id);
                                    set((state) => ({
                                        processedEmailIds: [...state.processedEmailIds, ...newlyFetchedIds].slice(-500)
                                    }));

                                    if (gemini) {
                                        for (const msg of contextData.newMessages) {
                                            const subject = msg.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || '';
                                            const from = msg.payload?.headers?.find((h: any) => h.name === 'From')?.value || '';
                                            const snippet = msg.snippet || '';
                                            const analysis = await gemini.analyzeEmail({ subject, from, snippet }, employee.workflow.map(s => ({ label: s.label, type: s.type, data: s.data })));
                                            if (analysis.isImportant) {
                                                contextData.urgentItems.push({ type: 'email', title: subject, detail: analysis.reason, priority: analysis.urgencyLevel });
                                            }
                                        }
                                    }
                                    break;

                                case 'analyze_calendar':
                                    if (contextData.calendarEvents.length === 0) continue;
                                    if (gemini) {
                                        const analysis = await gemini.analyzeCalendar(contextData.calendarEvents);

                                        contextData.summary = analysis.summary;

                                        if (analysis.hasConflicts) {
                                            analysis.conflicts.forEach(conflict => {
                                                contextData.urgentItems.push({
                                                    type: 'calendar',
                                                    title: "Schedule Conflict",
                                                    detail: conflict,
                                                    priority: 'high'
                                                });
                                            });
                                        }

                                        analysis.importantEvents.forEach(evt => {
                                            contextData.urgentItems.push({
                                                type: 'calendar',
                                                title: "Priority Meeting",
                                                detail: evt,
                                                priority: 'medium'
                                            });
                                        });

                                        addLog({
                                            message: `Calendar analysis complete: ${analysis.summary}`,
                                            type: 'success',
                                            employeeId: employee.id
                                        });
                                    }
                                    break;

                                case 'analyze_tasks':
                                    if (contextData.tasks.length === 0) continue;
                                    if (gemini) {
                                        const analysis = await gemini.analyzeTasks(contextData.tasks);

                                        contextData.summary = analysis.summary;

                                        analysis.topPriorities.forEach(prio => {
                                            contextData.urgentItems.push({
                                                type: 'task',
                                                title: "Task Priority",
                                                detail: prio,
                                                priority: 'high'
                                            });
                                        });

                                        analysis.overdueAlerts.forEach(alert => {
                                            contextData.urgentItems.push({
                                                type: 'task',
                                                title: "Overdue Task",
                                                detail: alert,
                                                priority: 'critical'
                                            });
                                        });

                                        if (analysis.smartFollowUps) {
                                            analysis.smartFollowUps.forEach(follow => {
                                                contextData.urgentItems.push({
                                                    type: 'follow_up',
                                                    title: `Smart Follow-up: ${follow.leadName}`,
                                                    detail: `Best Time: ${follow.bestTime}. Reason: ${follow.reason}`,
                                                    priority: 'medium'
                                                });
                                            });
                                        }

                                        addLog({
                                            message: `Tasks prioritized. Tip: ${analysis.efficiencyTip}`,
                                            type: 'success',
                                            employeeId: employee.id
                                        });
                                    }
                                    break;

                                case 'fetch_crm_data':
                                    const { useCRMStore: store } = await import('@/store/crmStore');
                                    const crmState = store.getState();
                                    contextData.crmData = {
                                        leads: crmState.leads,
                                        deals: crmState.deals
                                    };
                                    addLog({
                                        message: `CRM Data synced: ${contextData.crmData.leads.length} leads, ${contextData.crmData.deals.length} deals.`,
                                        type: 'success',
                                        employeeId: employee.id
                                    });
                                    break;

                                case 'analyze_support':
                                    if (contextData.newMessages.length === 0) continue;
                                    if (gemini) {
                                        for (const msg of contextData.newMessages) {
                                            const snippet = msg.snippet || '';
                                            const analysis = await gemini.analyzeSupport(snippet);

                                            if (analysis.sentiment === 'frustrated' || analysis.sentiment === 'negative' || analysis.isUrgent) {
                                                contextData.urgentItems.push({
                                                    type: 'email',
                                                    title: `Support Ticket: ${analysis.sentiment.toUpperCase()}`,
                                                    detail: `Issue: ${analysis.mainIssue}\nDraft: ${analysis.draftResponse.substring(0, 50)}...`,
                                                    priority: analysis.isUrgent ? 'high' : 'medium'
                                                });
                                            }
                                        }
                                    }
                                    break;

                                case 'generate_insights':
                                    if (!contextData.crmData.deals.length) continue;
                                    if (gemini) {
                                        const insights = await gemini.generateBusinessInsights(contextData.crmData);
                                        // Always add the strategic summary as an insight
                                        contextData.urgentItems.push({
                                            type: 'research',
                                            title: "Strategic Overview",
                                            detail: insights.strategicAdvice,
                                            priority: 'low'
                                        });

                                        insights.opportunities.forEach((opp: string) => {
                                            contextData.urgentItems.push({
                                                type: 'research',
                                                title: "Business Opportunity",
                                                detail: opp,
                                                priority: 'medium'
                                            });
                                        });

                                        insights.risks.forEach((risk: string) => {
                                            contextData.urgentItems.push({
                                                type: 'research',
                                                title: "Pipeline Risk",
                                                detail: risk,
                                                priority: 'high'
                                            });
                                        });

                                        addLog({
                                            message: `Business Audit Complete. Strategy: ${insights.strategicAdvice}`,
                                            type: 'success',
                                            employeeId: employee.id
                                        });

                                        if (insights.leadScores) {
                                            insights.leadScores.forEach(score => {
                                                contextData.urgentItems.push({
                                                    type: 'lead_score',
                                                    title: `Lead Score: ${score.score}`,
                                                    detail: score.reason,
                                                    priority: score.score > 80 ? 'high' : 'medium'
                                                });
                                            });
                                        }

                                        if (insights.dealPredictions) {
                                            insights.dealPredictions.forEach(pred => {
                                                contextData.urgentItems.push({
                                                    type: 'deal_prediction',
                                                    title: `Deal Propensity: ${pred.probability}%`,
                                                    detail: `Risk Factors: ${pred.riskFactors.join(', ')}`,
                                                    priority: pred.probability < 40 ? 'high' : 'medium'
                                                });
                                            });
                                        }

                                        if (insights.revenueForecast) {
                                            contextData.urgentItems.push({
                                                type: 'revenue_forecast',
                                                title: `Revenue Outlook: ${insights.revenueForecast.outlook}`,
                                                detail: `Predicted Amount: $${insights.revenueForecast.predictedAmount.toLocaleString()} (Confidence: ${insights.revenueForecast.confidence}%)`,
                                                priority: 'medium'
                                            });
                                        }
                                    }
                                    break;

                                case 'notify_user':
                                    if (contextData.urgentItems.length === 0) continue;

                                    const { useCRMStore: crmStore } = await import('@/store/crmStore');
                                    const addInsight = crmStore.getState().addInsight;

                                    contextData.urgentItems.forEach((item: any) => {
                                        addNotification({
                                            title: `🎯 ${employee.name}: ${item.title}`,
                                            message: `${item.detail}\nPriority: ${item.priority}`,
                                            type: item.priority === 'high' ? 'error' : 'warning'
                                        });

                                        // Persist insight into CRM store for the AI Insights page
                                        addInsight({
                                            title: item.title,
                                            description: item.detail,
                                            type: item.type === 'email' ? 'sentiment_analysis' :
                                                item.type === 'calendar' ? 'deal_risk' :
                                                    item.type === 'task' ? 'follow_up_suggestion' :
                                                        item.type === 'follow_up' ? 'follow_up_suggestion' :
                                                            item.type === 'lead_score' ? 'lead_score' :
                                                                item.type === 'deal_prediction' ? 'deal_prediction' :
                                                                    item.type === 'revenue_forecast' ? 'revenue_forecast' :
                                                                        'trend_prediction',
                                            confidence: 90,
                                            recommendedAction: "Review and take action",
                                        });
                                    });
                                    break;
                            }
                        }

                        addLog({ message: `✓ ${employee.name} cycle completed.`, type: 'success', employeeId: employee.id });

                        // Performance Boost: Increment tasks completed count
                        get().updateEmployee(employee.id, {
                            tasksCompleted: (employee.tasksCompleted || 0) + 1,
                            efficiency: Math.min(100, (employee.efficiency || 90) + 0.1)
                        });
                    }

                    set({ lastScanTime: new Date().toISOString() });
                } catch (error: any) {
                    console.error("Autonomous agents failed:", error);
                    const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');

                    if (isQuotaError) {
                        const cooldownMinutes = 1; // 1 minute cooldown for background tasks
                        set({
                            isRateLimited: true,
                            rateLimitExpiry: Date.now() + (cooldownMinutes * 60 * 1000)
                        });
                        addLog({
                            message: `AI Overloaded (429). Background scans paused for ${cooldownMinutes} min.`,
                            type: 'error'
                        });
                    } else if (error.message?.includes('TOKEN_EXPIRED') || error.message?.includes('401')) {
                        addLog({
                            message: "Google connection expired. Please reconnect in Settings.",
                            type: 'error'
                        });
                    } else {
                        addLog({ message: `System error: ${error.message}`, type: 'error' });
                    }
                } finally {
                    set({ isScanning: false });
                }
            },

            sendMessage: async (employeeId: string, content: string) => {
                const { employees, updateEmployee, addLog } = get();
                const employee = employees.find(e => e.id === employeeId);
                if (!employee) return;

                const userMessage = { role: 'user' as const, content, timestamp: new Date().toISOString() };
                const updatedMessages = [...(employee.messages || []), userMessage];

                updateEmployee(employeeId, { messages: updatedMessages });

                try {
                    const { useAuthStore } = await import('@/store/authStore');
                    const { user } = useAuthStore.getState();
                    const userApiKey = user?.apiKey;

                    if (!userApiKey) {
                        const botMessage = {
                            role: 'assistant' as const,
                            content: "I'd love to help, but my brain (Gemini API) isn't connected yet. Please add your API key in Settings!",
                            timestamp: new Date().toISOString()
                        };
                        updateEmployee(employeeId, { messages: [...updatedMessages, botMessage] });
                        return;
                    }

                    const gemini = new GeminiService(userApiKey, user?.model);

                    // Simple system prompt based on employee type
                    let systemPrompt = `You are ${employee.name}, a ${employee.role}. ${employee.description}`;
                    if (employee.type === 'calendar_manager') {
                        systemPrompt += " You have access to the user's Google Calendar. You can help schedule, check for conflicts, and organize events.";
                    } else if (employee.type === 'task_manager') {
                        systemPrompt += " You help manage CRM tasks, prioritize them, and provide summaries.";
                    }

                    const response = await gemini.chat(updatedMessages.map(m => ({ role: m.role, content: m.content })), systemPrompt);

                    const botMessage = { role: 'assistant' as const, content: response, timestamp: new Date().toISOString() };
                    updateEmployee(employeeId, { messages: [...updatedMessages, botMessage].slice(-20) }); // Keep last 20 messages

                    addLog({
                        message: `Chat response from ${employee.name}`,
                        type: 'info',
                        employeeId
                    });

                } catch (error: any) {
                    console.error("Chat failed:", error);
                    const botMessage = {
                        role: 'assistant' as const,
                        content: `Sorry, I encountered an error: ${error.message}`,
                        timestamp: new Date().toISOString()
                    };
                    updateEmployee(employeeId, { messages: [...updatedMessages, botMessage] });
                }
            }
        }),
        {
            name: 'ai-employee-storage',
        }
    )
);
