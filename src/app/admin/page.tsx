"use client";

import { mockQuestions, mockClassrooms, mockUsers, charactersData } from '../../data/mockData';

export default function AdminHomePage() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
          Selamat datang kembali. Berikut adalah Admin Dashboard saat ini.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* Stat Cards */}
        {[
          { label: 'Total Classrooms', count: mockClassrooms.length, icon: '🏫', color: '#ff477e' },
          { label: 'Total Topics', count: charactersData.length, icon: '🎮', color: '#f0944d' },
          { label: 'Total Questions', count: mockQuestions.length, icon: '📝', color: '#22c55e' },
          { label: 'Total Users', count: mockUsers.length, icon: '👥', color: '#3b82f6' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '60px', height: '60px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>
                {stat.label}
              </p>
              <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>
                {stat.count}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem'
      }}>
        <h2 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1rem' }}>
          Petunjuk Penggunaan Panel Admin
        </h2>
        <ul style={{ color: '#ffffffff', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.5rem' }}>
          <li><strong>Classrooms:</strong> Buat dan kelola ruang kelas khusus untuk murid. Anda akan mendapatkan kode kelas (Join Code).</li>
          <li><strong>Topics:</strong> Tambahkan karakter waifu/husband baru, lengkapi gambar dan dialog mereka. Atur skor dan batasan (attempt) di sini.</li>
          <li><strong>Editor Soal (di dalam Topics):</strong> Edit pertanyaan, dengan dukungan timer mundur dan kunci jawaban ganda.</li>
          <li><strong>People:</strong> Pantau siapa saja murid yang telah mendaftar dan memantau status peran (role) mereka.</li>
          <li><strong>Leaderboard:</strong> Papan peringkat khusus Admin untuk memantau performa murid per kelas.</li>
        </ul>
      </div>
    </div>
  );
}
