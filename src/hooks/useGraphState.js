// src/hooks/useGraphState.js

import { useState, useEffect, useCallback } from 'react';
import { parseStructuredData, generateGraphFromParsedData } from '../utils/graphParser';

// A helper function to generate a random graph. We keep it here as it's tightly coupled
// with the state setters of this hook.
const generateRandomGraphData = (containerRect, graphType) => {
    const newNodeCount = Math.floor(Math.random() * 6) + 5; // 5-10 nodes
    const newNodes = [];
    const newEdges = [];
    for (let i = 1; i <= newNodeCount; i++) {
        const id = Date.now() + i;
        const x = 50 + Math.random() * (containerRect.width - 100);
        const y = 50 + Math.random() * (containerRect.height - 100);
        newNodes.push({ id, value: `Node ${i}`, x, y });
    }
    const possibleEdges = [];
    for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
            possibleEdges.push([newNodes[i].id, newNodes[j].id]);
        }
    }
    const edgeCount = Math.floor(possibleEdges.length * (0.3 + Math.random() * 0.2));
    for (let i = 0; i < edgeCount; i++) {
        if (possibleEdges.length === 0) break;
        const randomIndex = Math.floor(Math.random() * possibleEdges.length);
        const [start, end] = possibleEdges.splice(randomIndex, 1)[0];
        const weight = parseFloat((1 + Math.random() * 9).toFixed(1));
        newEdges.push({
            id: Date.now() + i + newNodeCount,
            start, end, weight,
            directed: graphType === 'directed'
        });
    }
    return { newNodes, newEdges };
}

