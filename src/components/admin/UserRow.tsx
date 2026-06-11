interface UserRowProps {
  user: any;
  isLastRow: boolean;
}

export default function UserRow({ user, isLastRow }: UserRowProps) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
      padding: '16px 24px',
      borderBottom: isLastRow ? 'none' : '1px solid rgba(255,255,255,0.05)',
      alignItems: 'center',
      transition: 'background-color 0.2s',
      cursor: 'default'
    }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', backgroundImage: 'url("/char-mc.png")', backgroundSize: 'cover', backgroundPosition: 'top' }}></div>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</span>
      </div>

      <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>{user.email}</span>

      <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>
        {user.gender === 'MALE' ? 'Laki-laki (♂)' : 'Perempuan (♀)'}
      </span>

      <span style={{
        display: 'inline-block',
        padding: '4px 10px', borderRadius: '20px',
        backgroundColor: user.role === 'admin' ? 'rgba(240, 148, 77, 0.2)' : 'rgba(34, 197, 94, 0.2)',
        color: user.role === 'admin' ? '#f0944d' : '#22c55e',
        fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: 'fit-content'
      }}>
        {user.role}
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '6px 12px', borderRadius: '6px',
          cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s'
        }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          Lihat
        </button>
      </div>
    </div>
  );
}
