"use client";

import { useState } from 'react';
import { mockUsers } from '../../../data/mockData';
import UserRow from '../../../components/admin/UserRow';

export default function AdminPeoplePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockUsers.length / itemsPerPage);

  const currentUsers = mockUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Pantauan Pengguna (People)
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
            Daftar semua siswa yang terdaftar di aplikasi.
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '800px' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr 1fr',
          padding: '16px 24px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {['Nama Lengkap', 'Email', 'Gender', 'Role', 'Aksi'].map(h => (
            <span key={h} style={{ color: '#ffffffff', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {currentUsers.map((user, idx) => (
          <UserRow key={user.id} user={user} isLastRow={idx === currentUsers.length - 1} />
        ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#a0a5b5', fontSize: '0.9rem', margin: 0 }}>
            Menampilkan <strong style={{ color: 'white' }}>{((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, mockUsers.length)}</strong> dari total <strong style={{ color: 'white' }}>{mockUsers.length}</strong> pengguna
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sebelumnya
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: 'white', fontWeight: 'bold' }}>
              {currentPage} / {totalPages}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255, 71, 126, 0.8)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
                border: currentPage === totalPages ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255, 71, 126, 0.5)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: currentPage === totalPages ? 'none' : '0 4px 10px rgba(255, 71, 126, 0.3)'
              }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
