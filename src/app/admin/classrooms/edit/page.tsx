"use client";

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../../../components/BackButton';

export default function EditClassroomPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    wallpaper_img: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simulasi simpan kelas berhasil!');
    window.location.href = '/admin/classrooms';
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <BackButton href="/admin/classrooms" />
        <div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>Buat/Edit Classroom</h1>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Nama Kelas</label>
            <input 
              type="text" 
              placeholder="Contoh: Kalkulus XII MIPA 1"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Deskripsi Kelas</label>
            <textarea 
              placeholder="Tuliskan deksripsi atau aturan kelas..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', outline: 'none', resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>URL Wallpaper (Latar Belakang)</label>
            <input 
              type="url" 
              placeholder="https://..."
              value={formData.wallpaper_img}
              onChange={(e) => setFormData({...formData, wallpaper_img: e.target.value})}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', outline: 'none'
              }}
            />
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '6px' }}>
              Masukkan tautan gambar untuk kustomisasi tema visual khusus kelas ini.
            </p>
          </div>

          <button type="submit" style={{
            marginTop: '1rem',
            padding: '14px',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}>
            Simpan Classroom
          </button>
        </form>
      </div>
    </div>
  );
}
