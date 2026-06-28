"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import { fetchApi } from '../../utils/api';

function getRankBadgeColor(rank: number) {
  if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
  if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #8E8E8E)';
  if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #A0522D)';
  return '#64748b';
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('all');
  const [topics, setTopics] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [classroomId, setClassroomId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cid = localStorage.getItem('classroomId') || '';
    setClassroomId(cid);
    
    if (cid) {
      fetchApi(`/api/v1/topics?classroomId=${cid}`).then(res => {
        if (res.data) setTopics(res.data);
      }).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!classroomId) return;
    
    setIsLoading(true);
    let url = `/api/v1/leaderboard?classroomId=${classroomId}`;
    if (filter !== 'all') {
      url += `&topicId=${filter}`;
    }
    
    fetchApi(url).then(res => {
      if (res.data) setRankings(res.data);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, [classroomId, filter]);

  const filters = [
    { key: 'all', label: 'Semua' },
    ...topics.map(t => ({ key: t.id, label: t.name }))
  ];

  const getDisplayName = (player: any) => {
    if (player.first_name) {
      return `${player.first_name} ${player.last_name || ''}`.trim();
    }
    return player.username || 'Pemain';
  };

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
        backgroundColor: 'rgba(15, 16, 21, 0.5)',
        zIndex: 0
      }}></div>

      <style dangerouslySetInnerHTML={{__html: `
        .lb-header-container {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0 1.5rem;
          box-sizing: border-box;
          margin-top: 1.5rem;
        }
        .lb-back-desktop {
          display: none;
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 10;
        }
        .lb-back-mobile {
          position: absolute;
          left: 1.5rem;
        }
        @media (min-width: 768px) {
          .lb-header-container {
            margin-top: 4rem;
          }
          .lb-back-desktop {
            display: block;
          }
          .lb-back-mobile {
            display: none;
          }
        }
      `}} />

      {/* Desktop Back button */}
      <div className="lb-back-desktop">
        <BackButton href="/dashboard" />
      </div>

      {/* Header Row */}
      <div className="lb-header-container">
        <div className="lb-back-mobile">
          <BackButton href="/dashboard" />
        </div>
        
        {/* Title Banner */}
        <div style={{
          backgroundColor: '#f0944d',
          padding: '10px 50px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(240, 148, 77, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{
            margin: 0,
            lineHeight: 1,
            color: 'white', fontSize: '1.5rem', fontWeight: '700',
            fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div style={{
        position: 'relative', zIndex: 5, marginTop: '1.5rem',
        width: '90%', maxWidth: '400px'
      }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: 'rgba(30, 33, 48, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          {filters.map(f => (
            <option key={f.key} value={f.key} style={{ color: 'white', backgroundColor: '#1e2130' }}>
              {f.label}
            </option>
          ))}
        </select>
        {/* Custom Arrow */}
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'white',
          fontSize: '0.8rem'
        }}>
          ▼
        </div>
      </div>

      {isLoading ? (
         <div style={{ position: 'relative', zIndex: 5, marginTop: '4rem', color: 'white' }}>Memuat data...</div>
      ) : rankings.length === 0 ? (
         <div style={{ position: 'relative', zIndex: 5, marginTop: '4rem', color: '#a0a5b5' }}>Belum ada data skor.</div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div style={{
            position: 'relative', zIndex: 5, marginTop: '2rem',
            display: 'flex', alignItems: 'flex-end', gap: '1.5rem',
            justifyContent: 'center'
          }}>
            {/* 2nd Place */}
            {rankings[1] && (
              <div className="animate-fade-in" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: getRankBadgeColor(2),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', fontSize: '2rem', fontWeight: '800', color: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  backgroundImage: `url(${rankings[1].profile_picture_url || '/char-mc.png'})`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{getDisplayName(rankings[1])}</p>
                <p style={{ color: '#ff477e', fontWeight: '700', fontSize: '0.85rem' }}>{(rankings[1].score || 0).toLocaleString()}</p>
              </div>
            )}

            {/* 1st Place */}
            {rankings[0] && (
              <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: getRankBadgeColor(1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', fontSize: '2.5rem', fontWeight: '800', color: 'white',
                  boxShadow: '0 6px 25px rgba(255, 215, 0, 0.5)',
                  border: '3px solid rgba(255,255,255,0.4)',
                  backgroundImage: `url(${rankings[0].profile_picture_url || '/char-mc.png'})`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>{getDisplayName(rankings[0])}</p>
                <p style={{ color: '#FFD700', fontWeight: '800', fontSize: '1rem' }}>{(rankings[0].score || 0).toLocaleString()}</p>
              </div>
            )}

            {/* 3rd Place */}
            {rankings[2] && (
              <div className="animate-fade-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: getRankBadgeColor(3),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', fontSize: '2rem', fontWeight: '800', color: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  backgroundImage: `url(${rankings[2].profile_picture_url || '/char-mc.png'})`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{getDisplayName(rankings[2])}</p>
                <p style={{ color: '#CD7F32', fontWeight: '700', fontSize: '0.85rem' }}>{(rankings[2].score || 0).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Rest of Rankings */}
          {rankings.length > 3 && (
            <div style={{
              position: 'relative', zIndex: 5, marginTop: '2rem',
              width: '100%', maxWidth: '600px',
              padding: '0 2rem 2rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {rankings.slice(3).map((player, idx) => (
                  <div key={player.user_id || idx} className="animate-fade-in" style={{
                    display: 'flex', alignItems: 'center', gap: '15px',
                    padding: '14px 20px',
                    borderBottom: idx < rankings.length - 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    animationDelay: `${(idx + 3) * 0.05}s`
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#64748b', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0
                    }}>
                      {player.rank || (idx + 4)}
                    </div>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundImage: `url(${player.profile_picture_url || '/char-mc.png'})`,
                      backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0
                    }}></div>
                    <span style={{ flex: 1, color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                      {getDisplayName(player)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>✓</span>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>
                        {(player.score || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </main>
  );
}
