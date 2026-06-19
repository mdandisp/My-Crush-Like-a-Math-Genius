"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "../../../../utils/api";
import toast from "react-hot-toast";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader";
import TopicCard from "../../../../components/admin/TopicCard";
import { useParams } from "next/navigation";

export default function AdminTopicsPage() {
  const { id } = useParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // 1. Ambil SEMUA topik (karena endpoint ini yang berhasil)
    fetchApi("/api/v1/topics")
      .then((res) => {
        // 2. Filter data berdasarkan classroom_id yang ada di URL (id)
        const allTopics = res.data || [];
        const filteredTopics = allTopics.filter(
          (topic: any) => topic.classroom_id === id,
        );

        setTopics(filteredTopics);
      })
      .catch((err) => {
        toast.error("Gagal mengambil daftar topik: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]); // Tambahkan [id] agar data ter-refresh jika pindah kelas

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus topik "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      try {
        await fetchApi(`/api/v1/topics/${id}`, { method: "DELETE" });
        toast.success(`Topik "${name}" berhasil dihapus.`);
        setTopics(topics.filter((t) => t.id !== id));
      } catch (err: any) {
        toast.error("Gagal menghapus topik: " + err.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        className="admin-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              color: "white",
              fontSize: "2rem",
              marginBottom: "0.5rem",
              fontWeight: "700",
            }}
          >
            Manajemen Classroom
          </h1>
          <p style={{ color: "#a0a5b5", fontSize: "1rem" }}>
            Kelola ruang kelas, lihat daftar murid, dan peringkat kelas.
          </p>
        </div>

        <Link
          href={`/admin/classrooms/${id}/topics/create`} // Gunakan backtick dan path yang benar
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#ff477e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Buat Topik
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#a0a5b5" }}>
          Memuat daftar topik...
        </div>
      ) : topics.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#a0a5b5",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: "12px",
          }}
        >
          Belum ada topik yang ditambahkan. Silakan klik "Tambah Topik Soal".
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
