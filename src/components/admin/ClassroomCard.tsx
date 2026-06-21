import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchApi } from "../../utils/api";

interface ClassroomCardProps {
  cls: {
    id: string;
    name: string;
    description: string;
    codes: string;
    wallpaper_img?: string; // URL wallpaper
    teacher?: string;
    students?: number;
  };
  role: string;
}

export default function ClassroomCard({ cls, role }: ClassroomCardProps) {
  const router = useRouter();

  const [teacher, setTeacher] = useState(cls.teacher || "N/A");
  const [studentsCount, setStudentsCount] = useState(cls.students || 0);

  useEffect(() => {
    if (!cls.teacher || cls.students === undefined) {
      const fetchMembers = async () => {
        try {
          const res = await fetchApi(`/api/v1/classrooms/${cls.id}/members`);
          if (res.data) {
            const members = res.data;
            let sCount = 0;
            let tName = "N/A";
            members.forEach((m: any) => {
              const role = (m.role || "").toLowerCase();
              if (role === "student") sCount++;
              if (role === "teacher" || role === "owner" || role === "admin") {
                tName = m.first_name ? `${m.first_name} ${m.last_name || ""}`.trim() : (m.username || "Teacher");
              }
            });
            setTeacher(tName);
            setStudentsCount(sCount);
          }
        } catch (e) {
          console.error("Failed to fetch classroom members", e);
        }
      };
      fetchMembers();
    }
  }, [cls.id, cls.teacher, cls.students]);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: "1.5rem",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden", // Agar gambar tidak keluar dari radius
        transition: "transform 0.2s",
        cursor: "default",
        // Menambahkan Wallpaper di belakang
        backgroundImage: cls.wallpaper_img
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${cls.wallpaper_img})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Konten Card */}
      <h3
        style={{
          color: "white",
          fontSize: "1.3rem",
          marginBottom: "8px",
          zIndex: 1,
          position: "relative",
        }}
      >
        {cls.name}
      </h3>

      <p
        style={{
          color: "#a0a5b5",
          fontSize: "0.85rem",
          minHeight: "40px",
        }}
      >
        {cls.description || "Tidak ada deskripsi"}
      </p>

      {/* Info Tambahan dengan Icon */}

      {role !== "user" && (
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p style={{ color: "#a0a5b5", fontSize: "0.8rem", margin: 0 }}>
            Join Code:
          </p>

          <p
            style={{
              color: "#f0944d",
              fontSize: "1.2rem",
              margin: 0,
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {cls.codes}
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            color: "#a0a5b5",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>👨‍🏫</span> Guru:{" "}
          <strong style={{ color: "white" }}>{teacher}</strong>
        </div>
        <div
          style={{
            color: "#a0a5b5",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>👥</span> Murid:{" "}
          <strong style={{ color: "white" }}>{studentsCount} siswa</strong>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div style={{ display: "flex", gap: "10px" }}>
        {role === "user" ? (
          <button
            onClick={() => {
              localStorage.setItem("classroomId", cls.id);
              router.push("/topic");
            }}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Masuk
          </button>
        ) : (
          <>
            <Link
              href={`/admin/classrooms/${cls.id}/edit`}
              style={{ flex: 1, textDecoration: "none" }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </Link>

            <Link
              href={`/admin/classrooms/${cls.id}`}
              style={{ flex: 1, textDecoration: "none" }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Detail
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
