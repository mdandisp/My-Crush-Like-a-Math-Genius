import Link from "next/link";
import { Character } from "../../types";

interface CharacterCardProps {
  char: Character;
  index: number;
}

export default function CharacterCard({ char, index }: CharacterCardProps) {
  return (
    <Link
      href={`/topic/${char.topicId}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="quiz-character-card desktop-only"
        style={{
          animationDelay: `${index * 0.15}s`,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(4px)",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          border: "2px solid rgba(255,255,255,0.25)",
          width: "280px",
          height: "400px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        {/* Character Image */}
        <img
          src={char.image}
          alt={char.name}
          className="char-image-hover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Gradient overlay for text */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "linear-gradient(to top, rgba(15, 16, 21, 0.9), transparent)",
            zIndex: 2,
          }}
        ></div>

        {/* Name & Concept */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h3
            style={{ color: "white", fontSize: "1.5rem", marginBottom: "5px" }}
          >
            {char.topicName}
          </h3>
          {/* <span style={{
            backgroundColor: '#ff477e',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {char.topicName}
          </span> */}
        </div>
      </div>
    </Link>
  );
}
