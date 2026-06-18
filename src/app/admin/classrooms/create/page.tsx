"use client";

import { useState } from "react";
import Link from "next/link";
import BackButton from "../../../../components/BackButton";
import { fetchApi } from "../../../../utils/api";

export default function CreateClassroomPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enable_external_invite: false,
    cover_img: null as File | null,
    wallpaper_img: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Buat instance FormData
    const payload = new FormData();

    // 2. Masukkan field-field ke dalam FormData
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append(
      "is_external_invite_enable",
      String(formData.enable_external_invite),
    );

    // 3. Masukkan file jika ada
    if (formData.cover_img) {
      payload.append("cover_img", formData.cover_img);
    }
    if (formData.wallpaper_img) {
      payload.append("wallpaper_img", formData.wallpaper_img);
    }

    try {
      // 4. Kirim ke API menggunakan fetch
      await fetchApi("/api/v1/classrooms", {
        method: "POST",
        body: payload,
        // Penting: Jangan set Content-Type secara manual saat menggunakan FormData
        // Browser akan otomatis menambahkan 'multipart/form-data' dengan boundary-nya
      });

      alert("Simpan kelas berhasil!");
      window.location.href = "/admin/classrooms";
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const fileInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#a0a5b5",
    cursor: "pointer",
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "700px" }}>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <BackButton href="/admin/classrooms" />
        </div>
        <div>
          <h1 style={{ color: "white", fontSize: "1.8rem", margin: 0 }}>
            Buat Classroom
          </h1>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                color: "#a0a5b5",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Nama Kelas
            </label>
            <input
              type="text"
              placeholder="Contoh: Kalkulus XII MIPA 1"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#a0a5b5",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Deskripsi Kelas
            </label>
            <textarea
              placeholder="Tuliskan deksripsi atau aturan kelas..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "#a0a5b5",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Enable External Invite
            </label>
            <select
              value={formData.enable_external_invite ? "yes" : "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  enable_external_invite: e.target.value === "yes",
                })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0a5b5",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Cover
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cover_img: e.target.files?.[0] || null,
                  })
                }
                style={fileInputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#a0a5b5",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Wallpaper
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wallpaper_img: e.target.files?.[0] || null,
                  })
                }
                style={fileInputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "1rem",
              padding: "14px",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#16a34a")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#22c55e")
            }
          >
            Simpan Classroom
          </button>
        </form>
      </div>
    </div>
  );
}
