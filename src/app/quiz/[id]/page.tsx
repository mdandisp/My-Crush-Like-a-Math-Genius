"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, use } from 'react';

const charactersData: Record<string, any> = {
  'lin-yu': { name: 'Lin Yu', concept: 'Integral', image: '/lin-yu.png' },
  'sato-shun': { name: 'Sato Shun', concept: 'Limit', image: '/sato-shun.png' },
  'deryck': { name: 'Deryck Thompson', concept: 'Turunan', image: '/deryck.png' },
  'mei-lian': { name: 'Mei Lian', concept: 'Integral', image: '/mei-lian.png' },
  'kisaragi-rei': { name: 'Kisaragi Rei', concept: 'Limit', image: '/kisaragi-rei.png' },
  'scarlett-hayes': { name: 'Scarlett Hayes', concept: 'Turunan', image: '/scarlett-hayes.png' }
};

// Mock soal kalkulus
const mockQuestions = [
  {
    id: 1,
    question: 'Tentukan turunan dari f(x) = 3x² + 2x - 5',
    options: ['6x + 2', '3x + 2', '6x - 5', '6x² + 2', '3x² + 2x'],
    correct: 0
  },
  {
    id: 2,
    question: 'Tentukan ∫ 4x³ dx',
    options: ['x⁴ + C', '4x⁴ + C', '12x² + C', '4x² + C', 'x³ + C'],
    correct: 0
  },
  {
    id: 3,
    question: 'Berapa nilai limit: lim(x→2) (x² - 4)/(x - 2)?',
    options: ['0', '2', '4', '∞', 'Tidak ada'],
    correct: 2
  },
  {
    id: 4,
    question: 'Tentukan turunan dari f(x) = sin(2x)',
    options: ['cos(2x)', '2cos(2x)', '-2cos(2x)', '2sin(2x)', '-sin(2x)'],
    correct: 1
  },
  {
    id: 5,
    question: 'Tentukan ∫ e^x dx',
    options: ['xe^x + C', 'e^(x+1) + C', 'e^x + C', 'ln(x) + C', 'e^x / x + C'],
    correct: 2
  }
];

