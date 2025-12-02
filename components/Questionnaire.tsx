import React from 'react';
import { SUS_QUESTIONS } from '../constants';

interface QuestionnaireProps {
  scores: number[];
  onScoreChange: (questionIndex: number, value: number) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ scores, onScoreChange }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-2">System Usability Scale</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Please rate the following statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
      </div>
      
      <div className="space-y-10">
        {SUS_QUESTIONS.map((q, index) => (
          <div key={q.id} className="relative">
            <label htmlFor={`sus-q-${q.id}`} className="block text-lg font-medium text-slate-800 dark:text-slate-100 mb-4 leading-snug">
              <span className="text-primary-500 mr-2">{q.id}.</span>
              {q.text}
            </label>
            
            <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20 text-right">Disagree</span>
                <div className="relative flex-1 h-10 flex items-center">
                    {/* Track */}
                    <div className="absolute w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    
                    {/* Input */}
                    <input
                        id={`sus-q-${q.id}`}
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={scores[index] || 0}
                        onChange={(e) => onScoreChange(index, parseInt(e.target.value, 10))}
                        className={`absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110`}
                    />
                    
                    {/* Tick marks */}
                    <div className="absolute w-full flex justify-between px-1 pointer-events-none">
                        {[1, 2, 3, 4, 5].map(tick => (
                             <div key={tick} className={`w-1 h-1 rounded-full ${scores[index] >= tick ? 'bg-primary-300' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        ))}
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20">Agree</span>
                
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg shadow-sm transition-colors ${scores[index] > 0 ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    {scores[index] || '-'}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questionnaire;