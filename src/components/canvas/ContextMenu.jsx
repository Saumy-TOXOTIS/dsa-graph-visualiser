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
            className="absolute z-20 bg-white dark:bg-gray-800 shadow-2xl rounded-xl py-2 w-48 text-gray-800 dark:text-gray-200"
            style={{ left: menuData.x, top: menuData.y }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            {menuData.nodeId && (
                <>
                    <button onClick={() => handleAction(() => onEditNode(menuData.nodeId))} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Node</button>
                    <button onClick={() => handleAction(() => onDeleteNode(menuData.nodeId))} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400">Delete Node</button>
                </>
            )}
            {menuData.edgeId && (
                <>
                    <button onClick={() => handleAction(() => onEditEdge(menuData.edgeId))} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Edge Weight</button>
                    <button onClick={() => handleAction(() => onDeleteEdge(menuData.edgeId))} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400">Delete Edge</button>
                </>
            )}
            {!menuData.nodeId && !menuData.edgeId && (
                <>
                    <button onClick={() => handleAction(() => onAddNode(menuData.x, menuData.y))} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Add Node Here</button>
                    <button onClick={() => handleAction(onResetAlgos)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Reset Algorithms</button>
                    <button onClick={() => handleAction(onGenerateRandom)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Generate Random</button>
                </>
            )}
        </div>
    );
};

export default ContextMenu;