// src/App.jsx

import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/sidebar/Sidebar';
import CanvasArea from './components/canvas/CanvasArea';
import Tutorial from './components/common/Tutorial';
import InfoPanel from './components/InfoPanel';
import ContextMenu from './components/canvas/ContextMenu';
import AboutModal from './components/common/AboutModal';
import DataViewPanel from './components/DataViewPanel';
import { useGraphState } from './hooks/useGraphState';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useCanvas } from './hooks/useCanvas';
import { buildAdjacencyList, buildAdjacencyMatrix } from './utils/graphUtils';
import { findCycle, findConnectedComponents } from './algorithms';
import GraphAnalysisPanel from './components/sidebar/GraphAnalysisPanel';

export default function GraphVisualizer() {
  const [theme, setTheme] = useState('dark');
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 600 });
  const [cycleResult, setCycleResult] = useState(null);
  const [componentsResult, setComponentsResult] = useState(null);

  const handleFindComponents = () => {
    resetAlgorithm(); // Clear other algorithm highlights
    setCycleResult(null); // Clear cycle highlights
    const result = findConnectedComponents(nodes, edges, graphType);
    setComponentsResult(result);
  };

  const handleFindCycle = () => {
    resetAlgorithm(); // Clear any running algorithm visualization
    const cyclePath = findCycle(nodes, edges, graphType);
    if (cyclePath) {
      setCycleResult({ isCyclic: true, path: cyclePath });
    } else {
      setCycleResult({ isCyclic: false, path: null });
      // Alert the user if no cycle is found
      setTimeout(() => alert("No cycles were found in the graph."), 100);
    }
  };

  const handleClearAnalysis = () => {
    setCycleResult(null);
    setComponentsResult(null);
  };

  // 1. Algorithm Runner is independent.
  const {
    currentAlgorithm, isRunning, isPaused, speed, progress,
    runAlgorithm, resetAlgorithm, setSpeed, setIsPaused,
    traversalResult, dijkstraResult, primResult, aStarResult, kruskalResult, topoSortResult, bellmanFordResult,
  } = useAlgorithmRunner();

  // 2. Graph State can safely use `resetAlgorithm`.
  const {
    nodes, setNodes, edges, graphType, setGraphType, savedGraphs,
    nodeValue, setNodeValue, fromNode, setFromNode, toNode, setToNode, edgeWeight, setEdgeWeight,
    addNode, addEdge, addEdgeDirectly, deleteNode, editNode, deleteEdge, editEdge,
    clearGraph, generateRandomGraph, saveGraph, loadGraph, buildGraphFromData,
  } = useGraphState(resetAlgorithm);

  // 3. Canvas gets all the data it needs to draw.
  const algorithmResults = { traversalResult, dijkstraResult, primResult, aStarResult, kruskalResult, topoSortResult, bellmanFordResult, cycleResult, componentsResult, currentAlgorithm };
  const {
    canvasRef, containerRef, contextMenu, setContextMenu, closeContextMenu,
        isDrawingEdge, setIsDrawingEdge, hoveredElement, setHoveredElement,
        startDrag, dragNode, endDrag
  } = useCanvas(nodes, edges, theme, graphType, algorithmResults, setNodes, addEdgeDirectly);

  const sortedNodesForDataView = useMemo(() => [...nodes].sort((a, b) => a.value.localeCompare(b.value)), [nodes]);
  const adjacencyList = useMemo(() => buildAdjacencyList(sortedNodesForDataView, edges, graphType), [sortedNodesForDataView, edges, graphType]);
  const adjacencyMatrix = useMemo(() => buildAdjacencyMatrix(sortedNodesForDataView, edges, graphType), [sortedNodesForDataView, edges, graphType]);

  const lastHoveredRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const findNodeAt = (x, y) => {
      // Iterate backwards so we find the top-most node first
      return [...nodes].reverse().find(node => Math.hypot(x - node.x, y - node.y) <= 30);
    };

    const findEdgeAt = (x, y) => {
      // This function calculates the distance from a point to a line segment.
      // It's the most reliable way to detect hovering over an edge.
      for (const edge of edges) {
        const startNode = nodes.find(n => n.id === edge.start);
        const endNode = nodes.find(n => n.id === edge.end);
        if (!startNode || !endNode) continue;

        const { x: x1, y: y1 } = startNode;
        const { x: x2, y: y2 } = endNode;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;

        // Handle case where start and end nodes are at the same position
        if (lenSq === 0) continue;

        // Project the mouse position onto the line segment
        let t = ((x - x1) * dx + (y - y1) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t)); // Clamp t to the [0, 1] range

        // Find the closest point on the segment
        const nearestX = x1 + t * dx;
        const nearestY = y1 + t * dy;

        // Calculate distance from mouse to the closest point
        const distance = Math.hypot(x - nearestX, y - nearestY);

        // If the distance is small enough, we're hovering over the edge
        if (distance < 10) { // 10px tolerance
          return edge;
        }
      }
      return null;
    };

    // --- MASTER MOUSE MOVE HANDLER ---
    const handleMouseMove = (e) => {
      const { x, y } = getMousePos(e);

      // Handle edge drawing drag
      if (isDrawingEdge) {
        setIsDrawingEdge(prev => ({ ...prev, to: { x, y } }));
        return;
      }

      // Handle node dragging
      dragNode(x, y);

      // Handle hover detection
      let currentHover = null;
      const nodeUnderCursor = findNodeAt(x, y);

      if (nodeUnderCursor) {
        currentHover = { type: 'node', id: nodeUnderCursor.id };
      } else {
        // Only check for edge hover if we are not hovering a node
        const edgeUnderCursor = findEdgeAt(x, y);
        if (edgeUnderCursor) {
          currentHover = { type: 'edge', id: edgeUnderCursor.id };
        }
      }

      // ONLY update state if the hover target has changed
      if (lastHoveredRef.current?.id !== currentHover?.id) {
        setHoveredElement(currentHover);
        lastHoveredRef.current = currentHover;
      }
    };

    // --- MASTER MOUSE DOWN HANDLER ---
    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only left click
      const { x, y } = getMousePos(e);
      const nodeUnderCursor = findNodeAt(x, y);

      if (nodeUnderCursor) {
        if (e.shiftKey) { // Start drawing edge
          setIsDrawingEdge({ from: nodeUnderCursor.id, to: { x, y } });
        } else { // Start dragging node
          startDrag(nodeUnderCursor.id, x, y);
        }
      }
    };

    // --- MASTER MOUSE UP HANDLER ---
    const handleMouseUp = (e) => {
      if (isDrawingEdge) {
        const { x, y } = getMousePos(e);
        const endNode = findNodeAt(x, y);
        if (endNode && endNode.id !== isDrawingEdge.from) {
          const startNodeName = nodes.find(n => n.id === isDrawingEdge.from)?.value || '';
          const weightStr = prompt(`Enter weight for edge (${startNodeName} to ${endNode.value}):`, "1.0");
          if (weightStr !== null) {
            const weight = parseFloat(weightStr);
            if (!isNaN(weight)) addEdgeDirectly(isDrawingEdge.from, endNode.id, weight);
            else alert('Invalid weight.');
          }
        }
        setIsDrawingEdge(null);
      }
      endDrag();
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const nodeUnderCursor = [...nodes].reverse().find((node) => Math.hypot(mouseX - node.x, mouseY - node.y) <= 30);
      let edgeUnderCursor = null;
      if (!nodeUnderCursor) {
        // Same logic as mouse over
        edgeUnderCursor = edges.find(edge => {
          const startNode = nodes.find(n => n.id === edge.start), endNode = nodes.find(n => n.id === edge.end);
          if (!startNode || !endNode) return false;
          const dx = endNode.x - startNode.x, dy = endNode.y - startNode.y;
          const lenSq = dx * dx + dy * dy;
          if (lenSq === 0) return false;
          const t = Math.max(0, Math.min(1, ((mouseX - startNode.x) * dx + (mouseY - startNode.y) * dy) / lenSq));
          const nearestX = startNode.x + t * dx;
          const nearestY = startNode.y + t * dy;
          return Math.hypot(mouseX - nearestX, mouseY - nearestY) < 10;
        });
      }
      setContextMenu({
        visible: true, x: e.clientX, y: e.clientY,
        nodeId: nodeUnderCursor ? nodeUnderCursor.id : null,
        edgeId: edgeUnderCursor ? edgeUnderCursor.id : null,
      });
    };

    // Attach events directly to the canvas container
    const container = containerRef.current;
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove); // Drag/hover can happen outside
    window.addEventListener('mouseup', handleMouseUp); // Release can happen outside
    container.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('contextmenu', handleContextMenu);
    };

  }, [nodes, edges, startDrag, dragNode, endDrag, isDrawingEdge, setIsDrawingEdge, setHoveredElement, addEdgeDirectly]);
  
  const sidebarProps = {
    graphActions: {
        onClear: clearGraph,
        onRandom: () => generateRandomGraph(containerRef),
        onSave: saveGraph,
        onTutorial: () => setShowTutorial(true),
    },
    graphInputs: {
        nodes, nodeValue, setNodeValue, 
        onAddNode: () => {
            const rect = containerRef.current?.getBoundingClientRect();
            addNode(rect ? rect.width / 2 : 300, rect ? rect.height / 2 : 300, nodeValue);
        },
        fromNode, setFromNode, toNode, setToNode, edgeWeight, setEdgeWeight,
        onAddEdge: addEdge,
    },
    algoPanel: {
        nodes, isRunning, graphType,
        onRunAlgorithm: (type, options) => {
            runAlgorithm(type, { ...options, nodes, edges, graphType });
        },
    },
    savedGraphs: {
        savedGraphs,
        onLoadGraph: loadGraph,
    },
    graphConstructorPanel: {
      onBuild: (data) => buildGraphFromData(data, containerRef),
    },
    graphAnalysisPanel: {
      onFindCycle: handleFindCycle,
      onFindComponents: handleFindComponents,
      onClearAnalysis: handleClearAnalysis,
      cycleResult,
      componentsResult,
    }
  };

  const canvasAreaProps = {
    containerRef, canvasRef, canvasSize, setCanvasSize,
    algoControlProps: {
        algorithm: currentAlgorithm, progress, isPaused, speed,
        onPauseToggle: () => setIsPaused(p => !p),
        onReset: resetAlgorithm,
        onSpeedChange: (e) => setSpeed(parseInt(e.target.value)),
    }
  };

  const contextMenuActions = {
    closeMenu: closeContextMenu,
    onEditNode: (nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        const newValue = prompt('Enter new value:', node?.value);
        if (newValue !== null && newValue.trim() !== '') editNode(nodeId, newValue);
    },
    onDeleteNode: deleteNode,
    onEditEdge: (edgeId) => {
        const edge = edges.find(e => e.id === edgeId);
        const newWeight = prompt('Enter new weight:', edge?.weight);
        if (newWeight !== null && !isNaN(parseFloat(newWeight))) {
            editEdge(edgeId, parseFloat(newWeight));
        }
    },
    onDeleteEdge: deleteEdge,
    onAddNode: (clientX, clientY) => {
        const rect = containerRef.current.getBoundingClientRect();
        const value = prompt("Enter node value:");
        if (value !== null && value.trim() !== '') {
            addNode(clientX - rect.left, clientY - rect.top, value);
        }
    },
    onResetAlgos: resetAlgorithm,
    onGenerateRandom: () => generateRandomGraph(containerRef),
  };

  return (
    <div 
        className={`min-h-screen w-full transition-colors duration-300 ${theme === 'light' ? 'bg-blue-50 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
        onClick={closeContextMenu}
    >
      <Header 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        graphType={graphType}
        setGraphType={setGraphType}
        onAboutClick={() => setIsAboutModalOpen(true)}
      />
      
      <AnimatePresence>
        {showTutorial && (
            <Tutorial
                show={showTutorial}
                onHide={() => setShowTutorial(false)}
                step={tutorialStep}
                onStepChange={setTutorialStep}
            />
        )}
      </AnimatePresence>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

      <main className="mt-6 flex flex-col lg:flex-row px-6 gap-6">
        <Sidebar {...sidebarProps} />
        <div>
          <CanvasArea {...canvasAreaProps} />
          <InfoPanel nodes={nodes} edges={edges} graphType={graphType} algoResults={algorithmResults} />
          <DataViewPanel adjList={adjacencyList} adjMatrix={adjacencyMatrix} nodes={sortedNodesForDataView} />
        </div>
      </main>

      <Footer />
      <ContextMenu menuData={contextMenu} {...contextMenuActions} />
    </div>
  );
}