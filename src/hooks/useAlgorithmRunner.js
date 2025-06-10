// src/hooks/useAlgorithmRunner.js

import { useState, useRef, useCallback } from 'react';
import * as algo from '../algorithms';

export const useAlgorithmRunner = (nodes, edges) => {
    const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [progress, setProgress] = useState(0);
    const [traversalResult, setTraversalResult] = useState(null);
    const [dijkstraResult, setDijkstraResult] = useState(null);
    const [primResult, setPrimResult] = useState(null);
    const [aStarResult, setAStarResult] = useState(null);
    const [kruskalResult, setKruskalResult] = useState(null);
    const [topoSortResult, setTopoSortResult] = useState(null);
    const [bellmanFordResult, setBellmanFordResult] = useState(null);
    const animationRef = useRef(null);
    const stepsRef = useRef([]);
    const edgesRef = useRef([]); // Use a ref to hold edges for the animation closure

    const reset = useCallback(() => {
        clearInterval(animationRef.current);
        animationRef.current = null;
        stepsRef.current = [];
        edgesRef.current = [];
        setCurrentAlgorithm(null);
        setIsRunning(false);
        setIsPaused(false);
        setProgress(0);
        setTraversalResult(null);
        setDijkstraResult(null);
        setPrimResult(null);
        setAStarResult(null);
        setKruskalResult(null);
        setTopoSortResult(null);
        setBellmanFordResult(null);
    }, []);

    const animate = useCallback((algorithm) => {
        setIsRunning(true);
        setIsPaused(false);
        let i = 0;
        animationRef.current = setInterval(() => {
            if (isPaused) return;
            if (i >= stepsRef.current.length) {
                clearInterval(animationRef.current);
                setIsRunning(false);
                setProgress(100);
                return;
            }
            const step = stepsRef.current[i];
            
            switch (algorithm) {
                case 'BFS':
                case 'DFS':
                    setTraversalResult(prev => ({ ...prev, currentStep: step.currentStep, stepIndex: i }));
                    break;
                case 'Dijkstra':
                    setDijkstraResult(prev => ({ ...prev, currentStep: step.currentStep, visitedOrder: step.visitedOrder, stepIndex: i }));
                    break;
                case 'Prim': {
                    const mstEdgeIds = step.mstEdges.map(e => {
                        const originalEdge = edgesRef.current.find(edge =>
                            (edge.start === e.from && edge.end === e.to) ||
                            (edge.start === e.to && edge.end === e.from)
                        );
                        return originalEdge?.id;
                    }).filter(Boolean);
                    setPrimResult(prev => ({ ...prev, mstNodes: step.visitedSoFar, mstEdges: step.mstEdges, mstEdgeIds: mstEdgeIds, currentStep: step.currentStep, stepIndex: i }));
                    break;
                }
                case 'AStar': {
                    setAStarResult(prev => ({ ...prev, visitedOrder: step.visitedOrder, currentStep: step.current, stepIndex: i }));
                    break;
                }
                case 'Kruskal': {
                    const mstEdgeIds = step.mstEdges.map(e => e.id);
                    setKruskalResult({ ...step, mstEdgeIds });
                    break;
                }
                case 'TopologicalSort': {
                    setTopoSortResult(step);
                    break;
                }
                case 'BellmanFord': {
                    setBellmanFordResult(step);
                    break;
                }
                default:
                    break;
            }
            setProgress(Math.round(((i + 1) / stepsRef.current.length) * 100));
            i++;
        }, speed);
    }, [speed, isPaused, edges]);

    const runAlgorithm = useCallback((type, options) => {
        reset();
        const { nodes, edges, graphType, startNode, dijkstraStart, dijkstraTarget, heuristicType } = options;
        edgesRef.current = edges; // Store edges in a ref for the animation closure
        setCurrentAlgorithm(type);

        switch (type) {
            case 'BFS': {
                const steps = algo.generateBfsSteps(nodes, edges, graphType, startNode);
                if (steps?.length > 0) {
                    stepsRef.current = steps;
                    setTraversalResult({ visitedOrder: steps.map(s => s.currentStep), currentStep: null, stepIndex: -1 });
                    animate('BFS');
                }
                break;
            }
            case 'DFS': {
                const steps = algo.generateDfsSteps(nodes, edges, graphType, startNode);
                if (steps?.length > 0) {
                    stepsRef.current = steps;
                    setTraversalResult({ visitedOrder: steps.map(s => s.currentStep), currentStep: null, stepIndex: -1 });
                    animate('DFS');
                }
                break;
            }
            case 'Dijkstra': {
                const result = algo.generateDijkstraResult(nodes, edges, graphType, dijkstraStart, dijkstraTarget);
                if (result) {
                    stepsRef.current = result.steps;
                    setDijkstraResult({ ...result, currentStep: null, stepIndex: -1 });
                    animate('Dijkstra');
                }
                break;
            }
            case 'Prim': {
                const steps = algo.generatePrimSteps(nodes, edges, graphType);
                if (steps?.length > 0) {
                    stepsRef.current = steps;
                    setPrimResult({ mstNodes: [], mstEdges: [], mstEdgeIds: [], currentStep: null, stepIndex: -1 });
                    animate('Prim');
                }
                break;
            }
            case 'AStar': {
                const result = algo.generateAStarResult(nodes, edges, graphType, dijkstraStart, dijkstraTarget, heuristicType);
                if (result) {
                    stepsRef.current = result.steps;
                    setAStarResult({ ...result, start: dijkstraStart, target: dijkstraTarget, currentStep: null, stepIndex: -1 });
                    animate('AStar');
                }
                break;
            }
            case 'Kruskal': {
                const steps = algo.generateKruskalSteps(nodes, edges);
                if (steps?.length > 0) {
                    stepsRef.current = steps;
                    setKruskalResult({});
                    animate('Kruskal');
                }
                break;
            }
            case 'TopologicalSort': {
                const result = algo.generateTopologicalSortSteps(nodes, edges);
                if (result.steps.length > 0) {
                    stepsRef.current = result.steps;
                    setTopoSortResult({ sortedOrder: [], cycleDetected: false }); // Initialize
                    animate('TopologicalSort');
                }
                break;
            }
            case 'BellmanFord': {
                const result = algo.generateBellmanFordSteps(nodes, edges, startNode);
                if (result && result.steps && result.steps.length > 0) {
                    stepsRef.current = result.steps;
                    setBellmanFordResult(result.steps[0]); // Set initial state from the first step
                    animate('BellmanFord');
                } else {
                    console.error("Bellman-Ford did not generate any steps.");
                    alert("Could not run Bellman-Ford. Ensure a start node is selected.");
                }
                break;
            }
            default:
                break;
        }
    }, [reset, animate, nodes, edges]);

    return {
        currentAlgorithm, isRunning, isPaused, speed, progress,
        traversalResult, dijkstraResult, primResult, aStarResult, kruskalResult, topoSortResult, bellmanFordResult,
        runAlgorithm,
        resetAlgorithm: reset,
        setSpeed,
        setIsPaused,
    };
};