const optionColors = ['#ff69b4', '#ff1493', '#00bfff', '#ffb347', '#2ecc71'];

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const character = charactersData[resolvedParams.id];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(mockQuestions.length).fill(null));
  const [quizState, setQuizState] = useState<'info' | 'playing' | 'finished'>('info');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!character) {
      router.push('/dashboard');
    }
  }, [character, router]);

  // Timer
  useEffect(() => {
    if (quizState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quizState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    setQuizState('playing');
  };

  const selectAnswer = (optIdx: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQ] = optIdx;
    setSelectedAnswers(newAnswers);
  };

  const goNext = () => {
    if (currentQ < mockQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz();
    }
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0;
    selectedAnswers.forEach((ans, i) => {
      if (ans === mockQuestions[i].correct) correct++;
    });
    setScore(correct);
    setQuizState('finished');
  };

  if (!character) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1015' }}></div>;

  const totalQ = mockQuestions.length;
  const progressPercent = quizState === 'finished' ? 100 : ((currentQ + 1) / totalQ) * 100;

  return (
    <main style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.3)',
        zIndex: 0
      }}></div>

      {/* ====== TOP: Banner Topik ====== */}
      <div style={{ 
        position: 'relative', 
        zIndex: 5, 
        marginTop: '0.8rem',
        backgroundColor: '#f0944d',
        padding: '10px 60px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(240, 148, 77, 0.4)'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          fontStyle: 'italic',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {quizState === 'finished' ? 'Selesai' : character.concept}
        </h1>
      </div>

      {/* ====== Progress Bar (dashed) ====== */}
      <div style={{ 
        position: 'relative', 
        zIndex: 5, 
        width: '70%', 
        maxWidth: '700px',
        marginTop: '6px',
        display: 'flex',
        gap: '6px'
      }}>
        {Array.from({ length: totalQ }).map((_, i) => (
          <div key={i} style={{ 
            flex: 1, 
            height: '6px', 
            borderRadius: '3px',
            backgroundColor: i <= currentQ ? '#ff477e' : 'rgba(255,255,255,0.3)',
            transition: 'background-color 0.3s'
          }}></div>
        ))}
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div style={{ 
        position: 'relative', 
        zIndex: 5, 
        flex: 1,
        width: '100%',
        display: 'flex',
        padding: '0.8rem 2rem',
        gap: '1.5rem',
        maxWidth: '1200px',
        minHeight: 0,
        overflow: 'hidden'
      }}>

        {/* ====== LEFT COLUMN: Timer + Character Card ====== */}
        <div style={{ 
          width: '220px', 
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          minHeight: 0
        }}>
          {/* Timer */}
          <div style={{ 
            backgroundColor: '#ff477e',
            padding: '12px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '2rem', 
              fontWeight: '800',
              letterSpacing: '4px'
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Character Card */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255,255,255,0.25)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <div style={{ 
              flex: 1, 
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img 
                src={character.image} 
                alt={character.name}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom'
                }} 
              />
            </div>
            {/* Affection Bar */}
            <div style={{ 
              height: '8px',
              backgroundColor: 'rgba(0,0,0,0.15)'
            }}>
              <div style={{ 
                width: '30%', 
                height: '100%', 
                background: 'linear-gradient(90deg, #ff477e, #ff6b9d)',
                borderRadius: '0 4px 4px 0'
              }}></div>
            </div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN: Question Area ====== */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative'
        }}>

          {/* === INFO STATE === */}
          {quizState === 'info' && (
            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Info Card */}
              <div style={{ 
                flex: 1,
                backgroundColor: 'rgba(30, 33, 48, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '2.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Informasi Soal</h2>
                <div style={{ color: '#a0a5b5', fontSize: '1rem', lineHeight: '2' }}>
                  <p>📚 Topik: <strong style={{ color: 'white' }}>{character.concept}</strong></p>
                  <p>📝 Jumlah Soal: <strong style={{ color: 'white' }}>{totalQ} soal</strong></p>
                  <p>⏱ Waktu: <strong style={{ color: 'white' }}>5 menit</strong></p>
                  <p>🎯 Tipe: <strong style={{ color: 'white' }}>Pilihan Ganda (5 opsi)</strong></p>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                <Link href={`/topic/${resolvedParams.id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '14px 40px', fontSize: '1.1rem', borderRadius: '30px' }}>
                    Back
                  </button>
                </Link>
                <button className="btn-primary" onClick={startQuiz} style={{ padding: '14px 40px', fontSize: '1.1rem', borderRadius: '30px' }}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* === PLAYING STATE === */}
          {quizState === 'playing' && (
            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Question Card */}
              <div style={{ 
                backgroundColor: 'rgba(30, 33, 48, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h3 style={{ color: '#a0a5b5', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                  Soal Nomor {currentQ + 1}
                </h3>
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '12px',
                  padding: '2rem',
                  minHeight: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <p style={{ color: '#333', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
                    {mockQuestions[currentQ].question}
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '0.8rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {mockQuestions[currentQ].options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => selectAnswer(i)}
                    style={{ 
                      width: '130px',
                      minHeight: '80px',
                      borderRadius: '16px',
                      border: selectedAnswers[currentQ] === i ? '4px solid white' : '4px solid transparent',
                      backgroundColor: optionColors[i],
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedAnswers[currentQ] === i 
                        ? '0 6px 25px rgba(0,0,0,0.4)' 
                        : '0 4px 15px rgba(0,0,0,0.2)',
                      transform: selectedAnswers[currentQ] === i ? 'scale(1.05)' : 'scale(1)',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      lineHeight: '1.3'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <button 
                  onClick={goBack} 
                  disabled={currentQ === 0}
                  className="btn-secondary"
                  style={{ 
                    padding: '12px 40px', fontSize: '1rem', borderRadius: '30px',
                    opacity: currentQ === 0 ? 0.4 : 1
                  }}
                >
                  Back
                </button>
                <button 
                  onClick={goNext} 
                  className="btn-primary"
                  style={{ padding: '12px 40px', fontSize: '1rem', borderRadius: '30px' }}
                >
                  {currentQ === totalQ - 1 ? 'Selesai' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* === FINISHED STATE === */}
          {quizState === 'finished' && (
            <div className="animate-fade-in" style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Trophy Icon */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '50px', height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🏆
              </div>

              {/* Glass results card */}
              <div style={{
                backgroundColor: 'rgba(30, 33, 48, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%'
              }}>
                <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Kuis Selesai!</h2>
                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: '800', 
                  color: '#ff477e',
                  marginBottom: '0.5rem'
                }}>
                  {score}/{totalQ}
                </div>
                <p style={{ color: '#a0a5b5', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Jawaban Benar</p>
                <p style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>
                  Waktu tersisa: {formatTime(timeLeft)}
                </p>
              </div>

              {/* Button */}
              <Link href={`/topic/${resolvedParams.id}`} style={{ textDecoration: 'none', marginTop: '2rem' }}>
                <button className="btn-primary" style={{ 
                  padding: '14px 50px', 
                  fontSize: '1.1rem', 
                  borderRadius: '30px' 
                }}>
                  Kerjakan Soal Lainnya
                </button>
              </Link>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}
