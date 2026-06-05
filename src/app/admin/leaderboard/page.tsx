"use client";

import { useState } from 'react';

// Mock detailed leaderboard data specifically for Admin
const adminLeaderboard = [
  { id: 1, name: 'Alice', email: 'alice@math.com', classId: 'KALK12', attempts: 3, correct: 15, incorrect: 0, points: 1500, timeSpent: '5m 30s' },
  { id: 2, name: 'Bob', email: 'bob@math.com', classId: 'OTHER', attempts: 2, correct: 12, incorrect: 3, points: 1100, timeSpent: '7m 10s' },
  { id: 3, name: 'Charlie', email: 'charlie@math.com', classId: 'KALK12', attempts: 5, correct: 10, incorrect: 15, points: -500, timeSpent: '12m 0s' },
  { id: 4, name: 'Diana', email: 'diana@math.com', classId: 'KALK12', attempts: 1, correct: 5, incorrect: 0, points: 500, timeSpent: '2m 15s' },
  { id: 5, name: 'Ethan', email: 'ethan@math.com', classId: 'OTHER', attempts: 2, correct: 14, incorrect: 1, points: 1300, timeSpent: '6m 45s' },
  { id: 6, name: 'Fiona', email: 'fiona@math.com', classId: 'KALK12', attempts: 4, correct: 8, incorrect: 7, points: 100, timeSpent: '9m 20s' },
  { id: 7, name: 'George', email: 'george@math.com', classId: 'OTHER', attempts: 1, correct: 20, incorrect: 0, points: 2000, timeSpent: '4m 50s' },
  { id: 8, name: 'Hannah', email: 'hannah@math.com', classId: 'KALK12', attempts: 3, correct: 11, incorrect: 4, points: 700, timeSpent: '8m 10s' },
];

export default function AdminLeaderboardPage() {
  const [filterClass, setFilterClass] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLeaderboard = filterClass === 'ALL' 
    ? adminLeaderboard 
    : adminLeaderboard.filter(p => p.classId === filterClass);

  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => b.points - a.points);
  const totalPages = Math.ceil(sortedLeaderboard.length / itemsPerPage);
  
  const currentLeaderboard = sortedLeaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="animate-fade-in">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Leaderboard (Analisis Detail)
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem', margin: 0 }}>
            Pantau statistik rinci tiap percobaan murid, skor, dan akurasi jawaban.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: '#a0a5b5', fontSize: '0.85rem' }}>Filter Kelas:</label>
          <select 
            value={filterClass} 
            onChange={(e) => {
              setFilterClass(e.target.value);
              setCurrentPage(1); // Reset page on filter change
            }} 
            style={{
              padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', outline: 'none', cursor: 'pointer'
            }}
          >
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
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '900px' }}>
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
        {currentLeaderboard.map((player, idx) => {
          const actualRank = ((currentPage - 1) * itemsPerPage) + idx;
          return (
          <div key={player.id} style={{
            display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1fr 1fr 1.5fr',
            padding: '16px 24px',
            borderBottom: idx < currentLeaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            alignItems: 'center',
            transition: 'background-color 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

            <span style={{
              color: actualRank === 0 ? '#FFD700' : actualRank === 1 ? '#C0C0C0' : actualRank === 2 ? '#CD7F32' : '#a0a5b5',
              fontWeight: '900', fontSize: '1.2rem'
            }}>
              #{actualRank + 1}
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
          );
        })}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#a0a5b5', fontSize: '0.9rem', margin: 0 }}>
            Menampilkan <strong style={{ color: 'white' }}>{((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedLeaderboard.length)}</strong> dari total <strong style={{ color: 'white' }}>{sortedLeaderboard.length}</strong> riwayat
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sebelumnya
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: 'white', fontWeight: 'bold' }}>
              {currentPage} / {totalPages}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255, 71, 126, 0.8)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
                border: currentPage === totalPages ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255, 71, 126, 0.5)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: currentPage === totalPages ? 'none' : '0 4px 10px rgba(255, 71, 126, 0.3)'
              }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
