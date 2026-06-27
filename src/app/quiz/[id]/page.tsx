"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, use, Suspense } from "react";
import toast from "react-hot-toast";
import { fetchApi } from "../../../utils/api";
import { mapTopicsToCharacters } from "../../../utils/characterMapper";
import QuizTopBanner from "../../../components/quiz/QuizTopBanner";
import QuestionDisplay from "../../../components/quiz/QuestionDisplay";
import AnswerGrid from "../../../components/quiz/AnswerGrid";
import QuizResultModal from "../../../components/quiz/QuizResultModal";
import CharacterModal from "../../../components/quiz/CharacterModal";
import { Character, TopicInfo, Question, AttemptSession } from "../../../types";

function QuizContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [character, setCharacter] = useState<any>(null);

  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "easy";
  const requestedCount = parseInt(searchParams.get("count") || "5");

  const [currentQ, setCurrentQ] = useState(0);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const [quizState, setQuizState] = useState<"info" | "playing" | "finished">(
    "info",
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // API States
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(requestedCount);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attemptDetails, setAttemptDetails] = useState<AttemptSession | null>(
    null,
  );

  // Pre-flight check
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const userGender = localStorage.getItem("userGender");
        const isFemale = userGender?.toLowerCase() === "female";

        // Fetch and Map Character
        const topicsRes = await fetchApi(`/api/v1/topics/${resolvedParams.id}`);
        const topic = topicsRes.data;

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
        if (topicsRes.data) {
          // 3. Map Topics to Characters
          setCharacter(character);
          // setAttempts(topic.max_attempts);
          // console.log(topic.max_attempts);
        } else {
          router.push("/dashboard");
        }

        // Fetch Topic Attempt Info
        const res = await fetchApi(
          `/api/v1/topics/${resolvedParams.id}/attempts/info`,
        );
        setTopicInfo(res.data);
      } catch (err: any) {
        toast.error(err.message || "Gagal mengambil info kuis");
        router.push("/dashboard");
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchInfo();
  }, [resolvedParams.id, router]);

  // Timer
  useEffect(() => {
    if (quizState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, timeLeft]);

  const handleTimeout = () => {
    toast.error("Waktu habis!");
    if (sessionId) fetchAttemptDetails(sessionId);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")} : ${sec.toString().padStart(2, "0")}`;
  };

  const startQuiz = async () => {
    setCorrectAnswer(0);
    if (topicInfo?.remaining_attempts === 0) {
      toast.error("Batas percobaan untuk kuis ini sudah habis.");
      return;
    }

    const levelSettings = topicInfo?.level_settings?.find(
      (l: any) => l.level === level,
    );
    if (levelSettings && requestedCount > levelSettings.remaining_questions) {
      toast.error(
        `Jumlah soal melebihi sisa soal (${levelSettings.remaining_questions})`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetchApi("/api/v1/attempts/start", {
        method: "POST",
        body: JSON.stringify({
          topicId: resolvedParams.id,
          level: level,
          requestedQuestions: requestedCount,
        }),
      });

      const session = res.data;
      setSessionId(session.id);

      const expiresAt = new Date(session.expiresAt).getTime();
      const now = new Date().getTime();
      const diffSeconds = Math.floor((expiresAt - now) / 1000);
      setTimeLeft(diffSeconds > 0 ? diffSeconds : 0);

      setQuizState("playing");
      setTotalQuestions(session.requestedQuestions);
      setCurrentQ(0);

      fetchNextQuestion(session.id);
    } catch (err: any) {
      toast.error(err.message || "Gagal memulai sesi kuis");
      setIsSubmitting(false);
    }
  };

  const fetchNextQuestion = async (sid: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetchApi(`/api/v1/attempts/${sid}/next-question`);
      if (res.data.isFinished) {
        fetchAttemptDetails(sid);
      } else {
        setCurrentQuestion(res.data.question);
        setSelectedAnswer(null);
      }
    } catch (err: any) {
      if (err.status === 400 && err.message === "Session Expired") {
        handleTimeout();
      } else {
        toast.error(err.message || "Gagal mengambil soal");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !sessionId || !currentQuestion) return;

    try {
      setIsSubmitting(true);
      const res = await fetchApi("/api/v1/attempts/submit-answer", {
        method: "POST",
        body: JSON.stringify({
          attemptSessionId: sessionId,
          questionId: currentQuestion.id,
          answerId: selectedAnswer,
        }),
      });

      const { isCorrect, isFinished, score: finalScore } = res.data;

      if (isCorrect) {
        setCorrectAnswer((prev) => prev + 1);
        toast.success("Jawaban Benar!");
      } else {
        toast.error("Jawaban Salah!");
      }

      if (isFinished) {
        fetchAttemptDetails(sessionId);
      } else {
        setCurrentQ((prev) => prev + 1);
        fetchNextQuestion(sessionId);
      }
    } catch (err: any) {
      if (err.status === 400 && err.message === "Session Expired") {
        handleTimeout();
      } else {
        toast.error(err.message || "Gagal mengirim jawaban");
      }
      setIsSubmitting(false);
    }
  };

  const fetchAttemptDetails = async (sid: string) => {
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      setQuizState("finished");
      const res = await fetchApi(`/api/v1/attempts/${sid}`);
      setAttemptDetails(res.data);
      setScore(res.data.score || 0);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengambil detail hasil kuis");
    }
  };

  if (!character)
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f1015" }}></div>
    );

  const totalQ = totalQuestions;
  const progressPercent =
    quizState === "finished" ? 100 : ((currentQ + 1) / totalQ) * 100;

  return (
    <main
      className="mobile-scroll-fix"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        backgroundImage: 'url("/bg_kelas.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
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

      <QuizTopBanner
        quizState={quizState}
        character={character}
        totalQ={totalQ}
        currentQ={currentQ}
        setShowCharacterModal={setShowCharacterModal}
      />

      {/* ====== MAIN CONTENT ====== */}
      <div
        className="quiz-main-content"
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          width: "100%",
          display: "flex",
          padding: "0.8rem 2rem",
          gap: "1.5rem",
          maxWidth: "1200px",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* ====== LEFT COLUMN: Timer + Character Card ====== */}
        <div
          className="quiz-left-col"
          style={{
            width: "280px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            minHeight: 0,
          }}
        >
          {/* Timer */}
          <div
            className="quiz-timer-card"
            style={{
              backgroundColor: "#ff477e",
              padding: "12px 20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(255, 71, 126, 0.4)",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "2rem",
                fontWeight: "800",
                letterSpacing: "4px",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Character Card - Desktop Only */}
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
            <div
              style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={character.image}
                alt={character.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            </div>
            {/* Affection Bar */}
            <div
              style={{
                height: "8px",
                backgroundColor: "rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: "30%",
                  height: "100%",
                  background: "linear-gradient(90deg, #ff477e, #ff6b9d)",
                  borderRadius: "0 4px 4px 0",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN: Question Area ====== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
          }}
        >
          {/* Mobile Speech Bubble to fill the gap */}
          {quizState === "info" && (
            <div
              className="mobile-only animate-fade-in"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backgroundColor: "rgba(30, 33, 48, 0.6)",
                backdropFilter: "blur(10px)",
                padding: "12px 15px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#e8e0d8",
                  backgroundImage: `url(${character.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  border: "2px solid #f0944d",
                  flexShrink: 0,
                }}
              ></div>
              <div>
                <h4
                  style={{
                    color: "#f0944d",
                    fontSize: "0.85rem",
                    margin: "0 0 4px 0",
                  }}
                >
                  {character.name}
                </h4>
                <p
                  style={{
                    color: "white",
                    fontSize: "0.9rem",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  "Ayo mulai kuisnya! Aku yakin kamu bisa."
                </p>
              </div>
            </div>
          )}

          {/* === INFO STATE === */}
          {quizState === "info" && (
            <div
              className="animate-fade-in quiz-info-state-container"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Info Card */}
              <div
                style={{
                  backgroundColor: "rgba(30, 33, 48, 0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "2.5rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minWidth: "350px",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  Informasi Soal
                </h2>

                {isLoadingInfo ? (
                  <p style={{ color: "#a0a5b5", textAlign: "center" }}>
                    Memuat info...
                  </p>
                ) : (
                  <div
                    style={{
                      color: "#a0a5b5",
                      fontSize: "1rem",
                      lineHeight: "2",
                    }}
                  >
                    <p>
                      📚 Topik:{" "}
                      <strong style={{ color: "white" }}>
                        {character.concept}
                      </strong>
                    </p>
                    <p>
                      ⚡ Tingkat Kesulitan:{" "}
                      <strong
                        style={{ color: "white", textTransform: "capitalize" }}
                      >
                        {level}
                      </strong>
                    </p>
                    <p>
                      📝 Jumlah Soal:{" "}
                      <strong style={{ color: "white" }}>{totalQ} soal</strong>
                    </p>
                    <p style={{ margin: "5px 0" }}>
                      🔄 Sisa Percobaan:{" "}
                      <strong
                        style={{
                          color:
                            (topicInfo?.remaining_attempts ?? 0) > 0
                              ? "#2ecc71"
                              : "#ff477e",
                        }}
                      >
                        {topicInfo?.remaining_attempts ?? "-"} kali
                      </strong>
                    </p>
                    <p>
                      🎯 Tipe:{" "}
                      <strong style={{ color: "white" }}>Pilihan Ganda</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                <Link
                  href={`/topic/${resolvedParams.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <button className="btn-secondary">Batal</button>
                </Link>
                <button
                  className="btn-primary"
                  onClick={startQuiz}
                  disabled={
                    isLoadingInfo ||
                    isSubmitting ||
                    topicInfo?.remaining_attempts === 0
                  }
                  style={{
                    opacity:
                      isLoadingInfo ||
                      isSubmitting ||
                      topicInfo?.remaining_attempts === 0
                        ? 0.5
                        : 1,
                  }}
                >
                  {isSubmitting ? "Memulai..." : "Mulai Sekarang"}
                </button>
              </div>
            </div>
          )}

          {/* === PLAYING STATE === */}
          {quizState === "playing" && currentQuestion && (
            <div
              className="animate-fade-in"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Question & Answers Card (Main Glass Container) */}
              <div
                className="quiz-question-container"
                style={{
                  backgroundColor: "rgba(30, 33, 48, 0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "1.5rem 2rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h3
                  className="quiz-question-title"
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  Soal Nomor {currentQ + 1}
                </h3>

                {/* Question Box (Cyan Border) */}
                <QuestionDisplay content={currentQuestion.content} />

                {/* Answer Options */}
                <AnswerGrid
                  options={currentQuestion.options}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Navigation Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  onClick={submitAnswer}
                  className="btn-primary"
                  disabled={!selectedAnswer || isSubmitting}
                  style={{
                    opacity: !selectedAnswer || isSubmitting ? 0.5 : 1,
                    cursor:
                      !selectedAnswer || isSubmitting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isSubmitting
                    ? "Mengirim..."
                    : currentQ === totalQ - 1
                      ? "Selesai"
                      : "Lanjut"}
                </button>
              </div>
            </div>
          )}

          {/* === FINISHED STATE === */}
          {quizState === "finished" && (
            <QuizResultModal
              correct={correctAnswer}
              score={score}
              totalQ={totalQ}
              timeLeft={timeLeft}
              formatTime={formatTime}
            />
          )}
        </div>
      </div>

      {/* Character Modal */}
      {showCharacterModal && (
        <CharacterModal
          character={character}
          setShowCharacterModal={setShowCharacterModal}
        />
      )}
    </main>
  );
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#0f1015",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          Memuat...
        </div>
      }
    >
      <QuizContent params={params} />
    </Suspense>
  );
}
