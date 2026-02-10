import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { useAIEmployeeStore } from '@/store/aiEmployeeStore';
import { GoogleService } from '@/services/googleService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatDialog } from '@/components/dashboard/ChatDialog';
import {
    Bot,
    Plus,
    Settings,
    Activity,
    MessageSquare,
    MoreVertical,
    Play,
    Pause,
    Terminal,
    Puzzle,
    Calendar,
    Mail,
    Users,
    RefreshCw,
    Workflow,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info,
    Trash2
} from 'lucide-react';

function AIEmployeesContent() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const {
        employees, logs, notifications, scanInbox, isScanning,
        addEmployee, updateEmployee, markNotificationRead, clearNotifications,
        deleteEmployee, isRateLimited, rateLimitExpiry
    } = useAIEmployeeStore();
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
    const [emails, setEmails] = useState<any[]>([]);
    const [chatEmployee, setChatEmployee] = useState<any>(null);
    const initializedRef = useRef(false);

    const handleHireEmployee = () => {
        const newId = crypto.randomUUID();
        const newEmployee = {
            id: newId,
            name: "New AI Agent",
            role: "Assistance",
            status: "paused" as const,
            type: "custom" as const,
            tasksCompleted: 0,
            efficiency: 100,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}&backgroundColor=e2e8f0`,
            description: "A new AI employee ready to be configured.",
            workflow: []
        };
        addEmployee(newEmployee);
        navigate(`/dashboard/agent-editor/${newId}`);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Auth Success:', tokenResponse);
            console.log('Access Token:', tokenResponse.access_token);
            console.log('Token Type:', tokenResponse.token_type);
            console.log('Expires In:', tokenResponse.expires_in);
            console.log('Scope:', tokenResponse.scope);

            if (tokenResponse?.access_token) {
                useAuthStore.getState().updateUser({
                    googleAccessToken: tokenResponse.access_token
                });

                // Test the token immediately
                try {
                    const testResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                        headers: {
                            'Authorization': `Bearer ${tokenResponse.access_token}`
                        }
                    });
                    const userData = await testResponse.json();
                    console.log('Token test successful! User:', userData);
                    alert(`Successfully connected Google account for ${userData.email}!`);
                } catch (err) {
                    console.error('Token test failed:', err);
                    alert('Connected, but token verification failed. Check console.');
                }
            }
        },
        onError: error => {
            console.error('Google Auth Failed', error);
            alert('Failed to connect Google account. Check console for details.');
        },
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email',
        flow: 'implicit', // Use 'auth-code' for refresh tokens in production
    });

    const syncGoogleData = async () => {
        if (!user?.googleAccessToken || isScanning) return;

        // Trigger the store's scanInbox for logging and notifications
        await scanInbox(user.googleAccessToken);

        // Also fetch local state for the preview cards (Calendar/Gmail)
        try {
            const events = await GoogleService.getCalendarEvents(user.googleAccessToken);
            const messages = await GoogleService.getGmailMessages(user.googleAccessToken);
            setCalendarEvents(events.items || []);
            setEmails(messages || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Auto-poll for new emails every 2 minutes when connected
    useEffect(() => {
        if (!user?.googleAccessToken || initializedRef.current) return;

        initializedRef.current = true;

        // Initial sync
        syncGoogleData();

        // Set up polling interval (2 minutes = 120000ms)
        const pollInterval = setInterval(() => {
            syncGoogleData();
        }, 120000); // 2 minutes

        // Cleanup on unmount or when token changes
        return () => {
            clearInterval(pollInterval);
            initializedRef.current = false; // Reset on unmount
        };
    }, [user?.googleAccessToken]);

    const getLogIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    // Auto-scan on mount if connected
    useEffect(() => {
        if (user?.googleAccessToken && !isScanning) {
            syncGoogleData();
        }
    }, [user?.googleAccessToken]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">AI Employees</h1>
                <p className="text-[#868686] mt-1">Manage and monitor your digital workforce</p>
            </div>

            <Tabs defaultValue="employees" className="w-full">
                <TabsList className="bg-[#141414] border border-[#1f1f1f] flex-wrap h-auto gap-2 p-2">
                    <TabsTrigger value="employees" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Employees
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                        <Puzzle className="w-4 h-4 mr-2" />
                        Integrations
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                        <Terminal className="w-4 h-4 mr-2" />
                        Activity Logs
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                        <Activity className="w-4 h-4 mr-2" />
                        Agent Insights
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="mt-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Your Workforce</h2>
                            {user?.googleAccessToken && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-[#868686]">
                                        Sarah is monitoring your inbox (checks every 2 min)
                                    </span>
                                </div>
                            )}
                        </div>
                        <Button
                            className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                            onClick={handleHireEmployee}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Hire New AI Employee
                        </Button>
                    </div>

                    {/* Notification Alert Area */}
                    {notifications.filter(n => !n.read).length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-[#868686] uppercase tracking-wider">
                                    Recent Alerts ({notifications.filter(n => !n.read).length})
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-[#868686] hover:text-white h-7"
                                    onClick={() => clearNotifications()}
                                >
                                    Clear All
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {notifications.filter(n => !n.read).map(n => {
                                    const notificationStyles = {
                                        success: 'border-green-500/50 bg-green-500/5',
                                        warning: 'border-yellow-500/50 bg-yellow-500/5',
                                        error: 'border-red-500/50 bg-red-500/5',
                                        info: 'border-blue-500/50 bg-blue-500/5'
                                    };
                                    const iconStyles = {
                                        success: 'text-green-500',
                                        warning: 'text-yellow-500',
                                        error: 'text-red-500',
                                        info: 'text-blue-500'
                                    };

                                    return (
                                        <div
                                            key={n.id}
                                            className={`bg-[#141414] border p-3 rounded-lg flex items-start gap-3 ${notificationStyles[n.type]}`}
                                        >
                                            <AlertCircle className={`w-5 h-5 mt-0.5 ${iconStyles[n.type]}`} />
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{n.title}</p>
                                                <p className="text-sm text-[#d2d2d2]">{n.message}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-auto text-[#868686] hover:text-white"
                                                onClick={() => markNotificationRead(n.id)}
                                            >
                                                Dismiss
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-[#2d62ff]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{employees.length}</p>
                                        <p className="text-sm text-[#868686]">Total Employees</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-[#22c55e]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            {employees.filter(e => e.status === 'active').length}
                                        </p>
                                        <p className="text-sm text-[#868686]">Active Now</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#dd23bb]/20 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-[#dd23bb]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">
                                            {employees.reduce((acc, curr) => acc + curr.tasksCompleted, 0)}
                                        </p>
                                        <p className="text-sm text-[#868686]">Tasks Completed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-[#f59e0b]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">96%</p>
                                        <p className="text-sm text-[#868686]">Avg Efficiency</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Employees Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((employee) => (
                            <Card key={employee.id} className="bg-[#141414] border-[#1f1f1f] hover:border-[#2d62ff]/30 transition-all duration-300 group">
                                <CardHeader className="relative pb-0">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Are you sure you want to fire ${employee.name}? This cannot be undone.`)) {
                                                    deleteEmployee(employee.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#868686] hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border-2 border-[#1f1f1f] group-hover:border-[#2d62ff]/50 transition-colors">
                                            <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                                        </div>
                                        <CardTitle className="text-white text-lg">{employee.name}</CardTitle>
                                        <CardDescription className="text-[#2d62ff] font-medium mt-1">{employee.role}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-4 space-y-4">
                                    <p className="text-sm text-[#868686] text-center line-clamp-2 min-h-[40px]">
                                        {employee.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#1f1f1f] border-b">
                                        <div className="text-center">
                                            <div className="text-xs text-[#868686] uppercase tracking-wider mb-1">Status</div>
                                            <Badge
                                                variant="outline"
                                                className={`
                                ${employee.status === 'active' ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20' : ''}
                                ${employee.status === 'paused' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20' : ''}
                                `}
                                            >
                                                {employee.status === 'active' ? 'Active' : 'Paused'}
                                            </Badge>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-[#868686] uppercase tracking-wider mb-1">Efficiency</div>
                                            <span className="text-white font-semibold">{employee.efficiency}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-[#868686]">
                                            <span>Tasks Completed</span>
                                            <span className="text-white">{employee.tasksCompleted}</span>
                                        </div>
                                        <div className="w-full bg-[#0a0a0a] rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] h-1.5 rounded-full"
                                                style={{ width: `${(employee.tasksCompleted / 500) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 bg-[#0a0a0a] border-[#1f1f1f] hover:bg-[#1f1f1f] text-white h-9 text-xs"
                                                onClick={() => navigate(`/dashboard/agent-editor/${employee.id}`)}
                                            >
                                                <Workflow className="w-3 h-3 mr-2" />
                                                Workflow
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 bg-[#2d62ff]/10 border-[#2d62ff]/20 hover:bg-[#2d62ff]/20 text-[#2d62ff] h-9 text-xs"
                                                onClick={() => setChatEmployee(employee)}
                                            >
                                                <MessageSquare className="w-3 h-3 mr-2" />
                                                Chat
                                            </Button>
                                        </div>
                                        <Button
                                            className={`w-full h-9 text-xs ${employee.status === 'active' ? 'bg-[#141414] hover:bg-[#1f1f1f] text-red-400 border border-red-500/20' : 'bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] border border-[#22c55e]/30'}`}
                                            onClick={() => updateEmployee(employee.id, { status: employee.status === 'active' ? 'paused' : 'active' })}
                                        >
                                            {employee.status === 'active' ? (
                                                <>
                                                    <Pause className="w-3 h-3 mr-2" />
                                                    Pause Agent
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-3 h-3 mr-2" />
                                                    Activate Agent
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Hire New Card */}
                        <Card
                            className="bg-[#0a0a0a] border-[#1f1f1f] border-dashed hover:border-[#2d62ff]/50 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center p-6 h-full min-h-[400px]"
                            onClick={handleHireEmployee}
                        >
                            <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center mb-4 group-hover:bg-[#2d62ff]/10 transition-colors">
                                <Plus className="w-8 h-8 text-[#868686] group-hover:text-[#2d62ff] transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Hire New Employee</h3>
                            <p className="text-sm text-[#868686] text-center max-w-[200px]">
                                Add a new AI agent to your workforce to automate tasks.
                            </p>
                        </Card>
                    </div>
                </TabsContent>

                {/* Logs Tab */}
                <TabsContent value="logs" className="mt-6">
                    <Card className="bg-[#141414] border-[#1f1f1f]">
                        <CardHeader>
                            <CardTitle className="text-white">System Logs</CardTitle>
                            <CardDescription className="text-[#868686]">Real-time activity log of your AI employees.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4">
                                {logs.length === 0 ? (
                                    <div className="text-center text-[#868686] py-10">No recent activity.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {logs.map((log) => (
                                            <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-[#1f1f1f] last:border-0 last:pb-0">
                                                <div className="mt-1">
                                                    {getLogIcon(log.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-white">{log.message}</p>
                                                        <span className="text-xs text-[#868686]">
                                                            {new Date(log.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    {log.employeeId && (
                                                        <p className="text-xs text-[#868686] mt-1">
                                                            Agent: {employees.find(e => e.id === log.employeeId)?.name || 'Unknown'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations" className="mt-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-semibold text-white">Connected Services</h2>
                            {isRateLimited && rateLimitExpiry && (
                                <div className="flex items-center gap-2 text-amber-500 animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    <span className="text-[10px]">AI Brain Cooling Down ({Math.ceil((rateLimitExpiry - Date.now()) / 1000)}s)</span>
                                </div>
                            )}
                        </div>
                        {user?.googleAccessToken && (
                            <Button
                                onClick={syncGoogleData}
                                disabled={isScanning}
                                variant="outline"
                                className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b]"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                                {isScanning ? 'Scanning...' : 'Sync Data'}
                            </Button>
                        )}
                    </div>
                    {/* ... (Keep existing Integrations Content) ... */}
                    {/* I need to make sure I don't delete the rest of the file content from the previous edit */}
                    <Card className="bg-[#141414] border-[#1f1f1f]">
                        <CardHeader>
                            <CardTitle className="text-white">Integrations</CardTitle>
                            <CardDescription className="text-[#868686]">Connect your favorite tools to supercharge your AI Employees.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Google Calendar */}
                                <div className="flex flex-col gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-[#2d62ff]" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">Google Calendar</h3>
                                                <p className="text-xs text-[#868686]">Sync your schedule</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {user?.googleAccessToken ? (
                                                <>
                                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                        Connected
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => googleLogin()}
                                                        className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white"
                                                    >
                                                        Reconnect
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => googleLogin()}
                                                    className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white"
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Calendar Events Preview */}
                                    {calendarEvents.length > 0 && (
                                        <div className="mt-2 space-y-2 border-t border-[#1f1f1f] pt-4">
                                            <p className="text-xs font-semibold text-[#868686] uppercase tracking-wider">Upcoming Events</p>
                                            <div className="space-y-2">
                                                {calendarEvents.slice(0, 3).map((event: any) => (
                                                    <div key={event.id} className="text-sm">
                                                        <div className="text-white truncate">{event.summary || 'No Title'}</div>
                                                        <div className="text-[#868686] text-xs">
                                                            {event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : 'All Day'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Gmail */}
                                <div className="flex flex-col gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#dd23bb]/20 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-[#dd23bb]" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">Gmail</h3>
                                                <p className="text-xs text-[#868686]">Sync your emails</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {user?.googleAccessToken ? (
                                                <>
                                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                        Connected
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => googleLogin()}
                                                        className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white"
                                                    >
                                                        Reconnect
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => googleLogin()}
                                                    className="border-[#1f1f1f] text-[#d2d2d2] hover:bg-[#1b1b1b] hover:text-white"
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gmail Messages Preview */}
                                    {emails.length > 0 && (
                                        <div className="mt-2 space-y-2 border-t border-[#1f1f1f] pt-4">
                                            <p className="text-xs font-semibold text-[#868686] uppercase tracking-wider">Recent Emails</p>
                                            <div className="space-y-2">
                                                {emails.slice(0, 3).map((msg: any) => (
                                                    <div key={msg.id} className="text-sm">
                                                        <div className="text-white truncate">
                                                            {msg.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || '(No Subject)'}
                                                        </div>
                                                        <div className="text-[#868686] text-xs truncate">
                                                            From: {msg.payload?.headers?.find((h: any) => h.name === 'From')?.value || 'Unknown'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Insights Tab */}
                <TabsContent value="insights" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Map through notifications or urgent items if we had a dedicated store, 
                            for now we use notifications as they represent the findings */}
                        {notifications.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#1f1f1f] flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-8 h-8 text-[#868686]" />
                                </div>
                                <h3 className="text-white font-medium">No Insights Yet</h3>
                                <p className="text-[#868686] text-sm mt-1">Agents are still scanning your data.</p>
                            </div>
                        ) : (
                            notifications.map((note) => (
                                <Card key={note.id} className="bg-[#141414] border-[#1f1f1f] overflow-hidden group">
                                    <div className={`h-1 w-full ${note.type === 'error' ? 'bg-red-500' :
                                            note.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-[10px] uppercase border-[#1f1f1f] text-[#868686]">
                                                {note.type === 'error' ? 'Critical' : 'Insight'}
                                            </Badge>
                                            <span className="text-[10px] text-[#868686]">
                                                {new Date(note.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base text-white mt-2 leading-tight">
                                            {note.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-[#d2d2d2] line-clamp-3">
                                            {note.message}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                                            <Button variant="ghost" size="sm" className="h-8 text-[#2d62ff] hover:text-[#2d62ff] hover:bg-[#2d62ff]/10 p-0">
                                                Take Action
                                            </Button>
                                            {!note.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markNotificationRead(note.id)}
                                                    className="h-8 text-xs text-[#868686] hover:text-white"
                                                >
                                                    Dismiss
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {chatEmployee && (
                <ChatDialog
                    employee={chatEmployee}
                    open={!!chatEmployee}
                    onOpenChange={(open) => !open && setChatEmployee(null)}
                />
            )}
        </div>
    );
}

export default function AIEmployeesPage() {
    return (
        <GoogleOAuthProvider clientId="623238923107-okm9pe182dg60r0ei5e23flul5sc9tis.apps.googleusercontent.com">
            <AIEmployeesContent />
        </GoogleOAuthProvider>
    );
}
