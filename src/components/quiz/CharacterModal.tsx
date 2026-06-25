import Image from 'next/image';

interface CharacterData {
  name: string;
  image: string;
}

interface CharacterModalProps {
  character: CharacterData;
  setShowCharacterModal: (show: boolean) => void;
}

export default function CharacterModal({ character, setShowCharacterModal }: CharacterModalProps) {
  return (
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
          <Image
            src={character.image}
            alt={character.name}
            fill
            style={{ objectFit: 'contain', objectPosition: 'center' }}
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
  );
}
