"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import TextInput from '../../components/auth/TextInput';
import { fetchApi } from '../../utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier || !password) {
      toast.error('Email/Username dan password harus diisi!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Backend meminta key "identifier" (bisa diisi email atau username)
      const payload = { 
        identifier: identifier, 
        password: password 
      };

      const loginReq = fetchApi('/api/v1/authentication/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      }).then((data) => {
        return data.data;
      }).catch((err) => {
        console.error("Backend Error Response:", err);
        let detailMsg = '';
        if (err.data) {
          detailMsg = typeof err.data === 'object' ? JSON.stringify(err.data) : err.data;
        } else {
          detailMsg = err.message || JSON.stringify(err);
        }
        throw new Error(`Error: ${detailMsg}`);
      });

      const responseData = await toast.promise(loginReq, {
        loading: 'Mengecek data...',
        success: 'Login berhasil!',
        error: (err) => err.message || 'Terjadi kesalahan'
      });

      // Misalkan backend mengembalikan token dan user profile di dalam responseData
      const token = responseData?.token || responseData?.access_token;
      
      if (token) {
        document.cookie = `token=${token}; path=/`;
      } else {
        // Fallback untuk dummy testing
        document.cookie = "token=dummy-token; path=/";
      }

      // Ambil data user jika ada
      const user = responseData?.user || responseData || {};
      const roles = responseData?.roles || [];
      
      let roleToSet = 'user';
      if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN') || roles.includes('admin')) {
        roleToSet = 'admin';
      }
      
      document.cookie = `role=${roleToSet}; path=/`;
      localStorage.setItem('userRole', roleToSet);

      if (user.gender) {
        localStorage.setItem('userGender', user.gender);
      }
      
      window.location.href = '/dashboard';
    } catch (error) {
      // Error sudah ditangani oleh toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk"
      subtitle="Silahkan masuk ke akun anda"
      footerText="Belum punya akun?"
      footerLinkText="Daftar"
      footerLinkHref="/register"
    >
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput 
          label="Email atau Username"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukan email atau username anda"
          disabled={isSubmitting}
        />
        
        <TextInput 
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukan password anda"
          disabled={isSubmitting}
        />

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#a0a5b5' : '#ff477e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            marginTop: '1rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(255, 71, 126, 0.4)'
          }}
        >
          {isSubmitting ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </AuthLayout>
  );
}
