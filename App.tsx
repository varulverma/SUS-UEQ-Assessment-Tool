import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Instructions from './components/Instructions';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import UeqQuestionnaire from './components/UeqQuestionnaire';
import UeqResults from './components/UeqResults';
import DataTable from './components/DataTable';
import { SUS_QUESTIONS, UEQ_ITEM_PAIRS, UEQ_SCALES } from './constants';
import { QuestionnaireType, UeqResult, Assessment, SusAssessment, UeqAssessment } from './types';
import * as XLSX from 'xlsx';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<QuestionnaireType>('SUS');
  
  // Form State
  const [participant, setParticipant] = useState('');
  const [product, setProduct] = useState('');

  // Data State
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('usability-assessments');
      if (storedData) {
        setAssessments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load assessments from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('usability-assessments', JSON.stringify(assessments));
    } catch (error) {
      console.error("Failed to save assessments to localStorage", error);
    }
  }, [assessments]);


  // SUS State
  const [susScores, setSusScores] = useState<number[]>(Array(SUS_QUESTIONS.length).fill(0));
  const susScore = useMemo(() => {
    if (susScores.some(s => s === 0)) {
      return null;
    }
    let score = 0;
    susScores.forEach((s, i) => {
      if ((i + 1) % 2 !== 0) {
        score += s - 1;
      } else {
        score += 5 - s;
      }
    });
    return score * 2.5;
  }, [susScores]);

  // UEQ State
  const [ueqScores, setUeqScores] = useState<number[]>(Array(UEQ_ITEM_PAIRS.length).fill(0));
  const ueqResults = useMemo((): UeqResult[] | null => {
    if (ueqScores.some(s => s === 0)) {
      return null;
    }
    
    const scaleScores: { [key: string]: number[] } = {};
    UEQ_SCALES.forEach(scale => scaleScores[scale] = []);
    
    UEQ_ITEM_PAIRS.forEach((pair, index) => {
        let score: number;
        if (pair.polarity === 1) {
            score = ueqScores[index] - 4;
        } else {
            score = 4 - ueqScores[index];
        }
        scaleScores[pair.scale].push(score);
    });

    return UEQ_SCALES.map(scale => {
        const scores = scaleScores[scale];
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { scale, mean };
    });

  }, [ueqScores]);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSusScoreChange = (questionIndex: number, value: number) => {
    const newScores = [...susScores];
    newScores[questionIndex] = value;
    setSusScores(newScores);
  };

  const handleUeqScoreChange = (questionIndex: number, value: number) => {
    const newScores = [...ueqScores];
    newScores[questionIndex] = value;
    setUeqScores(newScores);
  };
  
  const handleClearForm = () => {
    // Note: We deliberately do NOT clear participant/product to allow rapid entry for same session
    setSusScores(Array(SUS_QUESTIONS.length).fill(0));
    setUeqScores(Array(UEQ_ITEM_PAIRS.length).fill(0));
  }

  const handleAddAssessment = () => {
    if (!participant.trim() || !product.trim()) {
      alert('Please enter both Participant Name and Product/System Name at the top of the page.');
      return;
    }
    
    let newAssessment: Assessment;
    const commonData = {
        id: new Date().toISOString() + Math.random(),
        participant,
        product,
        timestamp: new Date().toLocaleString(),
    };

    if (activeQuestionnaire === 'SUS') {
      if (susScore === null) {
        alert('Please complete all SUS questions before adding.');
        return;
      }
      newAssessment = {
        ...commonData,
        type: 'SUS',
        scores: susScores,
        totalScore: susScore
      }
    } else {
      if (ueqResults === null) {
        alert('Please complete all UEQ questions before adding.');
        return;
      }
      newAssessment = {
        ...commonData,
        type: 'UEQ',
        scores: ueqScores,
        results: ueqResults
      }
    }
    setAssessments(prev => [...prev, newAssessment]);
    handleClearForm();
  };
  
  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to delete all saved data? This action cannot be undone.")) {
        setAssessments([]);
    }
  }

  const handleExportToExcel = () => {
    if (assessments.length === 0) {
      alert("There is no data to export.");
      return;
    }
    
    const susData = assessments.filter(a => a.type === 'SUS') as SusAssessment[];
    const ueqData = assessments.filter(a => a.type === 'UEQ') as UeqAssessment[];

    const wb = XLSX.utils.book_new();

    if (susData.length > 0) {
        const flattenedSus = susData.map(d => {
            const scoresObj: {[key: string]: number} = {};
            d.scores.forEach((s, i) => scoresObj[`Q${i+1}`] = s);
            return {
                Participant: d.participant,
                Product: d.product,
                Timestamp: d.timestamp,
                'SUS Score': d.totalScore,
                ...scoresObj,
            };
        });
        const wsSus = XLSX.utils.json_to_sheet(flattenedSus);
        XLSX.utils.book_append_sheet(wb, wsSus, "SUS Results");
    }

    if (ueqData.length > 0) {
        const flattenedUeq = ueqData.map(d => {
            const scoresObj: {[key: string]: number} = {};
            d.scores.forEach((s, i) => scoresObj[`Item ${i+1}`] = s);
            const resultsObj: {[key: string]: number} = {};
            d.results.forEach(r => resultsObj[r.scale] = parseFloat(r.mean.toFixed(2)));
            return {
                Participant: d.participant,
                Product: d.product,
                Timestamp: d.timestamp,
                ...resultsObj,
                ...scoresObj,
            };
        });
        const wsUeq = XLSX.utils.json_to_sheet(flattenedUeq);
        XLSX.utils.book_append_sheet(wb, wsUeq, "UEQ Results");
    }
    
    XLSX.writeFile(wb, "Usability_Assessments.xlsx");
  };

  return (
    <div className="text-slate-700 dark:text-slate-300 transition-colors">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Instructions />
          
          {/* Glass Card: Global Inputs */}
          <section className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/10 animate-fade-in">
             <div className="flex items-center gap-2 mb-4">
                 <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                 <h2 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-100">Assessment Details</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="participant" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Participant Name</label>
                  <input 
                    type="text" 
                    id="participant" 
                    value={participant} 
                    onChange={e => setParticipant(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400" 
                    placeholder="Enter name..." 
                  />
                </div>
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Product / System</label>
                  <input 
                    type="text" 
                    id="product" 
                    value={product} 
                    onChange={e => setProduct(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-400" 
                    placeholder="Enter system name..." 
                  />
                </div>
             </div>
          </section>

          {/* Questionnaire Toggles */}
          <div className="flex justify-center p-1.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/5 max-w-md mx-auto shadow-sm">
             <button 
                onClick={() => setActiveQuestionnaire('SUS')} 
                className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${activeQuestionnaire === 'SUS' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md transform scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30'}`}
             >
                SUS Scale
             </button>
             <button 
                onClick={() => setActiveQuestionnaire('UEQ')} 
                className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${activeQuestionnaire === 'UEQ' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md transform scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30'}`}
             >
                UEQ Scale
             </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Main Questionnaire Card */}
              <div className="lg:col-span-2 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-purple-500 to-primary-600"></div>
                {activeQuestionnaire === 'SUS' ? (
                  <Questionnaire scores={susScores} onScoreChange={handleSusScoreChange} />
                ) : (
                  <UeqQuestionnaire scores={ueqScores} onScoreChange={handleUeqScoreChange} />
                )}
              </div>

              {/* Sidebar: Results & Actions */}
              <div className="lg:col-span-1 sticky top-24 space-y-6">
                {activeQuestionnaire === 'SUS' ? (
                  <Results score={susScore} />
                ) : (
                  <UeqResults results={ueqResults} />
                )}
                
                <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 dark:border-white/10 space-y-3">
                    <button type="button" onClick={handleAddAssessment} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/30 transform hover:-translate-y-0.5">
                        Add Assessment
                    </button>
                    <button type="button" onClick={handleClearForm} className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition-all">
                        Reset Form
                    </button>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-16">
            <DataTable assessments={assessments} onClearAll={handleClearAllData} onExport={handleExportToExcel} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;