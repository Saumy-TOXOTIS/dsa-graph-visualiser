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
    const [floydWarshallResult, setFloydWarshallResult] = useState(null);
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
        setFloydWarshallResult(null);
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
                if (algorithm === 'AStar' && stepsRef.current.length > 0) {
                    setAStarResult(prev => ({ ...prev, ...stepsRef.current[stepsRef.current.length - 1] }));
                }
                return;
            }
            const step = stepsRef.current[i];

            switch (algorithm) {
                case 'BFS':
                    setTraversalResult(prev => ({ ...prev, ...step, stepIndex: i }));
                    break;
                case 'DFS':
                    // --- UPDATED: Pass the entire new DFS step object ---
                    setTraversalResult(prev => ({ ...prev, ...step, stepIndex: i }));
                    break;
                case 'Dijkstra':
                    setDijkstraResult(prev => ({ ...prev, ...step, stepIndex: i }));
                    break;
                case 'BellmanFord': {
                    setBellmanFordResult(prev => ({ ...prev, ...step, stepIndex: i }));
                    break;
                }
                case 'AStar': {
                    setAStarResult(prev => ({ ...prev, ...step, stepIndex: i }));
                    break;
                }
                case 'Prim': {
                    setPrimResult(prev => ({...prev, ...step, stepIndex: i }));
                    break;
                }
                case 'Kruskal': {
                    setKruskalResult(prev => ({...prev, ...step, stepIndex: i}));
                    break;
                }
                case 'TopologicalSort': {
                    setTopoSortResult(prev => ({...prev, ...step, stepIndex: i}));
                    break;
                }
                case 'FloydWarshall':
                    setFloydWarshallResult(prev => ({...prev, ...step}));
                    break;
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
                    setTraversalResult({
                        steps: steps,
                        visitedOrder: steps.map(s => s.currentStep).filter((v, i, a) => a.indexOf(v) === i),
                        currentStep: null,
                        sourceNode: null,
                        currentEdgeId: null,
                        exploringEdgeIds: [],
                        stepIndex: -1
                    });
                    animate('BFS');
                }
                break;
            }
            case 'DFS': {
                const steps = algo.generateDfsSteps(nodes, edges, graphType, startNode);
                if (steps?.length > 0) {
                    stepsRef.current = steps;
                    // --- UPDATED: Initialize the state for DFS ---
                    setTraversalResult({
                        steps: steps,
                        visitedNodes: [],
                        visitedEdgeIds: [],
                        pathStack: [],
                        currentNode: null,
                        currentEdgeId: null,
                        backtrackingNode: null,
                        stepIndex: -1,
                    });
                    animate('DFS');
                }
                break;
            }
            case 'Dijkstra': {
                const result = algo.generateDijkstraResult(nodes, edges, graphType, dijkstraStart, dijkstraTarget);
                if (result && result.steps.length > 0) {
                    stepsRef.current = result.steps;
                    // --- UPDATED: Initialize the state for Dijkstra ---
                    setDijkstraResult({
                        ...result,
                        currentNodeId: null,
                        relaxingEdgeId: null,
                        stepIndex: -1,
                    });
                    animate('Dijkstra');
                }
                break;
            }
            case 'BellmanFord': {
                const result = algo.generateBellmanFordSteps(nodes, edges, graphType, startNode);
                if (result?.steps.length > 0) {
                    stepsRef.current = result.steps;
                    setBellmanFordResult({ ...result, stepIndex: -1 });
                    animate('BellmanFord');
                } else {
                    alert("Could not run Bellman-Ford. Ensure a start node is selected.");
                }
                break;
            }
            case 'AStar': {
                const result = algo.generateAStarResult(nodes, edges, graphType, dijkstraStart, dijkstraTarget, heuristicType);
                if (result?.steps.length) {
                    stepsRef.current = result.steps;
                    // --- THE FIX IS HERE ---
                    // Initialize with the first step and GUARANTEE path/pathEdges are empty arrays.
                    setAStarResult({
                        ...result.steps[0],
                        totalDistance: result.totalDistance,
                        path: [],
                        pathEdges: [],
                        stepIndex: -1
                    });
                    animate('AStar');
                }
                break;
            }
            case 'Prim': {
                const result = { steps: algo.generatePrimSteps(nodes, edges, graphType) };
                if (result.steps?.length) {
                    stepsRef.current = result.steps;
                    // --- UPDATED: Initialize the state for Prim's ---
                    setPrimResult({ ...result.steps[0], stepIndex: -1 });
                    animate('Prim');
                }
                break;
            }
            case 'Kruskal': {
                const steps = algo.generateKruskalSteps(nodes, edges);
                if (steps?.length) {
                    stepsRef.current = steps;
                    // --- UPDATED: Initialize the state for Kruskal's ---
                    setKruskalResult({ ...steps[0], stepIndex: -1 });
                    animate('Kruskal');
                }
                break;
            }
            case 'TopologicalSort': {
                const result = algo.generateTopologicalSortSteps(nodes, edges);
                if (result.steps.length) {
                    stepsRef.current = result.steps;
                    // --- UPDATED: Initialize the state for TopoSort ---
                    setTopoSortResult({ ...result, ...result.steps[0], stepIndex: -1 });
                    animate('TopologicalSort');
                }
                break;
            }
            case 'FloydWarshall': {
                const result = algo.generateFloydWarshallSteps(nodes, edges, graphType);
                if (result.steps?.length) {
                    stepsRef.current = result.steps;
                    setFloydWarshallResult({ ...result.steps[0], stepIndex: -1 });
                    animate('FloydWarshall');
                }
                break;
            }
            default:
                break;
        }
    }, [reset, animate, nodes, edges]);

    return {
        currentAlgorithm, isRunning, isPaused, speed, progress,
        traversalResult, dijkstraResult, primResult, aStarResult, kruskalResult, topoSortResult, bellmanFordResult, floydWarshallResult,
        runAlgorithm,
        resetAlgorithm: reset,
        setSpeed,
        setIsPaused,
    };
};