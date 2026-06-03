"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import BackButton from '../../components/BackButton';

export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState('');

  const handleRegister = () => {
    if (!gender) {
      toast.error("Silakan pilih gender terlebih dahulu!");
      return;
    }
    // Simpan gender pemain untuk menentukan apakah mereka mencari Waifu atau Husbu
    localStorage.setItem('userGender', gender);
    
    // Set dummy cookie untuk Middleware agar langsung terhitung login
    document.cookie = "token=dummy-token; path=/";
    
    toast.success("Pendaftaran berhasil! Memasuki permainan...");
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
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
        <BackButton href="/" style={{ marginBottom: '10px' }} />

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ color: '#ff477e', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Mendaftar</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Silahkan daftarkan akun anda
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '500' }}>
                Email
              </label>
              <input 
                type="email" 
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

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: '500' }}>
                Gender
              </label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#334155',
                  fontSize: '0.9rem',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23334155%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '12px auto'
                }}>
                <option value="">Pilih gender anda</option>
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>

            <button 
              type="button" 
              onClick={handleRegister}
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
              Daftar
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            Sudah punya akun? <Link href="/login" style={{ color: '#ff477e', textDecoration: 'none', fontWeight: '600' }}>Masuk</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
