import { useState } from 'react';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckSquare, 
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Target,
  Phone,
  Mail,
  Users,
  FileText,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import { formatDate, isOverdue, isToday, getDaysUntil } from '@/lib/utils';
import type { Task, TaskPriority, TaskType } from '@/types';

const taskTypes: { value: TaskType; label: string; icon: any }[] = [
  { value: 'follow_up', label: 'Follow Up', icon: Phone },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'demo', label: 'Demo', icon: Target },
  { value: 'proposal', label: 'Proposal', icon: FileText },
  { value: 'other', label: 'Other', icon: CheckSquare },
];

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'urgent', label: 'Urgent', color: '#dd23bb' },
];

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, completeTask, leads, deals } = useCRMStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    type: 'follow_up' as TaskType,
    priority: 'medium' as TaskPriority,
    dueDate: '',
    relatedType: '' as 'lead' | 'deal' | '',
    relatedId: '',
  });

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');
  const overdueTasks = pendingTasks.filter(t => isOverdue(t.dueDate));
  const todayTasks = pendingTasks.filter(t => isToday(t.dueDate));

  const handleAddTask = () => {
    const relatedTo = taskForm.relatedType && taskForm.relatedId
      ? {
          type: taskForm.relatedType,
          id: taskForm.relatedId,
          name: taskForm.relatedType === 'lead'
            ? leads.find(l => l.id === taskForm.relatedId)?.name || ''
            : deals.find(d => d.id === taskForm.relatedId)?.title || ''
        }
      : undefined;

    addTask({
      title: taskForm.title,
      description: taskForm.description,
      type: taskForm.type,
      priority: taskForm.priority,
      status: 'pending',
      assignedTo: '2',
      relatedTo,
      dueDate: new Date(taskForm.dueDate),
    });

    setTaskForm({
      title: '',
      description: '',
      type: 'follow_up',
      priority: 'medium',
      dueDate: '',
      relatedType: '',
      relatedId: '',
    });
    setIsAddTaskOpen(false);
  };

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        type: taskForm.type,
        priority: taskForm.priority,
        dueDate: new Date(taskForm.dueDate),
      });
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        type: 'follow_up',
        priority: 'medium',
        dueDate: '',
        relatedType: '',
        relatedId: '',
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      type: task.type,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      relatedType: task.relatedTo?.type || '',
      relatedId: task.relatedTo?.id || '',
    });
    setIsAddTaskOpen(true);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const p = priorities.find(p => p.value === priority);
    return (
      <Badge 
        variant="outline" 
        style={{ borderColor: `${p?.color}40`, color: p?.color, backgroundColor: `${p?.color}10` }}
      >
        {p?.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: TaskType) => {
    const t = taskTypes.find(t => t.value === type);
    const Icon = t?.icon || CheckSquare;
    return <Icon className="w-4 h-4" />;
  };

  const getTaskStatus = (task: Task) => {
    if (task.status === 'completed') return { label: 'Completed', color: '#22c55e' };
    if (isOverdue(task.dueDate)) return { label: 'Overdue', color: '#ef4444' };
    if (isToday(task.dueDate)) return { label: 'Due Today', color: '#f59e0b' };
    const days = getDaysUntil(task.dueDate);
    if (days <= 3) return { label: `Due in ${days} days`, color: '#dd23bb' };
    return { label: 'Upcoming', color: '#2d62ff' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Tasks</h1>
          <p className="text-[#868686] mt-1">Manage your follow-ups and stay on top of your work</p>
        </div>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#141414] border-[#1f1f1f] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Task Title</Label>
                <Input 
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  placeholder="Follow up with John"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Description</Label>
                <Textarea 
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  placeholder="Task details..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Type</Label>
                  <Select 
                    value={taskForm.type} 
                    onValueChange={(v) => setTaskForm({...taskForm, type: v as TaskType})}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                      {taskTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className="text-white">
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Priority</Label>
                  <Select 
                    value={taskForm.priority} 
                    onValueChange={(v) => setTaskForm({...taskForm, priority: v as TaskPriority})}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                      {priorities.map(p => (
                        <SelectItem key={p.value} value={p.value} className="text-white">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Due Date</Label>
                <Input 
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
              {!editingTask && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Related To</Label>
                    <Select 
                      value={taskForm.relatedType} 
                      onValueChange={(v) => setTaskForm({...taskForm, relatedType: v as 'lead' | 'deal' | '', relatedId: ''})}
                    >
                      <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                        <SelectItem value="lead" className="text-white">Lead</SelectItem>
                        <SelectItem value="deal" className="text-white">Deal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d2d2d2]">Select</Label>
                    <Select 
                      value={taskForm.relatedId} 
                      onValueChange={(v) => setTaskForm({...taskForm, relatedId: v})}
                      disabled={!taskForm.relatedType}
                    >
                      <SelectTrigger className="bg-[#0a0a0a] border-[#1f1f1f] text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
                        {taskForm.relatedType === 'lead' && leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id} className="text-white">
                            {lead.name}
                          </SelectItem>
                        ))}
                        {taskForm.relatedType === 'deal' && deals.map(deal => (
                          <SelectItem key={deal.id} value={deal.id} className="text-white">
                            {deal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <Button 
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="w-full bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-white">{pendingTasks.length}</p>
            <p className="text-sm text-[#868686]">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#ef4444]">{overdueTasks.length}</p>
            <p className="text-sm text-[#868686]">Overdue</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#f59e0b]">{todayTasks.length}</p>
            <p className="text-sm text-[#868686]">Due Today</p>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-[#1f1f1f]">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#22c55e]">{completedTasks.length}</p>
            <p className="text-sm text-[#868686]">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868686]" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#141414] border-[#1f1f1f] text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-[#141414] border-[#1f1f1f] text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="pending" className="text-white">Pending</SelectItem>
            <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
            <SelectItem value="completed" className="text-white">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40 bg-[#141414] border-[#1f1f1f] text-white">
            <AlertCircle className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-[#1b1b1b] border-[#1f1f1f]">
            <SelectItem value="all" className="text-white">All Priorities</SelectItem>
            {priorities.map(p => (
              <SelectItem key={p.value} value={p.value} className="text-white">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-[#141414] border border-[#1f1f1f]">
          <TabsTrigger value="pending" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-0">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-[#22c55e] mx-auto mb-4" />
                  <p className="text-[#868686]">No pending tasks!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1f1f1f]">
                  {pendingTasks.map((task) => {
                    const status = getTaskStatus(task);
                    return (
                      <div 
                        key={task.id} 
                        className="p-4 flex items-start gap-4 hover:bg-[#1b1b1b] transition-colors group"
                      >
                        <Checkbox 
                          checked={false}
                          onCheckedChange={() => completeTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{task.title}</span>
                            {getPriorityBadge(task.priority)}
                            <Badge 
                              variant="outline" 
                              style={{ borderColor: status.color, color: status.color }}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-[#868686] mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-[#868686]">
                            <span className="flex items-center gap-1">
                              {getTypeIcon(task.type)}
                              {taskTypes.find(t => t.value === task.type)?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {formatDate(task.dueDate)}
                            </span>
                            {task.relatedTo && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {task.relatedTo.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-[#868686] hover:text-white"
                            onClick={() => openEditDialog(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-[#868686] hover:text-red-400"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-0">
              {completedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-[#868686] mx-auto mb-4" />
                  <p className="text-[#868686]">No completed tasks yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1f1f1f]">
                  {completedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 flex items-start gap-4 opacity-60"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#22c55e] mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium line-through">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#868686]">
                          <span>Completed {task.completedAt && formatDate(task.completedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
