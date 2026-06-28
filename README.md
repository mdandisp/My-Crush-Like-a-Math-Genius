# My Crush Like a Math Genius (Frontend)

Sebuah aplikasi web edukasi inovatif berbasis *Visual Novel* (Gamifikasi) untuk pembelajaran Matematika/Kalkulus. Aplikasi ini mengajak pemain untuk belajar matematika dengan cara yang seru—memilih karakter (*Husbu/Waifu*) yang mewakili konsep kalkulus (seperti Limit, Turunan, Integral) dan mengerjakan kuis untuk meningkatkan *affection* (skor) serta bersaing di papan peringkat (*Leaderboard*).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Library UI:** [React](https://react.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & Animasi:** 
  - Vanilla CSS Murni (Desain modern, *Glassmorphism*)
  - [Framer Motion](https://www.framer.com/motion/) (Untuk transisi dan mikro-animasi mulus)
- **Render Matematika:** [KaTeX](https://katex.org/) (Untuk render persamaan matematika LaTeX)
- **State & Komunikasi:** `fetch` bawaan dengan arsitektur Proxy API
- **Notifikasi:** [react-hot-toast](https://react-hot-toast.com/)
- **Utilitas Tambahan:** `react-easy-crop` (Pemotongan foto profil), `react-markdown` (Render teks *rich-text*)

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

---

## 🎬 Panduan Demo (Alur Presentasi)

Gunakan alur (script) di bawah ini agar presentasi Anda mengalir dengan natural dan profesional saat mendemokan aplikasi:

### Tahap 1: Pembukaan & Login (1 Menit)
- **Aksi:** Buka halaman utama (`/login`).
- **Narasi:** *"Selamat pagi/siang, hari ini saya akan mendemokan **My Crush Like a Math Genius**, sebuah platform pembelajaran Matematika interaktif berbasis Visual Novel. Kita akan mulai dengan masuk sebagai Siswa."*
- **Aksi:** Lakukan login menggunakan akun siswa.

### Tahap 2: Dashboard & Pemilihan Kelas (2 Menit)
- **Aksi:** Tunjukkan halaman Dashboard yang menampilkan daftar kelas.
- **Narasi:** *"Setelah login, siswa akan disambut di Dashboard. Di sini mereka bisa melihat ruang kelas yang tersedia. Mari kita masuk ke salah satu kelas."*
- **Aksi:** Klik salah satu kartu kelas.
- **Narasi:** *"Di dalam kelas, materi dibagi menjadi beberapa topik (seperti Limit, Turunan, Integral). Setiap topik direpresentasikan oleh karakter unik (Husbu/Waifu) yang akan menemani proses belajar."*

### Tahap 3: Interaksi Visual Novel (2 Menit)
- **Aksi:** Pilih satu topik (misal: Turunan). Lalu pilih tingkat kesulitan (Easy/Medium/Hard).
- **Narasi:** *"Siswa bisa memilih tingkat kesulitan. Setelah memilih, kita akan masuk ke fase Visual Novel. Di sini, karakter akan berinteraksi dan menyemangati siswa sebelum kuis dimulai."*
- **Aksi:** Klik layar untuk memajukan dialog karakter sampai masuk ke Kuis.

### Tahap 4: Sesi Kuis Berjalan (3 Menit)
- **Aksi:** Jawab beberapa pertanyaan (jawab ada yang benar dan ada yang salah).
- **Narasi:** *"Ini adalah tampilan kuisnya. Ada batas waktu di sebelah kiri dan informasi karakter di atas. Ketika siswa menjawab, sistem langsung mengecek kebenarannya secara *real-time*."*
- **Aksi:** Selesaikan kuis sampai muncul modal "Kuis Selesai".

### Tahap 5: Hasil Kuis & Leaderboard (2 Menit)
- **Aksi:** Perlihatkan modal "Kuis Selesai".
- **Narasi:** *"Setelah selesai, siswa bisa melihat skor, jumlah jawaban benar, dan sisa waktu."*
- **Aksi:** Klik tombol **Leaderboard** bergambar 🏆.
- **Narasi:** *"Siswa juga bisa membandingkan perolehan skornya dengan teman-teman lain di Leaderboard untuk menumbuhkan jiwa kompetitif."*
- **Aksi:** Tekan tombol **Back** dari Leaderboard.
- **Narasi:** *"Navigasinya juga sangat mulus, tombol kembali akan membawa siswa tepat ke hasil kuisnya lagi, dan mereka bisa memilih 'Main Lagi' atau kembali ke Dashboard."*

### Tahap 6: Halaman Profil & Riwayat (1 Menit)
- **Aksi:** Buka halaman Profil.
- **Narasi:** *"Terakhir, siswa dapat melihat riwayat pengerjaan kuis mereka beserta skor yang diperoleh di halaman Profil."*

### Tahap 7: (Opsional) Sisi Admin
- **Aksi:** Logout, lalu Login dengan akun Admin.
- **Narasi:** *"Sebagai tambahan, sistem ini dilengkapi Admin Panel tempat Guru bisa mengatur kelas, menambah topik, memantau nilai siswa, dan mengunggah soal kuis yang mendukung format matematika LaTeX (KaTeX)."*
