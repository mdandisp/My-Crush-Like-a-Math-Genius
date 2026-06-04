"use client";

import Link from 'next/link';
import { charactersData } from '../../../data/mockData';

export default function AdminTopicsPage() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Manajemen Topik (Karakter)
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
            Kelola daftar karakter Waifu/Husbu, dialog, dan atribut permainan mereka.
          </p>
        </div>
        
        <Link href="/admin/topics/edit" style={{ textDecoration: 'none' }}>
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
            + Tambah Karakter
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {charactersData.map(char => (
          <div key={char.id} style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              height: '180px',
              backgroundColor: '#e8e0d8',
              backgroundImage: `url(${char.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}></div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>{char.name}</h3>
                <span style={{ 
                  backgroundColor: char.type === 'cewe' ? 'rgba(255, 71, 126, 0.2)' : 'rgba(59, 130, 246, 0.2)', 
                  color: char.type === 'cewe' ? '#ff477e' : '#3b82f6', 
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' 
                }}>
                  {char.type === 'cewe' ? 'Waifu' : 'Husbu'}
                </span>
              </div>
              <p style={{ color: '#a0a5b5', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>
                Konsep: <strong style={{ color: '#f0944d' }}>{char.concept}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/admin/topics/edit?id=${char.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '10px',
                    backgroundColor: 'transparent', color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    Edit Info
                  </button>
                </Link>
                <Link href={`/admin/topics/${char.id}/questions`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '10px',
                    backgroundColor: 'rgba(240, 148, 77, 0.2)', color: '#f0944d',
                    border: '1px solid rgba(240, 148, 77, 0.4)', borderRadius: '8px',
                    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 148, 77, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(240, 148, 77, 0.2)'}>
                    Kelola Soal
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
