// src/hooks/useCanvas.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { calculateNodeDegrees } from '../utils/graphUtils';

const COMPONENT_COLORS = [
    ['#6EE7B7', '#34D399'], ['#FBBF24', '#F59E0B'], ['#F472B6', '#EC4899'],
    ['#93C5FD', '#60A5FA'], ['#C4B5FD', '#A78BFA'], ['#FCA5A5', '#F87171'],
    ['#818CF8', '#6366F1'],
];

const darkenColor = (hex, percent) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    if(hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.max(0, Math.floor(r * (100 - percent) / 100));
    const newG = Math.max(0, Math.floor(g * (100 - percent) / 100));
    const newB = Math.max(0, Math.floor(b * (100 - percent) / 100));
    return `#${(newR).toString(16).padStart(2, '0')}${(newG).toString(16).padStart(2, '0')}${(newB).toString(16).padStart(2, '0')}`;
}

const getNodeStyle = (node, isHovered, algorithmResults, edges) => {
    const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, componentsResult, currentAlgorithm } = algorithmResults;
    let state = 'default';
    let shouldPulse = false;

    if (currentAlgorithm) {
        const isDFS = currentAlgorithm === 'DFS', isBFS = currentAlgorithm === 'BFS', isDijkstra = currentAlgorithm === 'Dijkstra';

        if (
            (isBFS && traversalResult?.currentStep === node.id) ||
            (isDFS && traversalResult?.currentNode === node.id) ||
            (isDijkstra && dijkstraResult?.currentNodeId === node.id) ||
            (primResult?.currentStep === node.id) || (aStarResult?.current === node.id) ||
            (topoSortResult?.currentNode === node.id) ||
            (kruskalResult?.currentEdgeId && (edges.find(e => e.id === kruskalResult.currentEdgeId)?.start === node.id || edges.find(e => e.id === kruskalResult.currentEdgeId)?.end === node.id)) ||
            (bellmanFordResult?.highlightedEdge && (edges.find(e => e.id === bellmanFordResult.highlightedEdge)?.start === node.id || edges.find(e => e.id === bellmanFordResult.highlightedEdge)?.end === node.id))
        ) {
            state = 'current'; shouldPulse = true;
        } 
        else if (isDFS && traversalResult?.pathStack?.includes(node.id)) state = 'pathStack';
        else if (isBFS && traversalResult?.sourceNode === node.id) state = 'source';
        else if (dijkstraResult?.path.includes(node.id) || aStarResult?.path.includes(node.id) || (cycleResult?.isCyclic && cycleResult.path?.includes(node.id)) || (bellmanFordResult?.negativeCycle?.includes(node.id))) state = 'path';
        else if ((dijkstraResult?.path[0] === node.id || aStarResult?.start === node.id) && (isDijkstra || currentAlgorithm === 'AStar')) state = 'start';
        else if ((dijkstraResult?.path[dijkstraResult.path.length - 1] === node.id || aStarResult?.target === node.id) && (isDijkstra || currentAlgorithm === 'AStar')) state = 'target';
        else if ((primResult?.mstNodes.includes(node.id)) || (kruskalResult?.mstEdgeIds ? edges.filter(e => kruskalResult.mstEdgeIds.includes(e.id)).flatMap(e => [e.start, e.end]).includes(node.id) : false)) state = 'mst';
        else if (
            (isBFS && traversalResult?.visitedOrder.includes(node.id)) ||
            (isDFS && traversalResult?.visitedNodes.includes(node.id)) ||
            (isDijkstra && dijkstraResult?.visitedOrder.includes(node.id)) ||
            (aStarResult?.visitedOrder.includes(node.id)) ||
            (topoSortResult?.sortedOrder?.includes(node.id))
        ) state = 'visited';
    }

    if (topoSortResult?.cycleDetected && topoSortResult.cycleNodes?.includes(node.id)) state = 'target';
    if (isHovered) state = 'hover';
    return { state, shouldPulse };
};

