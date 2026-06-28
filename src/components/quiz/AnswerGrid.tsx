const optionColors = ['#ff69b4', '#ff1493', '#00bfff', '#ffb347', '#2ecc71'];

import { Option } from '../../types';
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface AnswerGridProps {
  options: Option[];
  selectedAnswer: string | null;
  setSelectedAnswer: (id: string) => void;
  isSubmitting: boolean;
}

export default function AnswerGrid({ options, selectedAnswer, setSelectedAnswer, isSubmitting }: AnswerGridProps) {
  return (
    <div className="quiz-options-wrapper" style={{
      display: 'flex',
      gap: '12px',
      flexWrap: 'nowrap',
      justifyContent: 'space-between'
    }}>
      {options?.map((opt: Option, i: number) => (
        <button
          key={opt.id}
          className="quiz-option-btn"
          onClick={() => setSelectedAnswer(opt.id)}
          disabled={isSubmitting}
          style={{
            flex: 1,
            minHeight: '160px',
            borderRadius: '12px',
            border: selectedAnswer === opt.id ? '4px solid white' : '4px solid transparent',
            backgroundColor: optionColors[i % optionColors.length],
            color: 'white',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: isSubmitting ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: selectedAnswer === opt.id
              ? '0 6px 25px rgba(0,0,0,0.4)'
              : '0 4px 15px rgba(0,0,0,0.2)',
            transform: selectedAnswer === opt.id ? 'scale(1.05)' : 'scale(1)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            lineHeight: '1.3',
            opacity: isSubmitting ? 0.8 : 1
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {(() => {
              const text = (opt.text || (opt as any).content) || '';
              return text ? `$${text.replace(/\$/g, '').replace(/\\\\/g, '\\')}$` : '';
            })()}
          </ReactMarkdown>
        </button>
      ))}
    </div>
  );
}
