"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ClassroomCard from "../../../components/admin/ClassroomCard";
import { fetchApi } from "../../../utils/api";

export default function AdminClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const result = await fetchApi("/api/v1/classrooms");
        setClassrooms(result.data || result || []);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data kelas");
      } finally {
        setLoading(false);
      }
    };

    setUserRole(localStorage.getItem("userRole") || "");

    fetchClassrooms();
  }, []);

  if (loading) return <div style={{ color: "white" }}>Memuat kelas...</div>;
  if (error) return <div style={{ color: "#ff477e" }}>Error: {error}</div>;

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
            Kelola ruang kelas, lihat daftar murid, dan bagikan kode kelas.
          </p>
        </div>

        <Link
          href="/admin/classrooms/create"
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
            Buat Classroom
          </button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {classrooms.map((cls: any) => (
          <ClassroomCard key={cls.id} cls={cls} role={userRole} />
        ))}
      </div>
    </div>
  );
}
