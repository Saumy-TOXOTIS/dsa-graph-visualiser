// src/hooks/useCanvas.js

import { useRef, useEffect, useState, useCallback } from 'react';
import { calculateNodeDegrees } from '../utils/graphUtils';

const COMPONENT_COLORS = [
    ['#6EE7B7', '#34D399'], ['#FBBF24', '#F59E0B'], ['#F472B6', '#EC4899'],
    ['#93C5FD', '#60A5FA'], ['#C4B5FD', '#A78BFA'], ['#FCA5A5', '#F87171'],
    ['#818CF8', '#6366F1'], ['#A3E635', '#84CC16'], ['#4ADE80', '#22C55E'],
    ['#34D399', '#10B981'], ['#2DD4BF', '#0D9488'], ['#67E8F9', '#0891B2'],
];

const darkenColor = (hex, percent) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    if(hex.length === 3) hex = hex.replace(/(.)/g, '$1$1');
    const r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
    const newR = Math.max(0, Math.floor(r * (100 - percent) / 100)), newG = Math.max(0, Math.floor(g * (100 - percent) / 100)), newB = Math.max(0, Math.floor(b * (100 - percent) / 100));
    return `#${(newR).toString(16).padStart(2, '0')}${(newG).toString(16).padStart(2, '0')}${(newB).toString(16).padStart(2, '0')}`;
}

const getNodeStyle = (node, isHovered, algorithmResults, edges) => {
    const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, componentsResult, currentAlgorithm } = algorithmResults;
    let state = 'default', shouldPulse = false, specificColor = null;

    if (currentAlgorithm === 'Kruskal' && kruskalResult?.dsuSets) {
        const componentIndex = kruskalResult.dsuSets.findIndex(set => set.includes(node.id));
        if (componentIndex !== -1) {
            specificColor = COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length][0];
        }
    }

    if (currentAlgorithm) {
        const isCurrentEdgeNode = (edgeId) => {
            const edge = edges.find(e => e.id === edgeId);
            return edge && (edge.start === node.id || edge.end === node.id);
        };

        if (topoSortResult?.cycleNodes?.includes(node.id)) { state = 'target'; shouldPulse = true; }
        else if (bellmanFordResult?.negativeCyclePath?.includes(node.id)) { state = 'target'; shouldPulse = true; }
        else if (
            (currentAlgorithm === 'TopologicalSort' && topoSortResult?.currentNodeId === node.id) ||
            (currentAlgorithm === 'Prim' && primResult?.currentNodeId === node.id) ||
            (currentAlgorithm === 'BFS' && traversalResult?.currentStep === node.id) ||
            (currentAlgorithm === 'DFS' && traversalResult?.currentNode === node.id) ||
            (currentAlgorithm === 'Dijkstra' && dijkstraResult?.currentNodeId === node.id) ||
            (currentAlgorithm === 'AStar' && aStarResult?.currentNodeId === node.id) ||
            (currentAlgorithm === 'BellmanFord' && bellmanFordResult?.updatedNodeId === node.id) ||
            (currentAlgorithm === 'Kruskal' && kruskalResult.type === 'accept_edge' && isCurrentEdgeNode(kruskalResult.currentEdgeId))
        ) { state = 'current'; shouldPulse = true; }
        else if (currentAlgorithm === 'BellmanFord' && bellmanFordResult?.highlightedEdgeId && isCurrentEdgeNode(bellmanFordResult.highlightedEdgeId)) state = 'exploring';
        else if (currentAlgorithm === 'AStar' && aStarResult?.openSet?.has(node.id)) state = 'openSet';
        else if (currentAlgorithm === 'DFS' && traversalResult?.pathStack?.includes(node.id)) state = 'pathStack';
        else if (currentAlgorithm === 'BFS' && traversalResult?.sourceNode === node.id) state = 'source';
        else if (aStarResult?.path?.includes(node.id) || dijkstraResult?.path?.includes(node.id) || (cycleResult?.isCyclic && cycleResult.path?.includes(node.id))) state = 'path';
        else if (primResult?.mstNodes?.has(node.id)) state = 'mst';
        else if (kruskalResult?.mstEdges?.flatMap(e => [e.start, e.end]).includes(node.id)) state = 'mst';
        else if (
            (traversalResult?.visitedNodes?.includes(node.id)) || (traversalResult?.visitedOrder?.includes(node.id)) ||
            (dijkstraResult?.visitedOrder?.includes(node.id)) || (aStarResult?.closedSet?.has(node.id)) ||
            (topoSortResult?.sortedOrder?.includes(node.id))
        ) state = 'visited';
    }

    if (componentsResult) {
        const componentIndex = componentsResult.components.findIndex(comp => comp.includes(node.id));
        if (componentIndex !== -1) {
            specificColor = COMPONENT_COLORS[componentIndex % COMPONENT_COLORS.length][0];
        }
    }
    
    if (isHovered) state = 'hover';
    return { state, shouldPulse, specificColor };
};

