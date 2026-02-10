import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Server, FileCheck, Globe, CheckCircle2 } from 'lucide-react';

const certifications = [
  {
    name: 'SOC 2 Type II',
    description: 'Independent audit of security controls and processes.',
    status: 'Certified',
  },
  {
    name: 'GDPR',
    description: 'Full compliance with EU data protection regulations.',
    status: 'Compliant',
  },
  {
    name: 'CCPA',
    description: 'California Consumer Privacy Act compliance.',
    status: 'Compliant',
  },
  {
    name: 'ISO 27001',
    description: 'Information security management certification.',
    status: 'In Progress',
  },
];

const securityMeasures = [
  {
    title: 'Data Encryption',
    icon: Lock,
    items: [
      'AES-256 encryption at rest',
      'TLS 1.3 for data in transit',
      'Encrypted database connections',
      'Secure key management',
    ],
  },
  {
    title: 'Infrastructure',
    icon: Server,
    items: [
      'Cloud-hosted with 99.9% uptime SLA',
      'Multi-region redundancy',
      'DDoS protection',
      'Regular security patching',
    ],
  },
  {
    title: 'Access Control',
    icon: Shield,
    items: [
      'Role-based access control (RBAC)',
      'Two-factor authentication (2FA)',
      'Single Sign-On (SSO) support',
      'Session management',
    ],
  },
  {
    title: 'Compliance',
    icon: FileCheck,
    items: [
      'Regular security audits',
      'Penetration testing',
      'Vulnerability scanning',
      'Incident response plan',
    ],
  },
];

export default function SecurityCompliance() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Shield className="w-3 h-3 mr-1" />
          Security, Privacy & Compliance
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Security, Privacy & Compliance</h1>
        <p className="text-[#d2d2d2] text-lg">
          At NexusCRM, security is our top priority. We employ industry-leading security 
          measures to protect your data and maintain compliance with global regulations.
        </p>
      </div>

      {/* Certifications */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#22c55e]" />
            Certifications & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a]">
                <div>
                  <h4 className="text-white font-medium">{cert.name}</h4>
                  <p className="text-sm text-[#868686]">{cert.description}</p>
                </div>
                <Badge 
                  className={cert.status === 'Certified' || cert.status === 'Compliant' 
                    ? 'bg-[#22c55e]/20 text-[#22c55e]' 
                    : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                  }
                >
                  {cert.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityMeasures.map((measure) => {
          const Icon = measure.icon;
          return (
            <Card key={measure.title} className="bg-[#141414] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#2d62ff]" />
                  {measure.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {measure.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#d2d2d2]">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Privacy */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2d62ff]" />
            Data Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#d2d2d2]">
            We are committed to protecting your privacy and handling your data responsibly:
          </p>
          <ul className="space-y-2 text-[#d2d2d2]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Your data is never sold to third parties</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Right to data export and deletion</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Transparent data processing practices</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <span>Data retention policies aligned with regulations</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Contact Security Team */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Security Questions?</h3>
              <p className="text-[#868686]">Contact our security team for more information.</p>
            </div>
            <a href="mailto:security@nexuscrm.com">
              <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] cursor-pointer hover:bg-[#2d62ff]/10">
                security@nexuscrm.com
              </Badge>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
