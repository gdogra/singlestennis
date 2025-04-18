# SingleTennis Deployment Guide

This document provides instructions for deploying the SingleTennis application to production.

## Prerequisites

- Node.js 16+ and npm/pnpm installed
- Supabase account with project set up
- Netlify account for deployment

## Environment Variables

Before deploying, ensure the following environment variables are set:

```
VITE_SUPABASE_URL=https://yhfebvzrpwlawtjspurg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

### 1. Build the Application

```bash
cd /path/to/singletennis/frontend
pnpm install
pnpm build
```

This will create a `dist` directory with the production build.

### 2. Deploy to Netlify

#### Option 1: Netlify CLI

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize a new Netlify site
netlify init

# Deploy the site
netlify deploy --prod
```

#### Option 2: Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git repository
4. Set the build command to `pnpm build`
5. Set the publish directory to `dist`
6. Add the environment variables in the site settings
7. Deploy the site

### 3. Configure Supabase

Ensure your Supabase project has the following:

1. Authentication enabled with email/password sign-up
2. Database tables created:
   - profiles
   - challenges
3. Storage buckets:
   - avatars (with public access)
4. Row-level security policies configured

### 4. Post-Deployment Verification

After deployment, verify:

1. User registration and login work
2. Players can be viewed and filtered
3. Challenges can be created and responded to
4. Match calendar displays correctly
5. Scores can be entered
6. Leaderboard shows player rankings
7. Avatar uploads work properly

## Continuous Integration/Deployment

For CI/CD, you can set up a GitHub Actions workflow:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install pnpm
        run: npm install -g pnpm
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Build
        run: pnpm build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

- If authentication issues occur, verify Supabase URL and anon key
- For routing issues, ensure Netlify redirects are configured correctly
- For storage issues, check Supabase storage bucket permissions
