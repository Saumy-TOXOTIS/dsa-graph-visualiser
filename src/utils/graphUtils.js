// src/utils/graphUtils.js

/**
 * Builds an adjacency list representation of the graph.
 * @param {Array} nodes - Array of node objects.
 * @param {Array} edges - Array of edge objects.
 * @param {string} graphType - 'directed' or 'undirected'.
 * @returns {Object} - An adjacency list.
 */
export const buildAdjacencyList = (nodes, edges, graphType) => {
    const adj = {};
    nodes.forEach((node) => (adj[node.id] = []));
    edges.forEach((edge) => {
        if (adj[edge.start]) {
            // FIX: Add edge.id so algorithms can track it
            adj[edge.start].push({ node: edge.end, weight: edge.weight, edgeId: edge.id });
        }
        if (graphType === 'undirected' && adj[edge.end]) {
            // FIX: Add edge.id so algorithms can track it
            adj[edge.end].push({ node: edge.start, weight: edge.weight, edgeId: edge.id });
        }
    });
    return adj;
};

/**
 * Calculates the in-degree, out-degree, and total degree for every node.
 * @param {Array} nodes - Array of node objects.
 * @param {Array} edges - Array of edge objects.
 * @returns {Object} - An object mapping each node ID to its degree info.
 * e.g., { nodeId: { in: 1, out: 2, degree: 3 } }
 */
export const calculateNodeDegrees = (nodes, edges) => {
    const degrees = {};

    // Initialize all degrees to 0
    nodes.forEach(node => {
        degrees[node.id] = { in: 0, out: 0, degree: 0 };
    });

    // Iterate through edges to calculate degrees
    edges.forEach(edge => {
        if (degrees[edge.start]) {
            degrees[edge.start].out++;
            degrees[edge.start].degree++;
        }
        if (degrees[edge.end]) {
            degrees[edge.end].in++;
            degrees[edge.end].degree++;
        }
    });

    return degrees;
};

/**
 * Builds an adjacency matrix representation of the graph.
 * @param {Array} nodes - Array of node objects.
 * @param {Array} edges - Array of edge objects.
 * @param {string} graphType - 'directed' or 'undirected'.
 * @returns {Array<Array<number>>} - An N x N matrix of weights.
 */
export const buildAdjacencyMatrix = (nodes, edges, graphType) => {
    if (nodes.length === 0) return [];

    const nodeIndexMap = new Map();
    // Sort nodes by value for a consistent matrix order
    const sortedNodes = [...nodes].sort((a, b) => a.value.localeCompare(b.value));
    
    sortedNodes.forEach((node, index) => {
        nodeIndexMap.set(node.id, index);
    });

    const size = sortedNodes.length;
    const matrix = Array(size).fill(0).map(() => Array(size).fill(0));

    edges.forEach(edge => {
        const startIndex = nodeIndexMap.get(edge.start);
        const endIndex = nodeIndexMap.get(edge.end);

        if (startIndex !== undefined && endIndex !== undefined) {
            matrix[startIndex][endIndex] = edge.weight;
            if (graphType === 'undirected') {
                matrix[endIndex][startIndex] = edge.weight;
            }
        }
    });

    return matrix;
};