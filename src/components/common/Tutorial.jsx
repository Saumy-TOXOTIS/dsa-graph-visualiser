// src/components/common/Tutorial.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { TUTORIAL_STEPS } from '../../constants/tutorial';

const Tutorial = ({ show, onHide, step, onStepChange }) => {
    if (!show) return null;

    const handleNext = () => onStepChange(Math.min(step + 1, TUTORIAL_STEPS.length - 1));
    const handlePrev = () => onStepChange(Math.max(0, step - 1));
    const isLastStep = step === TUTORIAL_STEPS.length - 1;

    return (
        <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                            Interactive Tutorial
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            {TUTORIAL_STEPS.map((_, i) => (
                                <div 
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-indigo-500 w-4' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={onHide} 
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <motion.p 
                    className="mb-8 text-gray-700 dark:text-gray-300 min-h-[100px] text-lg leading-relaxed"
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {TUTORIAL_STEPS[step]}
                </motion.p>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={handlePrev} 
                        disabled={step === 0} 
                        className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                    >
                        Previous
                    </button>

                    <button 
                        onClick={isLastStep ? onHide : handleNext} 
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 font-medium relative overflow-hidden group"
                    >
                        <span className="relative z-10">
                            {isLastStep ? 'Start Exploring' : 'Next'}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Tutorial;