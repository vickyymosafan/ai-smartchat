# Struktur Project

## Layout Direktori

```
app/                    # Next.js App Router
├── api/                # API routes (REST endpoints)
│   ├── chat/           # Pertukaran pesan AI
│   ├── chats/          # CRUD riwayat chat
│   ├── messages/       # Manajemen pesan
│   ├── music/          # Endpoint playlist
│   ├── sessions/       # Manajemen sesi
│   └── swagger/        # Endpoint dokumentasi API
├── api-docs/           # Halaman Swagger UI
├── globals.css         # Style global & variabel tema
├── layout.tsx          # Root layout dengan providers
└── page.tsx            # Halaman utama (client component)

components/
├── chat/               # Komponen UI chat
├── dialogs/            # Modal dialog
├── layout/             # Sidebar, header
├── music/              # Pemutar musik
├── providers/          # React context providers
└── ui/                 # Komponen shadcn/ui

lib/
├── adapters/           # API adapters (pola DIP)
├── api/                # Fungsi service layer
├── generated/          # API client auto-generated
├── pwa/                # Konfigurasi PWA
├── supabase.ts         # Singleton Supabase client
└── utils.ts            # Fungsi utilitas (cn, generateId, dll.)

hooks/                  # Custom React hooks (pola SRP)
types/                  # Definisi tipe TypeScript
data/                   # Data statis (default playlist)
scripts/                # Script build (generasi API)
public/                 # Aset statis, service worker
```

## Pola Arsitektur

### Provider Pattern

`AppProviders` menyusun: `ThemeProvider` → `MusicProvider` → `ChatProvider`

### Adapter Pattern (DIP)

Panggilan API melalui adapters (`lib/adapters/`) memungkinkan implementasi mock/offline:

- `ChatApiAdapter` - operasi chat
- `SessionApiAdapter` - operasi sesi

### Hook Pattern (SRP)

Setiap hook memiliki tanggung jawab tunggal:

- `useSession` - manajemen sesi
- `useChatHistory` - CRUD chat
- `useMessages` - operasi pesan

### Segregated Context (ISP)

`ChatProvider` menyediakan hooks terfokus: `useChatSession`, `useChatHistories`, `useChatMessages`

## Spesifikasi API

`openapi.yaml` mendefinisikan semua REST endpoints. Jalankan `npm run generate:api` untuk regenerasi TypeScript client setelah perubahan spec.
