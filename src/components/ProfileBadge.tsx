interface ProfileBadgeProps {
  name?: string;
  level?: number;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}

export default function ProfileBadge({ name = "Pemain 1", level, size = 'medium', style }: ProfileBadgeProps) {
  const isSmall = size === 'small';
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
      backdropFilter: 'blur(10px)',
      padding: isSmall ? '8px 16px 8px 8px' : '10px 20px 10px 10px', 
      borderRadius: '50px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      ...style
    }}>
      <div style={{ 
        width: isSmall ? '40px' : '50px', 
        height: isSmall ? '40px' : '50px', 
        borderRadius: '50%', 
        backgroundColor: '#ccc',
        backgroundImage: 'url("/char-mc.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        marginRight: isSmall ? '12px' : '15px'
      }}></div>
      <div>
        <h3 style={{ fontSize: isSmall ? '0.85rem' : '1rem', color: 'white', marginBottom: '2px', marginTop: '0' }}>{name}</h3>
        {level !== undefined && level > 0 && <p style={{ fontSize: '0.75rem', color: '#ff477e', margin: 0 }}>Level {level}</p>}
      </div>
    </div>
  );
}
