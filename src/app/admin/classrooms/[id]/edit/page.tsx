"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackButton from "../../../../../components/BackButton";
import { fetchApi } from "../../../../../utils/api";

export default function editClassroomPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    enable_external_invite: false,
    status: "",
    cover_img: null as File | null,
    wallpaper_img: null as File | null,
  });
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingWallpaper, setExistingWallpaper] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [removeWallpaper, setRemoveWallpaper] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchClassroom = async () => {
      try {
        const result = await fetchApi(`/api/v1/classrooms/${id}`);
        const data = result.data || result;
        setFormData({
          id: data.id || "",
          name: data.name || "",
          description: data.description || "",
          enable_external_invite: !!data.is_external_invite_enable || !!data.enable_external_invite,
          status: data.status || "",
          cover_img: null,
          wallpaper_img: null,
        });
        setExistingCover(data.cover_img || null);
        setExistingWallpaper(data.wallpaper_img || null);
      } catch (error) {
        console.error("Gagal mengambil data kelas:", error);
        alert("Gagal memuat data kelas.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) return <div style={{ color: "white" }}>Memuat data...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Buat instance FormData
    const payload = new FormData();

    // 2. Masukkan field-field ke dalam FormData
    payload.append("id", formData.id);
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append(
      "is_external_invite_enable",
      String(formData.enable_external_invite),
    );
    payload.append("status", formData.status);

    // console.log("ID yang dikirim:", id);
    // console.log("URL lengkap:", `/api/v1/classrooms/${id}`);

    // 3. Masukkan file jika ada, atau tanda hapus
    if (formData.cover_img) {
      payload.append("cover_img", formData.cover_img);
    } else if (removeCover) {
      payload.append("delete_cover_img", "true");
    }

    if (formData.wallpaper_img) {
      payload.append("wallpaper_img", formData.wallpaper_img);
    } else if (removeWallpaper) {
      payload.append("delete_wallpaper_img", "true");
    }

    try {
      // 4. Kirim ke API menggunakan fetch
      await fetchApi(`/api/v1/classrooms/${id}`, {
        method: "PUT",
        body: payload,
      });

      alert("Update kelas berhasil!");
      window.location.href = "/admin/classrooms";
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.",
      )
    ) {
      return;
    }

    try {
      // Sesuaikan path jika endpoint delete kamu berbeda
      await fetchApi(`/api/v1/classrooms/${id}`, {
        method: "DELETE",
      });

      alert("Kelas berhasil dihapus!");
      window.location.href = "/admin/classrooms";
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus kelas.");
    }
  };

  const renderImageUpload = (
    label: string,
    existingUrl: string | null,
    newFile: File | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: () => void
  ) => {
    const previewUrl = newFile ? URL.createObjectURL(newFile) : existingUrl;

    return (
      <div>
        <label
          style={{
            display: "block",
            color: "#a0a5b5",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          {label}
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "160px",
            borderRadius: "12px",
            border: "2px dashed rgba(255,255,255,0.2)",
            backgroundColor: "rgba(0,0,0,0.3)",
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ff477e")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
        >
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  color: "white",
                  textAlign: "center",
                  padding: "20px 8px 8px 8px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                Ubah Gambar
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ef4444",
                  transition: "all 0.2s",
                  zIndex: 10,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                title="Hapus Gambar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </>
          ) : (
            <div style={{ color: "#a0a5b5", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px", opacity: 0.7 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>Pilih Gambar</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "4px" }}>PNG, JPG, WebP</div>
            </div>
          )}
          <input type="file" accept="image/*" onChange={onChange} style={{ display: "none" }} />
        </label>
      </div>
    );
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
            Edit Classroom
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

          <div>
            <label
              style={{
                display: "block",
                color: "#a0a5b5",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Status
            </label>
            <select
              value={formData.status} // Mengambil nilai string dari state
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
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
              <option value="" disabled>
                Pilih Status
              </option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIEVED">Archived</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {renderImageUpload(
              "Cover",
              existingCover,
              formData.cover_img,
              (e) => {
                setFormData({ ...formData, cover_img: e.target.files?.[0] || null });
                if (e.target.files?.[0]) setRemoveCover(false);
              },
              () => {
                setFormData({ ...formData, cover_img: null });
                setExistingCover(null);
                setRemoveCover(true);
              }
            )}
            
            {renderImageUpload(
              "Wallpaper",
              existingWallpaper,
              formData.wallpaper_img,
              (e) => {
                setFormData({ ...formData, wallpaper_img: e.target.files?.[0] || null });
                if (e.target.files?.[0]) setRemoveWallpaper(false);
              },
              () => {
                setFormData({ ...formData, wallpaper_img: null });
                setExistingWallpaper(null);
                setRemoveWallpaper(true);
              }
            )}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)"
          }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
              }}
            >
              Hapus Kelas
            </button>

            <button
              type="submit"
              style={{
                padding: "10px 24px",
                background: "linear-gradient(135deg, #ff477e, #ff6b9d)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 15px rgba(255, 71, 126, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 71, 126, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 71, 126, 0.3)";
              }}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
