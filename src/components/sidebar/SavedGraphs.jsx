// src/components/sidebar/SavedGraphs.jsx

import React from 'react';

const SavedGraphs = ({ savedGraphs, onLoadGraph }) => {
    if (savedGraphs.length === 0) {
        return null;
    }

    return (
        <div className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Saved Graphs</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedGraphs.map((graph, index) => (
                    <div
                        key={index}
                        className="p-3 rounded-lg flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => onLoadGraph(graph)}
                    >
                        <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{graph.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{graph.nodes.length} nodes, {graph.edges.length} edges</div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(graph.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedGraphs;