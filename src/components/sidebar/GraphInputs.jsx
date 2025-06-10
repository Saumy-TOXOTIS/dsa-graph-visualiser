// src/components/sidebar/GraphInputs.jsx

import React from 'react';
import { motion } from 'framer-motion';

const GraphInputs = ({
    nodes,
    nodeValue, setNodeValue, onAddNode,
    fromNode, setFromNode,
    toNode, setToNode,
    edgeWeight, setEdgeWeight,
    onAddEdge
}) => {
    const inputClasses = "flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500";
    const selectClasses = "w-full rounded-xl px-2 py-3 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

    return (
        <>
            {/* Node Input */}
            <motion.div
                className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
                whileHover={{ y: -5 }}
            >
                <label className="text-center block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Add New Node</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={nodeValue}
                        onChange={(e) => setNodeValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onAddNode()}
                        placeholder="Node Value"
                        className={inputClasses}
                    />
                    <button
                        onClick={onAddNode}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition flex items-center"
                    >
                        Add
                    </button>
                </div>
            </motion.div>

            {/* Edge Input */}
            <motion.div
                className="p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
                whileHover={{ y: -5 }}
            >
                <label className="text-center block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Add Edge</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <select value={fromNode} onChange={(e) => setFromNode(e.target.value)} className={selectClasses}>
                        <option value="">From</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </select>
                    <select value={toNode} onChange={(e) => setToNode(e.target.value)} className={selectClasses}>
                        <option value="">To</option>
                        {nodes.map((node) => <option key={node.id} value={node.id}>{node.value}</option>)}
                    </select>
                    <input
                        type="number"
                        step="0.1"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        placeholder="Weight"
                        className={`${selectClasses} text-center`}
                    />
                </div>
                <button
                    onClick={onAddEdge}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:opacity-90 transition"
                >
                    Add Edge
                </button>
            </motion.div>
        </>
    );
};

export default GraphInputs;