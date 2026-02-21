
import React from 'react';
import { Word } from '../types';

interface WordPillProps {
  word: Word;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled: boolean;
}

const WordPill: React.FC<WordPillProps> = ({ word, isSelected, onToggle, disabled }) => {
  return (
    <button
      onClick={() => onToggle(word.id)}
      disabled={disabled && !isSelected}
      className={`
        pill-animation
        h-12 px-6 rounded-full border-2 text-sm font-medium transition-all duration-300
        ${isSelected 
          ? 'custom-blue border-transparent text-white shadow-lg transform scale-105' 
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
        }
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        flex items-center justify-center text-center
      `}
    >
      {word.label}
    </button>
  );
};

export default WordPill;