const getEdgeStyle = (edge, isHovered, algorithmResults, graphType) => {
    const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, bellmanFordResult, cycleResult, currentAlgorithm } = algorithmResults;
    let state = 'default', isRejected = false;

    if (currentAlgorithm === 'BFS' && traversalResult) {
        if (traversalResult.exploringEdgeIds?.includes(edge.id)) state = 'exploring';
        else if (traversalResult.currentEdgeId === edge.id) state = 'current';
        else if (traversalResult.steps?.slice(0, traversalResult.stepIndex + 1).some(step => step.edgeId === edge.id)) state = 'visited';
    } else if (currentAlgorithm === 'DFS' && traversalResult) {
        if (traversalResult.currentEdgeId === edge.id) state = 'current';
        else if (traversalResult.visitedEdgeIds?.includes(edge.id)) state = 'visited';
    } else if (currentAlgorithm === 'Dijkstra' && dijkstraResult) {
        // --- UPDATED: Dijkstra edge styling ---
        if (dijkstraResult.relaxingEdgeId === edge.id) state = 'exploring';
        else if (dijkstraResult.pathEdges?.includes(edge.id)) state = 'path';
        else if (dijkstraResult.visitedOrder?.includes(edge.start) && dijkstraResult.visitedOrder?.includes(edge.end)) state = 'visited';
    }
    else if (kruskalResult?.currentEdgeId === edge.id && kruskalResult.stepType === 'reject') isRejected = true;
    else if ((dijkstraResult?.pathEdges.includes(edge.id)) || (aStarResult?.pathEdges.includes(edge.id)) || (primResult?.mstEdgeIds?.includes(edge.id)) || (kruskalResult?.mstEdgeIds?.includes(edge.id)) || (cycleResult?.isCyclic && isEdgeInPath(edge, cycleResult.path, graphType))) state = 'path';
    else if ((kruskalResult?.currentEdgeId === edge.id) || (bellmanFordResult?.highlightedEdge === edge.id)) state = 'current';

    if (isHovered) state = 'hover';
    return { state, isRejected };
};

const isEdgeInPath = (edge, path, graphType) => {
    for (let i = 0; i < path.length; i++) {
        const u = path[i], v = path[(i + 1) % path.length];
        if ((edge.start === u && edge.end === v) || (graphType === 'undirected' && edge.start === v && edge.end === u)) return true;
    }
    return false;
}

