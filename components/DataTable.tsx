import React from 'react';
import { Assessment, SusAssessment } from '../types';

interface DataTableProps {
    assessments: Assessment[];
    onClearAll: () => void;
    onExport: () => void;
}

const DataTable: React.FC<DataTableProps> = ({ assessments, onClearAll, onExport }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-serif text-slate-800 dark:text-slate-100">
                    Saved Assessments
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your session data</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onExport}
                    disabled={assessments.length === 0}
                    className="px-4 py-2 text-sm font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Export Excel
                </button>
                <button
                    onClick={onClearAll}
                    disabled={assessments.length === 0}
                    className="px-4 py-2 text-sm font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Clear All
                </button>
            </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
            {assessments.length > 0 ? (
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">Participant</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Product</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Type</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Score</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {assessments.slice().reverse().map(item => (
                            <tr key={item.id} className="bg-white/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.participant}</td>
                                <td className="px-6 py-4">{item.product}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${item.type === 'SUS' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-serif text-lg text-slate-800 dark:text-slate-200">
                                    {item.type === 'SUS' ? item.totalScore.toFixed(1) : `${item.results[0].mean.toFixed(2)}`}
                                </td>
                                <td className="px-6 py-4 text-xs font-medium opacity-70">{item.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-16 bg-white/30 dark:bg-slate-800/30">
                    <p className="text-slate-400 dark:text-slate-500 text-lg">No assessments saved yet</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Add your first assessment above</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default DataTable;