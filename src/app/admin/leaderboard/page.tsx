"use client";

import { useState, useEffect } from 'react';
import { fetchApi } from '../../../utils/api';

export default function AdminLeaderboardPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState('ALL');
  const [topicsList, setTopicsList] = useState<any[]>([]);
  const [filterTopic, setFilterTopic] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetchApi('/api/v1/classrooms');
        setClassrooms(res.data || res || []);
      } catch (err) {
        console.error("Gagal memuat kelas", err);
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (filterClass !== 'ALL') {
        try {
          const res = await fetchApi(`/api/v1/topics?classroomId=${filterClass}`);
          setTopicsList(res.data || []);
        } catch (err) {
          console.error("Gagal memuat topik untuk filter", err);
        }
      } else {
        setTopicsList([]);
      }
      setFilterTopic('ALL');
    };
    fetchTopics();
  }, [filterClass]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const userScores = new Map<string, any>();
        const classesToFetch = filterClass === 'ALL' ? classrooms : [{ id: filterClass }];

        for (const cls of classesToFetch) {
          if (!cls || !cls.id) continue;
          try {
            // Fetch topics for this classroom
            const topicsRes = await fetchApi(`/api/v1/topics?classroomId=${cls.id}`);
            const rawTopics = topicsRes.data || topicsRes;
            let topics = Array.isArray(rawTopics) ? rawTopics : [];

            // Filter by topic if a specific topic is selected
            if (filterTopic !== 'ALL') {
              topics = topics.filter((t: any) => t.id === filterTopic);
            }

            for (const topic of topics) {
              try {
                // Fetch leaderboard for this classroom & topic
                const lbRes = await fetchApi(`/api/v1/leaderboard?classroomId=${cls.id}&topicId=${topic.id}`);
                const rawData = lbRes.data || lbRes;
                const data = Array.isArray(rawData) ? rawData : [];

                const normalizeTopicName = (name: string) => {
                  const match = name.match(/\((.*?)\)/);
                  return match ? match[1].trim() : name.trim();
                };
                const normalizedName = normalizeTopicName(topic.name);

                for (const player of data) {
                  const uid = player.user_id;
                  if (!userScores.has(uid)) {
                    userScores.set(uid, {
                      ...player,
                      topicScores: [{ topicName: normalizedName, score: player.score || 0 }]
                    });
                  } else {
                    const existing = userScores.get(uid);
                    existing.score = (existing.score || 0) + (player.score || 0);
                    
                    const existingTopic = existing.topicScores.find((ts: any) => ts.topicName === normalizedName);
                    if (existingTopic) {
                      existingTopic.score += (player.score || 0);
                    } else {
                      existing.topicScores.push({ topicName: normalizedName, score: player.score || 0 });
                    }
                  }
                }
              } catch (e) {
                console.error(`Gagal memuat leaderboard untuk topic ${topic.id}`, e);
              }
            }
          } catch (e) {
            console.error(`Gagal memuat topics untuk kelas ${cls.id}`, e);
          }
        }

        // Convert to array and sort by score descending
        const aggregated = Array.from(userScores.values());
        setLeaderboard(aggregated.sort((a, b) => (b.score || 0) - (a.score || 0)));
      } catch (err) {
        console.error("Gagal memuat leaderboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (classrooms.length > 0 || filterClass !== 'ALL') {
      fetchLeaderboard();
    } else {
      setLoading(false);
    }
  }, [filterClass, filterTopic, classrooms]);

  const totalPages = Math.max(1, Math.ceil(leaderboard.length / itemsPerPage));

  const currentLeaderboard = leaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDisplayName = (player: any) => {
    if (player.first_name) {
      return `${player.first_name} ${player.last_name || ''}`.trim();
    }
    return player.username || player.name || 'Peserta';
  };

  const toggleRow = (uid: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) newSet.delete(uid);
      else newSet.add(uid);
      return newSet;
    });
  };

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

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'center', minWidth: '280px', maxWidth: '400px', flex: 1 }}>
          <label style={{ color: '#a0a5b5', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Filter Kelas:</label>
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setCurrentPage(1); // Reset page on filter change
            }}
            style={{
              width: '100%', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="ALL">Semua Kelas</option>
            {classrooms.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>

          <label style={{ color: '#a0a5b5', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Filter Materi:</label>
          <select
            value={filterTopic}
            onChange={(e) => {
              setFilterTopic(e.target.value);
              setCurrentPage(1);
            }}
            disabled={filterClass === 'ALL'}
            style={{
              width: '100%', padding: '8px 16px', borderRadius: '8px', backgroundColor: filterClass === 'ALL' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)', color: filterClass === 'ALL' ? 'rgba(255,255,255,0.3)' : 'white',
              border: '1px solid rgba(255,255,255,0.2)', outline: 'none', cursor: filterClass === 'ALL' ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="ALL">Semua Materi</option>
            {topicsList.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
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
            display: 'grid', gridTemplateColumns: '50px 3fr 1.5fr 50px',
            padding: '16px 24px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            alignItems: 'center'
          }}>
            {['Rank', 'Peserta', 'Total Poin', ''].map(h => (
              <span key={h} style={{ color: '#a0a5b5', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          {loading ? (
            <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Memuat leaderboard...</div>
          ) : currentLeaderboard.length === 0 ? (
            <div style={{ padding: '2rem', color: '#a0a5b5', textAlign: 'center' }}>Belum ada data peringkat.</div>
          ) : (
            currentLeaderboard.map((player, idx) => {
              const actualRank = ((currentPage - 1) * itemsPerPage) + idx;
              const displayName = getDisplayName(player);
              const avatarUrl = player.profile_picture_url || '/char-mc.png';
              const uid = player.user_id || idx.toString();
              const isExpanded = expandedRows.has(uid);
              const hasTopics = player.topicScores && player.topicScores.length > 0;

              return (
                <div key={uid} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '50px 3fr 1.5fr 50px',
                    padding: '16px 24px',
                    borderBottom: (idx < currentLeaderboard.length - 1 && !isExpanded) ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    alignItems: 'center',
                    transition: 'background-color 0.2s',
                    backgroundColor: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                    cursor: filterTopic === 'ALL' && hasTopics ? 'pointer' : 'default'
                  }}
                    onClick={() => { if (filterTopic === 'ALL' && hasTopics) toggleRow(uid); }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'}>

                    <span style={{
                      color: actualRank === 0 ? '#FFD700' : actualRank === 1 ? '#C0C0C0' : actualRank === 2 ? '#CD7F32' : '#a0a5b5',
                      fontWeight: '900', fontSize: '1.2rem'
                    }}>
                      #{actualRank + 1}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}></div>
                      <div>
                        <p style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 2px 0' }}>{displayName}</p>
                        <p style={{ color: '#a0a5b5', fontSize: '0.8rem', margin: 0 }}>{player.username ? `@${player.username}` : (player.name ? `@${player.name}` : (player.email || '-'))}</p>
                      </div>
                    </div>

                    <span style={{
                      color: (player.score || 0) < 0 ? '#ef4444' : '#22c55e',
                      fontWeight: '800', fontSize: '1.2rem',
                      textShadow: (player.score || 0) > 0 ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'none'
                    }}>
                      {(player.score || 0).toLocaleString()}
                    </span>

                    {filterTopic === 'ALL' && hasTopics && (
                      <span style={{ color: '#a0a5b5', textAlign: 'center', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        ▼
                      </span>
                    )}
                  </div>

                  {/* Expanded Breakdown Rows */}
                  {isExpanded && filterTopic === 'ALL' && hasTopics && (
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '1rem 2rem 1rem 4rem',
                      borderBottom: idx < currentLeaderboard.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}>
                      <p style={{ color: '#a0a5b5', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Poin per Materi :</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {player.topicScores.map((ts: any, tidx: number) => (
                          <div key={tidx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>{ts.topicName || `Topik ${tidx + 1}`}</span>
                            <span style={{ color: ts.score < 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{ts.score > 0 ? `+${ts.score}` : ts.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#a0a5b5', fontSize: '0.9rem', margin: 0 }}>
            Menampilkan <strong style={{ color: 'white' }}>{leaderboard.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, leaderboard.length)}</strong> dari total <strong style={{ color: 'white' }}>{leaderboard.length}</strong> riwayat
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
