import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
    }}>
      {/* Dark overlay for the whole admin section to ensure readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.7)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="admin-layout-wrapper" style={{ zIndex: 1, display: 'flex', width: '100%' }}>
        <AdminSidebar />
        
        <main className="admin-main-content" style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
