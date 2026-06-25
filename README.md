# My Crush Like a Math Genius (Frontend)

Sebuah aplikasi web edukasi inovatif berbasis *Visual Novel* (Gamifikasi) untuk pembelajaran Matematika/Kalkulus. Aplikasi ini mengajak pemain untuk belajar matematika dengan cara yang seru—memilih karakter (*Husbu/Waifu*) yang mewakili konsep kalkulus (seperti Limit, Turunan, Integral) dan mengerjakan kuis untuk meningkatkan *affection* (skor) serta bersaing di papan peringkat (*Leaderboard*).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Library UI:** [React](https://react.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Vanilla CSS Murni (Menekankan desain modern, *Glassmorphism*, dan animasi mulus tanpa *framework* eksternal)
- **State & Komunikasi:** `fetch` bawaan dengan arsitektur Proxy API
- **Notifikasi:** [react-hot-toast](https://react-hot-toast.com/)

---

## ✨ Fitur Utama 

### Untuk Siswa (Student)
1. **Autentikasi:** Sistem Login & Register yang terhubung ke Backend.
2. **Visual Novel Dashboard:** Pemilihan karakter (*Husbu/Waifu*) berdasarkan materi spesifik.
3. **Dialog Interaktif:** Obrolan dinamis dengan karakter sebelum memulai kuis.
4. **Sesi Kuis Cerdas:** Menjawab pertanyaan interaktif secara *real-time* yang langsung disimpan di *database*.
5. **Leaderboard Global:** Bersaing skor dan peringkat dengan murid lain berdasarkan topik dan kelas.
6. **Profil Siswa:** Melihat statistik akun.

### Untuk Guru (Admin Panel)
1. **Manajemen Kelas:** Membuat, mengubah, dan menghapus data kelas beserta *cover/wallpaper*.
2. **Manajemen Materi & Kuis:** Menambahkan soal kuis untuk masing-masing kelas.
3. **Pantauan Siswa (People):** Mengelola daftar semua siswa terdaftar.
4. **Analitik Leaderboard:** Memantau kemajuan, skor, dan detail performa per topik untuk seluruh siswa.

---

## 🚀 Cara Menjalankan Proyek (Local Development)

```bash
# 1. Pastikan Anda berada di direktori project frontend
cd math-genius-game

# 2. Install semua dependensi
npm install

# 3. Jalankan server dalam mode development
npm run dev

# 4. Buka aplikasi di browser
http://localhost:3000
```

> **Catatan Backend:** Aplikasi ini dirancang untuk berkomunikasi dengan server Backend (misal: Spring Boot). Pengaturan URL tujuan API bisa diatur pada file `.env` atau `next.config.js`. Permintaan API dari *frontend* akan otomatis diarahkan melalui mekanisme *proxy* di file `src/proxy.ts`.

---

## 🔑 Akses Admin (Testing)

Jika Backend Anda telah dikonfigurasi dengan *seeder* default, Anda bisa mencoba login ke Admin Panel menggunakan:
- **Email:** `superadmin123@mail.com`
- **Password:** `string`

---

## 📁 Struktur Folder Utama

```text
├── src/
│   ├── app/          # Rute utama (Pages & Layouts ala Next.js App Router)
│   ├── components/   # Komponen UI Reusable (Admin, Quiz, dsb.)
│   ├── data/         # Data statis & narasi karakter (mockData.ts)
│   ├── styles/       # CSS Utama (index.css untuk desain Glassmorphism)
│   ├── types/        # Definisi tipe data global (TypeScript Interfaces)
│   └── utils/        # Fungsi bantuan (api fetcher, mapper, dsb.)
├── public/           # Aset statis (Gambar karakter, ikon, dll)
└── proxy.ts          # Proxy pengarah rute /api ke server backend
```
