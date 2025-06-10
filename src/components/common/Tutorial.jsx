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
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Tutorial</h2>
                    <button onClick={onHide} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <p className="mb-6 text-gray-700 dark:text-gray-300 min-h-[60px]">
                    {TUTORIAL_STEPS[step]}
                </p>

                <div className="flex justify-between items-center">
                    <button onClick={handlePrev} disabled={step === 0} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 transition">
                        Previous
                    </button>

                    <button onClick={isLastStep ? onHide : handleNext} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg transition">
                        {isLastStep ? 'Start Exploring' : 'Next'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Tutorial;