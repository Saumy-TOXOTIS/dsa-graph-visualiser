// src/components/sidebar/GraphActions.jsx

import React from 'react';

const GraphActions = ({ onClear, onRandom, onSave, onTutorial }) => {
    return (
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Graph Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onClear}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:opacity-90 transition"
                >
                    Clear
                </button>
                <button
                    onClick={onRandom}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                >
                    Random
                </button>
                <button
                    onClick={onSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition"
                >
                    Save
                </button>
                <button
                    onClick={onTutorial}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg hover:opacity-90 transition"
                >
                    Tutorial
                </button>
            </div>
        </div>
    );
};

export default GraphActions;