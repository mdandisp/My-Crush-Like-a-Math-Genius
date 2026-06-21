"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProfileBadge from "../../components/ProfileBadge";
import { fetchApi } from "../../utils/api";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import JoinLayout from "../../components/dashboard/ClassroomJoinCard";
import TextInput from "../../components/auth/TextInput";
import { useRouter } from "next/navigation";

export default function ClassroomPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("Kode classroom wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await fetchApi("/api/v1/classrooms/join", {
        method: "POST",
        body: JSON.stringify({
          code: identifier.trim(),
        }),
      });

      toast.success(result.message || "Berhasil bergabung ke classroom.");

      // Kosongkan input
      setIdentifier("");

      // Jika ingin redirect setelah join
      router.push("/dashboard/classrooms");
    } catch (err: any) {
      let errorMsg = err.message || "Gagal bergabung ke classroom.";
      if (errorMsg.toLowerCase().includes("not found")) {
        errorMsg = "Kode kelas tidak ditemukan";
      }
      toast.error(errorMsg);
      console.log(err);
      console.log(err.response);
      console.log(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Ambil gender dan role pemain dari localStorage (diset saat daftar/login)
    setUserRole(localStorage.getItem("userRole") || "");
    const userRole = localStorage.getItem("userRole");

    if (
      userRole === "admin" ||
      userRole === "SUPER_ADMIN" ||
      userRole === "ADMIN"
    ) {
      setIsAdmin(true);
    }
  }, []);

  return (
    <main
      className="mobile-scroll-fix"
      style={{
        minHeight: "100vh",
        backgroundImage: 'url("/bg_kelas.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: "2rem",
      }}
    >
      {/* Dark overlay to make UI pop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 16, 21, 0.4)",
          zIndex: 0,
        }}
      ></div>

      <DashboardHeader
        isAdmin={isAdmin}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div
        className="mobile-dashboard-title"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "6rem",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            className="animate-fade-in"
            style={{
              fontSize: "2.5rem",
              color: "white",
              textShadow: "0 4px 15px rgba(255, 71, 126, 0.5)",
            }}
          >
            Join Classroom
          </h1>
        </div>

        {/* Classroom Join */}
        <JoinLayout title="Masuk" subtitle="Silahkan masuk ke classroom">
          <form
            onSubmit={handleJoin}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextInput
              label="Kode Classroom"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Masukan kode classroom"
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isSubmitting ? "#a0a5b5" : "#ff477e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                marginTop: "1rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 14px rgba(255, 71, 126, 0.4)",
              }}
            >
              {isSubmitting ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </JoinLayout>
      </div>
    </main>
  );
}
