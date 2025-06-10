// src/components/sidebar/AlgorithmPanel.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToggleSwitch from '../common/ToggleSwitch';

const AlgorithmPanel = ({ nodes, graphType, isRunning, onRunAlgorithm }) => {
    const [traversalType, setTraversalType] = useState('BFS');
    const [isTraversalToggleChecked, setIsTraversalToggleChecked] = useState(false);
    const [startNode, setStartNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    const [heuristicType, setHeuristicType] = useState('euclidean');

    useEffect(() => {
        setTraversalType(isTraversalToggleChecked ? 'DFS' : 'BFS');
    }, [isTraversalToggleChecked]);

    const selectClasses = "w-full rounded-xl px-4 py-3 text-sm border-0 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500";

    const handleRunTraversal = () => { if (startNode) onRunAlgorithm(traversalType, { startNode: parseInt(startNode) }); };
    const handleRunDijkstra = () => { if (startNode && targetNode) onRunAlgorithm('Dijkstra', { dijkstraStart: parseInt(startNode), dijkstraTarget: parseInt(targetNode) }); };
    const handleRunAStar = () => { if (startNode && targetNode) onRunAlgorithm('AStar', { dijkstraStart: parseInt(startNode), dijkstraTarget: parseInt(targetNode), heuristicType }); };
    const handleRunPrim = () => onRunAlgorithm('Prim', {});
    const handleRunKruskal = () => onRunAlgorithm('Kruskal', {});
    const handleRunTopoSort = () => onRunAlgorithm('TopologicalSort', {});
    const handleRunBellmanFord = () => { if (startNode) onRunAlgorithm('BellmanFord', { startNode: parseInt(startNode) }); };

    const buttonVariants = {
        hover: { 
            y: -2,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        },
        tap: { scale: 0.97 }
    };

    return (
        <motion.div 
            className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Graph Algorithms
                </h2>
            </div>

            {/* Traversal: BFS/DFS */}
            <motion.div 
                className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="mb-4">
                    <ToggleSwitch
                        isChecked={isTraversalToggleChecked}
                        onChange={() => setIsTraversalToggleChecked(prev => !prev)}
                        option1="BFS"
                        option2="DFS"
                    />
                </div>
                <motion.select 
                    value={startNode} 
                    onChange={(e) => setStartNode(e.target.value)} 
                    className={`${selectClasses} mb-4 cursor-pointer`}
                    whileFocus={{ scale: 1.02 }}
                >
                    <option value="">Select Start Node</option>
                    {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                </motion.select>
                <motion.button
                    onClick={handleRunTraversal}
                    disabled={!startNode || isRunning}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                    variants={buttonVariants}
                    whileHover={!isRunning && startNode ? "hover" : {}}
                    whileTap={!isRunning && startNode ? "tap" : {}}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 ${(!startNode || isRunning) ? 'opacity-50' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isRunning ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </motion.span>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                        {isRunning ? 'Running...' : `Run ${traversalType}`}
                    </span>
                </motion.button>
            </motion.div>

            {/* Pathfinding: Dijkstra/A* */}
            <motion.div 
                className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Pathfinding
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <motion.select 
                        value={startNode} 
                        onChange={(e) => setStartNode(e.target.value)} 
                        className={`${selectClasses} cursor-pointer`}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="">From</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </motion.select>
                    <motion.select 
                        value={targetNode} 
                        onChange={(e) => setTargetNode(e.target.value)} 
                        className={`${selectClasses} cursor-pointer`}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="">To</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </motion.select>
                </div>
                
                {/* Dijkstra */}
                <motion.button
                    onClick={handleRunDijkstra}
                    disabled={!startNode || !targetNode || isRunning}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg mb-3"
                    variants={buttonVariants}
                    whileHover={!isRunning && startNode && targetNode ? "hover" : {}}
                    whileTap={!isRunning && startNode && targetNode ? "tap" : {}}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 ${(!startNode || !targetNode || isRunning) ? 'opacity-50' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Run Dijkstra
                    </span>
                </motion.button>
                
                {/* Bellman-Ford */}
                <motion.button
                    onClick={handleRunBellmanFord}
                    disabled={!startNode || !targetNode || isRunning}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg mb-3"
                    variants={buttonVariants}
                    whileHover={!isRunning && startNode && targetNode ? "hover" : {}}
                    whileTap={!isRunning && startNode && targetNode ? "tap" : {}}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 ${(!startNode || !targetNode || isRunning) ? 'opacity-50' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Run Bellman-Ford
                    </span>
                </motion.button>
                
                {/* A* */}
                <motion.select 
                    value={heuristicType} 
                    onChange={(e) => setHeuristicType(e.target.value)} 
                    className={`${selectClasses} mb-3 cursor-pointer`}
                    whileFocus={{ scale: 1.02 }}
                >
                    <option value="euclidean">Euclidean Heuristic</option>
                    <option value="manhattan">Manhattan Heuristic</option>
                </motion.select>
                <motion.button
                    onClick={handleRunAStar}
                    disabled={!startNode || !targetNode || isRunning}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                    variants={buttonVariants}
                    whileHover={!isRunning && startNode && targetNode ? "hover" : {}}
                    whileTap={!isRunning && startNode && targetNode ? "tap" : {}}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 ${(!startNode || !targetNode || isRunning) ? 'opacity-50' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                        </svg>
                        Run A* Search
                    </span>
                </motion.button>
            </motion.div>

            {/* MST Algorithms */}
            <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Minimum Spanning Tree
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <motion.button
                        onClick={handleRunPrim}
                        disabled={nodes.length === 0 || isRunning}
                        className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                        variants={buttonVariants}
                        whileHover={!isRunning && nodes.length > 0 ? "hover" : {}}
                        whileTap={!isRunning && nodes.length > 0 ? "tap" : {}}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 ${(nodes.length === 0 || isRunning) ? 'opacity-50' : ''}`} />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Run Prim's MST
                        </span>
                    </motion.button>
                    <motion.button
                        onClick={handleRunKruskal}
                        disabled={nodes.length === 0 || isRunning}
                        className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                        variants={buttonVariants}
                        whileHover={!isRunning && nodes.length > 0 ? "hover" : {}}
                        whileTap={!isRunning && nodes.length > 0 ? "tap" : {}}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-600 ${(nodes.length === 0 || isRunning) ? 'opacity-50' : ''}`} />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Run Kruskal's
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Topological Sort */}
            <motion.div 
                className="pt-6 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Topological Sort
                </h3>
                <motion.button
                    onClick={handleRunTopoSort}
                    disabled={graphType !== 'directed' || nodes.length === 0 || isRunning}
                    className="w-full relative overflow-hidden px-5 py-3 font-semibold rounded-xl text-white shadow-lg"
                    variants={buttonVariants}
                    whileHover={!isRunning && graphType === 'directed' && nodes.length > 0 ? "hover" : {}}
                    whileTap={!isRunning && graphType === 'directed' && nodes.length > 0 ? "tap" : {}}
                    title={graphType !== 'directed' ? "Only available for directed graphs" : ""}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 ${(graphType !== 'directed' || nodes.length === 0 || isRunning) ? 'opacity-50' : ''}`} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Run Topological Sort
                    </span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default AlgorithmPanel;