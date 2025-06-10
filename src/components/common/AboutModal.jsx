// src/components/common/AboutModal.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CodeBracketIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

const AboutModal = ({ isOpen, onClose }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { y: "-50%", opacity: 0, scale: 0.9 },
        visible: { 
            y: "0%", 
            opacity: 1, 
            scale: 1, 
            transition: { 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                staggerChildren: 0.1,
                when: "beforeChildren"
            } 
        },
        exit: { y: "50%", opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-gradient-to-br from-black/80 to-indigo-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 pointer-events-none" />
                        
                        <div className="relative z-10 p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full p-1.5 shadow-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-all hover:scale-110"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="text-center mb-8">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-block p-1 rounded-lg mb-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-md px-4 py-2">
                                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                            About This Project
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-indigo-500 dark:text-indigo-300 font-medium mt-1">
                                    A journey into the world of graph algorithms
                                </p>
                            </div>

                            <motion.div 
                                className="space-y-6 text-left"
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Creator Section */}
                                <motion.div 
                                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                                    variants={itemVariants}
                                >
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full shadow-md">
                                        <UserIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Created by Saumy Tiwari</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            A passionate developer exploring the intersections of code, design, and data structures. This project is a testament to the beauty and complexity of graph theory, brought to life with an interactive and intuitive interface.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Tech Stack Section */}
                                <motion.div 
                                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                                    variants={itemVariants}
                                >
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-full shadow-md">
                                        <CodeBracketIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Technology Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                                                React
                                            </span>
                                            <span className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-700 dark:text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                                                Vite
                                            </span>
                                            <span className="bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-900/50 dark:to-sky-900/50 text-cyan-700 dark:text-cyan-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                                                Tailwind CSS
                                            </span>
                                            <span className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 text-rose-700 dark:text-rose-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                                                Framer Motion
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Made with 
                                <motion.span 
                                    className="mx-1 inline-block"
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    <HeartIcon className="h-5 w-5 text-rose-500" />
                                </motion.span> 
                                in India.
                            </motion.div>
                        </div>
                        
                        {/* Decorative corner accents */}
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-indigo-500 rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500 rounded-bl-2xl" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;