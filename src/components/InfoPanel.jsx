// src/components/InfoPanel.jsx
import React from 'react';
import { ChartBarIcon, ClipboardDocumentListIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const ResultItem = ({ node, type }) => {
    const nodeValue = node?.value || 'N/A';
    const colors = {
        default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        start: 'bg-green-500 text-white',
        target: 'bg-red-500 text-white',
        path: 'bg-orange-500 text-white',
        visited: 'bg-emerald-500 text-white',
        current: 'bg-pink-500 text-white',
    };
    return <span className={`px-2 py-1 rounded text-sm font-mono ${colors[type]}`}>{nodeValue}</span>;
}

const InfoPanel = ({ nodes, edges, graphType, algoResults }) => {
    const { traversalResult, dijkstraResult, primResult, aStarResult, topoSortResult, bellmanFordResult } = algoResults;

    const findNode = (id) => nodes.find(n => n.id === id);

    return (
        <div className="w-full lg:w-3/4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graph Info */}
            <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><ChartBarIcon className="h-5 w-5" /> Graph Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Total Nodes</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{nodes.length}</div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Total Edges</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{edges.length}</div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl text-center col-span-2">
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">Graph Type</div>
                        <div className="text-xl font-bold capitalize text-gray-900 dark:text-white">{graphType}</div>
                    </div>
                </div>
                <h3 className="text-md mt-4 mb-4 font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <ArrowsRightLeftIcon className="h-5 w-5" /> Edge List
                </h3>
                <div className="flex-1 space-y-2 pr-2 -mr-2 overflow-y-auto max-h-[150px]">
                    {edges.length > 0 ? (
                        edges.map(edge => {
                            const startNode = findNode(edge.start);
                            const endNode = findNode(edge.end);
                            return (
                                <div key={edge.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex justify-between items-center text-sm">
                                    <span className="font-mono text-gray-800 dark:text-gray-200">
                                        {startNode?.value || '?'}
                                        <span className="text-indigo-500 font-sans px-2">{graphType === 'directed' ? '→' : '↔'}</span>
                                        {endNode?.value || '?'}
                                    </span>
                                    <span className="text-xs bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 font-semibold px-2 py-0.5 rounded-full">
                                        {edge.weight.toFixed(1)}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 pt-4">No edges to display.</div>
                    )}
                </div>
            </div>

            {/* Algorithm Results */}
            <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><ClipboardDocumentListIcon className="h-5 w-5" /> Algorithm Results</h2>
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    {traversalResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-indigo-600 dark:text-indigo-400">Traversal Order</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {traversalResult.visitedOrder.map((id, idx) => (
                                    <ResultItem key={idx} node={findNode(id)} type={traversalResult.stepIndex >= idx ? (traversalResult.currentStep === id ? 'current' : 'visited') : 'default'} />
                                ))}
                            </div>
                        </div>
                    )}
                    {dijkstraResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-indigo-600 dark:text-indigo-400">Dijkstra's Path</h3>
                            {dijkstraResult.path.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {dijkstraResult.path.map((id, idx) => (
                                            <ResultItem key={idx} node={findNode(id)} type={idx === 0 ? 'start' : (idx === dijkstraResult.path.length - 1 ? 'target' : 'path')} />
                                        ))}
                                    </div>
                                    <p><span className="font-medium">Total Distance:</span> {dijkstraResult.distances[dijkstraResult.path[dijkstraResult.path.length - 1]]?.toFixed(1) ?? 'N/A'}</p>
                                </>
                            ) : <p>No path found.</p>}
                        </div>
                    )}
                    {aStarResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-indigo-600 dark:text-indigo-400">A* Path</h3>
                            {aStarResult.path.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {aStarResult.path.map((id, idx) => (
                                            <ResultItem key={idx} node={findNode(id)} type={idx === 0 ? 'start' : (idx === aStarResult.path.length - 1 ? 'target' : 'path')} />
                                        ))}
                                    </div>
                                </>
                            ) : <p>No path found.</p>}
                        </div>
                    )}
                    {primResult && (
                        <div>
                            <h3 className="font-semibold text-md mb-2 text-purple-600 dark:text-purple-400">Prim's MST</h3>
                            <div className="mt-1 space-y-1">
                                {primResult.mstEdges.map((edge, idx) => (
                                    <div key={idx} className="text-sm bg-purple-50 dark:bg-gray-700 p-2 rounded-lg">
                                        {findNode(edge.from)?.value || '?'} ↔ {findNode(edge.to)?.value || '?'} (w: {edge.weight.toFixed(1)})
                                    </div>
                                ))}
                            </div>
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
                    {!traversalResult && !dijkstraResult && !primResult && !aStarResult && !topoSortResult && !bellmanFordResult && (
                        <div className="text-center py-4 text-gray-500">Run an algorithm to see results.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;