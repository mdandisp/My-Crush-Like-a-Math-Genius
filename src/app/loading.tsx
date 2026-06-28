import GlobalSpinner from '../components/common/GlobalSpinner';

export default function GlobalLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f1015',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <GlobalSpinner message="MEMUAT..." isAbsolute={false} />
    </div>
  );
}
