// src/components/canvas/ContextMenu.jsx
import React from 'react';

const ContextMenu = ({ menuData, onEditNode, onDeleteNode, onEditEdge, onDeleteEdge, onAddNode, onResetAlgos, onGenerateRandom, closeMenu }) => {
    if (!menuData.visible) return null;

    const handleAction = (action) => {
        action();
        closeMenu();
    };

    return (
        <div
            className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg py-1 w-56 text-gray-800 dark:text-gray-200 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
            style={{ 
                left: menuData.x, 
                top: menuData.y,
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {menuData.nodeId && (
                <>
                    <button 
                        onClick={() => handleAction(() => onEditNode(menuData.nodeId))} 
                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Edit Node</span>
                    </button>
                    <button 
                        onClick={() => handleAction(() => onDeleteNode(menuData.nodeId))} 
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Delete Node</span>
                    </button>
                </>
            )}
            {menuData.edgeId && (
                <>
                    <button 
                        onClick={() => handleAction(() => onEditEdge(menuData.edgeId))} 
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Edit Edge Weight</span>
                    </button>
                    <button 
                        onClick={() => handleAction(() => onDeleteEdge(menuData.edgeId))} 
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Delete Edge</span>
                    </button>
                </>
            )}
            {!menuData.nodeId && !menuData.edgeId && (
                <>
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Canvas Actions
                    </div>
                    <button 
                        onClick={() => handleAction(() => onAddNode(menuData.x, menuData.y))} 
                        className="w-full text-left px-4 py-2.5 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Add Node Here</span>
                    </button>
                    <button 
                        onClick={() => handleAction(onResetAlgos)} 
                        className="w-full text-left px-4 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Reset Algorithms</span>
                    </button>
                    <button 
                        onClick={() => handleAction(onGenerateRandom)} 
                        className="w-full text-left px-4 py-2.5 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors duration-150 flex items-center gap-2 group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span>Generate Random</span>
                    </button>
                </>
            )}
        </div>
    );
};

export default ContextMenu;