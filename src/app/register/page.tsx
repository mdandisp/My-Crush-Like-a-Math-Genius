"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import TextInput from '../../components/auth/TextInput';
import SelectInput from '../../components/auth/SelectInput';

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

    setIsSubmitting(true);

    try {
      const payload = {
        email: email,
        password: password,
        gender: gender.toLowerCase(),
        username: username,
        first_name: firstName,
      };

      const registerReq = fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/authentication/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          let detailMsg = '';
          if (data.data) {
            detailMsg = typeof data.data === 'object' ? JSON.stringify(data.data) : data.data;
          } else {
            detailMsg = data.message || JSON.stringify(data);
          }
          throw new Error(`Error: ${detailMsg}`);
        }
        return data.data;
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

        <TextInput 
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password anda"
          disabled={isSubmitting}
        />

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
