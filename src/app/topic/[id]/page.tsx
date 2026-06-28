"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

import {
  charactersData,
  mockRanking,
  GAME_SETTINGS,
} from "../../../data/mockData";
import { getRankBadgeColor } from "../../../utils/helpers";
import BackButton from "../../../components/BackButton";
import ProfileBadge from "../../../components/ProfileBadge";
import { fetchApi } from "../../../utils/api";
import { mapTopicsToCharacters } from "../../../utils/characterMapper";

export default function TopicDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [character, setCharacter] = useState<any>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"detail" | "ranking">("detail");
  const [displayedChars, setDisplayedChars] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );
  const [questionCount, setQuestionCount] = useState<number | "">(5);
  const [attemptsInfo, setAttemptsInfo] = useState({
    max_attempts: 0,
    remaining_attempts: 0,
    current_attempts: 0,
  });
  const [levelSettings, setLevelSettings] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);

  const getDisplayName = (player: any) => {
    if (player.first_name) {
      return `${player.first_name} ${player.last_name || ''}`.trim();
    }
    return player.username || 'Pemain';
  };

  useEffect(() => {
    const loadTopicAndCharacter = async () => {
      // 1. Ambil target gender
      const userGender = localStorage.getItem("userGender");
      const isFemale = userGender?.toLowerCase() === "female";

      try {
        // 2. Fetch Topics from Backend
        const res = await fetchApi(`/api/v1/topics/${resolvedParams.id}`);

        const topic = res.data;

        const character = {
          id: topic.id,
          topicId: topic.id,
          topicName: topic.name,
          name: topic.name,
          info: topic.description,

          image: isFemale ? topic.male_normal_img : topic.female_normal_img,

          dialog: isFemale
            ? topic.male_normal_dialog
            : topic.female_normal_dialog,

          datingImage: isFemale
            ? topic.male_dating_img
            : topic.female_dating_img,

          datingDialog: isFemale
            ? topic.male_dating_dialog
            : topic.female_dating_dialog,
        };
        if (res.data) {
          // 3. Map Topics to Characters
          setCharacter(character);
          // setAttempts(topic.max_attempts);
          // console.log(topic.max_attempts);
        } else {
          router.push("/dashboard");
        }

        const attemptsRes = await fetchApi(
          `/api/v1/topics/${resolvedParams.id}/attempts/info`,
        );
        const attempts = attemptsRes.data;
        const attemptsInfo = {
          max_attempts: attempts.max_attempts,
          remaining_attempts: attempts.remaining_attempts,
        };

        setAttemptsInfo({
          max_attempts: attempts.max_attempts,
          remaining_attempts: attempts.remaining_attempts,
          current_attempts: attempts.current_attempts,
        });
        if (attempts.level_settings) {
          setLevelSettings(attempts.level_settings);
        }

        const cid = localStorage.getItem("classroomId") || "";
        if (cid) {
          const lbRes = await fetchApi(`/api/v1/leaderboard?classroomId=${cid}&topicId=${resolvedParams.id}`);
          if (lbRes.data) {
            setRankings(lbRes.data);
            
            // Cek apakah user saat ini adalah peringkat 1
            try {
              const userRes = await fetchApi('/api/v1/users/me');
              const currentUser = userRes.data;
              if (currentUser && lbRes.data.length > 0) {
                const rank1User = lbRes.data[0];
                if (rank1User.user_id === currentUser.id || rank1User.username === currentUser.username) {
                  setCharacter((prev: any) => ({
                    ...prev,
                    image: prev.datingImage || prev.image,
                    dialog: prev.datingDialog || prev.dialog
                  }));
                }
              }
            } catch (e) {
              console.warn("Gagal mengecek rank user:", e);
            }
          }
        }

        // setTopicInfo(attemptsRes.data);
      } catch (error) {
        console.error("Gagal memuat topik:", error);
        router.push("/dashboard");
      }
    };

    loadTopicAndCharacter();
  }, [resolvedParams.id, router]);

  // Get max questions for current difficulty from API or fallback to GAME_SETTINGS
  const getCurrentMaxQuestions = () => {
    if (levelSettings && levelSettings.length > 0) {
      const setting = levelSettings.find(
        (s) => s.level.toLowerCase() === difficulty.toLowerCase()
      );
      if (setting && typeof setting.remaining_questions === "number") {
        return setting.remaining_questions;
      }
    }
    return GAME_SETTINGS.questionLimits[difficulty];
  };

  const maxQuestions = getCurrentMaxQuestions();

  // Adjust question count if it exceeds new difficulty max
  useEffect(() => {
    if (typeof questionCount === "number" && questionCount > maxQuestions) {
      setQuestionCount(maxQuestions);
    }
  }, [difficulty, maxQuestions]);

  if (!character)
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f1015" }}></div>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage: 'url("/bg_kelas.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 16, 21, 0.3)",
          zIndex: 0,
        }}
      ></div>

      {/* Back button */}
      <BackButton
        href="/topic"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 10,
        }}
        className="mobile-abs-left"
      />

      {/* Profile Badge - Top Right */}
      <ProfileBadge
        name="Pemain 1"
        size="small"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
        }}
        className="mobile-abs-right"
      />

      {/* Title Banner - "Pilih Karakter" */}
      <div
        className="mobile-title-margin"
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "1.5rem",
          backgroundColor: "#f0944d",
          padding: "10px 50px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(240, 148, 77, 0.4)",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
            fontStyle: "italic",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Pilih Karakter
        </h1>
      </div>

      {/* Main Card Area */}
      <div
        className="topic-main-area"
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "800px",
          padding: "0 2rem",
          flex: 1,
        }}
      >
        {/* Center Card */}
        <div
          className="topic-center-card"
          style={{
            flex: 1,
            display: "flex",
            minHeight: "420px",
            gap: "1rem", // Add a little gap between the floating image and the right card
          }}
        >
          {/* Left: Character Image */}
          <div
            className="quiz-character-card desktop-only"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              border: "2px solid rgba(255,255,255,0.25)",
              flex: 1,
              flexDirection: "column",
              position: "relative",
            }}
          >
            <img
              src={character.image}
              alt={character.name}
              className="animate-fade-in"
              key={character.id}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
            {/* Affection Bar */}
            {/* <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              backgroundColor: 'rgba(0,0,0,0.15)',
              zIndex: 3
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                background: 'linear-gradient(90deg, #ff477e, #ff6b9d)',
                borderRadius: '0 4px 4px 0'
              }}></div>
            </div> */}
          </div>

          {/* Right: Tabs & Content */}
          <div
            className="topic-right-content"
            style={{
              width: "55%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Tab Buttons */}
            <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0" }}>
              <button
                onClick={() => setActiveTab("detail")}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  backgroundColor: activeTab === "detail" ? "#f0944d" : "#fff",
                  color: activeTab === "detail" ? "white" : "#999",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderRadius: activeTab === "detail" ? "0 0 8px 0" : "0",
                }}
              >
                Detail
              </button>
              <button
                onClick={() => setActiveTab("ranking")}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  backgroundColor: activeTab === "ranking" ? "#f0944d" : "#fff",
                  color: activeTab === "ranking" ? "white" : "#999",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderRadius: activeTab === "ranking" ? "0 0 0 8px" : "0",
                }}
              >
                Ranking
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
              {activeTab === "detail" ? (
                <div className="animate-fade-in" key="detail">
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      color: "#333",
                      marginBottom: "8px",
                      fontWeight: "700",
                    }}
                  >
                    {character.name}
                  </h3>
                  {character.info
                    .split(/(Hobi:[^.]*\.)/)
                    .map((part: string, i: number) =>
                      part.startsWith("Hobi:") ? (
                        <p
                          key={i}
                          style={{
                            fontWeight: "700",
                            color: "#f0944d",
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            margin: "10px 0",
                            padding: "8px 12px",
                            backgroundColor: "rgba(240, 148, 77, 0.08)",
                            borderLeft: "3px solid #f0944d",
                            borderRadius: "0 6px 6px 0",
                          }}
                        >
                          {part}
                        </p>
                      ) : part.trim() ? (
                        <p
                          key={i}
                          style={{
                            fontSize: "0.9rem",
                            color: "#777",
                            lineHeight: "1.7",
                            margin: "0",
                          }}
                        >
                          {part}
                        </p>
                      ) : null,
                    )}
                </div>
              ) : (
                <div
                  className="animate-fade-in"
                  key="ranking"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {rankings.length > 0 ? rankings.map((player, idx) => (
                    <div
                      key={player.user_id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        backgroundColor:
                          (player.rank || idx + 1) <= 3
                            ? "rgba(240, 148, 77, 0.08)"
                            : "transparent",
                      }}
                    >
                      {/* Rank Badge */}
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: getRankBadgeColor(player.rank || idx + 1),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          flexShrink: 0,
                        }}
                      >
                        {player.rank || idx + 1}
                      </div>
                      
                      {player.profile_picture_url && (
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          backgroundImage: `url(${player.profile_picture_url})`,
                          backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0
                        }}></div>
                      )}

                      {/* Name */}
                      <span
                        style={{
                          flex: 1,
                          fontSize: "0.85rem",
                          color: "#444",
                          fontWeight: "500",
                        }}
                      >
                        {getDisplayName(player)}
                      </span>
                      {/* Score */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span style={{ color: "#22c55e", fontSize: "0.8rem" }}>
                          ✓
                        </span>
                        <span style={{ color: "#444", fontWeight: "700" }}>
                          {(player.score || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: "center", color: "#888", fontSize: "0.9rem", marginTop: "1rem" }}>
                      Belum ada pemain di peringkat ini.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Level Selection & Mulai Button */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "1rem",
          backgroundColor: "rgba(30, 33, 48, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {attemptsInfo.current_attempts >= attemptsInfo.max_attempts ? (
          <div
            style={{
              color: "#ff477e",
              fontWeight: "bold",
              fontSize: "1.1rem",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            🚫 Anda telah mencapai batas maksimal attempt (
            {attemptsInfo.max_attempts} kali) untuk karakter ini.
          </div>
        ) : (
          <>
            <div
              style={{
                color: "white",
                fontWeight: "600",
                marginBottom: "-0.5rem",
              }}
            >
              Sisa Attempt:{" "}
              <span style={{ color: "#f0944d" }}>
                {attemptsInfo.remaining_attempts} / {attemptsInfo.max_attempts}
              </span>
            </div>

            {/* Difficulty Selection */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                backgroundColor: "rgba(255,255,255,0.05)",
                padding: "8px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  style={{
                    padding: "8px 24px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      difficulty === lvl ? "#ff477e" : "transparent",
                    color: difficulty === lvl ? "white" : "#e2e8f0",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      difficulty === lvl
                        ? "0 4px 12px rgba(255, 71, 126, 0.4)"
                        : "none",
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Question Count Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label
                style={{
                  color: "#a0a5b5",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Jumlah Soal:
              </label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? "" : parseInt(e.target.value);
                  setQuestionCount(val);
                }}
                min={1}
                max={maxQuestions}
                style={{
                  width: "80px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  textAlign: "center",
                }}
              />
              <span style={{ color: "#a0a5b5", fontSize: "0.8rem" }}>
                (Maks: {maxQuestions})
              </span>
            </div>

            {/* Mulai Button */}
            {typeof questionCount === "number" &&
            questionCount > 0 &&
            questionCount <= maxQuestions ? (
              <Link
                href={`/dialog/${resolvedParams.id}?level=${difficulty.toLowerCase()}&count=${questionCount}`}
                style={{ textDecoration: "none", marginTop: "0.5rem" }}
              >
                <button
                  className="btn-primary"
                  style={{ padding: "14px 60px", fontSize: "1.2rem" }}
                >
                  Mulai Kuis
                </button>
              </Link>
            ) : (
              <button
                disabled
                style={{
                  padding: "14px 60px",
                  fontSize: "1.2rem",
                  backgroundColor: "#555",
                  color: "#999",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "not-allowed",
                  marginTop: "0.5rem",
                }}
              >
                Jumlah Soal Tidak Valid
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
