import React from 'react';
import { UEQ_ITEM_PAIRS } from '../constants';

interface UeqQuestionnaireProps {
  scores: number[];
  onScoreChange: (questionIndex: number, value: number) => void;
}

const UeqQuestionnaire: React.FC<UeqQuestionnaireProps> = ({ scores, onScoreChange }) => {
  return (
    <div>
       <div className="mb-6">
        <h2 className="text-2xl font-serif text-slate-800 dark:text-white mb-2">User Experience Questionnaire</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
            For each pair of adjectives, move the slider to indicate which one you feel describes the product better.
        </p>
       </div>

      <div className="space-y-6">
        {UEQ_ITEM_PAIRS.map((pair, index) => (
          <div key={index} className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
             <div className="flex justify-between items-center font-medium text-slate-700 dark:text-slate-200 mb-4 text-sm md:text-base">
              <span className="text-left flex-1">{pair.left}</span>
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm mx-4 transition-colors ${scores[index] > 0 ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                {scores[index] || '-'}
              </div>
              <span className="text-right flex-1">{pair.right}</span>
            </div>
            
            <div className="relative h-6 flex items-center">
                 <input
                    id={`ueq-q-${index}`}
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={scores[index] || 0}
                    onChange={(e) => onScoreChange(index, parseInt(e.target.value, 10))}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110`}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UeqQuestionnaire;