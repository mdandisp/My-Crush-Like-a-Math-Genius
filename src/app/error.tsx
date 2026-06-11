"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0f1015',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      color: 'white'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff477e' }}>Oops!</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Terjadi kesalahan pada sistem.</h2>
        <p style={{ color: '#a0a5b5', maxWidth: '500px', margin: '0 auto' }}>
          {error.message || 'Server sedang sibuk atau ada gangguan koneksi.'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        >
          Coba Lagi
        </button>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#ff477e',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)'
          }}>
            Ke Beranda
          </button>
        </Link>
      </div>
    </main>
  );
}