const getEdgeStyle = (edge, isHovered, algorithmResults, graphType) => {
    const { traversalResult, dijkstraResult, primResult, kruskalResult, aStarResult, topoSortResult, bellmanFordResult, cycleResult, currentAlgorithm } = algorithmResults;
    let state = 'default', isRejected = false;

    if (currentAlgorithm === 'TopologicalSort' && topoSortResult) {
        if (topoSortResult.processedEdgeId === edge.id) state = 'exploring';
        else if(topoSortResult.sortedOrder?.includes(edge.start)) state = 'visited';
    }
    else if (currentAlgorithm === 'Kruskal' && kruskalResult) {
        const mstEdgeIds = kruskalResult.mstEdges?.map(e => e.id) || [];
        if (mstEdgeIds.includes(edge.id)) state = 'mst';
        else if (kruskalResult.currentEdgeId === edge.id) {
            if (kruskalResult.type === 'check_edge') state = 'exploring';
            else if (kruskalResult.type === 'accept_edge') state = 'current';
            else if (kruskalResult.type === 'reject_edge') state = 'rejected';
        }
    }
    else if (currentAlgorithm === 'Prim' && primResult) {
        const mstEdgeIds = primResult.mstEdges?.map(e => e.id) || [];
        if (primResult.cheapestEdgeId === edge.id) state = 'current';
        else if (primResult.fringeEdgeIds?.includes(edge.id)) state = 'exploring';
        else if (mstEdgeIds.includes(edge.id)) state = 'mst';
    }
    else if (bellmanFordResult?.negativeCyclePath && isEdgeInPath(edge, bellmanFordResult.negativeCyclePath, graphType)) state = 'target';
    else if (currentAlgorithm === 'BellmanFord' && bellmanFordResult?.highlightedEdgeId === edge.id) state = 'exploring';
    else if (currentAlgorithm === 'AStar' && aStarResult?.relaxingEdgeId === edge.id) state = 'exploring';
    else if (currentAlgorithm === 'BFS' && traversalResult?.exploringEdgeIds?.includes(edge.id)) state = 'exploring';
    else if ((currentAlgorithm === 'BFS' || currentAlgorithm === 'DFS') && traversalResult?.currentEdgeId === edge.id) state = 'current';
    else if (aStarResult?.pathEdges?.includes(edge.id)) state = 'path';
    else if (traversalResult?.visitedEdgeIds?.includes(edge.id) || (traversalResult?.steps?.slice(0, traversalResult.stepIndex + 1).some(step => step.edgeId === edge.id))) state = 'visited';
    else if (currentAlgorithm === 'Dijkstra' && dijkstraResult?.relaxingEdgeId === edge.id) state = 'exploring';
    else if (dijkstraResult?.pathEdges?.includes(edge.id)) state = 'path';
    else if (dijkstraResult?.visitedOrder?.includes(edge.start) && dijkstraResult.visitedOrder?.includes(edge.end)) state = 'visited';
    else if (cycleResult?.isCyclic && isEdgeInPath(edge, cycleResult.path, graphType)) state = 'path';

    if (isHovered) state = 'hover';
    return { state, isRejected };
};

