import Link from "next/link";

interface QuizResultModalProps {
  correct: number;
  score: number;
  totalQ: number;
  timeLeft: number;
  formatTime: (s: number) => string;
  topicId?: string;
}

export default function QuizResultModal({
  correct,
  score,
  totalQ,
  timeLeft,
  formatTime,
  topicId,
}: QuizResultModalProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Trophy Icon */}
      <Link
        href="/leaderboard"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          textDecoration: "none",
        }}
      >
        <div
          className="char-image-hover"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.15) translateY(-5px)";
            e.currentTarget.style.backgroundColor = "rgba(255, 71, 126, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
          }}
          title="Lihat Papan Peringkat"
        >
          🏆
        </div>
      </Link>

      {/* Glass results card */}
      <div
        style={{
          backgroundColor: "rgba(30, 33, 48, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "3rem",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>
          Kuis Selesai!
        </h2>
        <div
          style={{
            fontSize: "4rem",
            fontWeight: "800",
            color: "#ff477e",
            marginBottom: "0.5rem",
          }}
        >
          {correct}/{totalQ}
        </div>
        <p
          style={{
            color: "#a0a5b5",
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
          }}
        >
          Jawaban Benar
        </p>

        {/* Display Score */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#a0a5b5", fontSize: "0.9rem", margin: "0 0 5px 0" }}>Skor yang Diperoleh</p>
          <div style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "#FFD700",
            textShadow: "0 2px 10px rgba(255, 215, 0, 0.3)"
          }}>
            {score.toLocaleString()}
          </div>
        </div>
        <p style={{ color: "#a0a5b5", fontSize: "0.9rem" }}>
          Waktu tersisa: {formatTime(timeLeft)}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href={`/profile`} style={{ textDecoration: "none" }}>
          <button className="btn-secondary">Lihat Profil</button>
        </Link>
        {topicId && (
          <Link href={`/topic/${topicId}`} style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ backgroundColor: "#f0944d" }}>Main Lagi</button>
          </Link>
        )}
        <Link href={`/dashboard`} style={{ textDecoration: "none" }}>
          <button className="btn-primary">Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
