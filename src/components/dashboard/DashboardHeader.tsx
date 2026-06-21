"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileBadge from "../ProfileBadge";

interface DashboardHeaderProps {
  isAdmin: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function DashboardHeader({
  isAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Full width absolute header to reach corners */}
      <header
        className="mobile-dashboard-header"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          right: "2rem",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Profile Badge */}
        <ProfileBadge name="Pemain 1" level={1} size="medium" />

        {/* Desktop Nav */}
        <div
          className="desktop-nav"
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          {pathname !== "/dashboard" && (
            <Link
              href="/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s",
              }}
            >
              ➕ Join Classroom
            </Link>
          )}
          {pathname !== "/dashboard/classrooms" && (
            <Link
              href="/dashboard/classrooms"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s",
              }}
            >
              📚 My Classroom
            </Link>
          )}
          {pathname !== "/leaderboard" && (
            <Link
              href="/leaderboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s",
              }}
            >
              🏆 Leaderboard
            </Link>
          )}
          {isAdmin && pathname !== "/admin" && (
            <Link
              href="/admin"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                padding: "8px 18px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s",
              }}
            >
              ⚙️ Admin
            </Link>
          )}
        </div>

        {/* Mobile Burger Btn */}
        <button
          className="mobile-burger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "10px",
            color: "white",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: "5rem",
            right: "1rem",
            background: "rgba(30, 33, 48, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "0.5rem",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            minWidth: "180px",
          }}
        >
          {pathname !== "/dashboard" && (
            <Link
              href="/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              ➕ Join Classroom
            </Link>
          )}
          {pathname !== "/dashboard/classrooms" && (
            <Link
              href="/dashboard/classrooms"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              📚 My Classroom
            </Link>
          )}
          {pathname !== "/leaderboard" && (
            <Link
              href="/leaderboard"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              🏆 Leaderboard
            </Link>
          )}
          {isAdmin && pathname !== "/admin" && (
            <Link
              href="/admin"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              ⚙️ Admin
            </Link>
          )}
        </div>
      )}
    </>
  );
}
