// src/hooks/useCanvas.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { calculateNodeDegrees } from '../utils/graphUtils';

// --- Define an array of colors for the components ---
const COMPONENT_COLORS = [
    ['#6EE7B7', '#34D399'], // Emerald
    ['#FBBF24', '#F59E0B'], // Amber
    ['#F472B6', '#EC4899'], // Pink
    ['#93C5FD', '#60A5FA'], // Blue
    ['#C4B5FD', '#A78BFA'], // Violet
    ['#FCA5A5', '#F87171'], // Red
    ['#818CF8', '#6366F1'], // Indigo
];

// This simple helper darkens a hex color without needing a new library.
const darkenColor = (hex, percent) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    if(hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, Math.floor(r * (100 - percent) / 100));
    const newG = Math.max(0, Math.floor(g * (100 - percent) / 100));
    const newB = Math.max(0, Math.floor(b * (100 - percent) / 100));

    return `#${(newR).toString(16).padStart(2, '0')}${(newG).toString(16).padStart(2, '0')}${(newB).toString(16).padStart(2, '0')}`;
}

// This function determines the style of a NODE based on all possible states.
const getNodeStyle = (node, isHovered, algorithmResults, edges) => {
    const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, componentsResult, currentAlgorithm } = algorithmResults;
    
    let state = 'default';
    let shouldPulse = false;

    if (currentAlgorithm) {
        // --- Highest Priority: Being the "Current" Node ---
        if (
            (traversalResult?.currentStep === node.id) ||
            (dijkstraResult?.currentStep === node.id) ||
            (primResult?.currentStep === node.id) ||
            (aStarResult?.current === node.id) ||
            (topoSortResult?.currentNode === node.id) ||
            (kruskalResult?.currentEdgeId && (edges.find(e => e.id === kruskalResult.currentEdgeId)?.start === node.id || edges.find(e => e.id === kruskalResult.currentEdgeId)?.end === node.id)) ||
            (bellmanFordResult?.highlightedEdge && (edges.find(e => e.id === bellmanFordResult.highlightedEdge)?.start === node.id || edges.find(e => e.id === bellmanFordResult.highlightedEdge)?.end === node.id))
        ) {
            state = 'current';
            shouldPulse = true;
        }
        // --- Next Priority: Being part of a final Path or Cycle ---
        else if (
            (dijkstraResult?.path.includes(node.id)) ||
            (aStarResult?.path.includes(node.id)) ||
            (cycleResult?.isCyclic && cycleResult.path?.includes(node.id)) ||
            (bellmanFordResult?.negativeCycle?.includes(node.id))
        ) {
            state = 'path';
        }
        // --- Next Priority: Being a Start or Target Node ---
        else if (dijkstraResult?.path[0] === node.id || aStarResult?.start === node.id) {
            state = 'start';
        } else if (dijkstraResult?.path[dijkstraResult.path.length - 1] === node.id || aStarResult?.target === node.id) {
            state = 'target';
        }
        // --- Next Priority: Being part of an MST ---
        else if (
            (primResult?.mstNodes.includes(node.id)) ||
            (kruskalResult?.mstEdgeIds ? edges.filter(e => kruskalResult.mstEdgeIds.includes(e.id)).flatMap(e => [e.start, e.end]).includes(node.id) : false)
        ) {
            state = 'mst';
        }
        // --- Lowest Priority: Being "Visited" ---
        else if (
            (traversalResult?.visitedOrder.includes(node.id)) ||
            (dijkstraResult?.visitedOrder.includes(node.id)) ||
            (aStarResult?.visitedOrder.includes(node.id)) ||
            (topoSortResult?.sortedOrder?.includes(node.id))
        ) {
            state = 'visited';
        }
    }

    if (topoSortResult?.cycleDetected && topoSortResult.cycleNodes?.includes(node.id)) {
        state = 'target'; // Use red for cycle nodes
    }

    // Hover state overrides everything except pulsing
    if (isHovered) {
        state = 'hover';
    }

    return { state, shouldPulse };
};

