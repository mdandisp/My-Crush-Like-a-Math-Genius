# My Crush Like a Math Genius (Frontend)

Sebuah aplikasi web edukasi berbasis *Visual Novel* untuk pembelajaran Kalkulus. Pemain dapat memilih karakter (Husbu/Waifu) berdasarkan topik kalkulus (Limit, Turunan, Integral), dan mengerjakan soal kuis untuk meningkatkan *affection* (skor) serta bersaing di *Leaderboard*.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library UI:** [React](https://react.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Vanilla CSS (CSS Murni dengan efek *Glassmorphism*)
- **Notifikasi:** [react-hot-toast](https://react-hot-toast.com/)

---

## Fitur Utama (Frontend)

1. **Autentikasi UI (Login & Register)**
2. **Dashboard & Pemilihan Karakter**
3. **Halaman Detail Topik**
4. **Sesi Kuis (Game Session)** (belum fix)
5. **Leaderboard**
6. **Admin Dashboard**

---

## Cara Menjalankan Proyek

```bash
# 1. Install dependensi
npm install

# 2. Jalankan mode development
npm run dev

# 3. Buka http://localhost:3000
```

---
## Login menggunakan akun admin sementara untuk mengakses admin panel:
1.  Jalankan aplikasi.
2.  Pada halaman login, masukkan:
    *   **Email:** `admin@mail.com`
    *   **Password:** `admin123`
3.  Klik tombol Login.
   
## Struktur Folder

```
├── src/
│   ├── app/          # Halaman Next.js
│   ├── components/   # Komponen React
│   ├── styles/       # CSS
│   └── utils/        # Fungsi bantuan
├── public/           # Aset statis
└── ...
```
