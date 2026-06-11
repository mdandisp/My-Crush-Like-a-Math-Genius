"use client";

import Link from 'next/link';
import { mockClassrooms } from '../../../data/mockData';
import ClassroomCard from '../../../components/admin/ClassroomCard';

export default function AdminClassroomsPage() {
  return (
    <div className="animate-fade-in">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Manajemen Classroom
          </h1>
          <p style={{ color: '#a0a5b5', fontSize: '1rem' }}>
            Kelola ruang kelas, lihat daftar murid, dan bagikan kode kelas (Join Code).
          </p>
        </div>

        <Link href="/admin/classrooms/edit" style={{ textDecoration: 'none' }}>
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
            Buat Classroom
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {mockClassrooms.map(cls => (
          <ClassroomCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}