// This function determines the style of an EDGE
const getEdgeStyle = (edge, isHovered, algorithmResults, graphType, cycleResult) => {
    const { dijkstraResult, primResult, kruskalResult, aStarResult, bellmanFordResult } = algorithmResults;
    
    let state = 'default';
    let isRejected = false;

    if (kruskalResult?.currentEdgeId === edge.id && kruskalResult.stepType === 'reject') {
        isRejected = true;
    } else if (
        (dijkstraResult?.pathEdges.includes(edge.id)) ||
        (aStarResult?.pathEdges.includes(edge.id)) ||
        (primResult?.mstEdgeIds?.includes(edge.id)) ||
        (kruskalResult?.mstEdgeIds?.includes(edge.id)) ||
        (cycleResult?.isCyclic && isEdgeInPath(edge, cycleResult.path, graphType))
    ) {
        state = 'path';
    } else if (
        (kruskalResult?.currentEdgeId === edge.id) ||
        (bellmanFordResult?.highlightedEdge === edge.id)
    ) {
        state = 'current';
    }

    if (isHovered) {
        state = 'hover';
    }
    
    return { state, isRejected };
};

// Helper to check if an edge is part of a cycle path
const isEdgeInPath = (edge, path, graphType) => {
    for (let i = 0; i < path.length; i++) {
        const u = path[i];
        const v = path[(i + 1) % path.length];
        if ((edge.start === u && edge.end === v) || (graphType === 'undirected' && edge.start === v && edge.end === u)) {
            return true;
        }
    }
    return false;
}

