// src/components/sidebar/GraphConstructorPanel.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const MatrixInput = ({ matrix, setMatrix }) => {
    const handleCellChange = (rowIndex, colIndex, value) => {
        const newMatrix = matrix.map(row => [...row]);
        const numValue = value === '' ? 0 : parseInt(value, 10);
        newMatrix[rowIndex][colIndex] = isNaN(numValue) ? 0 : numValue;
        setMatrix(newMatrix);
    };

    const addRowCol = () => {
        const newSize = matrix.length + 1;
        const newMatrix = Array(newSize).fill(0).map((_, i) =>
            Array(newSize).fill(0).map((__, j) =>
                (matrix[i] && matrix[i][j] !== undefined) ? matrix[i][j] : 0
            )
        );
        setMatrix(newMatrix);
    };

    const removeRowCol = () => {
        if (matrix.length > 1) {
            setMatrix(matrix.slice(0, -1).map(row => row.slice(0, -1)));
        }
    };

    return (
        <div className="space-y-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Matrix Size: {matrix.length}x{matrix.length}</span>
                </div>
                <div className="flex gap-2">
                    <motion.button 
                        onClick={addRowCol} 
                        title="Increase size"
                        className="p-1.5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <PlusIcon className="h-4 w-4" />
                    </motion.button>
                    <motion.button 
                        onClick={removeRowCol} 
                        title="Decrease size" 
                        disabled={matrix.length <= 1}
                        className="p-1.5 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-sm disabled:from-gray-400 disabled:to-gray-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MinusIcon className="h-4 w-4" />
                    </motion.button>
                </div>
            </div>
            <div className="overflow-x-auto p-1">
                <div className="inline-block border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50">
                    {matrix.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2 mb-2 last:mb-0">
                            {row.map((cell, colIndex) => (
                                <motion.input
                                    key={colIndex}
                                    type="number"
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                    className="w-12 h-12 text-center font-mono rounded-lg border-0 bg-white/90 dark:bg-gray-900/90 shadow-sm focus:ring-2 focus:ring-indigo-500"
                                    whileFocus={{ 
                                        scale: 1.05,
                                        boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)"
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GraphConstructorPanel = ({ onBuild }) => {
    const [matrix, setMatrix] = useState([ [0, 1, 0], [0, 0, 1], [1, 0, 0] ]); // Default 3x3 cycle

    const handleBuildClick = () => {
        onBuild({ type: 'matrix', data: matrix });
    };
    
    return (
        <motion.div 
            className="p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <MatrixInput matrix={matrix} setMatrix={setMatrix} />
            
            <motion.button
                onClick={handleBuildClick}
                className="w-full mt-5 relative overflow-hidden px-5 py-3 font-bold rounded-xl text-white shadow-lg"
                whileHover={{ 
                    y: -2,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.97 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Build Graph from Matrix
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ArrowRightIcon className="h-5 w-5"/>
                    </motion.span>
                </span>
            </motion.button>
        </motion.div>
    );
};

export default GraphConstructorPanel;