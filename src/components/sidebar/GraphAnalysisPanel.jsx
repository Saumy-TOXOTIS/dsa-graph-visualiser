// src/components/sidebar/GraphAnalysisPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BeakerIcon, MagnifyingGlassCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const GraphAnalysisPanel = ({ onFindCycle, onFindComponents, onClearAnalysis, cycleResult, componentsResult }) => {
    const hasResult = cycleResult || componentsResult;

    return (
        <motion.div 
            className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                    <MagnifyingGlassCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Graph Analysis
                </h2>
            </div>

            <div className="space-y-4">
                <motion.button
                    onClick={onFindCycle}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.97 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <BeakerIcon className="h-5 w-5" />
                        Find a Cycle
                    </span>
                </motion.button>

                <motion.button
                    onClick={onFindComponents}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.97 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        Analyze Connectivity
                    </span>
                </motion.button>

                {hasResult && (
                    <motion.div 
                        className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        {cycleResult && (
                            <motion.div 
                                className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-gray-700/80 dark:to-gray-700/50 border border-amber-200 dark:border-gray-600 shadow-sm"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1 rounded-full">
                                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold text-amber-800 dark:text-amber-300">
                                        {cycleResult.isCyclic ? "Cycle Detected!" : "No Cycle Found"}
                                    </p>
                                </div>
                                {cycleResult.isCyclic && (
                                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                        Graph contains a cycle
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {componentsResult && (
                            <motion.div 
                                className="p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-cyan-100/50 dark:from-gray-700/80 dark:to-gray-700/50 border border-blue-200 dark:border-gray-600 shadow-sm"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1 rounded-full">
                                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-semibold text-blue-800 dark:text-blue-300">
                                        {componentsResult.count} Component{componentsResult.count !== 1 ? 's' : ''} Found
                                    </p>
                                </div>
                                {componentsResult.count === 1 && (
                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                        Graph is fully connected!
                                    </p>
                                )}
                            </motion.div>
                        )}

                        <motion.button
                            onClick={onClearAnalysis}
                            className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <XCircleIcon className="h-5 w-5" />
                            Clear Analysis Results
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default GraphAnalysisPanel;