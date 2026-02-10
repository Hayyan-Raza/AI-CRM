import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAIEmployeeStore } from '@/store/aiEmployeeStore';
import type { WorkflowNode } from '@/store/aiEmployeeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function AIEmployeeEditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { employees, updateEmployee } = useAIEmployeeStore();

    const [employee, setEmployee] = useState<any>(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [workflow, setWorkflow] = useState<WorkflowNode[]>([]);

    useEffect(() => {
        const foundEmployee = employees.find(e => e.id === id);
        if (foundEmployee) {
            setEmployee(foundEmployee);
            setName(foundEmployee.name);
            setRole(foundEmployee.role);
            setWorkflow(foundEmployee.workflow || [
                { id: '1', type: 'trigger', label: 'Monitor Inbox', position: { x: 0, y: 0 }, data: {} }
            ]);
        }
    }, [id, employees]);

    const handleSave = () => {
        if (employee && id) {
            updateEmployee(id, {
                ...employee,
                name,
                role,
                workflow
            });
            navigate('/dashboard/ai-employees');
        }
    };

    const addWorkflowStep = () => {
        const newStep: WorkflowNode = {
            id: Date.now().toString(),
            type: 'action',
            label: 'New Step',
            position: { x: 0, y: workflow.length },
            data: {}
        };
        setWorkflow([...workflow, newStep]);
    };

    const removeWorkflowStep = (stepId: string) => {
        setWorkflow(workflow.filter(s => s.id !== stepId));
    };

    const updateWorkflowStep = (stepId: string, label: string) => {
        setWorkflow(workflow.map(s =>
            s.id === stepId ? { ...s, label } : s
        ));
    };

    if (!employee) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-white text-xl">Loading employee...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard/ai-employees')}
                            className="text-[#868686] hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Edit AI Employee</h1>
                            <p className="text-[#868686] mt-1">Configure {name || 'employee'}</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings Panel */}
                    <div className="space-y-6">
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardHeader>
                                <CardTitle className="text-white">Basic Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-[#868686]">Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-2"
                                        placeholder="Employee name"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[#868686]">Role</Label>
                                    <Input
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="bg-[#0a0a0a] border-[#1f1f1f] text-white mt-2"
                                        placeholder="Employee role"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardHeader>
                                <CardTitle className="text-white">Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[#868686]">Tasks Completed</span>
                                    <span className="text-white font-semibold">{employee.tasksCompleted}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#868686]">Efficiency</span>
                                    <span className="text-white font-semibold">{employee.efficiency}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#868686]">Status</span>
                                    <span className="text-white font-semibold capitalize">{employee.status}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Workflow Editor */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#141414] border-[#1f1f1f]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">Workflow Steps</CardTitle>
                                    <Button
                                        onClick={addWorkflowStep}
                                        className="bg-[#2d62ff] hover:bg-[#2d62ff]/90 text-white"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Step
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {workflow.map((step, index) => (
                                        <div
                                            key={step.id}
                                            className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-4 flex items-center gap-3 hover:border-[#2d62ff]/50 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#2d62ff]/20 text-[#2d62ff] flex items-center justify-center font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <Input
                                                value={step.label}
                                                onChange={(e) => updateWorkflowStep(step.id, e.target.value)}
                                                className="flex-1 bg-transparent border-none text-white focus-visible:ring-0"
                                                placeholder="Step name"
                                            />
                                            {step.type !== 'trigger' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeWorkflowStep(step.id)}
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    {workflow.length === 0 && (
                                        <div className="text-center py-12 text-[#868686]">
                                            No workflow steps yet. Click "Add Step" to create one.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
