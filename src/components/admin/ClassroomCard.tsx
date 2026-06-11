import Link from 'next/link';

interface ClassroomCardProps {
  cls: any;
}

export default function ClassroomCard({ cls }: ClassroomCardProps) {
  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'transform 0.2s, boxShadow 0.2s',
      cursor: 'default'
    }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>{cls.name}</h3>

      <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem' }}>
        <p style={{ color: '#a0a5b5', fontSize: '0.8rem', margin: 0 }}>Join Code:</p>
        <p style={{ color: '#f0944d', fontSize: '1.2rem', margin: 0, fontWeight: 'bold', letterSpacing: '2px' }}>
          {cls.id.toUpperCase()}-X9
        </p>
      </div>

      <p style={{ color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>👨‍🏫</span> Guru: <strong style={{ color: 'white' }}>{cls.teacher}</strong>
      </p>
      <p style={{ color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>👥</span> Murid: <strong style={{ color: 'white' }}>{cls.students} siswa</strong>
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href={`/admin/classrooms/edit?id=${cls.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Edit
          </button>
        </Link>
        <Link href={`/admin/leaderboard?classId=${cls.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: '#22c55e',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}>
            Leaderboard
          </button>
        </Link>
      </div>
    </div>
  );
}
