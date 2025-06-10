// src/components/layout/Header.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ theme, toggleTheme, graphType, setGraphType, onAboutClick }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                    <img src='/Graph.svg' className='h-20 w-20' ></img>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                    DSA Graph Visualizer
                </h1>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                <div className="flex gap-2 bg-gray-200 dark:bg-gray-800 rounded-full px-2 py-1">
                    <button
                        onClick={() => setGraphType('directed')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${graphType === 'directed'
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                                : 'bg-transparent text-gray-800 dark:text-gray-200'
                            }`}
                    >
                        Directed
                    </button>
                    <button
                        onClick={() => setGraphType('undirected')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${graphType === 'undirected'
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                                : 'bg-transparent text-gray-800 dark:text-gray-200'
                            }`}
                    >
                        Undirected
                    </button>
                </div>
                <button
                    onClick={onAboutClick}
                    className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="About this project"
                >
                    <InformationCircleIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                    <span className="hidden sm:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;