// src/components/sidebar/GraphAnalysisPanel.jsx
import React from 'react';
import { BeakerIcon, MagnifyingGlassCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const GraphAnalysisPanel = ({ onFindCycle, onFindComponents, onClearAnalysis, cycleResult, componentsResult }) => {
    const hasResult = cycleResult || componentsResult;

    return (
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Graph Analysis</h2>
            <div className="space-y-3">
                <button onClick={onFindCycle} className="w-full text-white font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition">
                    Find a Cycle
                </button>
                <button onClick={onFindComponents} className="w-full text-white font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:opacity-90 transition">
                    Analyze Connectivity
                </button>

                {hasResult && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        {cycleResult && (
                            <div className="p-3 bg-yellow-50 dark:bg-gray-700 rounded-lg text-center">
                                <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                                    {cycleResult.isCyclic ? "Cycle Found!" : "No Cycle Found."}
                                </p>
                            </div>
                        )}
                        {componentsResult && (
                            <div className="p-3 bg-sky-50 dark:bg-gray-700 rounded-lg text-center">
                                <p className="font-semibold text-sky-800 dark:text-sky-300">
                                    Found {componentsResult.count} Component(s)
                                </p>
                                {componentsResult.count === 1 && <p className="text-xs text-green-600 dark:text-green-400">Graph is fully connected!</p>}
                            </div>
                        )}
                        <button onClick={onClearAnalysis} className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400">
                            <XCircleIcon className="h-4 w-4" />
                            Clear Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraphAnalysisPanel;