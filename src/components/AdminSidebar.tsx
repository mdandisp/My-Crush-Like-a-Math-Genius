"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Classrooms', path: '/admin/classrooms', icon: '🏫' },
    { name: 'Topics', path: '/admin/topics', icon: '🎮' },
    { name: 'People', path: '/admin/people', icon: '👥' },
    { name: 'Leaderboard', path: '/admin/leaderboard', icon: '🏆' },
  ];

  return (
    <div style={{
      width: '260px',
      minHeight: '100vh',
      backgroundColor: 'rgba(15, 16, 21, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{
          color: 'white',
          fontSize: '1.4rem',
          fontWeight: '700',
          margin: 0,
          textShadow: '0 2px 10px rgba(255, 71, 126, 0.4)'
        }}>
          Admin Panel
        </h2>
        <img
          src="/favicon.ico"
          alt="App Logo"
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 15px rgba(255, 71, 126, 0.4))',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.path === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.path);

          return (
            <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#ff477e' : 'transparent',
                color: isActive ? 'white' : '#a0a5b5',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 12px rgba(255, 71, 126, 0.4)' : 'none'
              }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
