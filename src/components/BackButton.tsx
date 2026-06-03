import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  style?: React.CSSProperties;
}

export default function BackButton({ href = "/", style }: BackButtonProps) {
  return (
    <Link href={href} style={{
      color: 'white', 
      textDecoration: 'none', 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      transition: 'all 0.2s',
      ...style
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}
