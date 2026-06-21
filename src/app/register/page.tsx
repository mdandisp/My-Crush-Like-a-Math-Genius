"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import TextInput from '../../components/auth/TextInput';
import SelectInput from '../../components/auth/SelectInput';
import { fetchApi } from '../../utils/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !gender || !username || !firstName) {
      toast.error("Silakan lengkapi semua kolom pendaftaran!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal harus 8 karakter!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: email,
        password: password,
        gender: gender.toLowerCase(),
        username: username,
        first_name: firstName,
      };

      const registerReq = fetchApi('/api/v1/authentication/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      }).then((data) => {
        return data.data;
      }).catch((err) => {
        let errorMsg = 'Terjadi kesalahan saat mendaftar.';
        
        if (err.data && Array.isArray(err.data)) {
          const firstError = err.data[0];
          if (firstError?.field) {
             errorMsg = `Validasi gagal pada kolom ${firstError.field}: ${firstError.message}`;
          }
        } else if (err.message) {
          if (err.message.toLowerCase().includes('duplicate key') || err.message.includes('23505')) {
             if (err.message.toLowerCase().includes('email')) {
               errorMsg = 'Gagal: Email ini sudah terdaftar.';
             } else if (err.message.toLowerCase().includes('username')) {
               errorMsg = 'Gagal: Username ini sudah digunakan.';
             } else {
               errorMsg = 'Gagal: Email atau username sudah terdaftar.';
             }
          } else {
             errorMsg = err.message;
          }
        }
        
        throw new Error(errorMsg);
      });

      await toast.promise(registerReq, {
        loading: 'Mendaftarkan akun...',
        success: 'Pendaftaran berhasil! Silakan masuk.',
        error: (err) => err.message || 'Terjadi kesalahan'
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (error) {
      // Error handled by toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Mendaftar"
      subtitle="Silahkan daftarkan akun anda"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk"
      footerLinkHref="/login"
    >
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextInput 
          label="Nama Depan (First Name)"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Masukkan nama depan anda"
          disabled={isSubmitting}
        />
        
        <TextInput 
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username anda"
          disabled={isSubmitting}
        />

        <TextInput 
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan email anda"
          disabled={isSubmitting}
        />

        <div style={{ position: 'relative' }}>
          <TextInput 
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password anda"
            disabled={isSubmitting}
            minLength={8}
            required
          />
          {password.length > 0 && password.length < 8 && (
            <span style={{ color: '#ff477e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              Minimal 8 karakter
            </span>
          )}
        </div>

        <SelectInput 
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          disabled={isSubmitting}
          placeholder="Pilih gender anda"
          options={[
            { label: 'Laki-laki', value: 'male' },
            { label: 'Perempuan', value: 'female' }
          ]}
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
          {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
        </button>
      </form>
    </AuthLayout>
  );
}
