---
title: Introducing Supabase to NuxtFast
description: Supabase is an open-source Firebase alternative. It's a great tool for building a backend for your app. It's now integrated with NuxtFast!
publishedAt: 2023-11-20
categories:
  - slug: feature
  - slug: database
author:
  slug: fer
image:
  src: https://picsum.photos/800/400?random=2
  urlRelative: https://picsum.photos/800/400?random=2
  alt: Supabase and NuxtFast logo combined
---

# Introducing Supabase to NuxtFast

Supabase is an open-source Firebase alternative that has been gaining tremendous popularity in the developer community. Today, we're excited to announce its integration with NuxtFast!

## Why Supabase?

Supabase provides a complete backend solution with:

- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Built-in auth with multiple providers
- **Storage**: File and image upload/storage
- **Edge Functions**: Serverless functions at the edge
- **API**: Auto-generated REST and GraphQL APIs

## Getting Started

### 1. Create a Supabase Account

First, head over to [supabase.com](https://supabase.com) and create your free account. The free tier is generous and perfect for getting started.

### 2. Create Your First Project

Once you're logged in, create a new project. You'll need to:

- Choose a name for your project
- Set a secure database password
- Select your region (closer to your users = better performance)

### 3. Get Your Project Credentials

Navigate to your project settings and copy:
- Your project URL
- Your anon public key
- Your service role key (keep this secret!)

## Integration with NuxtFast

NuxtFast now comes with pre-configured Supabase integration. Simply add your credentials to your `.env` file:

```bash
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

## What's Next?

With Supabase integrated into NuxtFast, you can now:

- Set up authentication in minutes
- Create real-time applications
- Store and serve files efficiently
- Build scalable APIs without backend complexity

We're excited to see what you'll build with this powerful combination!

---

*Ready to get started? Check out our [Getting Started guide](/blog/getting-started-nuxtfast) or join our community on Discord.* 