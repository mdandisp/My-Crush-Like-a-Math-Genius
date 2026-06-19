"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { charactersData } from "../../../data/mockData";
import ProfileBadge from "../../../components/ProfileBadge";
import { fetchApi } from "../../../utils/api";
import { mapTopicsToCharacters } from "../../../utils/characterMapper";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import CharacterCard from "../../../components/dashboard/CharacterCard";
import { Character } from "../../../types";
import ClassroomCard from "../../../components/admin/ClassroomCard";

export default function ClassroomPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const result = await fetchApi("/api/v1/classrooms/me");
        setClassrooms(result.data || result || []);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data kelas");
      } finally {
        setLoading(false);
      }
    };

    const userRole = localStorage.getItem("data.roles");

    if (
      userRole === "admin" ||
      userRole === "SUPER_ADMIN" ||
      userRole === "ADMIN"
    ) {
      setIsAdmin(true);
    }

    console.log("userRole:", userRole);

    fetchClassrooms();
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
            My Classroom
          </h1>
        </div>

        {/* Classroom Selection */}
        <div className="animate-fade-in">
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
      </div>
    </main>
  );
}
