// src/components/layout/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ theme, toggleTheme, graphType, setGraphType, onAboutClick }) => {
    return (
        <header className="relative flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            {/* Decorative gradient bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
            
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    className="relative"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 blur-md opacity-20 animate-pulse" />
                    <img src='/Graph.svg' className='h-20 w-20 relative z-10' alt="Graph Logo" />
                </motion.div>
                <motion.h1 
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    DSA Graph Visualizer
                </motion.h1>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                <motion.div 
                    className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-1 py-1 border border-gray-200 dark:border-gray-700 shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => setGraphType('directed')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            graphType === 'directed'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        Directed
                    </button>
                    <button
                        onClick={() => setGraphType('undirected')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            graphType === 'undirected'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        Undirected
                    </button>
                </motion.div>

                <motion.button
                    onClick={onAboutClick}
                    className="p-2.5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-indigo-600 dark:text-indigo-400 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
                    title="About this project"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <InformationCircleIcon className="h-6 w-6 relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </motion.button>

                <motion.button
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {theme === 'light' ? (
                            <>
                                <motion.span 
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    🌙
                                </motion.span>
                                <span className="hidden sm:inline">Dark Mode</span>
                            </>
                        ) : (
                            <>
                                <motion.span
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    ☀️
                                </motion.span>
                                <span className="hidden sm:inline">Light Mode</span>
                            </>
                        )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </motion.button>
            </div>
        </header>
    );
};

export default Header;