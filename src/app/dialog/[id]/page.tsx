"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { charactersData, mockDialogues } from '../../../data/mockData';

export default function DialogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const character = charactersData.find(c => c.id === resolvedParams.id);
  
  const [currentLine, setCurrentLine] = useState(0);
  const [dialogues, setDialogues] = useState<string[]>([]);

  useEffect(() => {
    if (!character) {
      router.push('/dashboard');
      return;
    }
    const lines = mockDialogues[character.id] || ["Mari kita mulai kuisnya!"];
    setDialogues(lines);
  }, [character, router]);

  const handleNext = () => {
    if (currentLine < dialogues.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.push(`/quiz/${resolvedParams.id}`);
    }
  };

  const handleSkip = () => {
    router.push(`/quiz/${resolvedParams.id}`);
  };

  if (!character || dialogues.length === 0) return null;

  return (
    <main 
      onClick={handleNext}
      style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      backgroundImage: 'url("/bg_dialog.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      {/* Skip Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleSkip(); }}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
          padding: '8px 24px', backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px',
          color: 'white', fontWeight: 'bold', cursor: 'pointer',
          backdropFilter: 'blur(5px)'
        }}
      >
        Lewati
      </button>

      {/* Character Image (Zoomed In Half-Body) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5
      }}>
        <img 
          src={character.image} 
          alt={character.name} 
          className="animate-fade-in"
          style={{
            position: 'absolute',
            bottom: '-35%', // Push the legs completely off screen
            left: '50%',
            transform: 'translateX(-50%)',
            height: '150%', // Enlarge the image
            objectFit: 'contain',
            objectPosition: 'bottom center'
          }}
        />
      </div>

      {/* Dialog Box Area */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1000px',
        zIndex: 10
      }}>
        {/* Name Plate */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#ff477e',
          color: 'white',
          padding: '8px 24px',
          borderRadius: '12px 12px 0 0',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
        }}>
          {character.name}
        </div>
        
        {/* Text Box */}
        <div style={{
          backgroundColor: 'rgba(30, 33, 48, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0 12px 12px 12px',
          padding: '2rem',
          minHeight: '150px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <p className="animate-fade-in" key={currentLine} style={{
            color: 'white',
            fontSize: '1.4rem',
            lineHeight: '1.6',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {dialogues[currentLine]}
          </p>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <span style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>
              Klik layar untuk lanjut ▶
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
