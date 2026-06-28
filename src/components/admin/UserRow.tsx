import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface UserData {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  name?: string;
  email?: string;
  gender?: string;
  role?: string;
  profile_picture_url?: string;
  user?: UserData;
}

interface UserRowProps {
  user: UserData;
  isLastRow: boolean;
}

export default function UserRow({ user, isLastRow }: UserRowProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const getDisplayName = (player: UserData) => {
    const p = player.user || player;
    if (p.first_name) {
      return `${p.first_name} ${p.last_name || ''}`.trim();
    }
    return p.username || p.name || 'Pengguna';
  };

  const displayName = getDisplayName(user);
  
  // Extract fields, checking both root level and nested user.user object
  const p = user.user || user;
  const avatarUrl = p.profile_picture_url || user.profile_picture_url || '/char-mc.png';
  const genderRaw = (p.gender || user.gender || '').toLowerCase();
  const genderDisplay = genderRaw === 'male' ? 'Laki-laki (♂)' : genderRaw === 'female' ? 'Perempuan (♀)' : '-';
  const email = p.email || user.email || '-';
  const role = p.role || user.role || '-';

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: '3fr 4fr 2fr',
        padding: '16px 24px',
        borderBottom: isLastRow ? 'none' : '1px solid rgba(255,255,255,0.05)',
        alignItems: 'center',
        transition: 'background-color 0.2s',
        cursor: 'default'
      }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}></div>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{displayName}</span>
        </div>

        <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>{email}</span>

        <span style={{
          display: 'inline-block',
          padding: '4px 10px', borderRadius: '20px',
          backgroundColor: role === 'admin' ? 'rgba(240, 148, 77, 0.2)' : 'rgba(34, 197, 94, 0.2)',
          color: role === 'admin' ? '#f0944d' : '#22c55e',
          fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: 'fit-content'
        }}>
          {role}
        </span>
      </div>
    </>
  );
}
