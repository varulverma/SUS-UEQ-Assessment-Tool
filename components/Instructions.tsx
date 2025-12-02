import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="text-center py-4">
      <h1 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
        Usability Score Calculator
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        Calculate scores for <strong>SUS</strong> and <strong>UEQ</strong> instantly. Fill out the details below to begin your assessment.
      </p>
    </div>
  );
};

export default Instructions;