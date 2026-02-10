import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Bell,
  Shield,
  Users2,
  CreditCard,
  Mail,
  Smartphone,
  Key,
  Upload,
  Save,
  Puzzle,
  Calendar
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

function SettingsContent() {
  const { user, company } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams(); // Get search params
  const defaultTab = searchParams.get('tab') || 'profile'; // Default to profile if no tab param
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync activeTab with URL param
  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  // Update URL param when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    deals: true,
    tasks: true,
    mentions: true,
  });
  const [_darkMode] = useState(true);

  // API Key Testing State
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [models, setModels] = useState<any[]>([]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google Auth Success:', tokenResponse);
      console.log('Access Token:', tokenResponse.access_token);
      console.log('Token Type:', tokenResponse.token_type);
      console.log('Expires In:', tokenResponse.expires_in);
      console.log('Scope:', tokenResponse.scope);

      if (tokenResponse?.access_token) {
        useAuthStore.getState().updateUser({ googleAccessToken: tokenResponse.access_token });

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
    flow: 'implicit',
  });

  const testApiKey = async (key: string) => {
    if (!key) return;
    setIsValidating(true);
    setApiKeyError(null);
    setIsValid(false);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.models) {
        setModels(data.models.filter((m: any) => m.name.includes('gemini')));
        setIsValid(true);
      }
    } catch (error: any) {
      setApiKeyError(error.message || 'Failed to validate API key');
      setModels([]);
    } finally {
      setIsValidating(false);
    }
  };

  // Automatically test API key on mount if it exists
  const [hasTested, setHasTested] = useState(false);
  useEffect(() => {
    if (user?.apiKey && !hasTested) {
      testApiKey(user.apiKey);
      setHasTested(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.apiKey]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
        <p className="text-[#868686] mt-1">Manage your account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-[#141414] border border-[#1f1f1f] flex-wrap h-auto gap-2 p-2">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Puzzle className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <Users2 className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-[#868686]">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] text-white">
                    {getInitials(user?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-[#1f1f1f] bg-[#0a0a0a] text-[#d2d2d2] hover:bg-[#1b1b1b]">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-[#868686] mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator className="bg-[#1f1f1f]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Full Name</Label>
                  <Input
                    defaultValue={user?.name}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Email</Label>
                  <Input
                    defaultValue={user?.email}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Job Title</Label>
                  <Input
                    placeholder="e.g. Sales Manager"
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Phone</Label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Bio</Label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 rounded-md bg-[#0a0a0a] border border-[#1f1f1f] text-white placeholder:text-[#868686] focus:outline-none focus:border-[#2d62ff]"
                />
              </div>

              <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Company Information</CardTitle>
              <CardDescription className="text-[#868686]">Your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Company Name</Label>
                  <Input
                    defaultValue={company?.name}
                    className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Plan</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={company?.plan?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase())}
                      disabled
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white capitalize"
                    />
                    <Badge className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] text-white">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">API Configuration</CardTitle>
              <CardDescription className="text-[#868686]">Configure your AI models and API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Gemini API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      id="apiKey"
                      placeholder="Enter your Gemini API Key"
                      className="bg-[#0a0a0a] border-[#1f1f1f] text-white flex-1"
                      defaultValue={user?.apiKey || ''}
                      onChange={(e) => {
                        const key = e.target.value;
                        if (key.length > 30) {
                          // Simple debounced/check could go here, but we'll use a specific test button or onBlur for now to avoid too many requests
                          // Actually user asked for "automatically test".
                          // Let's do it on blur to start, or if they pause.
                        }
                      }}
                      onBlur={(e) => {
                        const key = e.target.value;
                        if (key) {
                          // Trigger test
                          testApiKey(key);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const key = (document.getElementById('apiKey') as HTMLInputElement).value;
                        testApiKey(key);
                      }}
                      disabled={isValidating}
                      className="border-[#1f1f1f] text-[#d2d2d2]"
                    >
                      {isValidating ? 'Testing...' : 'Test'}
                    </Button>
                  </div>
                  {apiKeyError && <p className="text-xs text-red-500">{apiKeyError}</p>}
                  {isValid && <p className="text-xs text-green-500">API Key is valid!</p>}
                  <p className="text-xs text-[#868686]">
                    Your API key is stored securely. Get one from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#2d62ff] hover:underline">Google AI Studio</a>.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#d2d2d2]">Default Model</Label>
                  <select
                    id="model"
                    className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-[#1f1f1f] text-white focus:outline-none focus:border-[#2d62ff]"
                    defaultValue={user?.model || 'gemini-2.5-flash'}
                  >
                    <optgroup label="Recommended Models (2026)">
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Verified Fast)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast & Reliable)</option>
                      <option value="gemini-2.0-pro">Gemini 2.0 Pro (Most Powerful)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (legacy)</option>
                    </optgroup>
                    {models.length > 0 && (
                      <optgroup label="Other Discovered Models">
                        {models
                          .filter(m => !['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'].some(r => m.name.includes(r)))
                          .map((m: any) => (
                            <option key={m.name} value={m.name.replace('models/', '')}>
                              {m.displayName || m.name.replace('models/', '')}
                            </option>
                          ))
                        }
                      </optgroup>
                    )}
                  </select>
                  <p className="text-xs text-[#868686]">
                    Select the AI model for agent logic. If you hit "Quota Exceeded" (429 errors), switch to <b>Gemini 1.5 Flash</b> or wait a few minutes. Free tier limits are applied per model per project.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const apiKey = (document.getElementById('apiKey') as HTMLInputElement).value;
                    const model = (document.getElementById('model') as HTMLSelectElement).value;

                    if (user) {
                      useAuthStore.getState().updateUser({ apiKey, model });
                      // alert('API Configuration saved successfully!');
                      // Use a subtle indicator instead of alert if possible, but alert is fine for now
                      alert('API Configuration saved successfully!');
                    }
                  }}
                  className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Integrations</CardTitle>
              <CardDescription className="text-[#868686]">Connect your favorite tools to supercharge your AI Employees.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Calendar */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
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

                {/* Gmail */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-[#868686]">Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#d2d2d2]">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#868686]" />
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-sm text-[#868686]">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#868686]" />
                      <div>
                        <p className="text-white">Push Notifications</p>
                        <p className="text-sm text-[#868686]">Receive push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(v) => setNotifications({ ...notifications, push: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#868686]" />
                      <div>
                        <p className="text-white">SMS Notifications</p>
                        <p className="text-sm text-[#868686]">Receive text messages</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#1f1f1f]" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#d2d2d2]">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Deal Updates</p>
                      <p className="text-sm text-[#868686]">When deals are created or updated</p>
                    </div>
                    <Switch
                      checked={notifications.deals}
                      onCheckedChange={(v) => setNotifications({ ...notifications, deals: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Task Reminders</p>
                      <p className="text-sm text-[#868686]">When tasks are due</p>
                    </div>
                    <Switch
                      checked={notifications.tasks}
                      onCheckedChange={(v) => setNotifications({ ...notifications, tasks: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Mentions</p>
                      <p className="text-sm text-[#868686]">When someone mentions you</p>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(v) => setNotifications({ ...notifications, mentions: v })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Change Password</CardTitle>
              <CardDescription className="text-[#868686]">Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#d2d2d2]">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-[#0a0a0a] border-[#1f1f1f] text-white"
                />
              </div>
              <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                <Key className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
              <CardDescription className="text-[#868686]">Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="text-white">2FA is enabled</p>
                    <p className="text-sm text-[#868686]">Your account is protected</p>
                  </div>
                </div>
                <Button variant="outline" className="border-[#1f1f1f] text-[#d2d2d2]">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="mt-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Team Members</CardTitle>
                <CardDescription className="text-[#868686]">Manage your team and their permissions</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] hover:opacity-90 text-white">
                <Users2 className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin User', email: 'admin@nexuscrm.com', role: 'Admin', status: 'active' },
                  { name: 'Sales Manager', email: 'manager@nexuscrm.com', role: 'Sales Manager', status: 'active' },
                  { name: 'Sales Rep', email: 'sales@nexuscrm.com', role: 'Sales Rep', status: 'active' },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a]">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-[#2d62ff] to-[#dd23bb] text-white text-sm">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-[#868686]">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-[#1f1f1f] text-[#d2d2d2]">
                        {member.role}
                      </Badge>
                      <Badge className="bg-[#22c55e]/20 text-[#22c55e]">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-[#868686]">Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#2d62ff]/20 to-[#dd23bb]/20 border border-[#2d62ff]/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">{company?.plan} Plan</h3>
                    <p className="text-[#d2d2d2]">Billed monthly</p>
                  </div>
                  <Badge className="bg-[#22c55e]/20 text-[#22c55e]">Active</Badge>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${company?.plan === 'starter' ? '29' : company?.plan === 'professional' ? '79' : '199'}
                  </span>
                  <span className="text-[#868686]">/month</span>
                </div>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Payment Method</CardTitle>
              <CardDescription className="text-[#868686]">Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2d62ff]/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#2d62ff]" />
                  </div>
                  <div>
                    <p className="text-white">•••• •••• •••• 4242</p>
                    <p className="text-sm text-[#868686]">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-[#1f1f1f] text-[#d2d2d2]">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs >
    </div >
  );
}

export default function SettingsPage() {
  return (
    <GoogleOAuthProvider clientId="623238923107-okm9pe182dg60r0ei5e23flul5sc9tis.apps.googleusercontent.com">
      <SettingsContent />
    </GoogleOAuthProvider>
  );
}
