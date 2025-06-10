// src/components/sidebar/GraphAnalysisPanel.jsx
import React from 'react';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';

const GraphAnalysisPanel = ({ onFindCycle, onClearCycle, cycleResult }) => {
    return (
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Graph Analysis</h2>
            <div className="space-y-3">
                <button
                    onClick={onFindCycle}
                    className="w-full text-white font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition"
                >
                    Find a Cycle
                </button>
                {cycleResult && (
                    <div className="p-3 bg-yellow-50 dark:bg-gray-700 rounded-lg text-center">
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                            {cycleResult.isCyclic ? "Cycle Found!" : "No Cycle Found."}
                        </p>
                        <button
                            onClick={onClearCycle}
                            className="mt-2 text-xs text-gray-500 hover:underline">
                            Clear Highlight
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraphAnalysisPanel;