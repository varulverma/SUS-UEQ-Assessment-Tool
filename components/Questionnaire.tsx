import React, { useState, useEffect, useRef } from 'react';
import { SUS_QUESTIONS } from '../constants';

interface QuestionnaireProps {
  scores: number[];
  onScoreChange: (questionIndex: number, value: number) => void;
  onTimeUpdate: (questionIndex: number, time: number) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ scores, onScoreChange, onTimeUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const currentQuestion = SUS_QUESTIONS[currentIndex];
  const currentScore = scores[currentIndex];

  useEffect(() => {
    // Reset timer when question changes
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SUS_QUESTIONS.length - 1) {
      recordTime();
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      recordTime();
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const recordTime = () => {
    const endTime = Date.now();
    const duration = (endTime - startTimeRef.current) / 1000; // seconds
    onTimeUpdate(currentIndex, duration);
  };

  // Determine Highlighting
  const isNeutral = currentScore === 3 || currentScore === 0;
  const isDisagree = currentScore > 0 && currentScore < 3;
  const isAgree = currentScore > 3;

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header / Progress */}
      <div className="mb-6 md:mb-10">
        <div className="flex justify-between items-end mb-3">
            <h2 className="text-xl md:text-2xl font-serif text-slate-800 dark:text-white tracking-tight">System Usability Scale</h2>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono bg-white/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {SUS_QUESTIONS.length}
            </span>
        </div>
        <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
                className="bg-gradient-to-r from-primary-400 to-primary-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${((currentIndex + 1) / SUS_QUESTIONS.length) * 100}%` }}
            ></div>
        </div>
      </div>
      
      {/* Question Card */}
      <div className={`flex-1 flex flex-col items-center transition-all duration-300 ease-out transform ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
         
         <div className="flex-grow flex items-center justify-center w-full mb-8 min-h-[120px]">
            <h3 className="text-2xl md:text-4xl font-serif text-slate-800 dark:text-slate-100 text-center leading-snug max-w-3xl">
                {currentQuestion.text}
            </h3>
         </div>
         
         {/* Interaction Area */}
         <div className="w-full max-w-2xl mx-auto px-2 md:px-0">
            
            {/* Labels */}
            <div className="flex justify-between mb-8 text-sm md:text-base font-medium transition-all duration-300">
                <span className={`px-4 py-2 rounded-xl border transition-all duration-300 ${isDisagree ? 'text-red-700 bg-red-100/80 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 scale-105 shadow-lg' : 'text-slate-500 border-transparent bg-transparent'}`}>
                    Strongly Disagree
                </span>
                <span className={`px-4 py-2 rounded-xl border transition-all duration-300 ${isAgree ? 'text-emerald-700 bg-emerald-100/80 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800 scale-105 shadow-lg' : 'text-slate-500 border-transparent bg-transparent'}`}>
                    Strongly Agree
                </span>
            </div>

            {/* Custom Slider Container */}
            <div className="relative h-20 w-full flex items-center justify-center select-none touch-none group">
                 
                 {/* Track Background */}
                 <div className="absolute w-full h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-full shadow-inner backdrop-blur-sm"></div>
                 
                 {/* Active Track Fill */}
                 <div 
                    className="absolute h-4 left-0 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 rounded-l-full opacity-80 transition-all duration-150 ease-out"
                    style={{ width: currentScore ? `${((currentScore - 1) / 4) * 100}%` : '0%', borderRadius: currentScore === 5 ? '9999px' : '9999px 0 0 9999px' }}
                 ></div>

                 {/* Ticks */}
                 <div className="absolute w-full flex justify-between px-[14px] md:px-[18px] pointer-events-none">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <div 
                            key={val} 
                            className={`w-1 h-4 md:h-5 rounded-full transition-all duration-300 z-0 ${currentScore >= val ? 'bg-white/50' : 'bg-slate-400/30'}`}
                        ></div>
                    ))}
                 </div>

                 {/* Native Range Input (Invisible overlay with huge touch target) */}
                 <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={currentScore || 1}
                    onChange={(e) => onScoreChange(currentIndex, parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-30 margin-0 p-0"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                 />
                 
                 {/* Custom Thumb Visual */}
                 <div 
                    className="absolute h-10 w-10 md:h-12 md:w-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.3)] border-[3px] border-primary-500 pointer-events-none transition-all duration-100 ease-out z-20 flex items-center justify-center"
                    style={{ 
                        left: `calc(${(( (currentScore || 1) - 1) / 4) * 100}% - ${window.innerWidth < 768 ? '20px' : '24px'})`,
                        transform: currentScore === 0 ? 'scale(0.8) opacity-50' : 'scale(1) opacity-100'
                    }}
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                 </div>
            </div>
            
            <div className={`text-center mt-2 h-6 text-sm transition-opacity duration-500 ${currentScore === 0 ? 'opacity-100 text-primary-600 animate-pulse' : 'opacity-0'}`}>
                Slide to rate
            </div>
         </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
            Back
        </button>
        
        {currentIndex < SUS_QUESTIONS.length - 1 ? (
             <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all transform active:scale-95 group"
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
             </button>
        ) : (
            <div className="px-6 py-3 text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800 animate-fade-in">
                Assessment Complete
            </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;