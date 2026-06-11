interface QuizTopBannerProps {
  quizState: string;
  character: any;
  totalQ: number;
  currentQ: number;
  setShowCharacterModal: (show: boolean) => void;
}

export default function QuizTopBanner({ quizState, character, totalQ, currentQ, setShowCharacterModal }: QuizTopBannerProps) {
  return (
    <>
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
    </>
  );
}
