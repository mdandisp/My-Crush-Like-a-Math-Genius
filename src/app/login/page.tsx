"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../../components/BackButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password harus diisi!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      toast.error('Email belum terdaftar atau password salah!');
      return;
    }

    // Simulasikan loading/verifikasi
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Mengecek data...',
        success: 'Login berhasil!',
        error: 'Login gagal',
      }
    ).then(() => {
      // Set dummy cookie untuk Middleware
      document.cookie = "token=dummy-token; path=/";
      
      localStorage.setItem('userGender', user.gender);
      
      window.location.href = '/dashboard';
    });
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Kembali text above the card */}
        <BackButton href="/" style={{ marginBottom: '10px' }} />

        {/* Login Card matching the mockup exactly */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ color: '#ff477e', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Masuk</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Silahkan masuk ke akun anda
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '500' }}>
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukan email anda" 
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#334155',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '500' }}>
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukan password anda" 
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#334155',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff477e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                marginTop: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 71, 126, 0.4)'
              }}
            >
              Masuk
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            Belum punya akun? <Link href="/register" style={{ color: '#ff477e', textDecoration: 'none', fontWeight: '600' }}>Daftar</Link>
          </div>
        </div>
      </div>

    </main>
  );
}
