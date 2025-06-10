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
    const inputClasses = "flex-1 border-0 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 focus:ring-indigo-400 dark:focus:ring-indigo-500 shadow-sm";
    const selectClasses = "w-full rounded-xl px-4 py-3 text-sm border-0 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 shadow-sm";

    return (
        <div className="space-y-5">
            {/* Node Input */}
            <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/60 to-white/80 dark:from-gray-800/60 dark:to-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -3 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add New Node</h3>
                </div>
                
                <div className="flex gap-3">
                    <motion.input
                        type="text"
                        value={nodeValue}
                        onChange={(e) => setNodeValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onAddNode()}
                        placeholder="Enter node value..."
                        className={inputClasses}
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                        onClick={onAddNode}
                        className="relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg min-w-[80px]"
                        whileHover={{ 
                            y: -2,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600" />
                        <span className="relative z-10 flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Edge Input */}
            <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/60 to-white/80 dark:from-gray-800/60 dark:to-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ y: -3 }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Create Edge</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <motion.select 
                        value={fromNode} 
                        onChange={(e) => setFromNode(e.target.value)} 
                        className={`${selectClasses} cursor-pointer`}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="" className="text-gray-400">From</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id} className="text-gray-800 dark:text-gray-200">
                                {node.value}
                            </option>
                        ))}
                    </motion.select>
                    
                    <motion.select 
                        value={toNode} 
                        onChange={(e) => setToNode(e.target.value)} 
                        className={`${selectClasses} cursor-pointer`}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="" className="text-gray-400">To</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id} className="text-gray-800 dark:text-gray-200">
                                {node.value}
                            </option>
                        ))}
                    </motion.select>
                    
                    <motion.input
                        type="number"
                        step="0.1"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        placeholder="Weight"
                        className={`${inputClasses} text-center`}
                        whileFocus={{ scale: 1.02 }}
                    />
                </div>
                
                <motion.button
                    onClick={onAddEdge}
                    className="w-full relative px-5 py-3 overflow-hidden font-medium text-white rounded-xl shadow-lg"
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.97 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Connect Nodes
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default GraphInputs;