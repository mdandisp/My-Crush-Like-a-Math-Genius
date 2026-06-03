"use client";

import Link from 'next/link';
import { useState } from 'react';
import BackButton from '../../components/BackButton';

const allRankings = [
  { rank: 1, name: 'blackmamba999', score: 99999, topic: 'all' },
  { rank: 2, name: 'whitegoose407', score: 8500, topic: 'all' },
  { rank: 3, name: 'redwolf227', score: 7200, topic: 'all' },
  { rank: 4, name: 'whistfulbb4', score: 6100, topic: 'all' },
  { rank: 5, name: 'eagleeye171', score: 5800, topic: 'all' },
  { rank: 6, name: 'beautifulmouse12', score: 4900, topic: 'all' },
  { rank: 7, name: 'stealthdragon88', score: 4200, topic: 'all' },
  { rank: 8, name: 'thundercat55', score: 3800, topic: 'all' },
  { rank: 9, name: 'silentfox999', score: 3100, topic: 'all' },
  { rank: 10, name: 'neonwolf42', score: 2500, topic: 'all' },
];

function getRankBadgeColor(rank: number) {
  if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
  if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #8E8E8E)';
  if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #A0522D)';
  return '#64748b';
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'integral', label: 'Integral' },
    { key: 'limit', label: 'Limit' },
    { key: 'turunan', label: 'Turunan' },
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
        backgroundColor: 'rgba(15, 16, 21, 0.5)',
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
          🏆 Leaderboard
        </h1>
      </div>

      {/* Filter Pills */}
      <div style={{
        position: 'relative', zIndex: 5, marginTop: '1.5rem',
        display: 'flex', gap: '0.5rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filter === f.key ? '#ff477e' : 'transparent',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: filter === f.key ? '0 4px 12px rgba(255,71,126,0.4)' : 'none'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div style={{
        position: 'relative', zIndex: 5, marginTop: '2rem',
        display: 'flex', alignItems: 'flex-end', gap: '1.5rem',
        justifyContent: 'center'
      }}>
        {/* 2nd Place */}
        <div className="animate-fade-in" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: getRankBadgeColor(2),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', fontSize: '2rem', fontWeight: '800', color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>2</div>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{allRankings[1].name}</p>
          <p style={{ color: '#ff477e', fontWeight: '700', fontSize: '0.85rem' }}>{allRankings[1].score.toLocaleString()}</p>
        </div>

        {/* 1st Place */}
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: getRankBadgeColor(1),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', fontSize: '2.5rem', fontWeight: '800', color: 'white',
            boxShadow: '0 6px 25px rgba(255, 215, 0, 0.5)',
            border: '3px solid rgba(255,255,255,0.4)'
          }}>👑</div>
          <p style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>{allRankings[0].name}</p>
          <p style={{ color: '#FFD700', fontWeight: '800', fontSize: '1rem' }}>{allRankings[0].score.toLocaleString()}</p>
        </div>

        {/* 3rd Place */}
        <div className="animate-fade-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: getRankBadgeColor(3),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', fontSize: '2rem', fontWeight: '800', color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>3</div>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{allRankings[2].name}</p>
          <p style={{ color: '#CD7F32', fontWeight: '700', fontSize: '0.85rem' }}>{allRankings[2].score.toLocaleString()}</p>
        </div>
      </div>

      {/* Rest of Rankings */}
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
          {allRankings.slice(3).map((player, idx) => (
            <div key={player.rank} className="animate-fade-in" style={{
              display: 'flex', alignItems: 'center', gap: '15px',
              padding: '14px 20px',
              borderBottom: idx < allRankings.length - 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              animationDelay: `${(idx + 3) * 0.05}s`
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#64748b', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0
              }}>
                {player.rank}
              </div>
              <span style={{ flex: 1, color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                {player.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#22c55e', fontSize: '0.85rem' }}>✓</span>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>
                  {player.score.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
