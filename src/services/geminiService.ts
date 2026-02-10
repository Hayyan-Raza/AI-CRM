import { GoogleGenerativeAI } from '@google/generative-ai';

export interface EmailAnalysisResult {
    isImportant: boolean;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
    suggestedAction?: string;
    category?: string;
}

export interface CalendarAnalysisResult {
    hasConflicts: boolean;
    conflicts: string[];
    importantEvents: string[];
    summary: string;
    suggestions: string[];
}

export interface TaskAnalysisResult {
    topPriorities: string[];
    overdueAlerts: string[];
    summary: string;
    efficiencyTip: string;
    smartFollowUps?: { leadName: string; bestTime: string; reason: string }[];
}

export interface SupportAnalysisResult {
    sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
    mainIssue: string;
    draftResponse: string;
    isUrgent: boolean;
}

export interface BusinessInsightResult {
    trends: string[];
    risks: string[];
    opportunities: string[];
    strategicAdvice: string;
    leadScores?: { leadId: string; score: number; reason: string }[];
    dealPredictions?: { dealId: string; probability: number; riskFactors: string[] }[];
    revenueForecast?: { outlook: string; predictedAmount: number; confidence: number };
}

export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private static interpretationCache: Record<string, any> = {};

    constructor(apiKey: string, modelName: string = 'gemini-1.5-flash') {
        if (apiKey) {
            try {
                this.genAI = new GoogleGenerativeAI(apiKey);
                // Normalize model name to ensure standard models are used unless overridden
                const normalizedModel = this.normalizeModelName(modelName);
                this.model = this.genAI.getGenerativeModel({ model: normalizedModel }, { apiVersion: 'v1beta' });
            } catch (error) {
                console.warn('Failed to initialize Gemini model:', error);
            }
        }
    }

    private normalizeModelName(name: string): string {
        // Use the requested model, defaulting to 1.5-flash if none provided
        if (!name) return 'gemini-1.5-flash';
        return name;
    }

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Analyze an email using Gemini AI based on user-defined workflow steps
     * @param email The email object with subject, from, snippet
     * @param workflowSteps User-defined workflow steps to guide analysis
     */
    async analyzeEmail(
        email: { subject: string; from: string; snippet: string },
        workflowSteps: Array<{ label: string; type: string; data?: any }>
    ): Promise<EmailAnalysisResult> {
        if (!this.model) {
            throw new Error('Gemini API not initialized. Please set your API key in Settings.');
        }

        try {
            // Convert workflow steps into instructions for Gemini
            const workflowInstructions = this.buildWorkflowInstructions(workflowSteps);

            const prompt = `You are an AI email assistant. The user has configured you with the following workflow:

${workflowInstructions}

Analyze this email and determine if it requires attention based on the workflow:

FROM: ${email.from}
SUBJECT: ${email.subject}
PREVIEW: ${email.snippet}

Respond in JSON format:
{
    "isImportant": boolean,
    "urgencyLevel": "low" | "medium" | "high" | "critical",
    "reason": "Brief explanation why this email is/isn't important",
    "suggestedAction": "What action to take",
    "category": "Type of email (e.g., sales, support, personal, spam)"
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from Gemini');
            }

            const analysis: EmailAnalysisResult = JSON.parse(jsonMatch[0]);
            return analysis;

        } catch (error: any) {
            const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');

            // Retry once with a small delay if it's a quota error
            if (isQuotaError) {
                console.warn('Gemini quota hit, retrying once in 2 seconds...');
                await this.sleep(2000);
                try {
                    const result = await this.model.generateContent(email.snippet); // Simpler prompt for retry
                    const response = await result.response;
                    const text = response.text();
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const analysis: EmailAnalysisResult = JSON.parse(jsonMatch[0]);
                        return analysis; // Return if retry succeeds
                    }
                } catch (e) { /* ignore */ }
            }

            if (isQuotaError) {
                console.warn('Gemini quota exceeded, using fallback analysis brain.');
            } else {
                console.error('Gemini analysis failed:', error);
            }

            // Fallback to basic keyword matching if Gemini fails
            const subject = email.subject.toLowerCase();
            const snippet = email.snippet.toLowerCase();
            const urgentKeywords = ['urgent', 'important', 'asap', 'critical', 'deadline'];

            const isImportant = urgentKeywords.some(keyword =>
                subject.includes(keyword) || snippet.includes(keyword)
            );

            return {
                isImportant,
                urgencyLevel: isImportant ? 'high' : 'low',
                reason: isImportant
                    ? 'Contains urgent keywords (fallback analysis)'
                    : 'No urgent indicators found (fallback analysis)',
                category: 'unknown'
            };
        }
    }

    /**
     * Specialized analysis for calendar events
     */
    async analyzeCalendar(events: any[]): Promise<CalendarAnalysisResult> {
        if (!this.model) throw new Error('Gemini API not initialized.');

        try {
            const eventsStr = events.map(e => `${e.summary} at ${e.start?.dateTime || e.start?.date}`).join('\n');
            const prompt = `Analyze these calendar events for conflicts, double bookings, or high-priority meetings:
            
            ${eventsStr}
            
            Respond in JSON format:
            {
                "hasConflicts": boolean,
                "conflicts": ["string describing conflict"],
                "importantEvents": ["string describing important event"],
                "summary": "Brief summary of the day",
                "suggestions": ["actions to take"]
            }`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { hasConflicts: false, conflicts: [], importantEvents: [], summary: "Could not analyze events.", suggestions: [] };
        } catch (error) {
            console.error('Calendar analysis failed:', error);
            return { hasConflicts: false, conflicts: [], importantEvents: [], summary: "Analysis failed due to API error.", suggestions: [] };
        }
    }

    /**
     * Specialized analysis for CRM tasks
     */
    async analyzeTasks(tasks: any[]): Promise<TaskAnalysisResult> {
        if (!this.model) throw new Error('Gemini API not initialized.');

        try {
            const tasksStr = tasks.map(t => `[${t.priority}] ${t.title} - Due: ${t.dueDate}`).join('\n');
            const prompt = `Analyze these CRM tasks. Identify top 3 priorities and any critically overdue items:
            
            ${tasksStr}
            
            Respond in JSON format:
            {
                "topPriorities": ["string task name and reason"],
                "overdueAlerts": ["string task name"],
                "summary": "Overall state of task list",
                "efficiencyTip": "One specific tip to get through these faster",
                "smartFollowUps": [{"leadName": "string", "bestTime": "string", "reason": "string"}]
            }`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { topPriorities: [], overdueAlerts: [], summary: "Could not analyze tasks.", efficiencyTip: "" };
        } catch (error) {
            console.error('Task analysis failed:', error);
            return { topPriorities: [], overdueAlerts: [], summary: "Analysis failed due to API error.", efficiencyTip: "" };
        }
    }

    /**
     * Build instructions for Gemini from user's workflow steps
     */
    private buildWorkflowInstructions(steps: Array<{ label: string; type: string; data?: any }>): string {
        let instructions = '';

        steps.forEach((step, index) => {
            instructions += `${index + 1}. ${step.label}\n`;

            // Add context based on step type and data
            if (step.type === 'condition' && step.data?.keywords) {
                instructions += `   - Look for these keywords: ${step.data.keywords.join(', ')}\n`;
            }
            if (step.type === 'notification') {
                instructions += `   - Flag emails that need user notification\n`;
            }
        });

        return instructions || 'Analyze emails and flag important ones requiring attention.';
    }

    /**
     * Specialized analysis for Customer Support
     */
    async analyzeSupport(emailContent: string): Promise<SupportAnalysisResult> {
        if (!this.model) throw new Error('Gemini API not initialized.');

        try {
            const prompt = `Analyze this customer support email for sentiment, main issue, and provide a polite draft response:
            
            ${emailContent}
            
            Respond in JSON format:
            {
                "sentiment": "positive" | "neutral" | "negative" | "frustrated",
                "mainIssue": "string",
                "draftResponse": "string",
                "isUrgent": boolean
            }`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { sentiment: 'neutral', mainIssue: "", draftResponse: "", isUrgent: false };
        } catch (error) {
            console.error('Support analysis failed:', error);
            return { sentiment: 'neutral', mainIssue: "Error", draftResponse: "", isUrgent: false };
        }
    }

    /**
     * Specialized analysis for Business Insights / Research
     */
    async generateBusinessInsights(crmData: { leads: any[], deals: any[] }): Promise<BusinessInsightResult> {
        if (!this.model) throw new Error('Gemini API not initialized.');

        try {
            const dataStr = `Leads: ${crmData.leads.length}, Deals: ${crmData.deals.map(d => `${d.title} (ID: ${d.id}, Stage: ${d.stage}, Value: $${d.value})`).join(', ')}`;
            const prompt = `Analyze this CRM data for business growth:
            
            ${dataStr}
            
            Perform 3 tasks:
            1. Scored Leads: Evaluate engagement and demographic data.
            2. Deal Prediction: Forecast which deals are likely to close.
            3. Revenue Forecast: Predict total revenue based on pipeline conversion.
            4. Strategic Advice: High-level growth strategy.
            
            Respond in JSON:
            {
                "trends": ["string"],
                "risks": ["string"],
                "opportunities": ["string"],
                "strategicAdvice": "string",
                "leadScores": [{"leadId": "string", "score": number, "reason": "string"}],
                "dealPredictions": [{"dealId": "string", "probability": number, "riskFactors": ["string"]}],
                "revenueForecast": {"outlook": "string", "predictedAmount": number, "confidence": number}
            }`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : { trends: [], risks: [], opportunities: [], strategicAdvice: "" };
        } catch (error) {
            console.error('Business insight failed:', error);
            return { trends: [], risks: [], opportunities: [], strategicAdvice: "Continue monitoring." };
        }
    }

    /**
     * Use Gemini to understand what action a workflow step represents
     * Maps natural language to executable actions
     */
    async interpretWorkflowStep(stepLabel: string): Promise<{
        action: 'fetch_emails' | 'analyze_emails' | 'notify_user' | 'fetch_calendar' | 'analyze_calendar' | 'fetch_tasks' | 'analyze_tasks' | 'fetch_crm_data' | 'analyze_support' | 'generate_insights' | 'score_leads' | 'predict_deals' | 'forecast_revenue' | 'unknown';
        confidence: number;
    }> {
        if (GeminiService.interpretationCache[stepLabel]) {
            return GeminiService.interpretationCache[stepLabel];
        }

        // Define fallback logic for reuse
        const getFallback = (label: string) => {
            const l = label.toLowerCase();
            if (l.includes('fetch') || l.includes('get')) {
                if (l.includes('calendar')) return { action: 'fetch_calendar' as const, confidence: 0.7 };
                if (l.includes('task')) return { action: 'fetch_tasks' as const, confidence: 0.7 };
                if (l.includes('crm') || l.includes('lead') || l.includes('deal')) return { action: 'fetch_crm_data' as const, confidence: 0.7 };
                return { action: 'fetch_emails' as const, confidence: 0.7 };
            }
            if (l.includes('analyze') || l.includes('check') || l.includes('review') || l.includes('prioritize')) {
                if (l.includes('calendar')) return { action: 'analyze_calendar' as const, confidence: 0.7 };
                if (l.includes('task')) return { action: 'analyze_tasks' as const, confidence: 0.7 };
                if (l.includes('support') || l.includes('sentiment')) return { action: 'analyze_support' as const, confidence: 0.7 };
                if (l.includes('insight') || l.includes('opportunity') || l.includes('trend')) return { action: 'generate_insights' as const, confidence: 0.7 };
                if (l.includes('score') || l.includes('lead priority')) return { action: 'score_leads' as const, confidence: 0.8 };
                if (l.includes('predict') || l.includes('propensity')) return { action: 'predict_deals' as const, confidence: 0.8 };
                if (l.includes('forecast') || l.includes('revenue')) return { action: 'forecast_revenue' as const, confidence: 0.8 };
                return { action: 'analyze_emails' as const, confidence: 0.7 };
            }
            if (l.includes('notify') || l.includes('alert') || l.includes('tell') || l.includes('inform')) {
                return { action: 'notify_user' as const, confidence: 0.7 };
            }
            return { action: 'unknown' as const, confidence: 0 };
        };

        if (!this.model) {
            return getFallback(stepLabel);
        }

        try {
            const prompt = `You are analyzing a workflow step. Determine the executable action.
            - fetch_emails: Get emails
            - analyze_emails: General email triage
            - notify_user: Alert user
            - fetch_calendar: Get calendar
            - analyze_calendar: Calendar check
            - fetch_tasks: Get CRM tasks
            - analyze_tasks: Task prioritization
            - fetch_crm_data: Get leads/deals from CRM
            - analyze_support: Customer sentiment & support drafts
            - generate_insights: Full business intelligence audit (Lead Scoring, Deal Prediction, Revenue Forecast)
            - score_leads: Prioritize high-value leads
            - predict_deals: Identification of at-risk deals
            - forecast_revenue: Advanced pipeline forecasting
            
            Step: "${stepLabel}"
            
            Respond ONLY JSON: {"action": "string", "confidence": number}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const resultObj = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallback(stepLabel);

            // Cache the successful or fallback result
            GeminiService.interpretationCache[stepLabel] = resultObj;
            return resultObj;

        } catch (error: any) {
            const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');

            if (isQuotaError) {
                console.warn('Gemini quota exceeded, using keyword-based step mapping.');
            } else {
                console.error('Failed to interpret workflow step:', error);
            }

            // Return fallback logic even on error
            return getFallback(stepLabel);
        }
    }

    /**
     * Generate a smart reply suggestion for an email
     */
    async suggestReply(
        email: { subject: string; from: string; body: string },
        context?: string
    ): Promise<string> {
        if (!this.model) {
            throw new Error('Gemini API not initialized.');
        }

        const prompt = `Generate a professional email reply for:

FROM: ${email.from}
SUBJECT: ${email.subject}
MESSAGE: ${email.body}

${context ? `CONTEXT: ${context}` : ''}

Write a concise, professional response.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }

    /**
     * Summarize an email thread
     */
    async summarizeEmail(emailContent: string): Promise<string> {
        if (!this.model) {
            throw new Error('Gemini API not initialized.');
        }

        const prompt = `Summarize this email in 2-3 sentences:

${emailContent}`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }

    /**
     * Chat with the Gemini model
     */
    async chat(
        messages: { role: 'user' | 'assistant'; content: string }[],
        systemPrompt?: string,
        retries: number = 2
    ): Promise<string> {
        if (!this.model) {
            throw new Error('Gemini API not initialized.');
        }

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            }));

            const chat = this.model.startChat({
                history: history.slice(0, -1),
            });

            const lastMessage = history[history.length - 1].parts[0].text;
            const result = await chat.sendMessage(
                systemPrompt ? `[SYSTEM INSTRUCTION: ${systemPrompt}]\n\n${lastMessage}` : lastMessage
            );
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');

            if (isQuotaError && retries > 0) {
                const waitTime = (3 - retries) * 3000;
                console.warn(`Gemini Chat Quota exceeded. Retrying in ${waitTime / 1000}s... (${retries} retries left)`);
                await this.sleep(waitTime);
                return this.chat(messages, systemPrompt, retries - 1);
            }

            if (isQuotaError) {
                return "I'm a bit overwhelmed right now (Day Daily Quota Exceeded). Let's take a break for a few minutes and try again! Your standard models (like 1.5 Flash) have much higher limits than experimental ones.";
            }

            throw error;
        }
    }
}

export default GeminiService;