export const useGraphState = (onGraphChange) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [graphType, setGraphType] = useState('undirected');
    const [savedGraphs, setSavedGraphs] = useState([]);
    const [nodeValue, setNodeValue] = useState('');
    const [fromNode, setFromNode] = useState('');
    const [toNode, setToNode] = useState('');
    const [edgeWeight, setEdgeWeight] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedGraphs');
            if (saved) setSavedGraphs(JSON.parse(saved));
        } catch (error) {
            console.error("Failed to load saved graphs:", error);
            setSavedGraphs([]);
        }
    }, []);

    useEffect(() => {
        setNodes([]);
        setEdges([]);
        onGraphChange?.();
    }, [graphType, onGraphChange]);

    const addNode = useCallback((x, y, value) => {
        const finalValue = (value || nodeValue).trim();
        if (finalValue) {
            if (nodes.find((node) => node.value === finalValue)) {
                alert('A node with this value already exists.');
                return;
            }
            const id = Date.now();
            setNodes(prevNodes => [...prevNodes, { id, value: finalValue, x, y }]);
            setNodeValue('');
        }
    }, [nodeValue, nodes]);

    // 1. Define addEdgeDirectly FIRST.
    const addEdgeDirectly = useCallback((startId, endId, weight) => {
        if (startId === endId) {
            alert('Cannot create an edge from a node to itself.');
            return;
        }
        const edgeExists = edges.some(edge =>
            (edge.start === startId && edge.end === endId) ||
            (graphType === 'undirected' && edge.start === endId && edge.end === startId)
        );
        if (edgeExists) {
            alert('An edge between these nodes already exists.');
            return;
        }
        setEdges(prevEdges => [...prevEdges, {
            id: Date.now(),
            start: startId,
            end: endId,
            weight: weight,
            directed: graphType === 'directed',
        }]);
    }, [edges, graphType]);
    
    // 2. Now define addEdgeFromForm, which can safely use addEdgeDirectly.
    const addEdgeFromForm = useCallback(() => {
        const start = parseInt(fromNode);
        const end = parseInt(toNode);
        const weightNum = parseFloat(edgeWeight);
        if (isNaN(start) || isNaN(end) || isNaN(weightNum)) {
            alert('Please select valid nodes and provide a numeric weight.');
            return;
        }
        addEdgeDirectly(start, end, weightNum);
        setFromNode('');
        setToNode('');
        setEdgeWeight('');
    }, [fromNode, toNode, edgeWeight, addEdgeDirectly]);

    const deleteNode = useCallback((nodeId) => {
        setNodes(prev => prev.filter(n => n.id !== nodeId));
        setEdges(prev => prev.filter(e => e.start !== nodeId && e.end !== nodeId));
    }, []);

    const editNode = useCallback((nodeId, newValue) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, value: newValue } : n));
    }, []);

    const deleteEdge = useCallback((edgeId) => {
        setEdges(prev => prev.filter(e => e.id !== edgeId));
    }, []);

    const editEdge = useCallback((edgeId, newWeight) => {
        setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, weight: parseFloat(newWeight) } : e));
    }, []);

    const clearGraph = useCallback(() => {
        if (window.confirm('Clear the entire graph?')) {
            setNodes([]);
            setEdges([]);
            onGraphChange?.();
        }
    }, [onGraphChange]);

    const generateRandomGraph = useCallback((containerRef) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const { newNodes, newEdges } = generateRandomGraphData(rect, graphType);
            setNodes(newNodes);
            setEdges(newEdges);
            onGraphChange?.();
        }
    }, [graphType, onGraphChange]);

    const saveGraph = useCallback(() => {
        const graphName = prompt('Enter a name for this graph:');
        if (graphName) {
            const graphData = { name: graphName, nodes, edges, graphType, createdAt: new Date().toISOString() };
            const updatedGraphs = [...savedGraphs, graphData];
            setSavedGraphs(updatedGraphs);
            localStorage.setItem('savedGraphs', JSON.stringify(updatedGraphs));
            alert(`Graph "${graphName}" saved successfully!`);
        }
    }, [nodes, edges, graphType, savedGraphs]);

    const loadGraph = useCallback((graphData) => {
        if (window.confirm('Load this graph? Current graph will be replaced.')) {
            setGraphType(graphData.graphType);
            setNodes(graphData.nodes);
            setEdges(graphData.edges);
            onGraphChange?.();
        }
    }, [onGraphChange]);

    const buildGraphFromData = useCallback((input, containerRef) => {
        if (!containerRef.current) {
            alert("Canvas not ready.");
            return;
        }
        if (window.confirm("This will clear the current graph and build a new one. Are you sure?")) {
            const parsedData = parseStructuredData(input);
            if (parsedData.error) {
                alert(`Error: ${parsedData.error}`);
                return;
            }
            const canvasRect = containerRef.current.getBoundingClientRect();
            const { nodes: newNodes, edges: newEdges } = generateGraphFromParsedData(parsedData, canvasRect);

            // Logic to determine if graph should be undirected
            let finalEdges = newEdges.map(e => ({ ...e, directed: graphType === 'directed' }));
            if (input.type.includes('matrix') && graphType === 'undirected') {
                const uniqueEdges = [];
                const seen = new Set();
                for (const edge of newEdges) {
                    const key1 = `${edge.start}-${edge.end}`;
                    const key2 = `${edge.end}-${edge.start}`;
                    if (!seen.has(key1) && !seen.has(key2)) {
                        uniqueEdges.push({ ...edge, directed: false });
                        seen.add(key1);
                        seen.add(key2);
                    }
                }
                finalEdges = uniqueEdges;
            }

            setNodes(newNodes);
            setEdges(finalEdges);
            onGraphChange?.();
        }
    }, [graphType, onGraphChange]);

    return {
        nodes, setNodes, edges, setEdges, graphType, setGraphType, savedGraphs,
        nodeValue, setNodeValue, fromNode, setFromNode, toNode, setToNode, edgeWeight, setEdgeWeight,
        addNode, 
        addEdge: addEdgeFromForm,
        addEdgeDirectly,
        deleteNode, editNode, deleteEdge, editEdge,
        clearGraph, generateRandomGraph, saveGraph, loadGraph, buildGraphFromData,
    };
};