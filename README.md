# Smartchat AI Assistant

Asisten AI berbasis chat untuk Universitas Muhammadiyah Jember yang dibangun dengan Next.js, Supabase, dan n8n.

## 🚀 Fitur

- 💬 Percakapan AI yang natural dengan RAG (Retrieval-Augmented Generation)
- 📝 Dukungan markdown lengkap untuk respons
- 💾 Riwayat percakapan tersimpan di database
- 🎵 Musik latar dengan lirik
- 🌙 Mode gelap dan terang
- ⚡ Response caching untuk performa optimal
- 📱 Responsive design untuk semua device

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Database**: Supabase (PostgreSQL)
- **AI Backend**: n8n Webhook dengan RAG
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Vercel

## 📋 Prasyarat

- Node.js 18+
- npm atau pnpm
- Akun Supabase
- n8n Workflow dengan RAG

## ⚙️ Instalasi

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd smartchat-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   pnpm install
   ```

3. **Setup environment variables**

   Salin `.env.example` ke `.env.local` dan isi dengan kredensial Anda:

   ```bash
   cp .env.example .env.local
   ```

   Isi file `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```

4. **Jalankan development server**

   ```bash
   npm run dev
   ```

5. **Buka browser**

   Akses [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

Buat tabel-tabel berikut di Supabase:

```sql
-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Chat histories table
CREATE TABLE chat_histories (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT REFERENCES sessions(id),
  title TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT REFERENCES sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Cached responses table
CREATE TABLE cached_responses (
  id TEXT PRIMARY KEY,
  "questionHash" TEXT UNIQUE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "hitCount" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "expiresAt" TIMESTAMP NOT NULL
);
```

## 🚀 Deployment ke Vercel

1. **Push ke GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect ke Vercel**

   - Login ke [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository dari GitHub

3. **Set Environment Variables**

   Di Vercel Dashboard → Settings → Environment Variables:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_WEBHOOK_URL`

4. **Deploy**

   Vercel akan otomatis build dan deploy

## 📱 Build untuk Android (Capacitor)

Untuk membuat aplikasi Android:

1. **Tambah static export di `next.config.mjs`**

   ```js
   const nextConfig = {
     output: "export",
     // ... config lainnya
   };
   ```

2. **Install Capacitor**

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Smartchat AI" "com.umj.smartchat" --web-dir=out
   npx cap add android
   ```

3. **Build dan Sync**

   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```

4. **Build APK di Android Studio**

## 📁 Struktur Folder

```
├── app/
│   ├── api/
│   │   ├── chat/          # Chat dengan AI
│   │   ├── chats/         # CRUD chat histories
│   │   ├── messages/      # Get messages
│   │   ├── music/         # Music data
│   │   └── sessions/      # Session management
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── chat/              # Chat components
│   ├── layout/            # Layout components
│   ├── music/             # Music player
│   ├── providers/         # Context providers
│   └── ui/                # UI components (shadcn)
├── lib/
│   ├── cache-helper.ts    # Response caching
│   ├── session-helper.ts  # Session management
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Utility functions
├── public/
│   └── UMJ.png            # Logo
└── types/
    └── index.ts           # TypeScript types
```

## 🎨 Kustomisasi Theme

Theme dapat dikustomisasi di `app/globals.css`. Project menggunakan:

- **Light mode**: Courier New font, cyan/teal color scheme
- **Dark mode**: Source Code Pro font, cyan/teal color scheme

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run analyze  # Analyze bundle size
```

## 🔒 Keamanan

- Semua kredensial disimpan di environment variables
- Service role key tidak pernah di-expose ke client
- CORS headers dikonfigurasi untuk API routes
- Input validation di semua API endpoints

## 📄 Lisensi

MIT License

## 👨‍💻 Kontributor

Dikembangkan untuk Universitas Muhammadiyah Jember
