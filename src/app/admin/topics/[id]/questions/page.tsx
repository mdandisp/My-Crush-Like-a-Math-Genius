"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "../../../../../utils/api";
import BackButton from "../../../../../components/BackButton";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import ClickToEditMath from "../../../../../components/admin/ClickToEditMath";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface QuestionDraft {
  id?: string;
  content: string;
  level: "Easy" | "Medium" | "Hard";
  timeLimit: number;
  options: string[];
  correct_index: number;
}

export default function EditQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [topicName, setTopicName] = useState<string>("");
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllQuestions = async (topicId: string) => {
    let page = 1;
    const allQuestions = [];

    while (true) {
      const res = await fetchApi(
        `/api/v1/questions?topicId=${topicId}&page=${page}`,
      );

      const data = res.data || [];

      if (data.length === 0) break;

      allQuestions.push(...data);
      page++;
    }

    return allQuestions;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('classroomId');
    if (cId) setClassroomId(cId);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Topic Name
        const topicRes = await fetchApi(`/api/v1/topics/${resolvedParams.id}`);
        if (topicRes.data) {
          setTopicName(topicRes.data.name || "");
        }

        // Fetch existing questions
        // const qRes = await fetchApi(`/api/v1/questions?topicId=${resolvedParams.id}`);
        // const existingQuestions = qRes.data || [];
        const existingQuestions = await fetchAllQuestions(resolvedParams.id);

        const mappedQuestions: QuestionDraft[] = existingQuestions.map(
          (q: any) => {
            let correctIdx = 0;
            const opts = q.options?.map((opt: any, idx: number) => {
              if (opt.is_correct) correctIdx = idx;
              return opt.content;
            }) || ["", "", "", ""];

            // Ensure we have 4 options
            while (opts.length < 4) opts.push("");

            return {
              id: q.id,
              content: q.content,
              level: (q.level
                ? q.level.charAt(0).toUpperCase() +
                  q.level.slice(1).toLowerCase()
                : "Easy") as "Easy" | "Medium" | "Hard",
              timeLimit: q.time_limit || 30,
              options: opts,
              correct_index: correctIdx,
            };
          },
        );

        if (mappedQuestions.length > 0) {
          setQuestions(mappedQuestions);
        } else {
          setQuestions([
            {
              content: "",
              level: "Easy",
              timeLimit: 30,
              options: ["", "", "", ""],
              correct_index: 0,
            },
          ]);
        }
      } catch (err: any) {
        toast.error("Gagal memuat data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [resolvedParams.id]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: "",
        level: "Easy",
        timeLimit: 30,
        options: ["", "", "", ""],
        correct_index: 0,
      },
    ]);
    setActiveTab(questions.length);
  };

  const handleUpdate = (field: keyof QuestionDraft, value: any) => {
    const updated = [...questions];
    updated[activeTab] = { ...updated[activeTab], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...questions];
    updated[activeTab].options[idx] = value;
    setQuestions(updated);
  };

  const handleDelete = async (idx: number) => {
    const q = questions[idx];

    try {
      if (q.id) {
        await fetchApi(`/api/v1/questions/${q.id}`, {
          method: "DELETE",
        });
      }

      const updated = questions.filter((_, i) => i !== idx);
      setQuestions(updated);
      setActiveTab(Math.max(0, idx - 1));

      toast.success("Soal berhasil dihapus");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);

    try {
      for (const q of questions) {
        const payload = {
          content: q.content,
          level: q.level.toLowerCase(),
          timeLimit: q.timeLimit,
          topicId: resolvedParams.id,
          options: q.options.map((opt, idx) => ({
            content: opt,
            isCorrect: idx === q.correct_index,
          })),
        };

        if (q.id) {
          // UPDATE
          await fetchApi(`/api/v1/questions/${q.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
        } else {
          // CREATE
          await fetchApi("/api/v1/questions/batch", {
            method: "POST",
            body: JSON.stringify({
              topicId: resolvedParams.id,
              level: q.level.toLowerCase(),
              questions: [
                {
                  content: q.content,
                  timeLimit: q.timeLimit,
                  options: q.options.map((opt, idx) => ({
                    content: opt,
                    isCorrect: idx === q.correct_index,
                  })),
                },
              ],
            }),
          });
        }
      }

      toast.success("Berhasil menyimpan!");

      // reload supaya id soal baru ikut terisi
      const refreshed = await fetchAllQuestions(resolvedParams.id);

      const mapped = refreshed.map((q: any) => {
        let correctIdx = 0;

        const opts = q.options?.map((o: any, idx: number) => {
          if (o.is_correct) correctIdx = idx;
          return o.content;
        }) ?? ["", "", "", ""];

        while (opts.length < 4) opts.push("");

        return {
          id: q.id,
          content: q.content,
          level: (q.level.charAt(0).toUpperCase() +
            q.level.slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard",
          timeLimit: q.time_limit,
          options: opts,
          correct_index: correctIdx,
        };
      });

      setQuestions(mapped);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const activeQ = questions[activeTab];
  const characterName = topicName || resolvedParams.id.replace(/-/g, " ");

  if (isLoading && questions.length === 0) {
    return <div style={{ color: "white", padding: "2rem" }}>Memuat...</div>;
  }

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", gap: "2rem", height: "100%" }}
    >
      {/* Sidebar untuk Daftar Soal */}
      <div
        style={{
          width: "320px",
          backgroundColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <BackButton
            href={classroomId ? `/admin/classrooms/${classroomId}` : "/admin/classrooms/"}
            style={{ marginBottom: "1rem" }}
          />
          <h2 style={{ color: "white", fontSize: "1.2rem", margin: 0 }}>
            Kelola Soal
          </h2>
          <div
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "4px 12px",
              backgroundColor: "rgba(240, 148, 77, 0.2)",
              border: "1px solid rgba(240, 148, 77, 0.4)",
              borderRadius: "20px",
              color: "#f0944d",
              fontSize: "0.85rem",
              fontWeight: "bold",
              textTransform: "capitalize",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            📚 Topik: {characterName}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {questions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "12px",
                backgroundColor:
                  activeTab === idx
                    ? "rgba(255, 71, 126, 0.2)"
                    : "rgba(255,255,255,0.03)",
                border:
                  activeTab === idx
                    ? "1px solid #ff477e"
                    : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "white", fontWeight: "bold" }}>
                  Soal {idx + 1}
                </span>
                <span style={{ color: "#f0944d", fontSize: "0.8rem" }}>
                  {q.level}
                </span>
              </div>
              <div
                style={{
                  color: "#a0a5b5",
                  fontSize: "0.85rem",
                  margin: 0,
                  maxHeight: "3rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {q.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {q.content.replace(/\$\$/g, '$').replace(/\\\\/g, '\\')}
                  </ReactMarkdown>
                ) : (
                  "Kosong..."
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "transparent",
              border: "2px dashed rgba(255,255,255,0.2)",
              color: "white",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            + Tambah Soal
          </button>
        </div>
      </div>

      {/* Area Utama Editor Soal (Gaya Quizizz) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {questions.length > 0 && activeQ ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => handleDelete(activeTab)}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                Hapus Soal
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isLoading ? "#a0a5b5" : "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 15px rgba(34, 197, 94, 0.3)",
                }}
              >
                {isLoading ? "Menyimpan..." : "Simpan Semua"}
              </button>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "2rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Toolbar Atas */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <select
                  value={activeQ.level}
                  onChange={(e) => handleUpdate("level", e.target.value)}
                  disabled={isLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    outline: "none",
                  }}
                >
                  <option value="Easy">Level: Easy</option>
                  <option value="Medium">Level: Medium</option>
                  <option value="Hard">Level: Hard</option>
                </select>
                <select
                  value={activeQ.timeLimit}
                  onChange={(e) =>
                    handleUpdate("timeLimit", parseInt(e.target.value))
                  }
                  disabled={isLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    outline: "none",
                  }}
                >
                  <option value={10}>10 detik</option>
                  <option value={20}>20 detik</option>
                  <option value={30}>30 detik</option>
                  <option value={45}>45 detik</option>
                  <option value={60}>60 detik</option>
                  <option value={120}>120 detik</option>
                </select>
              </div>

              {/* Teks Soal */}
              <div style={{ display: "flex", flex: 1, minHeight: "150px" }}>
                <ClickToEditMath
                  value={activeQ.content}
                  onChange={(val) => handleUpdate("content", val)}
                  disabled={isLoading}
                  placeholder="Ketik pertanyaan Anda di sini... (gunakan $ $ untuk matematika inline, atau block $$ $$)"
                  autoFormatKatex={false}
                  style={{
                    height: "100%",
                    minHeight: "150px",
                    fontSize: "1.2rem",
                  }}
                />
              </div>

              {/* Pilihan Ganda */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  flex: 1,
                }}
              >
                {activeQ.options.map((opt, idx) => {
                  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
                  const isCorrect = activeQ.correct_index === idx;

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: colors[idx],
                        borderRadius: "12px",
                        padding: "4px",
                        opacity: isCorrect ? 1 : 0.8,
                        boxShadow: isCorrect ? `0 0 0 4px white` : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Checkbox Jawaban Benar */}
                      <div
                        onClick={() =>
                          !isLoading && handleUpdate("correct_index", idx)
                        }
                        style={{
                          width: "40px",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          borderRight: "1px solid rgba(255,255,255,0.2)",
                        }}
                        title="Tandai sebagai jawaban benar"
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid white",
                            backgroundColor: isCorrect
                              ? "white"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isCorrect && (
                            <span
                              style={{
                                color: colors[idx],
                                fontWeight: "bold",
                                fontSize: "0.9rem",
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Input Jawaban */}
                      <ClickToEditMath
                        value={opt}
                        onChange={(val) => handleOptionChange(idx, val)}
                        disabled={isLoading}
                        placeholder={`Tambahkan opsi jawaban...`}
                        autoFormatKatex={true}
                        style={{
                          flex: 1,
                          height: "100px",
                          backgroundColor: "transparent",
                          border: "none",
                          fontSize: "1.1rem",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a0a5b5",
            }}
          >
            Belum ada soal. Klik + Tambah Soal.
          </div>
        )}
      </div>
    </div>
  );
}
