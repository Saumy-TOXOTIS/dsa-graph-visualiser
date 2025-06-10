// src/components/sidebar/SavedGraphs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const SavedGraphs = ({ savedGraphs, onLoadGraph }) => {
    if (savedGraphs.length === 0) {
        return null;
    }

    return (
        <motion.div 
            className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                    <BookmarkIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Saved Graphs
                </h2>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {savedGraphs.map((graph, index) => (
                    <motion.div
                        key={index}
                        className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => onLoadGraph(graph)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {graph.name}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                        {graph.nodes.length} nodes
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                                        {graph.edges.length} edges
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <ClockIcon className="h-3.5 w-3.5" />
                                {new Date(graph.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SavedGraphs;