const isEdgeInPath = (edge, path, graphType) => {
    if(!path) return false;
    for (let i = 0; i < path.length -1; i++) {
        const u = path[i], v = path[i + 1];
        if ((edge.start === u && edge.end === v) || (graphType === 'undirected' && edge.start === v && edge.end === u)) return true;
    }
    if (path.length > 1 && path[0] === path[path.length - 1]) {
        const u = path[path.length - 2], v = path[0];
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
            start: '#10B981', target: '#EF4444', exploring: '#FBBF24', openSet: '#f97316',
            edgeDefault: theme === 'light' ? '#4B5563' : '#D1D5DB', edgeHover: '#F59E0B',
            edgeVisited: '#60A5FA', edgeCurrent: '#EC4899', edgePath: '#10B981',
            edgeExploring: '#FBBF24', edgeRejected: '#ef4444', edgeTarget: '#EF4444', edgeMst: '#8B5CF6'
        };
        
        edges.forEach((edge) => {
            const startNode = nodes.find(n => n.id === edge.start), endNode = nodes.find(n => n.id === edge.end);
            if (!startNode || !endNode) return;
            const isHovered = hoveredElement?.type === 'edge' && hoveredElement.id === edge.id;
            const style = getEdgeStyle(edge, isHovered, algorithmResults, graphType);
            ctx.globalAlpha = (style.state === 'rejected') ? 0.3 : 1.0;
            ctx.beginPath(); ctx.moveTo(startNode.x, startNode.y); ctx.lineTo(endNode.x, endNode.y);
            let edgeColor = colors[`edge${style.state.charAt(0).toUpperCase() + style.state.slice(1)}`] || colors.edgeDefault;
            if (style.state === 'mst') edgeColor = colors.edgeMst;
            const pulseSize = (style.state === 'target' && algorithmResults.bellmanFordResult) ? 4 * (Math.sin(Date.now() / 200) + 1) : 0;
            ctx.strokeStyle = edgeColor; ctx.lineWidth = ((style.state !== 'default' && style.state !== 'visited') ? 4 : 2.5) + pulseSize/2;
            ctx.setLineDash(style.isRejected ? [5, 5] : []); ctx.stroke(); ctx.setLineDash([]);
            ctx.globalAlpha = 1.0;
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
                ctx.closePath(); ctx.fillStyle = edgeColor; ctx.fill();
            }
        });
        
        nodes.forEach((node) => {
            const isHovered = hoveredElement?.type === 'node' && hoveredElement.id === node.id;
            const style = getNodeStyle(node, isHovered, algorithmResults, edges);
            const pulseSize = style.shouldPulse ? 4 * (Math.sin(Date.now() / 200) + 1) : 0;
            const radius = 30 + pulseSize;
            ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            let nodeColor = style.specificColor || colors[style.state] || colors.default;
            if(algorithmResults.componentsResult?.components) {
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

        const { dijkstraResult, bellmanFordResult, aStarResult, currentAlgorithm } = algorithmResults;
        const pfData = dijkstraResult || bellmanFordResult || aStarResult;
        const areScoresVisible = (currentAlgorithm === 'Dijkstra' || currentAlgorithm === 'BellmanFord' || currentAlgorithm === 'AStar') && pfData;
        
        if (areScoresVisible && currentAlgorithm === 'AStar' && aStarResult?.fScores) {
            nodes.forEach(node => {
                const f = aStarResult.fScores[node.id];
                if (f !== undefined && f !== Infinity) {
                    const g = aStarResult.gScores[node.id], h = aStarResult.hScores[node.id];
                    const gText = g.toFixed(0), hText = h.toFixed(0), fText = f.toFixed(0);
                    const text = `g:${gText} h:${hText} f:${fText}`;
                    ctx.font = 'normal 11px sans-serif';
                    ctx.fillStyle = theme === 'light' ? '#4c1d95' : '#e9d5ff'; 
                    ctx.textAlign = 'center';
                    const textWidth = ctx.measureText(text).width;
                    ctx.clearRect(node.x - textWidth / 2 - 4, node.y - 58, textWidth + 8, 16);
                    ctx.fillText(text, node.x, node.y - 45);
                }
            });
        } else if (areScoresVisible && pfData?.distances) {
            nodes.forEach(node => {
                const distance = pfData.distances[node.id];
                if (distance !== undefined) {
                    const text = distance === Infinity ? '∞' : distance.toFixed(1);
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillStyle = theme === 'light' ? '#86198f' : '#f0abfc'; 
                    ctx.textAlign = 'center';
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

        if (hoveredElement?.type === 'node') {
            const hoveredNode = nodes.find(n => n.id === hoveredElement.id), degrees = nodeDegrees[hoveredElement.id];
            if (hoveredNode && degrees) {
                const posY = hoveredNode.y - (areScoresVisible ? 60 : 45);
                ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                const boxPadding = 8, textToDisplay = graphType === 'directed' ? `In: ${degrees.in} | Out: ${degrees.out}` : `Degree: ${degrees.degree}`;
                const textWidth = ctx.measureText(textToDisplay).width, boxWidth = textWidth + boxPadding * 2, boxHeight = 12 + boxPadding * 2;
                ctx.fillStyle = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)';
                ctx.strokeStyle = theme === 'light' ? '#a5b4fc' : '#4f46e5'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(hoveredNode.x - boxWidth / 2, posY - boxHeight, boxWidth, boxHeight, [8]); ctx.fill(); ctx.stroke();
                ctx.fillStyle = theme === 'light' ? '#1e293b' : '#e0e7ff';
                ctx.fillText(textToDisplay, hoveredNode.x, posY - boxPadding);
            }
        }
    }, [nodes, edges, theme, hoveredElement, algorithmResults, isDrawingEdge, nodeDegrees, graphType]);

    useEffect(() => {
        let isAnimating = true;
        const renderLoop = () => { if (!isAnimating) return; drawGraph(); animationFrameRef.current = requestAnimationFrame(renderLoop); };
        renderLoop();
        return () => { isAnimating = false; cancelAnimationFrame(animationFrameRef.current); };
    }, [drawGraph]);

    useEffect(() => {
        let resizeTimer;
        const handleResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { drawGraph(); }, 100); };
        window.addEventListener('resize', handleResize); drawGraph();
        return () => { window.removeEventListener('resize', handleResize); clearTimeout(resizeTimer); };
    }, [drawGraph]);

    const startDrag = (nodeId, mouseX, mouseY) => { setDraggingId(nodeId); const node = nodes.find(n => n.id === nodeId); if (node) setOffset({ x: mouseX - node.x, y: mouseY - node.y }); };
    const dragNode = (mouseX, mouseY) => {
        if (draggingId === null) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newX = Math.max(40, Math.min(rect.width - 40, mouseX - offset.x)), newY = Math.max(40, Math.min(rect.height - 40, mouseY - offset.y));
        setNodes(currentNodes => currentNodes.map(node => node.id === draggingId ? { ...node, x: newX, y: newY } : node));
    };
    const endDrag = () => { setDraggingId(null); };

    return { canvasRef, containerRef, contextMenu, setContextMenu, closeContextMenu: () => setContextMenu(prev => ({ ...prev, visible: false })), isDrawingEdge, setIsDrawingEdge, hoveredElement, setHoveredElement, startDrag, dragNode, endDrag };
};