# NexusCRM: The First CRM with Valid AI Employees

## Inspiration
Honestly, we were tired of "smart" CRMs that just ended up being glorified spreadsheets. You spend half your day entering data and the other half reminding yourself to follow up. We thought, "What if the CRM could actually *do* the work?" Not just remind you to send an email, but actually draft it, understand the context, and act like a real teammate. That's where the idea for NexusCRM came from—building a system where you don't just manage data, you manage a team of AI employees who help you sell.

## What it does
NexusCRM is a full-featured customer relationship management platform, but with a twist. reliable
- **It's a CRM**: You can add leads, track deals through a Kanban pipeline, scheduling tasks, and monitor revenue.
- **It has AI "Employees"**: You can create custom AI agents (like "Sarah" for outreach or "Mike" for closing) and assign them to specific leads.
- **It writes for you**: The AI analyzes the deal stage and drafts context-aware emails and follow-ups.
- **It thinks**: We have an "Insights" engine that looks at your data and tells you which deals are likely to close and which ones are wasting your time.

## How we built it
We wanted this to be fast and modern, so we went with a **React** frontend powered by **Vite**.
- **Backend**: We used **Supabase** for the heavy lifting—Auth, Database (PostgreSQL), and Realtime subscriptions. It saved us weeks of boilerplate.
- **State Management**: We used **Zustand**. It's way simpler than Redux and handles our complex auth and data states perfectly.
- **The AI**: We integrated **Google Gemini** (and prepped for OpenAI) to power the intelligence behind the agents.
- **Styling**: **Tailwind CSS** and **Shadcn/UI** gave us that premium, dark-mode aesthetic without writing thousands of lines of CSS.

## Challenges we ran into
The database integration was trickier than we expected.
- **UUID Nightmares**: We spent a embarrassing amount of time debugging "invalid input syntax for type uuid". It turns out, you can't just send string placeholders like "new-company" to a PostgreSQL database that expects strictly typed UUIDs. We had to refactor our entire store to handle optional IDs gracefully.
- **The "Vercel Refresh" Bug**: Deploying a Single Page App (SPA) is always fun until you hit refresh on a sub-page and get a 404. We had to configure the rewrite rules specifically for Vercel to handle the client-side routing correctly.
- **State vs. Database**: Keeping the local UI state in sync with Supabase's real-time data was a balancing act. We had to implement optimistic updates so the app feels instant, even while the server confirms the save.

## Accomplishments that we're proud of
- **The "Add Deal" Flow**: It sounds simple, but getting the relationships right between Users, Companies, Leads, and Deals—while ensuring data integrity—was a big win. It finally works seamlessly.
- **The UI**: We're really happy with how the dark mode and glassmorphism effects turned out. It doesn't look like a boring enterprise tool; it feels like software from the future.
- **Seamless Auth**: The login/signup flow with Supabase is rock solid now, handling sessions and profile creation automatically.

## What we learned
- **Types matter**: TypeScript saved us from so many runtime errors, especially with the complex nested objects we get back from the database.
- **Supabase Policies**: We learned a lot about Row Level Security (RLS). You can't just query whatever you want; you have to explicitly allow it.
- **AI isn't magic**: You have to frame the data correctly. Giving the AI "context" (like previous emails or deal value) makes the difference between a generic robot response and something that actually sounds human.

## What's next for NexusCRM
- **Voice Agents**: We want to integrate Vapi so your AI employees can actually make phone calls.
- **Email Scraping**: Automatically pulling in emails from Gmail/Outlook so you don't have to copy-paste.
- **Multi-Tenant Teams**: Letting multiple real humans collaborate in the same workspace with their own armies of AI agents.
