// src/components/DataViewPanel.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListBulletIcon, TableCellsIcon } from '@heroicons/react/24/outline';

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
                layoutId="tabIndicator"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
        )}
    </motion.button>
);

const AdjacencyListView = ({ adjList, nodes }) => {
    const findNodeValue = (id) => nodes.find(n => n.id === id)?.value || '?';

    return (
        <div className="p-5 font-mono text-sm space-y-3">
            {Object.keys(adjList).length > 0 ? Object.entries(adjList).map(([nodeId, neighbors]) => (
                <motion.div 
                    key={nodeId} 
                    className="group bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                    whileHover={{ x: 2 }}
                >
                    <div className="flex items-start">
                        <span className="font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent min-w-[80px]">
                            {findNodeValue(parseInt(nodeId))}:
                        </span>
                        <div className="ml-4 flex flex-wrap gap-2">
                            {neighbors.length > 0 ? neighbors.map((neighbor, i) => (
                                <motion.span 
                                    key={i} 
                                    className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {findNodeValue(neighbor.node)}
                                    <span className="text-emerald-500 font-bold">{neighbor.weight}</span>
                                </motion.span>
                            )) : <span className="text-gray-500 text-sm">No connections</span>}
                        </div>
                    </div>
                </motion.div>
            )) : (
                <motion.div 
                    className="text-center py-6 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Graph is empty.
                </motion.div>
            )}
        </div>
    );
};

const AdjacencyMatrixView = ({ matrix, nodes }) => {
    return (
        <div className="p-4 overflow-x-auto">
            {nodes.length > 0 ? (
                <motion.div 
                    className="inline-block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <table className="border-collapse text-center">
                        <thead>
                            <tr>
                                <th className="p-3 w-16 h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 sticky left-0 z-10">
                                    <div className="w-6 h-6 mx-auto"></div>
                                </th>
                                {nodes.map(node => (
                                    <th 
                                        key={node.id} 
                                        title={node.value} 
                                        className="p-3 min-w-[4rem] h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 font-bold text-indigo-500 dark:text-indigo-400 truncate"
                                    >
                                        {node.value}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, i) => (
                                <tr key={i}>
                                    <td 
                                        title={nodes[i].value} 
                                        className="p-3 w-16 h-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-r border-gray-200 dark:border-gray-700 font-bold text-indigo-500 dark:text-indigo-400 sticky left-0 z-10"
                                    >
                                        {nodes[i].value}
                                    </td>
                                    {row.map((cell, j) => (
                                        <motion.td 
                                            key={j} 
                                            className={`p-3 min-w-[4rem] h-14 border-b border-gray-200 dark:border-gray-700 font-mono transition-colors ${cell > 0 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 font-bold' 
                                                : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {cell}
                                        </motion.td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            ) : (
                <motion.div 
                    className="text-center py-6 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Graph is empty.
                </motion.div>
            )}
        </div>
    );
};

const DataViewPanel = ({ adjList, adjMatrix, nodes }) => {
    const [activeView, setActiveView] = useState('list');

    return (
        <motion.div
            className="w-full mt-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-2xl">
                <TabButton isActive={activeView === 'list'} onClick={() => setActiveView('list')}>
                    <ListBulletIcon className="h-5 w-5" />
                    <span>Adjacency List</span>
                </TabButton>
                <TabButton isActive={activeView === 'matrix'} onClick={() => setActiveView('matrix')}>
                    <TableCellsIcon className="h-5 w-5" />
                    <span>Adjacency Matrix</span>
                </TabButton>
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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