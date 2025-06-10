// src/components/sidebar/GraphActions.jsx

import React from 'react';
import { motion } from 'framer-motion';

const GraphActions = ({ onClear, onRandom, onSave, onTutorial }) => {
    const buttonVariants = {
        hover: { 
            y: -3,
            scale: 1.03,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        },
        tap: { scale: 0.97 }
    };

    return (
        <motion.div 
            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                    Graph Actions
                </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <motion.button
                    onClick={onClear}
                    className="relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg group"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 group-hover:from-red-600 group-hover:to-orange-700 transition-all duration-300" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                    </span>
                </motion.button>

                <motion.button
                    onClick={onRandom}
                    className="relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg group"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 group-hover:from-purple-600 group-hover:to-indigo-700 transition-all duration-300" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Random
                    </span>
                </motion.button>

                <motion.button
                    onClick={onSave}
                    className="relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg group"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save
                    </span>
                </motion.button>

                <motion.button
                    onClick={onTutorial}
                    className="relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg group"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 group-hover:from-amber-600 group-hover:to-yellow-700 transition-all duration-300" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tutorial
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default GraphActions;