export const useCanvas = (nodes, edges, theme, graphType, algorithmResults, setNodes, addEdgeDirectly) => {
    const canvasRef = useRef(null), containerRef = useRef(null);
    const [draggingId, setDraggingId] = useState(null), [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredElement, setHoveredElement] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, nodeId: null, edgeId: null });
    const [isDrawingEdge, setIsDrawingEdge] = useState(null), [nodeDegrees, setNodeDegrees] = useState({});
    const animationFrameRef = useRef();

    useEffect(() => { setNodeDegrees(calculateNodeDegrees(nodes, edges)); }, [nodes, edges]);

    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current, container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d'), rect = container.getBoundingClientRect();
        canvas.width = rect.width; canvas.height = rect.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, theme === 'light' ? '#e0e7ff' : '#1e293b');
        gradient.addColorStop(1, theme === 'light' ? '#dbeafe' : '#0f172a');
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const colors = {
            default: '#3B82F6', hover: '#F59E0B', visited: '#60A5FA', current: '#EC4899',
            source: '#10B981', pathStack: '#10B981', path: '#10B981', mst: '#8B5CF6',
            start: '#10B981', target: '#EF4444',
            edgeDefault: theme === 'light' ? '#4B5563' : '#D1D5DB', edgeHover: '#F59E0B',
            edgeVisited: '#60A5FA', edgeCurrent: '#EC4899', edgePath: '#10B981',
            edgeExploring: '#FBBF24', edgeRejected: '#ef4444'
        };
        
        edges.forEach((edge) => {
            const startNode = nodes.find(n => n.id === edge.start), endNode = nodes.find(n => n.id === edge.end);
            if (!startNode || !endNode) return;
            const isHovered = hoveredElement?.type === 'edge' && hoveredElement.id === edge.id;
            const style = getEdgeStyle(edge, isHovered, algorithmResults, graphType);
            ctx.beginPath(); ctx.moveTo(startNode.x, startNode.y); ctx.lineTo(endNode.x, endNode.y);
            let edgeColor = colors.edgeDefault;
            if (style.isRejected) edgeColor = colors.edgeRejected;
            else if (style.state === 'hover') edgeColor = colors.edgeHover;
            else if (style.state === 'exploring') edgeColor = colors.edgeExploring;
            else if (style.state === 'current') edgeColor = colors.edgeCurrent;
            else if (style.state === 'visited') edgeColor = colors.edgeVisited;
            else if (style.state === 'path') edgeColor = colors.edgePath;
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = (style.state === 'current' || style.state === 'exploring' || style.state === 'hover' || style.state === 'path') ? 4 : 2.5;
            ctx.setLineDash(style.isRejected ? [5, 5] : []); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = isHovered ? '#f59e0b' : (theme === "light" ? '#1F2937' : '#D1D5DB');
            ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(edge.weight.toFixed(1), (startNode.x + endNode.x) / 2, (startNode.y + endNode.y) / 2 - 15);
            if (edge.directed) {
                const angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
                const arrowLength = 15, arrowOffset = 30;
                ctx.beginPath();
                const endX = endNode.x - arrowOffset * Math.cos(angle), endY = endNode.y - arrowOffset * Math.sin(angle);
                ctx.moveTo(endX, endY);
                ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6));
                ctx.closePath(); ctx.fillStyle = isHovered ? '#f59e0b' : (theme === "light" ? '#1F2937' : '#D1D5DB'); ctx.fill();
            }
        });
        
        nodes.forEach((node) => {
            const isHovered = hoveredElement?.type === 'node' && hoveredElement.id === node.id;
            const style = getNodeStyle(node, isHovered, algorithmResults, edges);
            const pulseSize = style.shouldPulse ? 4 * (Math.sin(Date.now() / 200) + 1) : 0;
            const radius = 30 + pulseSize;
            ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            let nodeColor = colors[style.state] || colors.default;
            if(algorithmResults.componentsResult) {
                const componentIndex = algorithmResults.componentsResult.components.findIndex(comp => comp.includes(node.id));
                if (componentIndex !== -1) nodeColor = COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length][0];
            }
            const nodeGradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, radius);
            nodeGradient.addColorStop(0, nodeColor); nodeGradient.addColorStop(1, darkenColor(nodeColor, 15));
            ctx.fillStyle = nodeGradient; ctx.fill();
            ctx.strokeStyle = isHovered ? '#f59e0b' : '#1E40AF'; ctx.lineWidth = isHovered ? 3.5 : 2.5; ctx.stroke();
            ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(node.value, node.x, node.y);
        });

        // --- NEW: Render Dijkstra distances on canvas ---
        const { dijkstraResult, currentAlgorithm } = algorithmResults;
        if (currentAlgorithm === 'Dijkstra' && dijkstraResult?.distances) {
            nodes.forEach(node => {
                const distance = dijkstraResult.distances[node.id];
                if (distance !== undefined) {
                    const text = distance === Infinity ? '∞' : distance.toFixed(1);
                    ctx.font = 'bold 14px sans-serif';
                    // Use a bright, distinct color for the text
                    ctx.fillStyle = theme === 'light' ? '#86198f' : '#f0abfc'; 
                    ctx.textAlign = 'center';
                    // Position it above the node, clearing a small area for readability
                    const textWidth = ctx.measureText(text).width;
                    ctx.clearRect(node.x - textWidth / 2 - 4, node.y - 55, textWidth + 8, 20);
                    ctx.fillText(text, node.x, node.y - 45);
                }
            });
        }

        if (isDrawingEdge) {
            const startNode = nodes.find(n => n.id === isDrawingEdge.from);
            if (startNode) {
                ctx.beginPath(); ctx.moveTo(startNode.x, startNode.y); ctx.lineTo(isDrawingEdge.to.x, isDrawingEdge.to.y);
                ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; ctx.setLineDash([10, 5]); ctx.stroke(); ctx.setLineDash([]);
            }
        }

        if (hoveredElement && hoveredElement.type === 'node') {
            const hoveredNode = nodes.find(n => n.id === hoveredElement.id), degrees = nodeDegrees[hoveredElement.id];
            if (hoveredNode && degrees) {
                const posX = hoveredNode.x, posY = hoveredNode.y - (dijkstraResult ? 60 : 45); // Adjust position if distances are shown
                ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                const boxPadding = 8, textToDisplay = graphType === 'directed' ? `In: ${degrees.in} | Out: ${degrees.out}` : `Degree: ${degrees.degree}`;
                const textWidth = ctx.measureText(textToDisplay).width, boxWidth = textWidth + boxPadding * 2, boxHeight = 12 + boxPadding * 2;
                ctx.fillStyle = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)';
                ctx.strokeStyle = theme === 'light' ? '#a5b4fc' : '#4f46e5'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(posX - boxWidth / 2, posY - boxHeight, boxWidth, boxHeight, [8]); ctx.fill(); ctx.stroke();
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
        return () => { isAnimating = false; cancelAnimationFrame(animationFrameRef.current); };
    }, [drawGraph]);

    useEffect(() => {
        let resizeTimer;
        const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { drawGraph(); }, 100); };
        window.addEventListener('resize', handleResize);
        drawGraph();
        return () => { window.removeEventListener('resize', handleResize); clearTimeout(resizeTimer); };
    }, [drawGraph]);

    const startDrag = (nodeId, mouseX, mouseY) => {
        setDraggingId(nodeId); const node = nodes.find(n => n.id === nodeId);
        if (node) setOffset({ x: mouseX - node.x, y: mouseY - node.y });
    };
    
    const dragNode = (mouseX, mouseY) => {
        if (draggingId === null) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newX = Math.max(40, Math.min(rect.width - 40, mouseX - offset.x));
        const newY = Math.max(40, Math.min(rect.height - 40, mouseY - offset.y));
        setNodes(currentNodes => currentNodes.map(node => node.id === draggingId ? { ...node, x: newX, y: newY } : node));
    };

    const endDrag = () => { setDraggingId(null); };

    return {
        canvasRef, containerRef, contextMenu, setContextMenu, closeContextMenu: () => setContextMenu(prev => ({ ...prev, visible: false })),
        isDrawingEdge, setIsDrawingEdge, hoveredElement, setHoveredElement,
        startDrag, dragNode, endDrag
    };
};