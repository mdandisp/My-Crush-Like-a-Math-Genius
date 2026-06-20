"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { charactersData } from "../../data/mockData";
import ProfileBadge from "../../components/ProfileBadge";
import { fetchApi } from "../../utils/api";
import { mapTopicsToCharacters } from "../../utils/characterMapper";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import CharacterCard from "../../components/dashboard/CharacterCard";
import { Character } from "../../types";

export default function DashboardPage() {
  const [targetGender, setTargetGender] = useState<"cewe" | "cowo">("cewe"); // cewe = Waifu, cowo = Husbu
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>(
    [],
  );

  useEffect(() => {
    // Ambil gender dan role pemain dari localStorage (diset saat daftar/login)
    const userGender = localStorage.getItem("userGender");
    const userRole = localStorage.getItem("userRole");

    if (
      userRole === "admin" ||
      userRole === "SUPER_ADMIN" ||
      userRole === "ADMIN"
    ) {
      setIsAdmin(true);
    }

    // Jika pemain perempuan, cari Husbu (cowo). Jika laki-laki, cari Waifu (cewe).
    const determinedGender =
      userGender && userGender.toLowerCase() === "female" ? "cowo" : "cewe";
    setTargetGender(determinedGender);

    const loadTopics = async () => {
      try {
        const classroomId = localStorage.getItem("classroomId");

        const res = await fetchApi(`/api/v1/topics?classroomId=${classroomId}`);

        if (res.data) {
          const mapped = mapTopicsToCharacters(res.data, determinedGender);
          setDisplayedCharacters(mapped);
        }
      } catch (err: any) {
        console.error("Gagal memuat topik:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTopics();
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
            Pilih Topik
          </h1>
        </div>

        {/* Character Selection */}
        <div
          className="dashboard-char-list"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {!isLoaded ? (
            <div
              style={{
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                marginTop: "4rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid rgba(255, 71, 126, 0.3)",
                  borderTopColor: "#ff477e",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontWeight: "500", letterSpacing: "1px" }}>
                Memuat Topik...
              </p>
            </div>
          ) : displayedCharacters.length === 0 ? (
            <div
              style={{ color: "white", textAlign: "center", marginTop: "2rem" }}
            >
              Belum ada topik yang tersedia.
            </div>
          ) : (
            displayedCharacters.map((char, index) => (
              <CharacterCard key={char.topicId} char={char} index={index} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
