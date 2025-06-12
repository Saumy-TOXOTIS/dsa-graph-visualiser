// src/components/info/FloydWarshallPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TableCellsIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const TabButton = ({ isActive, onClick, children }) => (
    <motion.button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all ${isActive
            ? 'text-indigo-600 dark:text-indigo-300'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        whileHover={!isActive ? { y: -2 } : {}}
        whileTap={{ scale: 0.98 }}
    >
        {children}
        {isActive && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full"
                layoutId="fwTabIndicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
        )}
    </motion.button>
);

const MatrixView = ({ matrix, nodes, isNextMatrix = false }) => {
    const findNodeValue = (id) => nodes.find(n => n.id === id)?.value || '?';

    return (
        <div className="p-4 overflow-x-auto">
            <motion.div
                className="inline-block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <table className="border-collapse text-center">
                    <thead>
                        <tr>
                            <th className="p-3 w-16 h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 sticky left-0 z-10"></th>
                            {nodes.map(node => (
                                <th key={node.id} title={node.value} className="p-3 min-w-[4rem] h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 font-bold text-indigo-500 dark:text-indigo-400 truncate">
                                    {node.value}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.map(rowNode => (
                            <tr key={rowNode.id}>
                                <td title={rowNode.value} className="p-3 w-16 h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-r border-gray-200 dark:border-gray-700 font-bold text-indigo-500 dark:text-indigo-400 sticky left-0 z-10">
                                    {rowNode.value}
                                </td>
                                {nodes.map(colNode => {
                                    const cell = matrix[rowNode.id]?.[colNode.id];
                                    let displayValue;
                                    if (cell === undefined || cell === null) {
                                        displayValue = '-';
                                    } else if (cell === Infinity) {
                                        displayValue = '∞';
                                    } else {
                                        displayValue = isNextMatrix ? findNodeValue(cell) : cell;
                                    }

                                    return (
                                        <motion.td key={colNode.id} className={`p-3 min-w-[4rem] h-14 border-b border-gray-200 dark:border-gray-700 font-mono transition-colors ${(cell !== Infinity && cell !== null && cell !== undefined)
                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 font-bold'
                                                : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {displayValue}
                                        </motion.td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};


const FloydWarshallPanel = ({ result, nodes }) => {
    const [activeView, setActiveView] = useState('distance');

    if (!result || !result.distances) return null;

    return (
        <motion.div
            className="w-full mt-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-2xl items-center justify-between">
                <div className="flex">
                    <TabButton isActive={activeView === 'distance'} onClick={() => setActiveView('distance')}>
                        <TableCellsIcon className="h-5 w-5" />
                        <span>Distance Matrix</span>
                    </TabButton>
                    <TabButton isActive={activeView === 'next'} onClick={() => setActiveView('next')}>
                        <ArrowPathIcon className="h-5 w-5" />
                        <span>Next Hop Matrix</span>
                    </TabButton>
                </div>
                <p className="px-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Pass: <span className="font-bold text-indigo-500 dark:text-indigo-300">{result.passNumber ?? 'N/A'}</span>
                </p>
            </div>
            <div className="max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeView === 'distance' && <MatrixView matrix={result.distances} nodes={nodes} />}
                        {activeView === 'next' && <MatrixView matrix={result.next} nodes={nodes} isNextMatrix />}
                    </motion.div>
                </AnimatePresence>
            </div>
            {result.negativeCyclePath && (
                <div className="p-4 text-center font-bold text-red-500 border-t border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
                    Negative Weight Cycle Detected!
                </div>
            )}
        </motion.div>
    );
};

export default FloydWarshallPanel;