import React from 'react';

interface GlobalSpinnerProps {
  message?: string;
  isAbsolute?: boolean;
}

export default function GlobalSpinner({ message = "Memuat...", isAbsolute = true }: GlobalSpinnerProps) {
  if (isAbsolute) {
    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.6)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}>
        <div style={{ position: 'relative', zIndex: 55, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 71, 126, 0.3)',
            borderTopColor: '#ff477e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: '500', letterSpacing: '1px' }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 71, 126, 0.3)',
        borderTopColor: '#ff477e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontWeight: '500', letterSpacing: '1px' }}>{message}</p>
    </div>
  );
}
