# Tech Stack & Build System

## Framework & Runtime

- **Next.js 16** dengan App Router
- **React 19** dengan dukungan Server Components
- **TypeScript** (strict mode aktif)

## Styling

- **Tailwind CSS 4** dengan CSS variables
- **shadcn/ui** (style new-york) dengan Radix UI primitives
- **lucide-react** untuk ikon

## Database & Backend

- **Supabase** (PostgreSQL) via `@supabase/supabase-js`
- **n8n Webhook** untuk pemrosesan AI/RAG

## PWA (Progressive Web App)

- **Service Worker** minimal (no-cache strategy)
- **Web App Manifest** dengan standalone display mode
- **beforeinstallprompt** capture untuk install prompt
- **Cross-platform**: Chrome/Edge (native), Safari iOS (manual instructions)
- **Onboarding Wizard** untuk pengguna pertama kali

## Library Utama

- `react-markdown` + `remark-gfm` untuk rendering markdown
- `next-themes` untuk manajemen tema
- `@tanstack/react-virtual` untuk virtualized lists
- `react-speech-recognition` untuk input suara
- `vaul` untuk komponen drawer
- `sonner` untuk notifikasi toast
- `swagger-ui-react` untuk dokumentasi API
- `@radix-ui/react-visually-hidden` untuk accessibility

## Generasi API

Spesifikasi OpenAPI (`openapi.yaml`) menghasilkan TypeScript client via `swagger-typescript-api`.

## Perintah Umum

```bash
npm run dev          # Jalankan development server
npm run build        # Build production
npm run lint         # Jalankan ESLint
npm run analyze      # Analisis bundle (ANALYZE=true)
npm run generate:api # Generate API client dari openapi.yaml
```

## Environment Variables

Diperlukan di `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key Supabase (server-only)
- `N8N_WEBHOOK_URL` - Endpoint webhook n8n untuk AI

## Path Aliases

`@/*` mengarah ke root project (dikonfigurasi di `tsconfig.json`).
