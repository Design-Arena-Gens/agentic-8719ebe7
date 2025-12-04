## Agentic Facebook Ad Spy

Agentic Facebook Ad Spy is a Next.js 16 application that pulls competitor intelligence from the Meta Ad Library and instantly synthesizes a fresh ad concept that mirrors the highest-leverage hooks.

### Features

- Query Meta’s Ad Library by keyword or Page ID (with graceful mock fallback when a token is absent)
- Visual gallery of competitor creatives, spend ranges, dates, and placements
- Automated ad concept generator that extracts shared angles, hooks, and CTA patterns
- Copy-to-clipboard actions for every field to accelerate creative iteration

### Local Development

```bash
npm install
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and provide a Meta Ad Library API token with access to the `ads_archive` endpoint.

```
FACEBOOK_ACCESS_TOKEN=your_meta_ad_library_token
```

When the token is missing or invalid the app serves rich sample data so the experience remains usable.

### Production Build

```bash
npm run build
npm start
```

### Deployment

The project is optimized for Vercel. Set the `FACEBOOK_ACCESS_TOKEN` as an Environment Variable in the Vercel dashboard or with the CLI before deploying.
