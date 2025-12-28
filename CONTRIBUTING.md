# Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada Smartchat AI! Berikut adalah panduan untuk membantu Anda berkontribusi.

## 🚀 Cara Berkontribusi

### 1. Fork Repository

```bash
# Fork repo ini ke akun GitHub Anda
# Lalu clone fork Anda
git clone https://github.com/<username-anda>/ai-smartchat.git
cd ai-smartchat
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Jalankan development server
npm run dev
```

### 3. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

### 4. Commit Changes

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Fitur baru
git commit -m "feat(scope): deskripsi singkat"

# Bug fix
git commit -m "fix(scope): deskripsi singkat"

# Dokumentasi
git commit -m "docs(scope): deskripsi singkat"

# Refactoring
git commit -m "refactor(scope): deskripsi singkat"
```

### 5. Push dan Buat Pull Request

```bash
git push origin feature/nama-fitur
```

Lalu buat Pull Request di GitHub.

## 📋 Coding Standards

- **TypeScript**: Gunakan strict mode
- **ESLint**: Jalankan `npm run lint` sebelum commit
- **Naming**: Gunakan camelCase untuk variabel/fungsi, PascalCase untuk komponen
- **Comments**: Gunakan JSDoc untuk fungsi publik

## 🧪 Testing

```bash
# Jalankan linting
npm run lint

# Build untuk memastikan tidak ada error
npm run build
```

## 📁 Struktur Kode

- `app/` - Next.js App Router pages dan API
- `components/` - React components
- `hooks/` - Custom React hooks
- `lib/` - Utilities dan helpers
- `types/` - TypeScript type definitions

## 💬 Butuh Bantuan?

Jika ada pertanyaan, silakan buat Issue di GitHub.

## 📄 Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License.
