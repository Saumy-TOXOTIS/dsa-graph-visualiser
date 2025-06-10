// src/components/canvas/CanvasArea.jsx
import React, { useRef, useCallback, useEffect } from 'react';
// ContextMenu import is removed
import AlgorithmControls from './AlgorithmControls';
import ContextMenu from './ContextMenu';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

const CanvasArea = ({
    // Refs
    containerRef,
    canvasRef,
    canvasSize,
    setCanvasSize,
    // Algorithm Control Props
    algoControlProps
}) => {
    const isResizing = useRef(false);

    const handleResizeMouseDown = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
    }, []);

    const handleResizeMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    const handleResizeMouseMove = useCallback((e) => {
        if (isResizing.current) {
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                // Calculate new dimensions based on mouse movement
                // Use `movementX` and `movementY` for smoother resizing
                const newWidth = rect.width + e.movementX;
                const newHeight = rect.height + e.movementY;

                setCanvasSize({
                    width: Math.max(400, newWidth), // Set a minimum width
                    height: Math.max(300, newHeight) // Set a minimum height
                });
            }
        }
    }, [containerRef, setCanvasSize]);

    useEffect(() => {
        // We add the move and up listeners to the window to allow dragging outside the component
        window.addEventListener('mousemove', handleResizeMouseMove);
        window.addEventListener('mouseup', handleResizeMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [handleResizeMouseMove, handleResizeMouseUp]);

    return (
        <div className="w-full lg:w-3/4">
            {/* The main container will now have its size controlled by state */}
            <div
                ref={containerRef}
                className="relative shadow-xl overflow-hidden rounded-2xl"
                style={{
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                    // If width is a percentage, we don't add 'px'
                    ...(typeof canvasSize.width === 'string' && { width: canvasSize.width }),
                }}
            >
                <canvas ref={canvasRef} className="w-full h-full" />
                
                {/* --- DRAG HANDLE --- */}
                <div
                    className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-500/50 hover:bg-indigo-500 rounded-tl-lg cursor-nwse-resize flex items-center justify-center"
                    onMouseDown={handleResizeMouseDown}
                    title="Drag to resize canvas"
                >
                    <ArrowsPointingOutIcon className="h-4 w-4 text-white/70 transform -rotate-45" />
                </div>
            </div>
            
            <AlgorithmControls {...algoControlProps} />
        </div>
    );
};

export default CanvasArea;