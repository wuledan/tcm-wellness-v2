# TCM Wellness — tcmbody.com

A Traditional Chinese Medicine (TCM) wellness platform that provides personalized constitution analysis, daily health tips aligned with solar terms, AI-powered food scanning, and educational content about TCM body types, herbs, and dietary therapy.

## Features

- **🧬 Body Constitution Quiz** — Take a quick 2-minute quiz to discover your TCM body type (9 constitutional types) with personalized diet, exercise, and lifestyle recommendations
- **🌅 Daily Wellness Tips** — Get daily health suggestions tailored to your body type and current solar term, with a full 24-term solar calendar
- **🍽️ AI Food Scan** — Upload food photos or search by name for TCM-based food analysis; AI identifies food properties (cold/cool/neutral/warm/hot) with constitution compatibility matching
- **📊 Personal Dashboard** — Track your wellness journey, quiz history, and personalized recommendations
- **📚 Learn** — Comprehensive guides on TCM body types, common herbs, dietary therapy, and seasonal wellness
- **🌍 Multi-language** — English, Chinese (中文), Korean (한국어), Vietnamese (Tiếng Việt)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Authentication | [Auth.js](https://authjs.dev/) (next-auth v5) |
| Database | [Prisma](https://www.prisma.io/) + [Neon](https://neon.tech/) (PostgreSQL) |
| AI (Text) | DeepSeek V4 — quiz analysis, recommendations, food analysis |
| AI (Vision) | Qwen-VL (Dashscope) — food image recognition |
| Cache / Rate-limit | Upstash Redis |
| Deployment | [Vercel](https://vercel.com/) |
| Analytics | Vercel Analytics |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key for AI-powered analysis |
| `QWEN_API_KEY` | Dashscope/Qwen-VL API key for food image recognition |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `DIRECT_URL` | Direct (non-pooled) PostgreSQL connection string |
| `AUTH_URL` | Deployment URL (e.g. `https://tcmbody.com`) |
| `AUTH_SECRET` | NextAuth secret for session encryption |

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database schema
npx prisma db push

# (Optional) Seed demo data
npx prisma db seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Commands

```bash
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npx prisma db seed     # Seed database
npx prisma studio      # Open Prisma Studio GUI
```

## Build

```bash
npm run build
```

The production build must pass with 0 errors before any deployment.

## Deployment

Deployed on Vercel. Environment variables must be configured in the Vercel project settings.

1. Push to the repository
2. Connect the repository to Vercel
3. Add all environment variables from `.env.local.example`
4. Deploy

## Project Structure

```
src/
├── app/               # Next.js App Router pages and API routes
│   ├── quiz/          # Body constitution quiz flow
│   ├── daily/         # Daily wellness tips and solar terms
│   ├── food-scan/     # AI food analysis
│   ├── dashboard/     # User dashboard
│   ├── learn/         # TCM educational content
│   ├── login/         # Authentication page
│   ├── profile/       # User profile
│   └── admin/         # Admin panel
├── components/        # Shared React components
├── contexts/          # React contexts (LanguageContext)
├── data/              # Static data (constitutions, foods, solar terms)
├── lib/               # Utility functions and helpers
└── locales/           # i18n translations (en, zh, ko, vi)
```
