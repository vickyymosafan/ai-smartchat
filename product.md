# Gambaran Produk

Smartchat AI adalah asisten AI berbasis chat yang dibangun untuk Universitas Muhammadiyah Jember (UMJ). Aplikasi ini menyediakan AI percakapan dengan kemampuan RAG (Retrieval-Augmented Generation).

## Fitur Utama

- Percakapan AI natural dengan respons berformat markdown
- Riwayat chat tersimpan di Supabase
- Manajemen sesi untuk kontinuitas pengguna
- Pemutar musik latar dengan tampilan lirik
- Dukungan tema gelap/terang dengan skema warna kustom
- Input suara dengan speech recognition
- PWA dengan install prompt cross-platform
- Onboarding wizard untuk pengguna baru
- Desain responsif untuk mobile dan desktop

## Fitur PWA

- **Standalone Mode**: Berjalan seperti aplikasi native
- **Install Prompt**: Deteksi otomatis platform (Chrome/Edge/Safari)
- **No-Cache Strategy**: Data selalu fresh dari server
- **iOS Support**: Instruksi manual install untuk Safari iOS

## Target Pengguna

Mahasiswa dan staf Universitas Muhammadiyah Jember yang mencari informasi melalui antarmuka percakapan.

## Integrasi Utama

- **n8n Webhook**: Pemrosesan AI backend dengan RAG
- **Supabase**: Database PostgreSQL untuk sesi, chat, dan pesan
- **Vercel**: Deployment dan analytics
