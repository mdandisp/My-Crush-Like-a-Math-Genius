import Link from 'next/link';

export default function LoadingPage() {
  return (
    <main style={{
      height: '100dvh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#0f1015'
    }}>
      {/* Background Image Layer (Scaled to hide cream borders) */}
      <div className="splash-bg-container" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url("/bg_splash.png")',
        zIndex: 0
      }}></div>

      {/* Content Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

      {/* Logo */}
      <div className="animate-fade-in" style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        width: '350px',
        maxWidth: '40vw'
      }}>
        <img
          src="/Logo.png"
          alt="My Crush Like a Math Genius Logo"
          style={{
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.4))'
          }}
        />
      </div>

      {/* Ketuk Untuk Mulai - matching mockup */}
      <div style={{
        position: 'absolute',
        bottom: '4rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <p className="animate-pulse" style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255, 71, 126, 0.5)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            Ketuk Untuk Mulai
          </p>
        </Link>
      </div>
      </div>
    </main>
  );
}
