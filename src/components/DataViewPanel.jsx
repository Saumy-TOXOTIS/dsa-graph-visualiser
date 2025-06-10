// src/components/DataViewPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListBulletIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const TabButton = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${isActive
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                : 'bg-transparent text-gray-500 hover:text-gray-200 dark:hover:bg-gray-700'
            }`}
    >
        {children}
    </button>
);

const AdjacencyListView = ({ adjList, nodes }) => {
    const findNodeValue = (id) => nodes.find(n => n.id === id)?.value || '?';

    return (
        <div className="p-4 font-mono text-sm space-y-2">
            {Object.keys(adjList).length > 0 ? Object.entries(adjList).map(([nodeId, neighbors]) => (
                <div key={nodeId} className="flex items-start">
                    <span className="font-bold text-indigo-400 min-w-[80px]">{findNodeValue(parseInt(nodeId))}:</span>
                    <div className="ml-4 flex flex-wrap gap-x-3 gap-y-1">
                        {neighbors.length > 0 ? neighbors.map((neighbor, i) => (
                            <span key={i} className="text-gray-700 dark:text-gray-300">
                                {findNodeValue(neighbor.node)}
                                <span className="text-emerald-500">({neighbor.weight})</span>
                            </span>
                        )) : <span className="text-gray-500">[]</span>}
                    </div>
                </div>
            )) : <p className="text-gray-500">Graph is empty.</p>}
        </div>
    );
};

const AdjacencyMatrixView = ({ matrix, nodes }) => {
    return (
        <div className="p-4 overflow-x-auto">
            {nodes.length > 0 ? (
                <table className="border-collapse text-center whitespace-nowrap">
                    <thead>
                        <tr>
                            <th className="p-2 w-16 h-12 border border-gray-300 dark:border-gray-600 sticky left-0 bg-white dark:bg-gray-800"></th>
                            {nodes.map(node => (
                                <th key={node.id} title={node.value} className="p-2 min-w-[4rem] h-12 border border-gray-300 dark:border-gray-600 font-bold text-indigo-400 truncate">{node.value}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td title={nodes[i].value} className="p-2 w-16 h-12 border border-gray-300 dark:border-gray-600 font-bold text-indigo-400 sticky left-0 bg-white dark:bg-gray-800 truncate">{nodes[i].value}</td>
                                {row.map((cell, j) => (
                                    <td key={j} className={`p-2 min-w-[4rem] h-12 border border-gray-300 dark:border-gray-600 font-mono transition-colors ${cell > 0 ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-gray-500'
                                        }`}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="text-gray-500 p-4">Graph is empty.</p>}
        </div>
    );
};

const DataViewPanel = ({ adjList, adjMatrix, nodes }) => {
    const [activeView, setActiveView] = useState('list');

    return (
        <motion.div
            className="w-full mt-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
                <TabButton isActive={activeView === 'list'} onClick={() => setActiveView('list')}>
                    <ListBulletIcon className="h-5 w-5" /> Adjacency List
                </TabButton>
                <TabButton isActive={activeView === 'matrix'} onClick={() => setActiveView('matrix')}>
                    <TableCellsIcon className="h-5 w-5" /> Adjacency Matrix
                </TabButton>
            </div>
            <div className="max-h-64 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeView === 'list' && <AdjacencyListView adjList={adjList} nodes={nodes} />}
                        {activeView === 'matrix' && <AdjacencyMatrixView matrix={adjMatrix} nodes={nodes} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default DataViewPanel;