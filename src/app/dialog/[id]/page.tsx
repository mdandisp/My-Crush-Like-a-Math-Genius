"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { charactersData, mockDialogues } from "../../../data/mockData";

import { mapTopicsToCharacters } from "../../../utils/characterMapper";
import { fetchApi } from "../../../utils/api";
import DialogBox from "../../../components/dialog/DialogBox";
import { Character } from "../../../types";

function DialogContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [character, setCharacter] = useState<any>(null);

  const [currentLine, setCurrentLine] = useState(0);
  const [dialogues, setDialogues] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "easy";
  const count = searchParams.get("count") || "5";

  useEffect(() => {
    const loadDialogData = async () => {
      const userGender = localStorage.getItem("userGender");
      const isFemale = userGender?.toLowerCase() === "female";

      try {
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

        setCharacter(character);

        setDialogues(
          character.dialog
            ? character.dialog.split("|")
            : ["Mari kita mulai kuisnya!"],
        );
      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      }
    };

    loadDialogData();
  }, [resolvedParams.id, router]);

  const handleNext = () => {
    if (currentLine < dialogues.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      localStorage.removeItem(`quizFinished_${resolvedParams.id}`);
      router.push(`/quiz/${resolvedParams.id}?level=${level}&count=${count}`);
    }
  };

  const handleSkip = () => {
    localStorage.removeItem(`quizFinished_${resolvedParams.id}`);
    router.push(`/quiz/${resolvedParams.id}?level=${level}&count=${count}`);
  };

  if (!character || dialogues.length === 0) return null;

  return (
    <main
      className="dialog-main"
      onClick={handleNext}
      style={{
        height: "100vh",
        maxHeight: "100vh",
        backgroundImage: 'url("/bg_dialog.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10,
          padding: "8px 24px",
          backgroundColor: "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "20px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          backdropFilter: "blur(5px)",
        }}
      >
        Lewati
      </button>

      {/* Character Image (Zoomed In Half-Body) */}
      <img
        src={character.image}
        alt={character.name}
        className="animate-fade-in dialog-char-img"
        style={{
          position: "absolute",
          top: "5%",
          left: "25%",
          transform: "translateX(-50%)",
          height: "140%",
          objectFit: "contain",
          objectPosition: "top center",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Dialog Box Area */}
      <DialogBox
        characterName={character.name}
        dialogueText={dialogues[currentLine]}
        currentLine={currentLine}
      />
    </main>
  );
}

export default function DialogPage({
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
          Memuat Dialog...
        </div>
      }
    >
      <DialogContent params={params} />
    </Suspense>
  );
}
