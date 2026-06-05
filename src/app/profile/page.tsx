"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';

export default function ProfilePage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState('Pemain 1');
  const [tempName, setTempName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/char-mc.png');

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
    setHistory(attempts.reverse()); // latest first
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
    setIsLoaded(true);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('userAvatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('userName', tempName.trim());
    }
    setIsEditingName(false);
  };

  if (!isLoaded) return <main style={{ minHeight: '100vh', backgroundColor: '#0f1015' }}></main>;

  return (
    <main style={{
      minHeight: '100vh',
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.6)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative', zIndex: 5, marginTop: '2rem', width: '100%', maxWidth: '800px', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px'
      }}>
        <div style={{ position: 'absolute', left: '2rem' }}>
          <BackButton href="/dashboard" />
        </div>
        
        {/* Banner */}
        <div style={{
          backgroundColor: '#ff477e',
          padding: '10px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)'
        }}>
          <h1 style={{
            color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0,
            fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Profil Pemain
          </h1>
        </div>
      </div>

      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: '800px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* User Info Card */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="file" 
              accept="image/*" 
              id="avatar-upload" 
              style={{ display: 'none' }} 
              onChange={handleAvatarChange} 
            />
            <div 
              onClick={() => document.getElementById('avatar-upload')?.click()}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center',
                cursor: 'pointer', transition: 'filter 0.2s', position: 'relative', overflow: 'hidden'
              }}
              title="Klik untuk ubah foto"
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.7)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <div style={{ position: 'absolute', bottom: 5, fontSize: '0.6rem', fontWeight: 'bold', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '10px', opacity: 0.8 }}>
                Ubah
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {isEditingName ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                    style={{
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #ff477e',
                      backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    style={{
                      padding: '4px 12px', backgroundColor: '#ff477e', color: 'white',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                    }}
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>{userName}</h2>
                  <button
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    style={{
                      background: 'transparent', border: 'none', color: '#ff477e', cursor: 'pointer',
                      fontSize: '0.9rem', textDecoration: 'underline'
                    }}
                  >
                    Ubah
                  </button>
                </>
              )}
            </div>
            <p style={{ color: '#a0a5b5', fontSize: '1rem', marginBottom: '1.5rem', wordBreak: 'break-word', textAlign: 'center' }}>Level: 1 | Role : Pelajar Kalkulus</p>
            <button
              onClick={() => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                localStorage.removeItem('userRole');
                window.location.href = "/login";
              }}
              style={{
                padding: '6px 16px', backgroundColor: 'transparent', color: '#ef4444',
                border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Riwayat Attempt Kuis</h3>

          {history.length === 0 ? (
            <p style={{ color: '#a0a5b5', textAlign: 'center', padding: '2rem' }}>Belum ada riwayat pengerjaan.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', color: '#f0944d' }}>
                    <th style={{ padding: '12px' }}>Tanggal</th>
                    <th style={{ padding: '12px' }}>Topik</th>
                    <th style={{ padding: '12px' }}>Level</th>
                    <th style={{ padding: '12px' }}>Soal</th>
                    <th style={{ padding: '12px' }}>Skor</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                      <td style={{ padding: '12px' }}>
                        {new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px' }}>{h.topicName}</td>
                      <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                        <span style={{
                          backgroundColor: h.level === 'easy' ? '#22c55e' : h.level === 'medium' ? '#f59e0b' : '#ef4444',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                        }}>
                          {h.level}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{h.questionCount}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: h.score === h.questionCount ? '#22c55e' : 'white' }}>
                        {h.score} / {h.questionCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
