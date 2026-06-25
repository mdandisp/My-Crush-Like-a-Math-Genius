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
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748b', backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}></div>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{displayName}</span>
        </div>

        <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>{email}</span>

        <span style={{ color: '#ffffffff', fontSize: '0.9rem' }}>
          {genderDisplay}
        </span>

        <span style={{
          display: 'inline-block',
          padding: '4px 10px', borderRadius: '20px',
          backgroundColor: role === 'admin' ? 'rgba(240, 148, 77, 0.2)' : 'rgba(34, 197, 94, 0.2)',
          color: role === 'admin' ? '#f0944d' : '#22c55e',
          fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: 'fit-content'
        }}>
          {role}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowDetail(true)}
            style={{
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

      {/* Detail Modal Portaled to Body */}
      {showDetail && mounted && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 9999
        }}
          onClick={() => setShowDetail(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1a1b23', borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '2rem', maxWidth: '420px', width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              transform: 'translateZ(0)' // Force GPU layer
            }}>
            {/* Avatar & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#64748b',
                backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'top',
                border: '3px solid rgba(255, 71, 126, 0.5)'
              }}></div>
              <div>
                <p style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', margin: '0 0 4px 0' }}>{displayName}</p>
                <p style={{ color: '#a0a5b5', fontSize: '0.85rem', margin: 0 }}>@{user.username || '-'}</p>
              </div>
            </div>

            {/* Detail Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Email', value: user.email || '-' },
                { label: 'Gender', value: genderDisplay },
                { label: 'Role', value: (user.role || '-').toUpperCase() },
                { label: 'User ID', value: user.user_id || user.id || '-' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <span style={{ color: '#a0a5b5', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDetail(false)}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '10px',
                backgroundColor: 'rgba(255, 71, 126, 0.8)', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: '600',
                cursor: 'pointer', fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 71, 126, 1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 71, 126, 0.8)'}>
              Tutup
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
