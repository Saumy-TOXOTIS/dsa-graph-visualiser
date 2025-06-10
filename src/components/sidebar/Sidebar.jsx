// src/components/sidebar/Sidebar.jsx
import React from 'react';
import GraphActions from './GraphActions';
import GraphInputs from './GraphInputs';
import GraphConstructorPanel from './GraphConstructorPanel';
import AlgorithmPanel from './AlgorithmPanel';
import SavedGraphs from './SavedGraphs';
import GraphAnalysisPanel from './GraphAnalysisPanel';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const SidebarSection = ({ title, children }) => (
    <details className="group" open>
        <summary className="flex items-center justify-between p-3 font-bold text-lg cursor-pointer list-none bg-white dark:bg-gray-800 rounded-2xl shadow-lg group-open:rounded-b-none">
            {title}
            <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg -mt-1 p-1">
            {children}
        </div>
    </details>
);

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