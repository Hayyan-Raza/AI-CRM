import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I get started with NexusCRM?',
        a: 'Sign up for a free 14-day trial at our signup page. No credit card required. After signing up, you can immediately start adding leads and creating deals.',
      },
      {
        q: 'Can I import data from my existing CRM?',
        a: 'Yes! We support importing data from Salesforce, HubSpot, Pipedrive, and other major CRMs. Go to Settings > Data Import to get started.',
      },
      {
        q: 'Is there a mobile app available?',
        a: 'Yes, NexusCRM has native mobile apps for both iOS and Android. Download them from the App Store or Google Play Store.',
      },
    ],
  },
  {
    category: 'Pricing & Billing',
    questions: [
      {
        q: 'What happens after my free trial ends?',
        a: 'After your 14-day trial, you can choose to upgrade to a paid plan or your account will be downgraded to a limited free tier.',
      },
      {
        q: 'Can I change my plan later?',
        a: 'Absolutely! You can upgrade or downgrade your plan at any time from the Settings > Billing page.',
      },
      {
        q: 'Do you offer discounts for annual billing?',
        a: 'Yes, you can save 20% by choosing annual billing instead of monthly.',
      },
    ],
  },
  {
    category: 'Features & Usage',
    questions: [
      {
        q: 'How does the AI lead scoring work?',
        a: 'Our AI analyzes lead behavior, engagement, and demographics to assign a score from 0-100. Higher scores indicate leads more likely to convert.',
      },
      {
        q: 'Can I customize the sales pipeline stages?',
        a: 'Yes, Professional and Enterprise plans allow full customization of pipeline stages to match your sales process.',
      },
      {
        q: 'Is there a limit on the number of contacts?',
        a: 'Contact limits vary by plan: Starter (1,000), Professional (10,000), Enterprise (unlimited).',
      },
    ],
  },
  {
    category: 'Security & Privacy',
    questions: [
      {
        q: 'How secure is my data?',
        a: 'We use bank-level 256-bit encryption, are SOC 2 Type II certified, and comply with GDPR and CCPA regulations.',
      },
      {
        q: 'Can I export my data?',
        a: 'Yes, you can export all your data at any time from Settings > Data Export. We believe your data belongs to you.',
      },
      {
        q: 'Do you offer single sign-on (SSO)?',
        a: 'SSO is available on our Enterprise plan with support for SAML 2.0, compatible with Okta, Azure AD, and OneLogin.',
      },
    ],
  },
  {
    category: 'Integrations',
    questions: [
      {
        q: 'What email providers do you integrate with?',
        a: 'We integrate with Gmail, Outlook, and any IMAP-enabled email service. Email sync is available on all paid plans.',
      },
      {
        q: 'Do you have an API?',
        a: 'Yes, we offer a RESTful API for building custom integrations. API access is included in Professional and Enterprise plans.',
      },
      {
        q: 'Can I connect NexusCRM to Zapier?',
        a: 'Yes, our Zapier integration allows you to connect with 5,000+ apps. Find us in the Zapier app directory.',
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="outline" className="border-[#2d62ff]/30 text-[#2d62ff] mb-4">
          <HelpCircle className="w-3 h-3 mr-1" />
          FAQ & Troubleshooting
        </Badge>
        <h1 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-[#d2d2d2] text-lg">
          Find answers to common questions about NexusCRM.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#868686]" />
        <Input
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 py-6 bg-[#141414] border-[#1f1f1f] text-white text-lg"
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {filteredFaqs.map((category) => (
          <Card key={category.category} className="bg-[#141414] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((q, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-[#1f1f1f]">
                    <AccordionTrigger className="text-[#d2d2d2] hover:text-white text-left">
                      {q.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#868686]">
                      {q.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {filteredFaqs.length === 0 && (
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-[#868686] mx-auto mb-4" />
              <p className="text-[#d2d2d2]">No results found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm text-[#868686] mt-2">Try a different search term or contact support.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Still Need Help */}
      <Card className="bg-gradient-to-br from-[#2d62ff]/10 to-[#dd23bb]/10 border-[#2d62ff]/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Still have questions?</h3>
              <p className="text-[#d2d2d2]">Our support team is here to help.</p>
            </div>
            <a href="/docs/support">
              <Badge className="bg-gradient-to-r from-[#2d62ff] to-[#dd23bb] text-white cursor-pointer px-4 py-2">
                Contact Support
              </Badge>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
