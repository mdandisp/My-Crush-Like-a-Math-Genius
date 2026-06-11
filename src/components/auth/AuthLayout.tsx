import Link from 'next/link';
import BackButton from '../BackButton';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthLayout({ title, subtitle, children, footerText, footerLinkText, footerLinkHref }: AuthLayoutProps) {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <BackButton href="/" style={{ marginBottom: '10px' }} />

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ color: '#ff477e', fontSize: '1.8rem', marginBottom: '0.2rem' }}>{title}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {subtitle}
          </p>

          {children}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            {footerText} <Link href={footerLinkHref} style={{ color: '#ff477e', textDecoration: 'none', fontWeight: '600' }}>{footerLinkText}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
