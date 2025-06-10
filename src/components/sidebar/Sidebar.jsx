// src/components/sidebar/Sidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphActions from './GraphActions';
import GraphInputs from './GraphInputs';
import GraphConstructorPanel from './GraphConstructorPanel';
import AlgorithmPanel from './AlgorithmPanel';
import SavedGraphs from './SavedGraphs';
import GraphAnalysisPanel from './GraphAnalysisPanel';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const SidebarSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <motion.div 
            className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/90 dark:from-gray-800/80 dark:to-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 font-bold text-lg cursor-pointer group"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    {title}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                    className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                >
                    <ChevronDownIcon className="h-5 w-5" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Sidebar = ({
    graphActions,
    graphInputs,
    graphConstructorPanel,
    graphAnalysisPanel,
    algoPanel,
    savedGraphs
}) => {
    return (
        <div className="w-full lg:w-1/4 space-y-4">
            <SidebarSection title="Graph Actions">
                <GraphActions {...graphActions} />
            </SidebarSection>

            <SidebarSection title="Add Manually">
                <GraphInputs {...graphInputs} />
            </SidebarSection>

            <SidebarSection title="Graph Constructor">
                <GraphConstructorPanel {...graphConstructorPanel} />
            </SidebarSection>

            <SidebarSection title="Graph Analysis">
                <GraphAnalysisPanel {...graphAnalysisPanel} />
            </SidebarSection>

            <SidebarSection title="Algorithms">
                <AlgorithmPanel {...algoPanel} />
            </SidebarSection>

            <SidebarSection title="Saved Graphs">
                <SavedGraphs {...savedGraphs} />
            </SidebarSection>
        </div>
    );
};

export default Sidebar;