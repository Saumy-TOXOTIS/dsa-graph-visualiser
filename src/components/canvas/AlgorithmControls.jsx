// src/components/canvas/AlgorithmControls.jsx
import React from 'react';
import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

const AlgorithmControls = ({ algorithm, progress, isPaused, onPauseToggle, onReset, speed, onSpeedChange }) => {
    if (!algorithm) return null;

    return (
        <div className="mt-6 p-6 rounded-xl shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                        {algorithm} Execution
                    </h3>
                    <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                        {progress}%
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={onPauseToggle} 
                        className="p-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        {isPaused ? (
                            <PlayIcon className="h-5 w-5" />
                        ) : (
                            <PauseIcon className="h-5 w-5" />
                        )}
                    </button>
                    <button 
                        onClick={onReset} 
                        className="p-2.5 rounded-full bg-gradient-to-br from-red-600 to-pink-500 text-white hover:from-red-700 hover:to-pink-600 shadow-md hover:shadow-red-200 dark:hover:shadow-red-900/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <StopIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-300">Speed:</span>
                    <select 
                        value={speed} 
                        onChange={onSpeedChange} 
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                    >
                        <option value={1600}>Slow</option>
                        <option value={800}>Medium</option>
                        <option value={400}>Fast</option>
                    </select>
                </div>
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 shadow-inner overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_0px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>
    );
};

export default AlgorithmControls;