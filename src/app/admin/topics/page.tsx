"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import TopicCard from '../../../components/admin/TopicCard';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/api/v1/topics')
      .then(res => {
        setTopics(res.data || []);
      })
      .catch(err => {
        toast.error('Gagal mengambil daftar topik: ' + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus topik "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await fetchApi(`/api/v1/topics/${id}`, { method: 'DELETE' });
        toast.success(`Topik "${name}" berhasil dihapus.`);
        setTopics(topics.filter(t => t.id !== id));
      } catch (err: any) {
        toast.error('Gagal menghapus topik: ' + err.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <AdminPageHeader 
        title="Manajemen Topik Soal"
        description="Kelola daftar materi topik matematika (seperti Limit, Integral) beserta pengaturannya."
        actionText="Tambah Topik Soal"
        actionHref="/admin/topics/edit"
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#a0a5b5' }}>Memuat daftar topik...</div>
      ) : topics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#a0a5b5', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
          Belum ada topik yang ditambahkan. Silakan klik "Tambah Topik Soal".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
