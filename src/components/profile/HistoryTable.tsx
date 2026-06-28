import { AttemptHistory } from '../../types';

interface HistoryTableProps {
  history: AttemptHistory[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
      <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Riwayat Attempt Kuis</h3>

      {history.length === 0 ? (
        <p style={{ color: '#a0a5b5', textAlign: 'center', padding: '2rem' }}>Belum ada riwayat pengerjaan.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', color: '#f0944d' }}>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Tanggal</th>
                <th style={{ padding: '12px' }}>Topik</th>
                <th style={{ padding: '12px' }}>Level</th>
                <th style={{ padding: '12px' }}>Soal</th>
                <th style={{ padding: '12px', whiteSpace: 'nowrap' }}>Skor</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={h.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(h.startedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px' }}>{h.topicName}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                    <span style={{
                      backgroundColor: h.selectedLevel === 'easy' ? '#22c55e' : h.selectedLevel === 'medium' ? '#f59e0b' : '#ef4444',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      {h.selectedLevel}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{h.requestedQuestions}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', color: h.score === h.requestedQuestions ? '#22c55e' : 'white' }}>
                    {h.score !== null ? h.score : '-'} / {h.requestedQuestions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
