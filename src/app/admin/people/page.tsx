"use client";

import { mockUsers } from '../../../data/mockData';

export default function AdminPeoplePage() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Pantauan Pengguna (People)
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
            Daftar semua siswa yang terdaftar di aplikasi.
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
          padding: '16px 24px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {['Nama Lengkap', 'Email', 'Gender', 'Role', 'Aksi'].map(h => (
            <span key={h} style={{ color: '#ffffffff', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {mockUsers.map((user, idx) => (
          <div key={user.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
            padding: '16px 24px',
            borderBottom: idx < mockUsers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            alignItems: 'center',
            transition: 'background-color 0.2s',
            cursor: 'default'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', backgroundImage: 'url("/char-mc.png")', backgroundSize: 'cover', backgroundPosition: 'top' }}></div>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</span>
            </div>

            <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>{user.email}</span>

            <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>
              {user.gender === 'MALE' ? 'Laki-laki (♂)' : 'Perempuan (♀)'}
            </span>

            <span style={{
              display: 'inline-block',
              padding: '4px 10px', borderRadius: '20px',
              backgroundColor: user.role === 'admin' ? 'rgba(240, 148, 77, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: user.role === 'admin' ? '#f0944d' : '#22c55e',
              fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: 'fit-content'
            }}>
              {user.role}
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', padding: '6px 12px', borderRadius: '6px',
                cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s'
              }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                Lihat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
