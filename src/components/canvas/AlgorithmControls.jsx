// src/components/canvas/AlgorithmControls.jsx
import React from 'react';
import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/20/solid'; // You may need to install @heroicons/react

const AlgorithmControls = ({ algorithm, progress, isPaused, onPauseToggle, onReset, speed, onSpeedChange }) => {
    if (!algorithm) return null;

    return (
        <div className="mt-4 p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{algorithm} Execution</h3>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full">
                        {progress}%
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={onPauseToggle} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
                        {isPaused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
                    </button>
                    <button onClick={onReset} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700">
                        <StopIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span>Speed:</span>
                    <select value={speed} onChange={onSpeedChange} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border-none">
                        <option value={1600}>Slow</option>
                        <option value={800}>Medium</option>
                        <option value={400}>Fast</option>
                    </select>
                </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
};

export default AlgorithmControls;