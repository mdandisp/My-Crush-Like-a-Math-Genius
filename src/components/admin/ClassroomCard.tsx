import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
}

export default function ClassroomCard({ cls }: ClassroomCardProps) {
  const router = useRouter();
  return (
    <Link
      href={`/admin/classrooms/${cls.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
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
            {cls.codes.toUpperCase()}
          </p>
        </div>
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
            <strong style={{ color: "white" }}>{cls.teacher || "N/A"}</strong>
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
            <strong style={{ color: "white" }}>
              {cls.students || 0} siswa
            </strong>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div style={{ display: "flex", gap: "10px" }}>
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
            href={`/admin/leaderboard?classId=${cls.id}`}
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
              Leaderboard
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
}
