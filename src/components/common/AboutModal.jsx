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
        visible: { y: "0%", opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { y: "50%", opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <XMarkIcon className="h-7 w-7" />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
                                About This Project
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                A journey into the world of graph algorithms.
                            </p>
                        </div>

                        <div className="space-y-6 text-left">
                            {/* Creator Section */}
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                                    <UserIcon className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Created by Saumy Tiwari</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        A passionate developer exploring the intersections of code, design, and data structures. This project is a testament to the beauty and complexity of graph theory, brought to life with an interactive and intuitive interface.
                                    </p>
                                </div>
                            </div>

                            {/* Tech Stack Section */}
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full">
                                    <CodeBracketIcon className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Technology Stack</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">React</span>
                                        <span className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">Vite</span>
                                        <span className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">Tailwind CSS</span>
                                        <span className="bg-gray-200 dark:bg-gray-700 text-sm font-medium px-3 py-1 rounded-full">Framer Motion</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                            Made with <HeartIcon className="h-5 w-5 text-red-500" /> in India.
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;