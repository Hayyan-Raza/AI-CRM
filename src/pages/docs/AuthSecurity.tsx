import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Key, Mail, Smartphone, Fingerprint } from 'lucide-react';

export default function AuthSecurity() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Shield className="w-3 h-3 mr-1" />
          Authentication & Security
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Authentication & Security</h1>
        <p className="text-[#d2d2d2] text-lg">
          NexusCRM provides enterprise-grade security to protect your customer data. 
          Learn about our authentication methods and security features.
        </p>
      </div>

      {/* Authentication Methods */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Authentication Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#2d62ff]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Email & Password</h3>
                  <p className="text-sm text-[#868686]">Standard authentication</p>
                </div>
              </div>
              <p className="text-sm text-[#d2d2d2]">
                Secure email and password authentication with bcrypt password hashing, 
                account lockout protection, and password strength requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#dd23bb]/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#dd23bb]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Social Login</h3>
                  <p className="text-sm text-[#868686]">OAuth 2.0 providers</p>
                </div>
              </div>
              <p className="text-sm text-[#d2d2d2]">
                Sign in with Google, Microsoft, or GitHub. Secure OAuth 2.0 integration 
                with verified email requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Two-Factor Auth</h3>
                  <p className="text-sm text-[#868686]">2FA/MFA support</p>
                </div>
              </div>
              <p className="text-sm text-[#d2d2d2]">
                Enable TOTP-based two-factor authentication using authenticator apps 
                like Google Authenticator or Authy for enhanced security.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">SSO / SAML</h3>
                  <p className="text-sm text-[#868686]">Enterprise plans</p>
                </div>
              </div>
              <p className="text-sm text-[#d2d2d2]">
                Single Sign-On integration with SAML 2.0 for enterprise customers. 
                Compatible with Okta, Azure AD, and OneLogin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Features */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#2d62ff]" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-2">Data Encryption</h3>
            <p className="text-sm text-[#d2d2d2]">
              All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. 
              Database connections are encrypted and credentials are stored using industry-standard hashing.
            </p>
          </div>
          <Separator className="bg-[#1f1f1f]" />
          <div>
            <h3 className="text-white font-medium mb-2">Session Management</h3>
            <p className="text-sm text-[#d2d2d2]">
              Secure session handling with HTTP-only cookies, CSRF protection, and automatic 
              session timeout after 30 minutes of inactivity. Users can view and revoke active sessions.
            </p>
          </div>
          <Separator className="bg-[#1f1f1f]" />
          <div>
            <h3 className="text-white font-medium mb-2">Access Control</h3>
            <p className="text-sm text-[#d2d2d2]">
              Role-based access control (RBAC) with three user roles: Admin, Sales Manager, and Sales Rep. 
              Each role has specific permissions and data access levels.
            </p>
          </div>
          <Separator className="bg-[#1f1f1f]" />
          <div>
            <h3 className="text-white font-medium mb-2">Audit Logging</h3>
            <p className="text-sm text-[#d2d2d2]">
              Comprehensive audit logs track all user actions including logins, data modifications, 
              and exports. Logs are retained for 90 days on all plans.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="bg-gradient-to-br from-[#22c55e]/10 to-[#2d62ff]/10 border-[#22c55e]/30">
        <CardHeader>
          <CardTitle className="text-white">Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-[#d2d2d2]">
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e]">✓</span>
              Enable two-factor authentication for all users
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e]">✓</span>
              Use strong, unique passwords (minimum 12 characters)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e]">✓</span>
              Regularly review user access and remove inactive accounts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e]">✓</span>
              Monitor audit logs for suspicious activity
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e]">✓</span>
              Keep your API keys secure and rotate them periodically
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
