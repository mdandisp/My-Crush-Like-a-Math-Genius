"use client";

import { useState, useEffect } from 'react';
import { fetchApi } from '../../../../utils/api';
import BackButton from '../../../../components/BackButton';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EditTopicPage() {
  const router = useRouter();
  const [topicId, setTopicId] = useState<string | null>(null);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    female_normal_img_url: '' as string,
    male_normal_img_url: '' as string,
    female_dating_img_url: '' as string,
    male_dating_img_url: '' as string,
    female_normal_img_file: null as File | null,
    male_normal_img_file: null as File | null,
    female_dating_img_file: null as File | null,
    male_dating_img_file: null as File | null,
    female_normal_dialog: '',
    male_normal_dialog: '',
    female_dating_dialog: '',
    male_dating_dialog: '',
    max_attempts: 3,
    level_settings: {
      Easy: { plus: 100, minus: 10 },
      Medium: { plus: 200, minus: 30 },
      Hard: { plus: 500, minus: 100 }
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const cId = params.get('classroomId');
    if (cId) setClassroomId(cId);
    if (id) {
      setTopicId(id);
      setIsLoading(true);
      // Fetch existing topic
      fetchApi(`/api/v1/topics/${id}`)
        .then(res => {
          const char = res.data;
          if (char) {
            // Map array settings back to object form
            const newLevelSettings = { ...formData.level_settings };
            if (Array.isArray(char.level_settings)) {
              char.level_settings.forEach((lvl: any) => {
                // Backend returns lowercase 'easy', 'medium', 'hard'. Capitalize first letter:
                const capitalizedLevel = lvl.level.charAt(0).toUpperCase() + lvl.level.slice(1);
                if (newLevelSettings[capitalizedLevel as keyof typeof newLevelSettings]) {
                  newLevelSettings[capitalizedLevel as keyof typeof newLevelSettings] = {
                    plus: lvl.true_score || 0,
                    minus: lvl.false_score || 0
                  };
                }
              });
            }

            setFormData(prev => ({
              ...prev,
              title: char.name || '',
              description: char.description || '',
              female_normal_img_url: char.female_normal_img || '',
              male_normal_img_url: char.male_normal_img || '',
              female_dating_img_url: char.female_dating_img || '',
              male_dating_img_url: char.male_dating_img || '',
              female_normal_dialog: char.female_normal_dialog || '',
              male_normal_dialog: char.male_normal_dialog || '',
              female_dating_dialog: char.female_dating_dialog || '',
              male_dating_dialog: char.male_dating_dialog || '',
              max_attempts: char.max_attempts || 3,
              level_settings: newLevelSettings
            }));
          }
        })
        .catch(err => toast.error('Gagal memuat data topik: ' + err.message))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const titleLower = formData.title.toLowerCase();
    if (!titleLower.includes('limit') && !titleLower.includes('integral') && !titleLower.includes('turunan')) {
      toast.error('Gagal: Nama topik harus mengandung materi "Limit", "Integral", atau "Turunan" agar cocok dengan karakter.');
      setIsLoading(false);
      return;
    }

    // Backend expects an array for level_settings
    const levelSettingsArray = Object.entries(formData.level_settings).map(([level, points]) => ({
      level: level.toLowerCase(),
      true_score: points.plus,
      false_score: points.minus
    }));

    const payload = new FormData();
    payload.append('name', formData.title);
    payload.append('description', formData.description);
    payload.append('female_normal_dialog', formData.female_normal_dialog);
    payload.append('male_normal_dialog', formData.male_normal_dialog);
    payload.append('female_dating_dialog', formData.female_dating_dialog);
    payload.append('male_dating_dialog', formData.male_dating_dialog);
    payload.append('max_attempts', String(formData.max_attempts));
    payload.append('level_settings', JSON.stringify(levelSettingsArray));
    if (formData.female_normal_img_file) payload.append('female_normal_img', formData.female_normal_img_file);
    if (formData.male_normal_img_file) payload.append('male_normal_img', formData.male_normal_img_file);
    if (formData.female_dating_img_file) payload.append('female_dating_img', formData.female_dating_img_file);
    if (formData.male_dating_img_file) payload.append('male_dating_img', formData.male_dating_img_file);

    try {
      if (topicId) {
        await fetchApi(`/api/v1/topics/${topicId}`, { method: 'PUT', body: payload });
        toast.success('Topik berhasil diperbarui!');
      } else {
        await fetchApi('/api/v1/topics', { method: 'POST', body: payload });
        toast.success('Topik berhasil dibuat!');
      }
      router.push(classroomId ? `/admin/classrooms/${classroomId}` : '/admin/topics');
    } catch (err: any) {
      toast.error('Gagal menyimpan topik: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelChange = (level: 'Easy' | 'Medium' | 'Hard', field: 'plus' | 'minus', val: string) => {
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

  const renderImageUpload = (
    label: string,
    existingUrl: string,
    newFile: File | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void
  ) => {
    const previewUrl = newFile ? URL.createObjectURL(newFile) : existingUrl || null;
    return (
      <div>
        <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>{label}</label>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '120px', borderRadius: '12px',
          border: '2px dashed rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)',
          cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.2s',
        }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#ff477e')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
        >
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={label} style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white', textAlign: 'center', padding: '20px 8px 8px 8px',
                fontSize: '0.85rem', fontWeight: '500',
              }}>Ubah Gambar</div>
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s', zIndex: 10,
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)'; e.currentTarget.style.color = '#ef4444'; }}
                title="Hapus Gambar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </>
          ) : (
            <div style={{ color: '#a0a5b5', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.7 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>Pilih Gambar</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>PNG, JPG, WebP</div>
            </div>
          )}
          <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
        </label>
      </div>
    );
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
          <BackButton href={classroomId ? `/admin/classrooms/${classroomId}` : "/admin/topics"} />
        </div>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>{topicId ? 'Edit Topik Soal' : 'Buat Topik Soal Baru'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#ff477e', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Informasi Dasar</h2>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Nama Topik / Materi</label>
            <input type="text" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required disabled={isLoading} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Deskripsi Karakter/Topik</label>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isLoading} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Maksimal Attempt per Murid</label>
            <input type="number" min={1} style={inputStyle} value={formData.max_attempts} onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 1 })} required disabled={isLoading} />
          </div>
        </div>

        {/* Character Images */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#00bfff', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Gambar Karakter</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {renderImageUpload(
              'Waifu (Perempuan) Normal',
              formData.female_normal_img_url,
              formData.female_normal_img_file,
              (e) => setFormData({ ...formData, female_normal_img_file: e.target.files?.[0] || null }),
              () => setFormData({ ...formData, female_normal_img_file: null, female_normal_img_url: '' })
            )}
            {renderImageUpload(
              'Waifu Dating (Rank 1)',
              formData.female_dating_img_url,
              formData.female_dating_img_file,
              (e) => setFormData({ ...formData, female_dating_img_file: e.target.files?.[0] || null }),
              () => setFormData({ ...formData, female_dating_img_file: null, female_dating_img_url: '' })
            )}
            {renderImageUpload(
              'Husbu (Laki-laki) Normal',
              formData.male_normal_img_url,
              formData.male_normal_img_file,
              (e) => setFormData({ ...formData, male_normal_img_file: e.target.files?.[0] || null }),
              () => setFormData({ ...formData, male_normal_img_file: null, male_normal_img_url: '' })
            )}
            {renderImageUpload(
              'Husbu Dating (Rank 1)',
              formData.male_dating_img_url,
              formData.male_dating_img_file,
              (e) => setFormData({ ...formData, male_dating_img_file: e.target.files?.[0] || null }),
              () => setFormData({ ...formData, male_dating_img_file: null, male_dating_img_url: '' })
            )}
          </div>
        </div>

        {/* Character Dialogs */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#ffb347', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Dialog Karakter</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Waifu (Perempuan) Normal</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={formData.female_normal_dialog} onChange={(e) => setFormData({ ...formData, female_normal_dialog: e.target.value })} disabled={isLoading} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Waifu Dating (Rank 1)</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={formData.female_dating_dialog} onChange={(e) => setFormData({ ...formData, female_dating_dialog: e.target.value })} disabled={isLoading} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Husbu (Laki-laki) Normal</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={formData.male_normal_dialog} onChange={(e) => setFormData({ ...formData, male_normal_dialog: e.target.value })} disabled={isLoading} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', color: '#a0a5b5', marginBottom: '8px', fontWeight: '600' }}>Husbu Dating (Rank 1)</label>
              <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={formData.male_dating_dialog} onChange={(e) => setFormData({ ...formData, male_dating_dialog: e.target.value })} disabled={isLoading} />
            </div>
          </div>
        </div>

        {/* Level Settings */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#22c55e', fontSize: '1.2rem', margin: '0 0 10px 0' }}>Pengaturan Skor per Level</h2>
          {(['Easy', 'Medium', 'Hard'] as const).map(lvl => (
            <div key={lvl} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ color: 'white', fontWeight: '600', textTransform: 'capitalize', fontSize: '1.1rem' }}>{lvl}</div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#22c55e', minWidth: '60px', fontSize: '0.9rem', fontWeight: '600' }}>+ Benar:</span>
                  <input type="number" style={inputStyle} value={formData.level_settings[lvl].plus} onChange={(e) => handleLevelChange(lvl, 'plus', e.target.value)} disabled={isLoading} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ef4444', minWidth: '60px', fontSize: '0.9rem', fontWeight: '600' }}>- Salah:</span>
                  <input type="number" style={inputStyle} value={formData.level_settings[lvl].minus} onChange={(e) => handleLevelChange(lvl, 'minus', e.target.value)} disabled={isLoading} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isLoading} style={{
          padding: '16px',
          backgroundColor: isLoading ? '#a0a5b5' : '#ff477e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '1.2rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: isLoading ? 'none' : '0 4px 15px rgba(255, 71, 126, 0.4)'
        }}>
          {isLoading ? 'Menyimpan...' : 'Simpan Topik'}
        </button>
      </form>
    </div>
  );
}
