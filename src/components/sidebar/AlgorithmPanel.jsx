// src/components/sidebar/AlgorithmPanel.jsx

import React, { useState, useEffect } from 'react';
import ToggleSwitch from '../common/ToggleSwitch';

const AlgorithmPanel = ({ nodes, graphType, isRunning, onRunAlgorithm }) => {
    const [traversalType, setTraversalType] = useState('BFS');
    const [isTraversalToggleChecked, setIsTraversalToggleChecked] = useState(false);

    // Inputs for algorithms
    const [startNode, setStartNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    const [heuristicType, setHeuristicType] = useState('euclidean');

    useEffect(() => {
        setTraversalType(isTraversalToggleChecked ? 'DFS' : 'BFS');
    }, [isTraversalToggleChecked]);

    const selectClasses = "w-full rounded-xl px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

    const handleRunTraversal = () => { if (startNode) onRunAlgorithm(traversalType, { startNode: parseInt(startNode) }); };

    const handleRunDijkstra = () => { if (startNode && targetNode) onRunAlgorithm('Dijkstra', { dijkstraStart: parseInt(startNode), dijkstraTarget: parseInt(targetNode) }); };

    const handleRunAStar = () => { if (startNode && targetNode) onRunAlgorithm('AStar', { dijkstraStart: parseInt(startNode), dijkstraTarget: parseInt(targetNode), heuristicType }); };

    const handleRunPrim = () => onRunAlgorithm('Prim', {});

    const handleRunKruskal = () => onRunAlgorithm('Kruskal', {});

    const handleRunTopoSort = () => onRunAlgorithm('TopologicalSort', {});

    const handleRunBellmanFord = () => { if (startNode) onRunAlgorithm('BellmanFord', { startNode: parseInt(startNode) }); };

    return (
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Algorithms</h2>

            {/* Traversal: BFS/DFS */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                    <ToggleSwitch
                        isChecked={isTraversalToggleChecked}
                        onChange={() => setIsTraversalToggleChecked(prev => !prev)}
                        option1="BFS"
                        option2="DFS"
                    />
                </div>
                <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className={selectClasses + " mb-3"}>
                    <option value="">Select Start Node</option>
                    {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                </select>
                <button onClick={handleRunTraversal} disabled={!startNode || isRunning} className="w-full text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                    {isRunning ? 'Running...' : `Run ${traversalType}`}
                </button>
            </div>

            {/* Pathfinding: Dijkstra/A* */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Pathfinding</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className={selectClasses}>
                        <option value="">From</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </select>
                    <select value={targetNode} onChange={(e) => setTargetNode(e.target.value)} className={selectClasses}>
                        <option value="">To</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </select>
                </div>
                {/* Dijkstra */}
                <button onClick={handleRunDijkstra} disabled={!startNode || !targetNode || isRunning} className="w-full mb-3 text-white px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                    Run Dijkstra
                </button>
                {/* Bellman-Ford */}
                <button onClick={handleRunBellmanFord} disabled={!startNode || !targetNode || isRunning} className="w-full text-white mb-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                    Run Bellman-Ford
                </button>
                {/* A* */}
                <select value={heuristicType} onChange={(e) => setHeuristicType(e.target.value)} className={selectClasses + " mb-3"}>
                    <option value="euclidean">Euclidean Heuristic</option>
                    <option value="manhattan">Manhattan Heuristic</option>
                </select>
                <button onClick={handleRunAStar} disabled={!startNode || !targetNode || isRunning} className="w-full text-white px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                    Run A* Search
                </button>
            </div>

            {/* Prim's MST */}
            <div className='grid grid-row-2'>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Minimum Spanning Tree</h3>
                <div className='grid grid-row-2 gap-4'>
                    <button onClick={handleRunPrim} disabled={nodes.length === 0 || isRunning} className="w-full text-white px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                        Run Prim's MST
                    </button>
                    <button onClick={handleRunKruskal} disabled={nodes.length === 0 || isRunning} className="w-full text-white px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400">
                        Run Kruskal's
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Topological Sort</h3>
                <button
                    onClick={handleRunTopoSort}
                    disabled={graphType !== 'directed' || nodes.length === 0 || isRunning}
                    className="w-full text-white px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:opacity-90 transition disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed"
                    title={graphType !== 'directed' ? "Only available for directed graphs" : ""}
                >
                    Run Topological Sort
                </button>
            </div>
        </div>
    );
};

export default AlgorithmPanel;