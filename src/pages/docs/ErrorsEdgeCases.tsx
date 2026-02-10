import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

const errorCodes = [
  {
    code: '400',
    name: 'Bad Request',
    description: 'The request was malformed or missing required parameters.',
    solution: 'Check your request format and ensure all required fields are provided.',
  },
  {
    code: '401',
    name: 'Unauthorized',
    description: 'Authentication failed or API key is invalid.',
    solution: 'Verify your API key is correct and included in the Authorization header.',
  },
  {
    code: '403',
    name: 'Forbidden',
    description: 'You do not have permission to access this resource.',
    solution: 'Check your user role permissions or contact your administrator.',
  },
  {
    code: '404',
    name: 'Not Found',
    description: 'The requested resource does not exist.',
    solution: 'Verify the resource ID is correct and the resource has not been deleted.',
  },
  {
    code: '429',
    name: 'Rate Limited',
    description: 'You have exceeded the API rate limit.',
    solution: 'Reduce request frequency or upgrade your plan for higher limits.',
  },
  {
    code: '500',
    name: 'Server Error',
    description: 'An unexpected error occurred on our servers.',
    solution: 'Retry the request after a few moments. If persistent, contact support.',
  },
];

const edgeCases = [
  {
    title: 'Duplicate Lead Detection',
    description: 'System prevents duplicate leads based on email address.',
    handling: 'When a duplicate is detected, the system will suggest merging or updating the existing lead.',
  },
  {
    title: 'Concurrent Edits',
    description: 'Multiple users editing the same record simultaneously.',
    handling: 'Last-write-wins with conflict detection. Users are notified of concurrent changes.',
  },
  {
    title: 'Data Import Errors',
    description: 'Issues during bulk data import operations.',
    handling: 'Failed rows are logged with error details. Successful rows are committed.',
  },
  {
    title: 'Email Delivery Failures',
    description: 'Emails fail to send due to various reasons.',
    handling: 'Retries with exponential backoff. Failed emails are queued for manual review.',
  },
];

export default function ErrorsEdgeCases() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Errors & Edge Cases
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Errors & Edge Cases</h1>
        <p className="text-[#d2d2d2] text-lg">
          Understanding error codes and how the system handles edge cases will help you 
          build more robust integrations.
        </p>
      </div>

      {/* HTTP Status Codes */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-[#ef4444]" />
            HTTP Status Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorCodes.map((error) => (
              <div key={error.code} className="p-4 rounded-lg bg-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-[#ef4444]/20 text-[#ef4444]">{error.code}</Badge>
                  <span className="text-white font-medium">{error.name}</span>
                </div>
                <p className="text-sm text-[#868686] mb-2">{error.description}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#d2d2d2]">{error.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edge Cases */}
      <Card className="bg-[#141414] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
            Edge Cases & Handling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {edgeCases.map((edgeCase) => (
              <div key={edgeCase.title} className="p-4 rounded-lg bg-[#0a0a0a]">
                <h4 className="text-white font-medium mb-2">{edgeCase.title}</h4>
                <p className="text-sm text-[#868686] mb-2">{edgeCase.description}</p>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#2d62ff] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#d2d2d2]">{edgeCase.handling}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Response Format */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardHeader>
          <CardTitle className="text-white">Error Response Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#d2d2d2] mb-4">
            All API errors follow a consistent JSON format:
          </p>
          <pre className="p-4 rounded-lg bg-[#0a0a0a] overflow-x-auto">
            <code className="text-sm text-[#d2d2d2] font-mono">{`{
  "error": {
    "code": "invalid_request",
    "message": "The request is missing required parameters",
    "details": {
      "field": "email",
      "issue": "required"
    }
  }
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
