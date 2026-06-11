interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode | string;
  color: string;
}

export default function StatCard({ label, count, icon, color }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        width: '60px', height: '60px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        color: color
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>
          {label}
        </p>
        <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>
          {count}
        </h2>
      </div>
    </div>
  );
}
