"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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

  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'easy';
  const requestedCount = parseInt(searchParams.get('count') || '5');

  const [currentQ, setCurrentQ] = useState(0);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  // Prepare questions array based on requestedCount
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [quizState, setQuizState] = useState<'info' | 'playing' | 'finished'>('info');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!character) {
      router.push('/dashboard');
    } else {
      // Build questions list by duplicating mockQuestions if necessary
      let qs = [];
      for (let i = 0; i < requestedCount; i++) {
        qs.push({ ...mockQuestions[i % mockQuestions.length], id: i + 1 });
      }
      setActiveQuestions(qs);
      setSelectedAnswers(new Array(requestedCount).fill(null));
    }
  }, [character, router, requestedCount]);

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
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz();
    }
  };

  // Back function removed for linear progression

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0;
    selectedAnswers.forEach((ans, i) => {
      if (ans === activeQuestions[i].correct) correct++;
    });
    setScore(correct);
    setQuizState('finished');

    // Save attempt to localStorage
    const history = JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
    history.push({
      id: Date.now().toString(),
      characterId: resolvedParams.id,
      topicName: character.concept,
      level: level,
      questionCount: requestedCount,
      score: correct,
      date: new Date().toISOString()
    });
    localStorage.setItem('quiz_attempts', JSON.stringify(history));
  };

  if (!character || activeQuestions.length === 0) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1015' }}></div>;

  const totalQ = activeQuestions.length;
  const progressPercent = quizState === 'finished' ? 100 : ((currentQ + 1) / totalQ) * 100;

  return (
    <main className="mobile-scroll-fix" style={{
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

      {/* ====== TOP: Header Row ====== */}
      <div style={{
        position: 'relative',
        zIndex: 50,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem',
        padding: '0 1.5rem'
      }}>
        {/* Banner Topik */}
        <div style={{
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
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {quizState === 'finished' ? 'Selesai' : character.concept}
          </h1>
        </div>

        {/* Top Right Floating Character Button (Info) - Mobile Only */}
        <button
          className="mobile-only"
          onClick={() => setShowCharacterModal(true)}
          style={{
            position: 'absolute',
            right: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            color: 'white'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          title={`Lihat Detail ${character.name}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </button>
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
      <div className="quiz-main-content" style={{
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
        <div className="quiz-left-col" style={{
          width: '280px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minHeight: 0
        }}>
          {/* Timer */}
          <div className="quiz-timer-card" style={{
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

          {/* Character Card - Desktop Only */}
          <div className="quiz-character-card desktop-only" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255,255,255,0.25)',
            flex: 1,
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
                  objectFit: 'cover',
                  objectPosition: 'top center'
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

          {/* Mobile Speech Bubble to fill the gap */}
          {quizState === 'info' && (
            <div className="mobile-only animate-fade-in" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'rgba(30, 33, 48, 0.6)',
              backdropFilter: 'blur(10px)',
              padding: '12px 15px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                backgroundColor: '#e8e0d8',
                backgroundImage: `url(${character.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                border: '2px solid #f0944d',
                flexShrink: 0
              }}></div>
              <div>
                <h4 style={{ color: '#f0944d', fontSize: '0.85rem', margin: '0 0 4px 0' }}>{character.name}</h4>
                <p style={{ color: 'white', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>
                  "Ayo mulai kuisnya! Aku yakin kamu bisa."
                </p>
              </div>
            </div>
          )}

          {/* === INFO STATE === */}
          {quizState === 'info' && (
            <div className="animate-fade-in quiz-info-state-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* Info Card */}
              <div style={{
                backgroundColor: 'rgba(30, 33, 48, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '2.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: '350px'
              }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Informasi Soal</h2>
                <div style={{ color: '#a0a5b5', fontSize: '1rem', lineHeight: '2' }}>
                  <p>📚 Topik: <strong style={{ color: 'white' }}>{character.concept}</strong></p>
                  <p>⚡ Tingkat Kesulitan: <strong style={{ color: 'white', textTransform: 'capitalize' }}>{level}</strong></p>
                  <p>📝 Jumlah Soal: <strong style={{ color: 'white' }}>{totalQ} soal</strong></p>
                  <p>⏱ Waktu: <strong style={{ color: 'white' }}>5 menit</strong></p>
                  <p>🎯 Tipe: <strong style={{ color: 'white' }}>Pilihan Ganda</strong></p>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                <Link href={`/topic/${resolvedParams.id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary">
                    Batal
                  </button>
                </Link>
                <button
                  className="btn-primary"
                  onClick={startQuiz}
                >
                  Mulai Sekarang
                </button>
              </div>
            </div>
          )}

          {/* === PLAYING STATE === */}
          {quizState === 'playing' && (
            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Question & Answers Card (Main Glass Container) */}
              <div className="quiz-question-container" style={{
                backgroundColor: 'rgba(30, 33, 48, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h3 className="quiz-question-title" style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                  Soal Nomor {currentQ + 1}
                </h3>

                {/* Question Box (Cyan Border) */}
                <div className="quiz-question-box" style={{
                  backgroundColor: '#e5e7eb', // Light gray background like mockup
                  border: '4px solid #00bfff', // Cyan border
                  padding: '2rem',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <p className="quiz-question-text" style={{ color: '#333', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
                    {activeQuestions[currentQ].question}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="quiz-options-wrapper" style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between'
                }}>
                  {activeQuestions[currentQ].options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      className="quiz-option-btn"
                      onClick={() => selectAnswer(i)}
                      style={{
                        flex: 1,
                        minHeight: '160px',
                        borderRadius: '12px',
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
                        flexDirection: 'column',
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
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={goNext}
                  className="btn-primary"
                  disabled={selectedAnswers[currentQ] === null}
                  style={{ opacity: selectedAnswers[currentQ] === null ? 0.5 : 1, cursor: selectedAnswers[currentQ] === null ? 'not-allowed' : 'pointer' }}
                >
                  {currentQ === totalQ - 1 ? 'Selesai' : 'Lanjut'}
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
              <Link href="/leaderboard" style={{ position: 'absolute', top: '1rem', right: '1rem', textDecoration: 'none' }}>
                <div
                  className="char-image-hover"
                  style={{
                    width: '50px', height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.15) translateY(-5px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 71, 126, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                  title="Lihat Papan Peringkat"
                >
                  🏆
                </div>
              </Link>

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

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Link href={`/profile`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary">
                    Lihat Profil
                  </button>
                </Link>
                <Link href={`/dashboard`} style={{ textDecoration: 'none' }}>
                  <button className="btn-primary">
                    Dashboard
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Character Modal */}
      {showCharacterModal && (
        <div
          onClick={() => setShowCharacterModal(false)}
          className="animate-fade-in"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 16, 21, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowCharacterModal(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'rgba(255,255,255,0.2)', border: 'none',
                color: 'white', width: '30px', height: '30px',
                borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              ✕
            </button>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>{character.name}</h2>

            <div style={{ width: '100%', height: '400px', backgroundColor: 'transparent', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '1.5rem' }}>
              <img
                src={character.image}
                alt={character.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>

            <div style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
              <p style={{ color: '#a0a5b5', margin: '0 0 10px 0', fontSize: '0.9rem' }}>Affection</p>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #ff477e, #ff6b9d)' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
