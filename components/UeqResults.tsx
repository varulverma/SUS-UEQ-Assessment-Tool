import React from 'react';
import { UeqResult } from '../types';
import { UEQ_BENCHMARK, UEQ_SCALES } from '../constants';

interface UeqResultsProps {
  results: UeqResult[] | null;
}

const getBenchmarkCategory = (mean: number): string => {
    if (mean >= UEQ_BENCHMARK.Excellent.low) return 'Excellent';
    if (mean >= UEQ_BENCHMARK.Good.low) return 'Good';
    if (mean >= UEQ_BENCHMARK.AboveAverage.low) return 'Above Avg';
    if (mean >= UEQ_BENCHMARK.BelowAverage.low) return 'Below Avg';
    return 'Bad';
};

const categoryColors: {[key: string]: string} = {
    'Excellent': 'bg-emerald-500',
    'Good': 'bg-lime-500',
    'Above Avg': 'bg-yellow-500',
    'Below Avg': 'bg-orange-500',
    'Bad': 'bg-red-500',
}

const UeqResults: React.FC<UeqResultsProps> = ({ results }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 dark:border-white/10">
      <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100 mb-6 text-center">UEQ Dimensions</h2>
      <div className={`space-y-5 ${results === null ? 'opacity-40 grayscale' : 'animate-fade-in'}`}>
        {(results ?? UEQ_SCALES.map(s => ({scale: s, mean: 0}))).map(result => {
          const percentage = ((result.mean + 3) / 6) * 100;
          const category = getBenchmarkCategory(result.mean);
          const color = categoryColors[category] || 'bg-slate-500';

          return (
            <div key={result.scale}>
              <div className="flex justify-between items-end mb-2">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">{result.scale}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{results ? category : '-'}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">{result.mean.toFixed(2)}</span>
                  </div>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2">
                  <div 
                    className={`${color} h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
                    style={{ width: `${results ? percentage : 0}%`, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  ></div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-center mt-6 text-slate-400 dark:text-slate-500 uppercase tracking-wide">
        Based on benchmark of 400+ products
      </p>
    </div>
  );
};

export default UeqResults;