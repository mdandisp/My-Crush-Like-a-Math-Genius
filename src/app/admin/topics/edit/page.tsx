"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '../../../../components/BackButton';
import { charactersData } from '../../../../data/mockData';

export default function EditTopicPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    normal_image_female: '',
    normal_image_male: '',
    normal_dialog: '',
    dating_image_female: '',
    dating_image_male: '',
    dating_dialog: '',
    max_attempts: 3,
    level_settings: {
      easy: { plus: 100, minus: 10 },
      medium: { plus: 200, minus: 30 },
      hard: { plus: 500, minus: 100 }
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      const char = charactersData.find(c => c.id === id);
      if (char) {
        setFormData(prev => ({
          ...prev,
          title: char.name,
          description: char.info || '',
          normal_image_female: char.type === 'cewe' ? char.image : '',
          normal_image_male: char.type === 'cowo' ? char.image : '',
        }));
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simulasi simpan karakter berhasil!');
    window.location.href = '/admin/topics';
  };

  const handleLevelChange = (level: 'easy' | 'medium' | 'hard', field: 'plus' | 'minus', val: string) => {
    setFormData({
      ...formData,
      level_settings: {
        ...formData.level_settings,
        [level]: {
          ...formData.level_settings[level],
          [field]: parseInt(val) || 0
        }
      }
    });
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
    color: 'white', outline: 'none', fontSize: '0.95rem'
  };

  const sectionStyle = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flexShrink: 0 }}>
          <BackButton href="/admin/topics" />
        </div>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>Buat/Edit Karakter (Topik)</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#ff477e', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Informasi Dasar</h2>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Nama Karakter (Title)</label>
            <input type="text" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Deskripsi / Konsep (Description)</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Maksimal Attempt per Murid</label>
            <input type="number" min={1} style={inputStyle} value={formData.max_attempts} onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 1 })} required />
          </div>
        </div>

        {/* Normal State */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#f0944d', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Kondisi Normal (Belum Jadian)</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Gambar Normal (Cewek) URL</label>
              <input type="url" style={inputStyle} value={formData.normal_image_female} onChange={(e) => setFormData({ ...formData, normal_image_female: e.target.value })} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Gambar Normal (Cowok) URL</label>
              <input type="url" style={inputStyle} value={formData.normal_image_male} onChange={(e) => setFormData({ ...formData, normal_image_male: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Dialog Normal</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={formData.normal_dialog} onChange={(e) => setFormData({ ...formData, normal_dialog: e.target.value })} />
          </div>
        </div>

        {/* Dating State */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#ec4899', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Kondisi Dating (Sudah Jadian)</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Gambar Dating (Cewek) URL</label>
              <input type="url" style={inputStyle} value={formData.dating_image_female} onChange={(e) => setFormData({ ...formData, dating_image_female: e.target.value })} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Gambar Dating (Cowok) URL</label>
              <input type="url" style={inputStyle} value={formData.dating_image_male} onChange={(e) => setFormData({ ...formData, dating_image_male: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Dialog Dating</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={formData.dating_dialog} onChange={(e) => setFormData({ ...formData, dating_dialog: e.target.value })} />
          </div>
        </div>

        {/* Level Settings */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#22c55e', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Pengaturan Skor per Level</h2>
          {(['easy', 'medium', 'hard'] as const).map(lvl => (
            <div key={lvl} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize', fontSize: '1.1rem' }}>{lvl}</div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#22c55e', minWidth: '60px', fontSize: '0.9rem', fontWeight: '600' }}>+ Benar:</span>
                  <input type="number" style={{ ...inputStyle, width: '100%' }} value={formData.level_settings[lvl].plus} onChange={(e) => handleLevelChange(lvl, 'plus', e.target.value)} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ef4444', minWidth: '60px', fontSize: '0.9rem', fontWeight: '600' }}>- Salah:</span>
                  <input type="number" style={{ ...inputStyle, width: '100%' }} value={formData.level_settings[lvl].minus} onChange={(e) => handleLevelChange(lvl, 'minus', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" style={{
          padding: '16px',
          backgroundColor: '#ff477e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '1.2rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)'
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          Simpan Karakter
        </button>
      </form>
    </div>
  );
}
