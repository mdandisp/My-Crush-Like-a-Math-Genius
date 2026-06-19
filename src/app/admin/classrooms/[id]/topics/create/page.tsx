"use client";

import { useState } from "react";
import Link from "next/link";
import BackButton from "../../../../../../components/BackButton";
import { fetchApi } from "../../../../../../utils/api";
import { useParams } from "next/navigation";

export default function CreateTopicPage() {
  const params = useParams();
  const classroomId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    female_normal_dialog: "",
    male_normal_dialog: "",
    female_dating_dialog: "",
    male_dating_dialog: "",
    status: "",
    level_settings: {
      Easy: { plus: 10, minus: 0 },
      Medium: { plus: 20, minus: -5 },
      Hard: { plus: 30, minus: -10 },
    },
    max_attempts: 0,
    female_normal_img: null as File | null,
    male_normal_img: null as File | null,
    female_dating_img: null as File | null,
    male_dating_img: null as File | null,
  });

  const levelSettingsArray = Object.entries(formData.level_settings).map(
    ([level, value]) => ({
      level: level.toLowerCase(),
      true_score: value.plus,
      false_score: value.minus,
    }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Buat instance FormData
    const payload = new FormData();

    // 2. Masukkan field-field ke dalam FormData
    payload.append("classroom_id", classroomId);
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("female_normal_dialog", formData.female_normal_dialog);
    payload.append("male_normal_dialog", formData.male_normal_dialog);
    payload.append("female_dating_dialog", formData.female_dating_dialog);
    payload.append("male_dating_dialog", formData.male_dating_dialog);
    payload.append("status", formData.status);
    payload.append("level_settings", JSON.stringify(levelSettingsArray));
    payload.append("max_attempts", String(formData.max_attempts));

    // 3. Masukkan file jika ada
    if (formData.female_normal_img) {
      payload.append("female_normal_img", formData.female_normal_img);
    }

    if (formData.male_normal_img) {
      payload.append("male_normal_img", formData.male_normal_img);
    }

    if (formData.female_dating_img) {
      payload.append("female_dating_img", formData.female_dating_img);
    }

    if (formData.male_dating_img) {
      payload.append("male_dating_img", formData.male_dating_img);
    }

    try {
      // 4. Kirim ke API menggunakan fetch
      await fetchApi("/api/v1/topics", {
        method: "POST",
        body: payload,
        // Penting: Jangan set Content-Type secara manual saat menggunakan FormData
        // Browser akan otomatis menambahkan 'multipart/form-data' dengan boundary-nya
      });

      alert("Simpan topil berhasil!");
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

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    outline: "none",
    fontSize: "0.95rem",
  };

  const sectionStyle = {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  };

  const handleLevelChange = (
    level: "Easy" | "Medium" | "Hard",
    field: "plus" | "minus",
    val: string,
  ) => {
    setFormData({
      ...formData,
      level_settings: {
        ...formData.level_settings,
        [level]: {
          ...formData.level_settings[level],
          [field]: parseInt(val) || 0,
        },
      },
    });
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
            Buat Topik
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
              Nama Topik
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
              Deskripsi Topik
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
              Female Normal Dialog
            </label>
            <textarea
              placeholder="Tuliskan dialog normal..."
              value={formData.female_normal_dialog}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  female_normal_dialog: e.target.value,
                })
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
              Male Normal Dialog
            </label>
            <textarea
              placeholder="Tuliskan dialog normal..."
              value={formData.male_normal_dialog}
              onChange={(e) =>
                setFormData({ ...formData, male_normal_dialog: e.target.value })
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
              Female Dating Dialog
            </label>
            <textarea
              placeholder="Tuliskan dialog dating..."
              value={formData.female_dating_dialog}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  female_dating_dialog: e.target.value,
                })
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
              Male Dating Dialog
            </label>
            <textarea
              placeholder="Tuliskan dialog dating..."
              value={formData.male_dating_dialog}
              onChange={(e) =>
                setFormData({ ...formData, male_dating_dialog: e.target.value })
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
              Status
            </label>
            <input
              placeholder="Tuliskan status..."
              value={formData.status}
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
                resize: "vertical",
              }}
            />
          </div>

          <div style={sectionStyle}>
            <h2
              style={{
                color: "#22c55e",
                fontSize: "1.2rem",
                margin: "0 0 10px 0",
              }}
            >
              Pengaturan Skor per Level
            </h2>
            {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
              <div
                key={lvl}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "600",
                    textTransform: "capitalize",
                    fontSize: "1.1rem",
                  }}
                >
                  {lvl}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#22c55e",
                        minWidth: "60px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      + Benar:
                    </span>
                    <input
                      type="number"
                      style={inputStyle}
                      value={formData.level_settings[lvl].plus}
                      onChange={(e) =>
                        handleLevelChange(lvl, "plus", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#ef4444",
                        minWidth: "60px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      - Salah:
                    </span>
                    <input
                      type="number"
                      style={inputStyle}
                      value={formData.level_settings[lvl].minus}
                      onChange={(e) =>
                        handleLevelChange(lvl, "minus", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            ))}
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
              Max Attempts
            </label>
            <input
              type="number"
              min={1}
              style={inputStyle}
              value={formData.max_attempts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_attempts: parseInt(e.target.value) || 1,
                })
              }
              required
              disabled={isLoading}
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
              Female Normal Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  female_normal_img: e.target.files?.[0] || null,
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
              Male Normal Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  male_normal_img: e.target.files?.[0] || null,
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
              Female Dating Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  female_dating_img: e.target.files?.[0] || null,
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
              Male Dating Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  male_dating_img: e.target.files?.[0] || null,
                })
              }
              style={fileInputStyle}
            />
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
            Simpan Topik
          </button>
        </form>
      </div>
    </div>
  );
}
