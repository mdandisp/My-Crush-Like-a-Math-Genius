"use client";

import Link from 'next/link';
import { useState } from 'react';

import { mockQuestions, mockClassrooms, mockUsers } from '../../data/mockData';
import BackButton from '../../components/BackButton';

type TabType = 'questions' | 'classrooms' | 'users';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('questions');

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'questions', label: 'Kelola Soal', icon: '📝' },
    { key: 'classrooms', label: 'Classroom', icon: '🏫' },
    { key: 'users', label: 'Pengguna', icon: '👥' },
  ];

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

      {/* Back button */}
      <BackButton href="/dashboard" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }} />

      {/* Title Banner */}
      <div style={{
        position: 'relative', zIndex: 5, marginTop: '1.5rem',
        backgroundColor: '#f0944d',
        padding: '10px 50px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(240, 148, 77, 0.4)'
      }}>
        <h1 style={{
          color: 'white', fontSize: '1.5rem', fontWeight: '700',
          fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          ⚙ Admin Dashboard
        </h1>
      </div>

      {/* Tab Navigation */}
      <div style={{
        position: 'relative', zIndex: 5, marginTop: '1.5rem',
        display: 'flex', gap: '0.5rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.key ? '#ff477e' : 'transparent',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(255,71,126,0.4)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: '900px',
        padding: '1.5rem 2rem 2rem',
        flex: 1
      }}>

        {/* === QUESTIONS TAB === */}
        {activeTab === 'questions' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem' }}>Daftar Soal ({mockQuestions.length})</h2>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '8px' }}>
                + Tambah Soal
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mockQuestions.map(q => (
                <div key={q.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', gap: '15px'
                }}>
                  <span style={{
                    backgroundColor: '#f0944d', color: 'white',
                    padding: '4px 10px', borderRadius: '6px',
                    fontSize: '0.75rem', fontWeight: '700', flexShrink: 0
                  }}>
                    {q.topic}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>{q.question}</p>
                    <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '4px' }}>Jawaban: {q.answer}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                      color: '#a0a5b5', padding: '6px 12px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.8rem'
                    }}>Edit</button>
                    <button style={{
                      background: 'none', border: '1px solid rgba(255,100,100,0.3)',
                      color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.8rem'
                    }}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CLASSROOMS TAB === */}
        {activeTab === 'classrooms' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem' }}>Daftar Classroom ({mockClassrooms.length})</h2>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '8px' }}>
                + Buat Classroom
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {mockClassrooms.map(cls => (
                <div key={cls.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '8px' }}>🏫 {cls.name}</h3>
                  <p style={{ color: '#a0a5b5', fontSize: '0.85rem', marginBottom: '4px' }}>Guru: {cls.teacher}</p>
                  <p style={{ color: '#a0a5b5', fontSize: '0.85rem' }}>👤 {cls.students} siswa</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '8px' }}>
                      Edit
                    </button>
                    <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '8px' }}>
                      Kelola
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === USERS TAB === */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem' }}>Daftar Pengguna ({mockUsers.length})</h2>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
                padding: '12px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                {['Nama', 'Email', 'Gender', 'Role', 'Aksi'].map(h => (
                  <span key={h} style={{ color: '#a0a5b5', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' as const }}>{h}</span>
                ))}
              </div>
              {/* Table Rows */}
              {mockUsers.map(user => (
                <div key={user.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>{user.name}</span>
                  <span style={{ color: '#a0a5b5', fontSize: '0.85rem' }}>{user.email}</span>
                  <span style={{ color: '#a0a5b5', fontSize: '0.85rem' }}>{user.gender === 'MALE' ? '♂' : '♀'}</span>
                  <span style={{
                    color: user.role === 'admin' ? '#f0944d' : '#22c55e',
                    fontSize: '0.8rem', fontWeight: '600'
                  }}>
                    {user.role}
                  </span>
                  <button style={{
                    background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#a0a5b5', padding: '4px 10px', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '0.75rem', justifySelf: 'start'
                  }}>Detail</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
