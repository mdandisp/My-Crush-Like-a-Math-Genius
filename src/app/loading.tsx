export default function GlobalLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f1015',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255, 71, 126, 0.2)',
        borderTopColor: '#ff477e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{
        color: 'white',
        marginTop: '1rem',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        MEMUAT...
      </p>
    </div>
  );
}
