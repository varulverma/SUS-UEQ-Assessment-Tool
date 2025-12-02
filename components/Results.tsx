import React from 'react';

interface ScoreCircleProps {
  score: number;
  color: string;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, color }) => {
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-medium text-slate-800 dark:text-slate-100">{score.toFixed(1)}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">SUS Score</span>
            </div>
        </div>
    );
};

interface ResultsProps {
  score: number | null;
}

const Results: React.FC<ResultsProps> = ({ score }) => {
  const getGradeAndAdjective = (s: number | null): { grade: string; adjective: string; color: string } => {
    if (s === null) return { grade: '-', adjective: 'N/A', color: 'text-slate-500' };
    if (s >= 80.3) return { grade: 'A', adjective: 'Excellent', color: 'text-emerald-500' };
    if (s >= 68) return { grade: 'B', adjective: 'Good', color: 'text-lime-500' };
    if (s >= 51) return { grade: 'C', adjective: 'Okay', color: 'text-amber-500' };
    if (s >= 35.7) return { grade: 'D', adjective: 'Poor', color: 'text-orange-500' };
    return { grade: 'F', adjective: 'Awful', color: 'text-red-500' };
  };

  const { grade, adjective, color } = getGradeAndAdjective(score);
  const isAboveAverage = score !== null && score >= 68;

  return (
    <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 dark:border-white/10 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 01-1.125-1.125v-3.375m9 0V1.5h-9v3.375m0 0h9" />
          </svg>
      </div>

      <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100 mb-6 relative z-10">Results</h2>
      
      <div className={`mx-auto flex justify-center mb-6 relative z-10 ${score === null ? 'opacity-50 grayscale' : 'animate-fade-in'}`}>
        <ScoreCircle score={score ?? 0} color={color} />
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-lg relative z-10">
          <div className="bg-white/50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 p-4 rounded-xl">
              <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">Grade</p>
              <p className={`${color} font-serif text-3xl`}>{grade}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 p-4 rounded-xl">
              <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">Rating</p>
              <p className={`${color} font-serif text-xl mt-1`}>{adjective}</p>
          </div>
      </div>

      {score !== null && (
        <div className={`mt-4 py-2 px-3 rounded-lg text-sm font-medium animate-fade-in relative z-10 ${isAboveAverage ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100/50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
            {isAboveAverage ? 'Above Average' : 'Below Average'}
        </div>
      )}
    </div>
  );
};

export default Results;