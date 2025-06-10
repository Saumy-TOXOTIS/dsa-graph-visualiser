// src/hooks/useCanvas.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { calculateNodeDegrees } from '../utils/graphUtils';

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
        const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, currentAlgorithm } = algorithmResults;
        
        edges.forEach((edge) => {
            const startNode = nodes.find((n) => n.id === edge.start);
            const endNode = nodes.find((n) => n.id === edge.end);
            if (!startNode || !endNode) return;
            const isHovered = hoveredElement?.type === 'edge' && hoveredElement.id === edge.id;
            // --- NEW: Check if the edge should be highlighted ---
            let isPathEdge = false;
            let isRejectedEdge = false;
            let isCurrentEdge = false;
            if (dijkstraResult && dijkstraResult.pathEdges.includes(edge.id)) isPathEdge = true;
            if (aStarResult && aStarResult.pathEdges.includes(edge.id)) isPathEdge = true;
            if (primResult && primResult.mstEdgeIds?.includes(edge.id)) isPathEdge = true;
            if (kruskalResult?.mstEdgeIds?.includes(edge.id)) isPathEdge = true;
            if (kruskalResult?.currentEdgeId === edge.id) {
                isCurrentEdge = true;
                if (kruskalResult.stepType === 'reject') {
                    isRejectedEdge = true;
                }
            }
            if (bellmanFordResult?.highlightedEdge === edge.id) {
                isCurrentEdge = true;
            }
            if (cycleResult?.isCyclic) {
                const path = cycleResult.path;
                for (let i = 0; i < path.length; i++) {
                    const u = path[i];
                    const v = path[(i + 1) % path.length]; // Wrap around for the last edge
                    if ((edge.start === u && edge.end === v) || (graphType === 'undirected' && edge.start === v && edge.end === u)) {
                        isPathEdge = true; // Use the same 'path' styling for now
                        break;
                    }
                }
            }
            ctx.beginPath();
            ctx.moveTo(startNode.x, startNode.y);
            ctx.lineTo(endNode.x, endNode.y);
            // Apply special styling for path edges
            if (isPathEdge) {
                ctx.strokeStyle = '#10B981'; // Green for accepted MST/Path
                ctx.lineWidth = 4;
            } else if (isRejectedEdge) {
                ctx.strokeStyle = '#ef4444'; // Red for rejected
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
            } else if (isCurrentEdge) {
                ctx.strokeStyle = '#f59e0b'; // Yellow for considering
                ctx.lineWidth = 4;
            } else {
                ctx.strokeStyle = isHovered ? '#f59e0b' : (theme === "light" ? '#4B5563' : '#D1D5DB');
                ctx.lineWidth = isHovered ? 4 : 2;
            }
            ctx.stroke();
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
            let nodeState = 'default';
            const isCycleNode = cycleResult?.isCyclic && cycleResult.path?.includes(node.id);
            if (isCycleNode) nodeState = 'path';
            if (currentAlgorithm) {
                // ======================== CORE FIX IS HERE ========================
                // This logic determines the color of a node based on ALL algorithm states.
                const isStart = (dijkstraResult?.path[0] === node.id) || (aStarResult?.start === node.id);
                const isTarget = (dijkstraResult?.path[dijkstraResult.path.length - 1] === node.id) || (aStarResult?.target === node.id);
                const isInPath = (dijkstraResult?.path.includes(node.id)) || (aStarResult?.path.includes(node.id));
                const isVisited = (traversalResult?.visitedOrder.slice(0, (traversalResult.stepIndex ?? -1) + 1).includes(node.id)) || (dijkstraResult?.visitedOrder.includes(node.id)) || (aStarResult?.visitedOrder.includes(node.id));
                const isCurrent = (traversalResult?.currentStep === node.id) || (dijkstraResult?.currentStep === node.id) || (primResult?.currentStep === node.id) || (aStarResult?.currentStep === node.id);
                const isMstNode = primResult?.mstNodes.includes(node.id);

                // Kruskal's specific node highlighting
                let isKruskalConsidering = false;
                if (kruskalResult?.currentEdgeId) {
                    const currentEdge = edges.find(e => e.id === kruskalResult.currentEdgeId);
                    if (currentEdge && (currentEdge.start === node.id || currentEdge.end === node.id)) {
                        isKruskalConsidering = true;
                    }
                }
                const isKruskalMstNode = kruskalResult?.mstEdgeIds ? edges.filter(e => kruskalResult.mstEdgeIds.includes(e.id)).flatMap(e => [e.start, e.end]).includes(node.id) : false;

                // Topological Sort specific node highlighting
                const isTopoCycleNode = topoSortResult?.cycleDetected && topoSortResult.cycleNodes?.includes(node.id);
                const isTopoVisitedNode = topoSortResult?.sortedOrder?.includes(node.id);
                const isTopoCurrentNode = topoSortResult?.currentNode === node.id;
                let isBellmanFordActive = false;
                if (bellmanFordResult?.highlightedEdge) {
                    const currentEdge = edges.find(e => e.id === bellmanFordResult.highlightedEdge);
                    if (currentEdge && (currentEdge.start === node.id || currentEdge.end === node.id)) {
                        isBellmanFordActive = true;
                    }
                }
                const isBellmanFordCycleNode = bellmanFordResult?.negativeCycle?.includes(node.id);
                
                // Set nodeState based on a clear priority
                if (isStart) nodeState = 'start';
                else if (isTarget) nodeState = 'target';
                else if (isTopoCycleNode) nodeState = 'target'; // Use red for cycle nodes
                else if (isInPath) nodeState = 'path';
                else if (isCurrent || isTopoCurrentNode) nodeState = 'current'; // Pink for current
                else if (isKruskalConsidering || isBellmanFordActive) nodeState = 'current'; // Also use pink for consideration
                else if (isVisited || isTopoVisitedNode) nodeState = 'visited'; // Blue for visited
                else if (isMstNode || isKruskalMstNode) nodeState = 'mst'; // Purple for MST
                else if (isBellmanFordCycleNode) nodeState = 'target';
            }
            ctx.beginPath();
            ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
            const nodeGradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 30);
            const colors = { default: ['#3B82F6', '#2563EB'], start: ['#10B981', '#059669'], target: ['#EF4444', '#DC2626'], path: ['#F97316', '#EA580C'], current: ['#EC4899', '#DB2777'], visited: ['#60A5FA', '#3B82F6'], mst: ['#8B5CF6', '#7C3AED'] };
            const [color1, color2] = isHovered ? ['#60A5FA', '#3B82F6'] : colors[nodeState];
            nodeGradient.addColorStop(0, color1);
            nodeGradient.addColorStop(1, color2);
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
        drawGraph();
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