export const useCanvas = (
    nodes,
    edges,
    theme,
    graphType,
    algorithmResults,
    setNodes,
    addEdgeDirectly
) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [draggingId, setDraggingId] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredElement, setHoveredElement] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, nodeId: null, edgeId: null });
    const [isDrawingEdge, setIsDrawingEdge] = useState(null);
    const [nodeDegrees, setNodeDegrees] = useState({});
    const animationFrameRef = useRef();

    useEffect(() => {
        setNodeDegrees(calculateNodeDegrees(nodes, edges));
    }, [nodes, edges]);

    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, theme === 'light' ? '#e0e7ff' : '#1e293b');
        gradient.addColorStop(1, theme === 'light' ? '#dbeafe' : '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, componentsResult, currentAlgorithm } = algorithmResults;
        const colors = {
            default: '#3B82F6', hover: '#F59E0B', visited: '#60A5FA', current: '#EC4899',
            path: '#10B981', mst: '#8B5CF6', start: '#10B981', target: '#EF4444',
            edgeDefault: theme === 'light' ? '#4B5563' : '#D1D5DB', edgeRejected: '#ef4444'
        };
        
        edges.forEach((edge) => {
            const startNode = nodes.find(n => n.id === edge.start);
            const endNode = nodes.find(n => n.id === edge.end);
            if (!startNode || !endNode) return;
            const isHovered = hoveredElement?.type === 'edge' && hoveredElement.id === edge.id;
            
            const style = getEdgeStyle(edge, isHovered, algorithmResults, graphType, algorithmResults.cycleResult);

            ctx.beginPath();
            ctx.moveTo(startNode.x, startNode.y);
            ctx.lineTo(endNode.x, endNode.y);

            ctx.strokeStyle = style.isRejected ? colors.edgeRejected : (colors[style.state] || colors.edgeDefault);
            ctx.lineWidth = (style.state === 'path' || style.state === 'current' || style.state === 'hover') ? 4 : (style.isRejected ? 2 : 2);
            ctx.setLineDash(style.isRejected ? [5, 5] : []);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = isHovered ? '#f59e0b' : (theme === "light" ? '#1F2937' : '#D1D5DB');
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(edge.weight.toFixed(1), (startNode.x + endNode.x) / 2, (startNode.y + endNode.y) / 2 - 15);
            if (edge.directed) {
                const angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
                const arrowLength = 15, arrowOffset = 30;
                ctx.beginPath();
                const endX = endNode.x - arrowOffset * Math.cos(angle);
                const endY = endNode.y - arrowOffset * Math.sin(angle);
                ctx.moveTo(endX, endY);
                ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fillStyle = isHovered ? '#f59e0b' : (theme === "light" ? '#1F2937' : '#D1D5DB');
                ctx.fill();
            }
        });
        
        nodes.forEach((node) => {
            const isHovered = hoveredElement?.type === 'node' && hoveredElement.id === node.id;
            const style = getNodeStyle(node, isHovered, algorithmResults, edges);
            
            const pulseSize = style.shouldPulse ? 4 * (Math.sin(Date.now() / 200) + 1) : 0;
            const radius = 30 + pulseSize;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

            let nodeColor = colors[style.state] || colors.default;

            // Handle component coloring override
            if(algorithmResults.componentsResult) {
                const componentIndex = algorithmResults.componentsResult.components.findIndex(comp => comp.includes(node.id));
                if (componentIndex !== -1) {
                    nodeColor = COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length][0];
                }
            }

            // Create gradient from the final color
            const nodeGradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, radius);
            nodeGradient.addColorStop(0, nodeColor);
            // We now use our own darkenColor function instead of the undefined tinycolor
            nodeGradient.addColorStop(1, darkenColor(nodeColor, 15));
            
            ctx.fillStyle = nodeGradient;
            ctx.fill();
            ctx.strokeStyle = isHovered ? '#f59e0b' : '#1E40AF';
            ctx.lineWidth = isHovered ? 3.5 : 2.5;
            ctx.stroke();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value, node.x, node.y);
        });

        if (isDrawingEdge) {
            const startNode = nodes.find(n => n.id === isDrawingEdge.from);
            if (startNode) {
                ctx.beginPath();
                ctx.moveTo(startNode.x, startNode.y);
                ctx.lineTo(isDrawingEdge.to.x, isDrawingEdge.to.y);
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        if (hoveredElement && hoveredElement.type === 'node') {
            const hoveredNode = nodes.find(n => n.id === hoveredElement.id);
            const degrees = nodeDegrees[hoveredElement.id];

            if (hoveredNode && degrees) {
                const posX = hoveredNode.x;
                const posY = hoveredNode.y - 45;

                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                const boxPadding = 8;
                let textToDisplay = graphType === 'directed' ? `In: ${degrees.in} | Out: ${degrees.out}` : `Degree: ${degrees.degree}`;
                const textWidth = ctx.measureText(textToDisplay).width;
                const boxWidth = textWidth + boxPadding * 2;
                const boxHeight = 12 + boxPadding * 2;

                ctx.fillStyle = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)';
                ctx.strokeStyle = theme === 'light' ? '#a5b4fc' : '#4f46e5';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(posX - boxWidth / 2, posY - boxHeight, boxWidth, boxHeight, [8]);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = theme === 'light' ? '#1e293b' : '#e0e7ff';
                ctx.fillText(textToDisplay, posX, posY - boxPadding);
            }
        }
    }, [nodes, edges, theme, hoveredElement, algorithmResults, isDrawingEdge, nodeDegrees, graphType]);

    useEffect(() => {
        let isAnimating = true;
        const renderLoop = () => {
            if (!isAnimating) return;
            drawGraph();
            animationFrameRef.current = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => {
            isAnimating = false;
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [drawGraph]);

    useEffect(() => {
        let resizeTimer;

        const handleResize = () => {
            // Clear the previous timer to reset the debounce period
            clearTimeout(resizeTimer);
            // Set a new timer
            resizeTimer = setTimeout(() => {
                console.log("Debounced resize: Redrawing graph...");
                drawGraph();
            }, 100); // Wait 100ms after the user stops resizing
        };

        window.addEventListener('resize', handleResize);
        // Initial draw to set the correct size
        drawGraph();

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer); // Clean up the timer on unmount
        };
    }, [drawGraph]);

    const startDrag = (nodeId, mouseX, mouseY) => {
        setDraggingId(nodeId);
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
            setOffset({ x: mouseX - node.x, y: mouseY - node.y });
        }
    };
    
    const dragNode = (mouseX, mouseY) => {
        if (draggingId === null) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newX = Math.max(40, Math.min(rect.width - 40, mouseX - offset.x));
        const newY = Math.max(40, Math.min(rect.height - 40, mouseY - offset.y));
        setNodes(currentNodes =>
            currentNodes.map(node =>
                node.id === draggingId ? { ...node, x: newX, y: newY } : node
            )
        );
    };

    const endDrag = () => {
        setDraggingId(null);
    };

    // Export everything needed by the parent component
    return {
        canvasRef, containerRef, contextMenu, setContextMenu, closeContextMenu: () => setContextMenu(prev => ({ ...prev, visible: false })),
        isDrawingEdge, setIsDrawingEdge, hoveredElement, setHoveredElement,
        startDrag, dragNode, endDrag
    };
};