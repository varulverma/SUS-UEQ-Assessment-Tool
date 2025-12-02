import React, { useState, useEffect, useRef } from 'react';
import { UEQ_ITEM_PAIRS } from '../constants';

interface UeqQuestionnaireProps {
  scores: number[];
  onScoreChange: (questionIndex: number, value: number) => void;
  onTimeUpdate: (questionIndex: number, time: number) => void;
}

const UeqQuestionnaire: React.FC<UeqQuestionnaireProps> = ({ scores, onScoreChange, onTimeUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const currentPair = UEQ_ITEM_PAIRS[currentIndex];
  const currentScore = scores[currentIndex];

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < UEQ_ITEM_PAIRS.length - 1) {
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
    const duration = (endTime - startTimeRef.current) / 1000;
    onTimeUpdate(currentIndex, duration);
  };

  // Determine Highlighting
  // UEQ is 1 to 7. 4 is neutral.
  const val = currentScore || 4; 
  
  const leftActive = val < 4;
  const rightActive = val > 4;
  
  // Calculate scaling intensity
  const leftScale = leftActive ? 1 + (Math.abs(val - 4) * 0.1) : 1;
  const rightScale = rightActive ? 1 + (Math.abs(val - 4) * 0.1) : 1;

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div className="flex justify-between items-end mb-3">
            <h2 className="text-xl md:text-2xl font-serif text-slate-800 dark:text-white tracking-tight">UEQ Assessment</h2>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono bg-white/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {UEQ_ITEM_PAIRS.length}
            </span>
        </div>
        <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${((currentIndex + 1) / UEQ_ITEM_PAIRS.length) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Main Interaction */}
      <div className={`flex-1 flex flex-col justify-center items-center transition-all duration-300 transform ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        
        <p className="text-slate-400 dark:text-slate-500 mb-8 md:mb-12 text-center text-xs md:text-sm uppercase tracking-[0.2em] font-bold">
            Which word better describes the product?
        </p>

        <div className="w-full max-w-4xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-4 items-center">
            
            {/* Left Adjective (Desktop: Col 1-3, Mobile: Top Left) */}
            <div className="w-full md:col-span-3 flex justify-start md:justify-end order-1">
                <div 
                    className={`transition-all duration-200 origin-left md:origin-right text-left md:text-right ${leftActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}
                    style={{ 
                        transform: `scale(${leftScale})`,
                        textShadow: leftActive ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                    }}
                >
                    <span className="text-3xl md:text-4xl font-serif leading-none block">{currentPair.left}</span>
                </div>
            </div>

            {/* Slider Column (Desktop: Col 4-9, Mobile: Order 3) */}
            <div className="w-full md:col-span-6 relative h-20 flex items-center justify-center order-3 md:order-2 px-2 md:px-6">
                
                {/* Visual Track */}
                <div className="absolute w-full h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                    {/* Center Marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 z-0"></div>
                    
                    {/* Dynamic Fill from Center */}
                    <div 
                        className={`absolute h-full transition-all duration-150 ease-out ${val === 4 ? 'opacity-0' : 'opacity-80'}`}
                        style={{
                            left: val < 4 ? `${((val - 1) / 6) * 100}%` : '50%',
                            right: val > 4 ? `${100 - ((val - 1) / 6) * 100}%` : '50%',
                            background: 'linear-gradient(90deg, #c084fc 0%, #a855f7 100%)'
                        }}
                    ></div>
                </div>

                {/* Ticks */}
                <div className="absolute w-full flex justify-between px-[2px] md:px-[6px] pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7].map((tick) => (
                        <div 
                            key={tick} 
                            className={`rounded-full transition-all duration-200 z-10 ${
                                (val === tick && val !== 4) ? 'bg-white w-2 h-2 shadow-sm' : 
                                (tick === 4) ? 'bg-slate-400/40 w-1.5 h-4' : 'bg-slate-400/30 w-1.5 h-1.5'
                            }`}
                        ></div>
                    ))}
                </div>

                {/* Invisible Input - Full Size */}
                <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={currentScore || 4}
                    onChange={(e) => onScoreChange(currentIndex, parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-30 m-0 p-0"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                />

                {/* Thumb Visual */}
                <div 
                    className="absolute h-10 w-10 md:h-12 md:w-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.3)] border-[3px] border-purple-500 pointer-events-none transition-all duration-100 ease-out z-20 flex items-center justify-center"
                    style={{ 
                        left: `calc(${((val - 1) / 6) * 100}% - ${window.innerWidth < 768 ? '20px' : '24px'})`,
                    }}
                >
                    <div className={`w-2 h-2 rounded-full bg-purple-500 transition-opacity ${val === 4 ? 'opacity-50' : 'opacity-100'}`}></div>
                </div>
            </div>

            {/* Right Adjective (Desktop: Col 10-12, Mobile: Top Right) */}
            <div className="w-full md:col-span-3 flex justify-end md:justify-start order-2 md:order-3">
                 {/* On mobile, we actually want Left and Right on same row above slider, OR stacked if screen is very narrow.
                     The CSS Grid handles desktop perfectly. For mobile flex-col, we need a special container if we want them side-by-side. 
                     However, splitting them widely apart vertically (Order 1 and Order 2) with slider (Order 3) is a valid pattern too.
                     Let's adjust for mobile specific: Side-by-Side top row is usually better for mental model.
                  */}
                 <div 
                    className={`transition-all duration-200 origin-right md:origin-left text-right md:text-left ${rightActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}
                    style={{ 
                         transform: `scale(${rightScale})`,
                         textShadow: rightActive ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                    }}
                >
                    <span className="text-3xl md:text-4xl font-serif leading-none block">{currentPair.right}</span>
                </div>
            </div>

            {/* Mobile-only layout override: Put text side by side above slider */}
            <div className="md:hidden w-full flex justify-between items-center absolute top-0 -mt-16 pointer-events-none opacity-0">
               {/* This is a hacky way to describe logic. Instead, let's just use CSS classes to reflow properly. 
                   Actually, simply using flex-row for the top container on mobile might work better.
               */}
            </div>
        </div>

        {/* Mobile specific tweaks for visual flow: 
            The above grid makes: Left (top), Right (middle), Slider (bottom) on mobile. 
            Better: Left/Right (row 1), Slider (row 2). 
        */}
        <style>{`
            @media (max-width: 768px) {
                .order-1 { order: 1; width: 50%; justify-content: flex-start; }
                .order-2 { order: 2; width: 50%; justify-content: flex-end; }
                .order-3 { order: 3; width: 100%; margin-top: 2rem; }
                /* We need a wrapping flex container for the text to sit side-by-side */
            }
        `}</style>
         
         {/* Let's redo the grid structure slightly for perfect mobile layout without style tag hacks */}
         <div className="md:hidden w-full flex justify-between items-start px-2 mb-8 gap-4">
             <div 
                className={`flex-1 text-left transition-all duration-200 origin-left ${leftActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}
                style={{ transform: `scale(${leftScale})` }}
             >
                 <span className="text-2xl font-serif leading-tight block">{currentPair.left}</span>
             </div>
             <div 
                className={`flex-1 text-right transition-all duration-200 origin-right ${rightActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}`}
                style={{ transform: `scale(${rightScale})` }}
             >
                 <span className="text-2xl font-serif leading-tight block">{currentPair.right}</span>
             </div>
         </div>

         {/* Desktop Only Text (Hidden on mobile) */}
         {/* This requires conditional rendering or display classes. I will simplify the main block to be desktop only for text, and use the mobile block above. */}

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
             className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
            Back
        </button>
        
        {currentIndex < UEQ_ITEM_PAIRS.length - 1 ? (
             <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all transform active:scale-95 group"
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
             </button>
        ) : (
            <div className="px-6 py-3 text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 animate-fade-in">
                Questionnaire Complete
            </div>
        )}
      </div>
    </div>
  );
};

export default UeqQuestionnaire;