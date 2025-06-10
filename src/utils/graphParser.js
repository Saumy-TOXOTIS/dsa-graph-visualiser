// src/utils/graphParser.js

// Parses structured matrix data from our new component
export const parseStructuredData = (input) => {
    try {
        if (input.type === 'matrix') {
            return parseMatrixData(input.data);
        }
        // Placeholder for future 'list' parser
        throw new Error("Invalid input type.");
    } catch (e) {
        return { error: e.message || "Failed to parse data." };
    }
};

function parseMatrixData(matrix) {
    const nodes = [];
    const edges = [];
    const size = matrix.length;

    if (size === 0) return { nodes: [], edges: [] };

    for (let i = 0; i < size; i++) {
        nodes.push(`Node ${i + 1}`);
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const weight = matrix[i][j];
            if (weight > 0) {
                edges.push({ from: nodes[i], to: nodes[j], weight });
            }
        }
    }
    return { nodes, edges };
}

// Generates the final node/edge arrays for the app, placing nodes in a circle
export const generateGraphFromParsedData = (parsedData, canvasDimensions) => {
    const nodeMap = new Map();
    const radius = Math.min(canvasDimensions.width, canvasDimensions.height) * 0.35;
    const centerX = canvasDimensions.width / 2;
    const centerY = canvasDimensions.height / 2;
    const angleStep = parsedData.nodes.length > 1 ? (2 * Math.PI) / parsedData.nodes.length : 0;

    const finalNodes = parsedData.nodes.map((label, i) => {
        const id = Date.now() + i;
        const x = parsedData.nodes.length > 1 
            ? centerX + radius * Math.cos(i * angleStep - Math.PI / 2) 
            : centerX;
        const y = parsedData.nodes.length > 1
            ? centerY + radius * Math.sin(i * angleStep - Math.PI / 2)
            : centerY;
        const node = { id, value: label, x, y };
        nodeMap.set(label, node);
        return node;
    });

    const finalEdges = parsedData.edges.map((edge, i) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;
        return {
            id: Date.now() + finalNodes.length + i,
            start: fromNode.id,
            end: toNode.id,
            weight: edge.weight,
            directed: true,
        };
    }).filter(Boolean);

    return { nodes: finalNodes, edges: finalEdges };
};