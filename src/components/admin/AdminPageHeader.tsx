import Link from 'next/link';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export default function AdminPageHeader({ title, description, actionText, actionHref }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
          {title}
        </h1>
        <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
          {description}
        </p>
      </div>

      {actionText && actionHref && (
        <Link href={actionHref} style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#ff477e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 71, 126, 0.4)',
            transition: 'all 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            {actionText}
          </button>
        </Link>
      )}
    </div>
  );
}
