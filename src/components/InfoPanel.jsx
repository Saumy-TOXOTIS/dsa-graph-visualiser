// src/components/InfoPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ClipboardDocumentListIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const ResultItem = ({ node, type }) => {
    const nodeValue = node?.value || 'N/A';
    // --- UPDATED: Add pathStack color for DFS ---
    const colors = {
        default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        start: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        target: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        path: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        pathStack: 'bg-gradient-to-r from-green-500 to-teal-500 text-white', // For DFS stack
        visited: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white',
        current: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
    };
    return (
        <motion.span
            className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${colors[type] || colors.default}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {nodeValue}
        </motion.span>
    );
}

const InfoPanel = ({ nodes, edges, graphType, algoResults }) => {
    // --- UPDATED: Get currentAlgorithm to differentiate rendering ---
    const { currentAlgorithm, traversalResult, dijkstraResult, primResult, aStarResult, topoSortResult, bellmanFordResult, kruskalResult } = algoResults;

    const findNode = (id) => nodes.find(n => n.id === id);

    // --- UPDATED: Logic to decide which array to map over ---
    const traversalDisplayOrder = traversalResult?.visitedNodes || traversalResult?.visitedOrder;

    return (
        <div className="w-full lg:w-3/4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graph Info */}
            <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Graph Information
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                        className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-700/80 p-4 rounded-xl text-center border border-indigo-100 dark:border-gray-600 shadow-sm"
                        whileHover={{ y: -2 }}
                    >
                        <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Total Nodes</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{nodes.length}</div>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-700/80 p-4 rounded-xl text-center border border-indigo-100 dark:border-gray-600 shadow-sm"
                        whileHover={{ y: -2 }}
                    >
                        <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Total Edges</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{edges.length}</div>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-700/80 p-4 rounded-xl text-center col-span-2 border border-indigo-100 dark:border-gray-600 shadow-sm"
                        whileHover={{ y: -2 }}
                    >
                        <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Graph Type</div>
                        <div className="text-2xl font-bold capitalize text-gray-900 dark:text-white">{graphType}</div>
                    </motion.div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1 rounded-lg">
                        <ArrowsRightLeftIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Edge List
                    </h3>
                </div>

                <div className="flex-1 space-y-3 pr-2 -mr-2 overflow-y-auto max-h-[150px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {edges.length > 0 ? (
                        edges.map(edge => {
                            const startNode = findNode(edge.start);
                            const endNode = findNode(edge.end);
                            return (
                                <motion.div
                                    key={edge.id}
                                    className="group bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center text-sm shadow-sm hover:shadow-md transition-all"
                                    whileHover={{ x: 2 }}
                                >
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {startNode?.value || '?'}
                                        <span className="mx-2 text-indigo-500 font-sans">
                                            {graphType === 'directed' ? (
                                                <motion.span
                                                    animate={{ x: [0, 2, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    →
                                                </motion.span>
                                            ) : '↔'}
                                        </span>
                                        {endNode?.value || '?'}
                                    </span>
                                    <span className="text-xs bg-gradient-to-r from-indigo-200 to-indigo-300 dark:from-indigo-800 dark:to-indigo-700 text-indigo-800 dark:text-indigo-200 font-semibold px-2.5 py-1 rounded-full">
                                        {edge.weight.toFixed(1)}
                                    </span>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            className="text-center py-4 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No edges to display.
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Algorithm Results */}
            <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Algorithm Results
                    </h2>
                </div>

                <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
                    {/* --- UPDATED: Main fix is here --- */}
                    {traversalResult && traversalDisplayOrder && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Traversal Order ({currentAlgorithm})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {traversalDisplayOrder.map((id, idx) => {
                                    let type = 'default';
                                    if (currentAlgorithm === 'BFS') {
                                        type = traversalResult.stepIndex >= idx ?
                                            (traversalResult.currentStep === id ? 'current' : 'visited') : 'default';
                                    } else if (currentAlgorithm === 'DFS') {
                                        // For DFS, we color based on the final state shown in the panel
                                        type = 'visited';
                                        if (traversalResult.pathStack?.includes(id)) type = 'pathStack';
                                        if (traversalResult.currentNode === id) type = 'current';
                                    }

                                    return (
                                        <ResultItem
                                            key={idx}
                                            node={findNode(id)}
                                            type={type}
                                        />
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}


                    {dijkstraResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        >
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Dijkstra's Path
                            </h3>
                            {dijkstraResult.path.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {dijkstraResult.path.map((id, idx) => (
                                            <ResultItem
                                                key={idx}
                                                node={findNode(id)}
                                                type={idx === 0 ? 'start' :
                                                    (idx === dijkstraResult.path.length - 1 ? 'target' : 'path')}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm bg-indigo-50 dark:bg-gray-700 p-2 rounded-lg border border-indigo-100 dark:border-gray-600">
                                        <span className="font-medium">Total Distance: </span>
                                        <span className="font-bold">
                                            {dijkstraResult.distances[dijkstraResult.path[dijkstraResult.path.length - 1]]?.toFixed(1) ?? 'N/A'}
                                        </span>
                                    </p>
                                </>
                            ) : <p className="text-red-500 font-medium">No path found.</p>}
                        </motion.div>
                    )}

                    {aStarResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-indigo-600 dark:text-indigo-400">A* Path</h3>
                            {aStarResult.path && aStarResult.path.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {aStarResult.path.map((id, idx) => (
                                            <ResultItem key={idx} node={findNode(id)} type={idx === 0 ? 'start' : (idx === aStarResult.path.length - 1 ? 'target' : 'path')} />
                                        ))}
                                    </div>
                                    {/* --- THE FIX IS HERE --- */}
                                    <p className="text-sm bg-indigo-50 dark:bg-gray-700 p-2 rounded-lg border border-indigo-100 dark:border-gray-600">
                                        <span className="font-medium">Total Distance: </span>
                                        <span className="font-bold">
                                            {aStarResult.totalDistance?.toFixed(1) ?? 'N/A'}
                                        </span>
                                    </p>
                                </>
                            ) : <p className="text-red-500 font-medium">No path found.</p>}
                        </div>
                    )}

                    {primResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-purple-600 dark:text-purple-400">Prim's MST</h3>
                            <p className="font-medium mb-2">Total Weight: <span className="font-bold">{primResult.mstEdges.reduce((acc, edge) => acc + edge.weight, 0).toFixed(1)}</span></p>
                            <div className="mt-1 space-y-1">
                                {primResult.mstEdges.map((edge, idx) => (
                                    <div key={idx} className="text-sm bg-purple-50 dark:bg-gray-700 p-2 rounded-lg">
                                        {findNode(edge.from)?.value || '?'} ↔ {findNode(edge.to)?.value || '?'} (w: {edge.weight.toFixed(1)})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {kruskalResult && kruskalResult.mstEdges && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-purple-600 dark:text-purple-400">Kruskal's MST</h3>
                            <p className="font-medium mb-2">Total Weight: <span className="font-bold">{kruskalResult.mstEdges.reduce((acc, edge) => acc + edge.weight, 0).toFixed(1)}</span></p>
                            <div className="mt-1 space-y-1">
                                {kruskalResult.mstEdges.map((edge, idx) => (
                                    <div key={idx} className="text-sm bg-violet-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                        {findNode(edge.start)?.value || '?'} ↔ {findNode(edge.end)?.value || '?'} (w: {edge.weight.toFixed(1)})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {bellmanFordResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-orange-600 dark:text-orange-400">Bellman-Ford Result</h3>
                            {bellmanFordResult.negativeCycle ? (
                                <p className="text-red-500 font-bold">Error: Negative Weight Cycle Detected!</p>
                            ) : (
                                <div>
                                    <p className="mb-2">Final shortest path distances:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(bellmanFordResult.distances).map(([nodeId, dist]) => (
                                            <div key={nodeId} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                                <span>{nodes.find(n => n.id === parseInt(nodeId))?.value || '?'}: </span>
                                                <span className="font-bold">{dist === Infinity ? '∞' : dist.toFixed(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <p className="mt-2 text-xs italic text-gray-500">{bellmanFordResult.description}</p>
                        </div>
                    )}

                    {topoSortResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-sky-600 dark:text-sky-400">Topological Sort Result</h3>
                            {topoSortResult.cycleDetected ? (
                                <p className="text-red-500 font-bold">Error: Cycle Detected! A topological sort is not possible.</p>
                            ) : (
                                <>
                                    <p className="mb-2">{topoSortResult.description}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {topoSortResult.sortedOrder?.map((id, idx) => (
                                            <ResultItem key={idx} node={findNode(id)} type={'visited'} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {!traversalResult && !dijkstraResult && !primResult && !aStarResult && !topoSortResult && !bellmanFordResult && !kruskalResult && (
                        <motion.div
                            className="text-center py-6 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Run an algorithm to see results.
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InfoPanel;