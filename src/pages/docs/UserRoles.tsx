import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserCheck, User, CheckCircle2, XCircle } from 'lucide-react';

const roles = [
  {
    name: 'Admin',
    description: 'Full system access and control',
    icon: Shield,
    color: '#2d62ff',
    permissions: [
      'Manage company settings',
      'Add/remove team members',
      'Assign roles and permissions',
      'Access all leads and deals',
      'View all reports and analytics',
      'Configure integrations',
      'Manage billing and subscription',
      'Export all data',
    ],
  },
  {
    name: 'Sales Manager',
    description: 'Team oversight and management',
    icon: UserCheck,
    color: '#dd23bb',
    permissions: [
      'View team performance',
      'Access team leads and deals',
      'Assign leads to reps',
      'Create and edit all deals',
      'Generate team reports',
      'Manage team tasks',
      'View pipeline analytics',
      'Cannot manage billing',
    ],
  },
  {
    name: 'Sales Rep',
    description: 'Individual contributor access',
    icon: User,
    color: '#22c55e',
    permissions: [
      'View assigned leads only',
      'Manage own deals',
      'Create tasks and follow-ups',
      'Log calls and emails',
      'View personal dashboard',
      'Update lead status',
      'Cannot view others data',
      'Cannot access settings',
    ],
  },
];

const permissionMatrix = [
  { feature: 'Leads', admin: true, manager: true, rep: 'Own only' },
  { feature: 'Deals', admin: true, manager: true, rep: 'Own only' },
  { feature: 'Pipeline', admin: true, manager: true, rep: 'View only' },
  { feature: 'Tasks', admin: true, manager: true, rep: true },
  { feature: 'Reports', admin: true, manager: 'Team only', rep: 'Personal only' },
  { feature: 'AI Insights', admin: true, manager: true, rep: 'Limited' },
  { feature: 'Team Management', admin: true, manager: 'View only', rep: false },
  { feature: 'Settings', admin: true, manager: false, rep: false },
  { feature: 'Billing', admin: true, manager: false, rep: false },
];

export default function UserRoles() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Users className="w-3 h-3 mr-1" />
          User Roles & Permissions
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">User Roles & Permissions</h1>
        <p className="text-[#d2d2d2] text-lg">
          NexusCRM uses a role-based access control system with three distinct user roles. 
          Each role has specific permissions designed for different responsibilities.
        </p>
      </div>

      {/* Role Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">User Roles</h2>
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.name} className="bg-[#141414] border-[#1f1f1f]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: role.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                      <p className="text-sm text-[#868686] mb-4">{role.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {role.permissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                            <span className="text-sm text-[#d2d2d2]">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Permission Matrix */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="text-left p-3 text-sm font-medium text-[#868686]">Feature</th>
                  <th className="text-center p-3 text-sm font-medium text-[#2d62ff]">Admin</th>
                  <th className="text-center p-3 text-sm font-medium text-[#dd23bb]">Sales Manager</th>
                  <th className="text-center p-3 text-sm font-medium text-[#22c55e]">Sales Rep</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row) => (
                  <tr key={row.feature} className="border-b border-[#1f1f1f]">
                    <td className="p-3 text-white">{row.feature}</td>
                    <td className="p-3 text-center">
                      {row.admin === true ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e] mx-auto" />
                      ) : row.admin === false ? (
                        <XCircle className="w-5 h-5 text-[#ef4444] mx-auto" />
                      ) : (
                        <span className="text-sm text-[#d2d2d2]">{row.admin}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.manager === true ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e] mx-auto" />
                      ) : row.manager === false ? (
                        <XCircle className="w-5 h-5 text-[#ef4444] mx-auto" />
                      ) : (
                        <span className="text-sm text-[#d2d2d2]">{row.manager}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.rep === true ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22c55e] mx-auto" />
                      ) : row.rep === false ? (
                        <XCircle className="w-5 h-5 text-[#ef4444] mx-auto" />
                      ) : (
                        <span className="text-sm text-[#d2d2d2]">{row.rep}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Isolation */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white">Multi-Tenant Data Isolation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#d2d2d2]">
            NexusCRM is built on a multi-tenant architecture where each company's data is completely isolated. 
            This ensures:
          </p>
          <ul className="space-y-2 text-[#d2d2d2]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Complete data separation between companies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Role-based access within your organization</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Audit trails for all data access</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Configurable data sharing policies</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
