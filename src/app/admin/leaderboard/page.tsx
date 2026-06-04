"use client";

import { useState } from 'react';

// Mock detailed leaderboard data specifically for Admin
const adminLeaderboard = [
  { id: 1, name: 'Alice', email: 'alice@math.com', attempts: 3, correct: 15, incorrect: 0, points: 1500, timeSpent: '5m 30s' },
  { id: 2, name: 'Bob', email: 'bob@math.com', attempts: 2, correct: 12, incorrect: 3, points: 1100, timeSpent: '7m 10s' },
  { id: 3, name: 'Charlie', email: 'charlie@math.com', attempts: 5, correct: 10, incorrect: 15, points: -500, timeSpent: '12m 0s' },
  { id: 4, name: 'Diana', email: 'diana@math.com', attempts: 1, correct: 5, incorrect: 0, points: 500, timeSpent: '2m 15s' },
];

export default function AdminLeaderboardPage() {
  const [filterClass, setFilterClass] = useState('ALL');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Leaderboard (Analisis Detail)
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem', margin: 0 }}>
            Pantau statistik rinci tiap percobaan murid, skor, dan akurasi jawaban.
          </p>
        </div>

        <div>
          <label style={{ color: '#a0a5b5', fontSize: '0.85rem', marginRight: '10px' }}>Filter Kelas:</label>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{
            padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)', outline: 'none', cursor: 'pointer'
          }}>
            <option value="ALL">Semua Kelas</option>
            <option value="KALK12">Kalkulus XII MIPA 1</option>
          </select>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1fr 1fr 1.5fr',
          padding: '16px 24px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          alignItems: 'center'
        }}>
          {['Rank', 'Peserta', 'Attempts', 'Benar/Salah', 'Waktu', 'Total Poin'].map(h => (
            <span key={h} style={{ color: '#a0a5b5', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {adminLeaderboard.sort((a, b) => b.points - a.points).map((player, idx) => (
          <div key={player.id} style={{
            display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1fr 1fr 1.5fr',
            padding: '16px 24px',
            borderBottom: idx < adminLeaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            alignItems: 'center',
            transition: 'background-color 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

            <span style={{
              color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#a0a5b5',
              fontWeight: '900', fontSize: '1.2rem'
            }}>
              #{idx + 1}
            </span>

            <div>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 4px 0' }}>{player.name}</p>
              <p style={{ color: '#a0a5b5', fontSize: '0.8rem', margin: 0 }}>{player.email}</p>
            </div>

            <span style={{ color: 'white', fontWeight: 'bold' }}>{player.attempts}x</span>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#22c55e', fontWeight: 'bold', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                {player.correct}
              </span>
              <span style={{ color: '#ef4444', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                {player.incorrect}
              </span>
            </div>

            <span style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>{player.timeSpent}</span>

            <span style={{
              color: player.points < 0 ? '#ef4444' : '#22c55e',
              fontWeight: '800', fontSize: '1.2rem',
              textShadow: player.points > 0 ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'none'
            }}>
              {player.points.toLocaleString()}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}
