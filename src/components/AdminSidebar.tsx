"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Classrooms', path: '/admin/classrooms', icon: '🏫' },
    { name: 'Topics', path: '/admin/topics', icon: '🎮' },
    { name: 'People', path: '/admin/people', icon: '👥' },
    { name: 'Leaderboard', path: '/admin/leaderboard', icon: '🏆' },
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="mobile-only" style={{
        width: '100%',
        padding: '1rem 1.5rem',
        backgroundColor: 'rgba(15, 16, 21, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Admin Panel</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '8px', 
            padding: '8px 12px', 
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isMobileMenuOpen && (
        <div className="mobile-only animate-fade-in" style={{
          position: 'fixed', top: '4.5rem', left: '1rem', right: '1rem',
          backgroundColor: 'rgba(30, 33, 48, 0.98)',
          backdropFilter: 'blur(15px)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 40,
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {navItems.map((item) => {
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.path);
            return (
              <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255, 71, 126, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#ff477e' : 'white',
                  fontWeight: isActive ? '700' : '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Return to Dashboard
            </div>
          </Link>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
    <div className="admin-sidebar desktop-only" style={{
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
      <div className="admin-sidebar-logo" style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      <nav className="admin-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
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

      <div className="admin-sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
    </>
  );
}
