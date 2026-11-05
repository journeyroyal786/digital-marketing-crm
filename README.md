# Royal Journey CRM

A custom agency CRM built with Next.js, Supabase and Tailwind CSS. Designed for deployment on Vercel and source control in GitHub.

## Included
- Branded executive dashboard
- Leads, sales opportunities, clients, projects, tasks, campaigns, creative approvals, tickets, invoices, payments, employees, contracts and reports modules
- Supabase authentication and row-level security policies
- AED currency formatting
- Search, status filters, create and update workflows for core records
- SQL schema with relationships, indexes, profile creation trigger and RLS policies

## 1. Create Supabase project
Create a project at https://supabase.com. In **SQL Editor**, run the complete contents of `supabase/schema.sql`.

Then open **Project Settings → API** and copy:
- Project URL
- anon/public key

## 2. Configure environment
Copy `.env.example` to `.env.local` and add your Supabase values. Never expose a Supabase service-role key in the browser or commit secrets to GitHub.

## 3. Install and run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## 4. Create the first user
In Supabase → Authentication → Users, invite your company email. Sign in at `/login`.
The profile trigger creates a `profiles` record. The first account can be promoted to owner by running:
```sql
update public.profiles set role = 'owner' where email = 'YOUR_EMAIL';
```
Use the actual email address. Invite additional employees through Supabase Auth and assign roles in `profiles`.

## 5. Deploy with GitHub + Vercel
1. Create a GitHub repository and push this project.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project → Settings → Environment Variables.
4. Deploy. Redeploy after changing environment variables.

## Roles
`owner`, `admin`, `sales`, `account_manager`, `operations`, `creative`, `finance`, `support`, `employee`.
RLS is enabled on business tables. The policies in the starter schema allow authenticated team members to collaborate within this single-company CRM. Tighten policies further if you later support multiple agencies/tenants.

## Important implementation notes
- This is a working starter CRM, not a pre-connected live system. Supabase credentials, initial user invitations and deployment are required.
- Lead sources such as Meta Lead Ads, Google Ads, Instagram DMs and WhatsApp require their respective API/webhook credentials and app approvals. The CRM includes source fields and integration-ready data structures, but does not pretend those external connections are active.
- WhatsApp/email delivery, ad-platform metrics, accounting synchronization and scheduled automations require provider credentials and deployment of secure server-side jobs/webhooks. Do not store access tokens or client passwords in CRM notes.
- Invoice records are operational tracking; confirm UAE VAT, invoicing and accounting requirements with your accountant before issuing tax invoices.
- Keep backups enabled in Supabase and restrict employee access by role.
