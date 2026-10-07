# Sane Control — Web Platform

Production-oriented web platform for **Sane Control**, combining an institutional website, service pages, lead-generation flows, dynamic content and an AI-assisted publishing pipeline.

## Overview

The project evolves a service-business website into a full web application with:

- Institutional and service pages
- Conversion-focused landing pages
- Dynamic blog powered by Supabase
- Administrative area with authentication and role-based access
- AI-assisted content generation and curation
- Automated publishing pipeline
- Scheduled cron execution
- Persistent media storage
- SEO metadata, canonical URLs and structured data
- Responsive, component-based interfaces

## Technology Stack

**Application**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zod
- Lucide React

**Data & Authentication**
- Supabase
- PostgreSQL
- Supabase SSR
- Row Level Security
- Role-based access control

**AI & Content Automation**
- Google Generative AI
- Groq
- Gradio / Hugging Face integrations
- NewsAPI
- RSS content sources
- Automated content generation, curation and publishing

## Architecture & Engineering

The application is structured around clear separation between the public website, administrative workflows, server-side integrations and automation services.

Key engineering concerns include:

- Server/client separation in Next.js
- Lazy initialization of privileged service clients
- Server-side handling of sensitive environment variables
- Authentication and authorization boundaries
- Rate-limited administrative authentication
- Database-backed content workflows
- Persistent image storage
- Automated publishing with protected cron endpoints
- SEO and structured-data implementation
- Reusable React components and centralized business data

## AI Publishing Pipeline

The blog automation subsystem supports a controlled workflow for researching, generating, reviewing and publishing content.

Content can be:

1. Discovered from configured news and RSS sources
2. Filtered for relevance to the business domain
3. Generated and enriched with AI
4. Stored with durable media assets
5. Reviewed through the administrative interface
6. Published through the application workflow

The automation is designed with explicit configuration and protected runtime endpoints rather than exposing service credentials in client-side code.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application runs locally at:

```text
http://localhost:3000
```

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Environment Variables

Runtime configuration is supplied through local or deployment environment variables.

Typical integrations include Supabase, Google AI, content providers and the protected automation endpoint.

**Never commit API keys, service-role credentials, cron secrets, private tokens or production environment files.**

## Project Status

This repository represents a real client-facing product and a production-oriented full-stack engineering workflow.

Some internal business information, credentials and deployment configuration are intentionally excluded from the public codebase.

---

Built with **Next.js · React · TypeScript · Supabase · AI**