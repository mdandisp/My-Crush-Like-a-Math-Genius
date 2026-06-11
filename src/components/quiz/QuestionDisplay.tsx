interface QuestionDisplayProps {
  content: string;
}

export default function QuestionDisplay({ content }: QuestionDisplayProps) {
  return (
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
        {content}
      </p>
    </div>
  );
}
