import Link from 'next/link';

interface TopicData {
  id: string;
  name: string;
  max_attempts: number;
  level_settings?: any[];
}

interface TopicCardProps {
  topic: TopicData;
  onDelete: (id: string, name: string) => void;
}

export default function TopicCard({ topic, onDelete }: TopicCardProps) {
  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0, fontWeight: '700' }}>{topic.name}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
          <span style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>Batas Percobaan:</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{topic.max_attempts} kali</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
          <span style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>Pengaturan Level:</span>
          <span style={{ color: '#f0944d', fontWeight: 'bold', fontSize: '0.9rem' }}>{topic.level_settings?.length || 0} Level Aktif</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
        <Link href={`/admin/topics/edit?id=${topic.id}`} style={{ flex: 1, textDecoration: 'none', minWidth: '80px' }}>
          <button style={{
            width: '100%', padding: '8px',
            backgroundColor: 'transparent', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Edit
          </button>
        </Link>
        <Link href={`/admin/topics/${topic.id}/questions`} style={{ flex: 1, textDecoration: 'none', minWidth: '80px' }}>
          <button style={{
            width: '100%', padding: '8px',
            backgroundColor: 'rgba(240, 148, 77, 0.2)', color: '#f0944d',
            border: '1px solid rgba(240, 148, 77, 0.4)', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 148, 77, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 148, 77, 0.2)'}>
            Soal
          </button>
        </Link>
        <button 
          onClick={() => onDelete(topic.id, topic.name)}
          style={{
            flex: 1, padding: '8px', minWidth: '80px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}>
          Hapus
        </button>
      </div>
    </div>
  );
}
