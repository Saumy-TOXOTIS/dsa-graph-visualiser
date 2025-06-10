// src/components/sidebar/GraphConstructorPanel.jsx

import React, { useState } from 'react';
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
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Matrix Size: {matrix.length}x{matrix.length}</span>
                <button onClick={addRowCol} title="Increase size" className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600"><PlusIcon className="h-4 w-4" /></button>
                <button onClick={removeRowCol} title="Decrease size" disabled={matrix.length <= 1} className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400"><MinusIcon className="h-4 w-4" /></button>
            </div>
            <div className="overflow-x-auto p-1">
                <div className="inline-block">
                    {matrix.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1 mb-1">
                            {row.map((cell, colIndex) => (
                                <input
                                    key={colIndex}
                                    type="number"
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                    className="w-12 h-12 text-center font-mono rounded-md border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
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
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <MatrixInput matrix={matrix} setMatrix={setMatrix} />
            <button
                onClick={handleBuildClick}
                className="w-full mt-4 text-white font-bold px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
                Build Graph from Matrix
                <ArrowRightIcon className="h-5 w-5"/>
            </button>
        </div>
    );
};

export default GraphConstructorPanel;