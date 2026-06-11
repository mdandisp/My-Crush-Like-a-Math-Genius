interface DialogBoxProps {
  characterName: string;
  dialogueText: string;
  currentLine: number;
}

export default function DialogBox({ characterName, dialogueText, currentLine }: DialogBoxProps) {
  return (
    <div className="dialog-box-area" style={{
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
        {characterName}
      </div>
      
      {/* Text Box */}
      <div className="dialog-text-box" style={{
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
        <p className="animate-fade-in dialog-text" key={currentLine} style={{
          color: 'white',
          fontSize: '1.4rem',
          lineHeight: '1.6',
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {dialogueText}
        </p>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <span style={{ color: '#a0a5b5', fontSize: '0.9rem' }}>
            Klik layar untuk lanjut ▶
          </span>
        </div>
      </div>
    </div>
  );
}
