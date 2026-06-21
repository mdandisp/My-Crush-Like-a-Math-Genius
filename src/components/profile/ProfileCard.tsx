interface ProfileCardProps {
  avatarUrl: string;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userName: string;
  handle: string;
  userRole: string;
  handleLogout: () => void;
}

export default function ProfileCard({
  avatarUrl, handleAvatarChange, userName, handle, userRole, handleLogout
}: ProfileCardProps) {
  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="file" 
          accept="image/*" 
          id="avatar-upload" 
          style={{ display: 'none' }} 
          onChange={handleAvatarChange} 
        />
        <div 
          onClick={() => document.getElementById('avatar-upload')?.click()}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundImage: `url("${avatarUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center',
            cursor: 'pointer', transition: 'filter 0.2s', position: 'relative', overflow: 'hidden'
          }}
          title="Klik untuk ubah foto"
          onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.7)'}
          onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
        >
          <div style={{ position: 'absolute', bottom: 5, fontSize: '0.6rem', fontWeight: 'bold', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '10px', opacity: 0.8 }}>
            Ubah
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>{userName}</h2>
        </div>
        <p style={{ color: '#ff477e', fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: '500' }}>{handle}</p>
        <p style={{ color: '#a0a5b5', fontSize: '1rem', marginBottom: '1.5rem', wordBreak: 'break-word', textAlign: 'center' }}>Level: 1 | Role : {userRole}</p>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 16px', backgroundColor: 'transparent', color: '#ef4444',
            border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
