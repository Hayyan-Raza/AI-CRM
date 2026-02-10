import { useAIEmployeeStore } from '@/store/aiEmployeeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Terminal,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';

export function ActivityLogs() {
    const { logs } = useAIEmployeeStore();

    return (
        <Card className="bg-[#0f0f0f] border-[#1f1f1f]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-[#6366f1]" />
                        <div>
                            <CardTitle className="text-white">Activity Logs</CardTitle>
                            <CardDescription>Real-time workflow execution logs</CardDescription>
                        </div>
                    </div>
                    <Badge className="bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20">
                        {logs.length} events
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Info className="w-12 h-12 text-[#868686] mb-3" />
                            <p className="text-[#868686] text-sm">No activity yet</p>
                            <p className="text-[#484848] text-xs mt-1">Logs will appear when Sarah scans your inbox</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {logs.slice().reverse().map((log, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#2f2f2f] transition-colors"
                                >
                                    {log.type === 'success' && (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    {log.type === 'error' && (
                                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    {log.type === 'warning' && (
                                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    {log.type === 'info' && (
                                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-mono break-words">{log.message}</p>
                                        <p className="text-xs text-[#868686] mt-1">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
