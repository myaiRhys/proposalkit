# ProposalKit

AI-powered proposal generator. Fill in a project brief, hit Generate, and get a complete professional proposal written by Claude in under 30 seconds.

## Setup

```bash
# Install dependencies
npm install

# Add your Anthropic API key to .env.local
ANTHROPIC_API_KEY=your_api_key_here
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard
4. Deploy

## Configure Your Brand

Click **Settings** in the nav to configure your company name, contact details, and tagline. These appear in all generated proposals and PDF exports.

## Features

- **AI-powered generation** — Claude writes professional, tailored proposals
- **Streaming output** — Watch the proposal appear word by word
- **PDF export** — Download client-ready PDF documents
- **History** — Save and reload previous proposals
- **White-label** — Your brand, your proposals

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude API
- jspdf (PDF generation)
- react-hook-form + zod (forms)

---

Built by [Kinnear Systems](https://kinnearsystems.co.za)
