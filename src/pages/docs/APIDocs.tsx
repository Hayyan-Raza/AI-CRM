import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Server, Key, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/leads',
    description: 'List all leads',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/leads',
    description: 'Create a new lead',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/leads/:id',
    description: 'Get a specific lead',
    auth: true,
  },
  {
    method: 'PUT',
    path: '/api/v1/leads/:id',
    description: 'Update a lead',
    auth: true,
  },
  {
    method: 'DELETE',
    path: '/api/v1/leads/:id',
    description: 'Delete a lead',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/deals',
    description: 'List all deals',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/deals',
    description: 'Create a new deal',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/deals/:id',
    description: 'Get a specific deal',
    auth: true,
  },
];

const codeExamples = {
  curl: `curl -X GET "https://api.nexuscrm.com/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
  javascript: `const response = await fetch('https://api.nexuscrm.com/v1/leads', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const leads = await response.json();`,
  python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.nexuscrm.com/v1/leads', headers=headers)
leads = response.json()`,
};

export default function APIDocs() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <Code className="w-3 h-3 mr-1" />
          API Documentation
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">API Documentation</h1>
        <p className="text-[#d2d2d2] text-lg">
          Integrate NexusCRM with your applications using our RESTful API. 
          Build custom integrations, automate workflows, and sync data.
        </p>
      </div>

      {/* Base URL */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#2d62ff]" />
            Base URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <code className="block p-4 rounded-lg bg-[#0a0a0a] text-[#22c55e] font-mono">
            https://api.nexuscrm.com/v1
          </code>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-[#dd23bb]" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#d2d2d2]">
            All API requests require authentication using an API key. Include your API key 
            in the Authorization header of each request.
          </p>
          <div className="p-4 rounded-lg bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#868686]">Header Format</span>
              <Button variant="ghost" size="sm" className="text-[#868686]">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <code className="text-[#d2d2d2] font-mono text-sm">
              Authorization: Bearer {'{YOUR_API_KEY}'}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="bg-[#0a0a0a] border border-[#1f1f1f]">
              <TabsTrigger value="curl" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                cURL
              </TabsTrigger>
              <TabsTrigger value="javascript" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="python" className="data-[state=active]:bg-[#2d62ff] data-[state=active]:text-white">
                Python
              </TabsTrigger>
            </TabsList>
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang} className="mt-4">
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-[#0a0a0a] overflow-x-auto">
                    <code className="text-sm text-[#d2d2d2] font-mono">{code}</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-[#868686]"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white">Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {endpoints.map((endpoint) => (
              <div 
                key={endpoint.path}
                className="flex items-center gap-4 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1b1b1b] transition-colors"
              >
                <Badge 
                  className={`
                    ${endpoint.method === 'GET' && 'bg-[#2d62ff]/20 text-[#2d62ff]'}
                    ${endpoint.method === 'POST' && 'bg-[#22c55e]/20 text-[#22c55e]'}
                    ${endpoint.method === 'PUT' && 'bg-[#f59e0b]/20 text-[#f59e0b]'}
                    ${endpoint.method === 'DELETE' && 'bg-[#ef4444]/20 text-[#ef4444]'}
                  `}
                >
                  {endpoint.method}
                </Badge>
                <code className="text-[#d2d2d2] font-mono text-sm">{endpoint.path}</code>
                <span className="text-sm text-[#868686] flex-1">{endpoint.description}</span>
                {endpoint.auth && (
                  <Badge variant="outline" className="border-[#1f1f1f] text-[#868686]">
                    Auth Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Webhook className="w-5 h-5 text-[#2d62ff]" />
            Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#d2d2d2] mb-4">
            Receive real-time notifications when events occur in your NexusCRM account. 
            Configure webhooks in your settings to receive HTTP POST requests.
          </p>
          <div className="flex flex-wrap gap-2">
            {['lead.created', 'lead.updated', 'deal.created', 'deal.won', 'task.completed'].map((event) => (
              <Badge key={event} variant="outline" className="border-[#1f1f1f] text-[#d2d2d2]">
                {event}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
