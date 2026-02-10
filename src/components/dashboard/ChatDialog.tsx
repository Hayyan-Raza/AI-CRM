import { useState, useRef, useEffect } from 'react';
import { useAIEmployeeStore, type AIEmployee } from '@/store/aiEmployeeStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatDialogProps {
    employee: AIEmployee;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ employee, open, onOpenChange }: ChatDialogProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { sendMessage } = useAIEmployeeStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [employee.messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const message = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            await sendMessage(employee.id, message);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#141414] border-[#1f1f1f] text-white sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-[#1f1f1f] flex-row items-center gap-3 space-y-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1f1f1f]">
                        <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <DialogTitle className="text-white text-base">{employee.name}</DialogTitle>
                        <p className="text-xs text-green-500 font-medium">Assistant Online</p>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {employee.messages?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-[#868686]">No messages yet. Say hi to {employee.name.split(' ')[0]}!</p>
                        </div>
                    ) : (
                        employee.messages?.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                    msg.role === 'user' ? "bg-[#2d62ff]/20 border-[#2d62ff]/30 text-[#2d62ff]" : "bg-[#1f1f1f] border-[#333] text-white"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-[#2d62ff] text-white rounded-tr-none"
                                        : "bg-[#1f1f1f] text-white border border-[#333] rounded-tl-none shadow-sm"
                                )}>
                                    {msg.content}
                                    <div className="text-[10px] opacity-40 mt-1 uppercase">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex gap-3 mr-auto items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1f1f1f] border border-[#333] text-white">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl rounded-tl-none p-3 shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-[#868686]" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[#1f1f1f] bg-[#0a0a0a]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="bg-[#141414] border-[#1f1f1f] text-white focus-visible:ring-[#2d62ff]/50"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="bg-[#2d62ff] hover:bg-[#2d62ff]/90 text-white shrink-0"
                            disabled={!input.trim() || isLoading}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
