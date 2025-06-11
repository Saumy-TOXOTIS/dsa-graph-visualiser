// src/algorithms/index.js

import { buildAdjacencyList } from '../utils/graphUtils';

/* ==== BFS ==== */

export const generateBfsSteps = (nodes, edges, graphType, startNode) => {
    if (!startNode || nodes.length === 0) return [];

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set([startNode]);
    const queue = [startNode];
    const visitedOrder = [startNode];
    const steps = [{ currentStep: startNode, visitedOrder: [...visitedOrder] }];

    while (queue.length > 0) {
        const current = queue.shift();
        const neighbors = adjacencyList[current] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                visitedOrder.push(neighbor.node);
                queue.push(neighbor.node);
                steps.push({ currentStep: neighbor.node, visitedOrder: [...visitedOrder] });
            }
        }
    }
    return steps;
};

/* ==== DFS ==== */

export const generateDfsSteps = (nodes, edges, graphType, startNode) => {
    if (!startNode || nodes.length === 0) return [];

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set();
    const visitedOrder = [];
    const steps = [];

    const dfs = (node) => {
        visited.add(node);
        visitedOrder.push(node);
        steps.push({ currentStep: node, visitedOrder: [...visitedOrder] });

        const neighbors = adjacencyList[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                dfs(neighbor.node);
            }
        }
    };

    dfs(startNode);
    return steps;
};

/* ==== Dijkstra ==== */

export const generateDijkstraResult = (nodes, edges, graphType, dijkstraStart, dijkstraTarget) => {
    if (!dijkstraStart || !dijkstraTarget || nodes.length === 0) return null;

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const distances = {};
    const previous = {};
    const visited = new Set();
    const steps = [];

    nodes.forEach(node => {
        distances[node.id] = Infinity;
    });
    distances[dijkstraStart] = 0;

    const unvisited = [...nodes.map(node => node.id)];

    while (unvisited.length > 0) {
        unvisited.sort((a, b) => distances[a] - distances[b]);
        const closest = unvisited.shift();

        if (distances[closest] === Infinity) break;

        visited.add(closest);
        steps.push({
            currentStep: closest,
            visitedOrder: Array.from(visited),
            distances: { ...distances }
        });

        if (closest === dijkstraTarget) break;

        const neighbors = adjacencyList[closest] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                const alt = distances[closest] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = closest;
                }
            }
        }
    }

    const path = [];
    const pathEdges = []; // NEW: Array to store edge IDs
    let current = dijkstraTarget;

    while (previous[current] !== undefined) {
        const prevNode = previous[current];
        path.unshift(current);

        // Find the edge that connects prevNode and current
        const edge = edges.find(e =>
            (e.start === prevNode && e.end === current) ||
            (graphType === 'undirected' && e.start === current && e.end === prevNode)
        );
        if (edge) {
            pathEdges.unshift(edge.id); // Add edge ID to the path
        }
        current = prevNode;
    }

    if (path.length > 0 || current === dijkstraStart) {
        path.unshift(current);
    }

    if (path[0] !== dijkstraStart) {
        return { path: [], pathEdges: [], distances, visitedOrder: Array.from(visited), steps };
    }

    return { path, pathEdges, distances, visitedOrder: Array.from(visited), steps };
};

/* ==== A-Star ==== */

export const generateAStarResult = (nodes, edges, graphType, startId, targetId, heuristicType) => {
    if (!startId || !targetId || nodes.length === 0) return null;

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const openSet = new Set([startId]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    nodes.forEach(node => {
        gScore[node.id] = Infinity;
        fScore[node.id] = Infinity;
    });

    gScore[startId] = 0;

    const heuristic = (aId, bId) => {
        const nodeA = nodes.find(n => n.id === aId);
        const nodeB = nodes.find(n => n.id === bId);
        if (!nodeA || !nodeB) return Infinity;

        if (heuristicType === 'manhattan') {
            return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
        }
        // Default to Euclidean
        return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    };

    fScore[startId] = heuristic(startId, targetId);

    const steps = [];
    const visitedOrder = [];

    while (openSet.size > 0) {
        let current = null;
        let lowestFScore = Infinity;

        for (const nodeId of openSet) {
            if (fScore[nodeId] < lowestFScore) {
                lowestFScore = fScore[nodeId];
                current = nodeId;
            }
        }

        if (current === targetId) {
            // --- MODIFICATION: A* Path Reconstruction with Edges ---
            const path = [];
            const pathEdges = []; // NEW
            let temp = current;
            while (cameFrom[temp] !== undefined) {
                const prevNode = cameFrom[temp];
                path.unshift(temp);
                const edge = edges.find(e =>
                    (e.start === prevNode && e.end === temp) ||
                    (graphType === 'undirected' && e.start === temp && e.end === prevNode)
                );
                if (edge) pathEdges.unshift(edge.id);
                temp = prevNode;
            }
            path.unshift(startId); // Add the start node
            steps.push({ current, visitedOrder: [...visitedOrder, current] });
            return { path, pathEdges, visitedOrder, steps };
        }

        openSet.delete(current);
        visitedOrder.push(current);
        steps.push({ current, visitedOrder: [...visitedOrder] });

        const neighbors = adjacencyList[current] || [];
        for (const neighbor of neighbors) {
            const tentativeGScore = gScore[current] + neighbor.weight;

            if (tentativeGScore < gScore[neighbor.node]) {
                cameFrom[neighbor.node] = current;
                gScore[neighbor.node] = tentativeGScore;
                fScore[neighbor.node] = tentativeGScore + heuristic(neighbor.node, targetId);

                if (!openSet.has(neighbor.node)) {
                    openSet.add(neighbor.node);
                }
            }
        }
    }

    // No path found
    return { path: [], pathEdges: [], visitedOrder, steps };
};

/* ==== Bellman Ford ==== */

export const generateBellmanFordSteps = (nodes, edges, startNodeId) => {
    if (nodes.length === 0 || !startNodeId) {
        return { steps: [], distances: {}, predecessors: {}, negativeCycle: null };
    }

    const steps = [];
    const distances = {};
    const predecessors = {};
    const startNode = nodes.find(n => n.id === startNodeId);

    // 1. Initialize distances
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        predecessors[node.id] = null;
    });
    distances[startNodeId] = 0;

    steps.push({
        description: `Initialization: Distance to start node ${startNode?.value} is 0. All others are ∞.`,
        distances: { ...distances },
        highlightedEdge: null,
        negativeCycle: null,
    });

    // 2. Relax edges repeatedly (V-1 times)
    for (let i = 1; i < nodes.length; i++) {
        let relaxedAnEdgeInPass = false; // Use a different name to be clear
        for (const edge of edges) {
            steps.push({
                description: `Pass ${i}, checking edge...`,
                distances: { ...distances },
                highlightedEdge: edge.id,
                negativeCycle: null,
            });

            if (distances[edge.start] !== Infinity && distances[edge.start] + edge.weight < distances[edge.end]) {
                distances[edge.end] = distances[edge.start] + edge.weight;
                predecessors[edge.end] = edge.start;
                // --- THIS WAS THE MISSING LINE ---
                relaxedAnEdgeInPass = true;
            }
        }
        // Optimization: If a full pass completes with no relaxation, we can stop.
        if (!relaxedAnEdgeInPass) {
            steps.push({
                description: `Pass ${i} completed with no changes. Stopping early.`,
                distances: { ...distances },
                highlightedEdge: null,
                negativeCycle: null,
            });
            break;
        }
    }

    // 3. Check for negative weight cycles
    let negativeCycleNode = null;
    for (const edge of edges) {
        if (distances[edge.start] !== Infinity && distances[edge.start] + edge.weight < distances[edge.end]) {
            // Negative cycle detected!
            negativeCycleNode = edge.end; // This node is part of or reachable from a cycle
            break;
        }
    }

    let finalCyclePath = null;
    if (negativeCycleNode) {
        // Backtrack to find a node that is definitely IN the cycle.
        let nodeInCycle = negativeCycleNode;
        for (let i = 0; i < nodes.length; i++) {
            nodeInCycle = predecessors[nodeInCycle];
        }

        // Now trace the cycle starting from this known cycle node.
        finalCyclePath = [];
        let currentNode = nodeInCycle;
        while (true) {
            finalCyclePath.push(currentNode);
            currentNode = predecessors[currentNode];
            if (currentNode === nodeInCycle) {
                finalCyclePath.push(currentNode);
                break;
            }
        }
        finalCyclePath.reverse();

        steps.push({
            description: `Negative weight cycle detected! Shortest paths are undefined.`,
            distances: { ...distances },
            highlightedEdge: null,
            negativeCycle: finalCyclePath,
        });
    } else {
        steps.push({
            description: "Algorithm finished. No negative cycles found.",
            distances: { ...distances },
            highlightedEdge: null,
            negativeCycle: null,
        });
    }

    return { steps, distances, predecessors, negativeCycle: finalCyclePath };
};

/* ==== Prim's ==== */

export const generatePrimSteps = (nodes, edges, graphType) => {
    if (nodes.length === 0) return [];

    const startId = nodes[0].id;
    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set([startId]);
    const mstEdges = [];
    const steps = [];

    // Initial step
    steps.push({
        currentStep: startId,
        visitedSoFar: [...visited],
        mstEdges: [],
    });

    while (visited.size < nodes.length) {
        let minEdge = null;

        for (const nodeId of visited) {
            const neighbors = adjacencyList[nodeId] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.node)) {
                    if (!minEdge || neighbor.weight < minEdge.weight) {
                        minEdge = {
                            from: nodeId,
                            to: neighbor.node,
                            weight: neighbor.weight
                        };
                    }
                }
            }
        }

        if (minEdge) {
            visited.add(minEdge.to);
            mstEdges.push(minEdge);
            steps.push({
                currentStep: minEdge.to,
                visitedSoFar: [...visited],
                mstEdges: [...mstEdges],
            });
        } else {
            // No more reachable nodes, break to prevent infinite loop on disconnected graphs
            break;
        }
    }

    return steps;
};

/* ==== Kruskal ==== */

export const generateKruskalSteps = (nodes, edges) => {
    if (nodes.length === 0 || edges.length === 0) return [];

    const steps = [];
    const mstEdges = [];

    // 1. Create a parent map for the DSU data structure. Initially, each node is its own parent.
    const parent = {};
    nodes.forEach(node => parent[node.id] = node.id);

    // The 'find' function for DSU: finds the representative (root) of a set.
    // Includes path compression for optimization.
    const find = (i) => {
        if (parent[i] === i) {
            return i;
        }
        return parent[i] = find(parent[i]);
    };

    // The 'union' function for DSU: merges two sets.
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent[rootI] = rootJ;
            return true; // Union was successful
        }
        return false; // They were already in the same set
    };

    // 2. Sort all edges by weight in ascending order.
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    steps.push({
        sortedEdges: sortedEdges.map(e => e.id), // Show the initial sorted order
        currentEdgeId: null,
        mstEdges: [],
        stepType: 'sort' // A special step type to explain the sorting
    });

    // 3. Iterate through sorted edges.
    for (const edge of sortedEdges) {
        const { start, end, id } = edge;

        // Check if adding this edge forms a cycle by checking if start and end are already in the same set.
        if (find(start) !== find(end)) {
            // No cycle: add the edge to the MST.
            union(start, end);
            mstEdges.push(edge);

            // Step: Edge Accepted
            steps.push({
                sortedEdges: sortedEdges.map(e => e.id),
                currentEdgeId: id,
                mstEdges: [...mstEdges],
                stepType: 'accept'
            });
        } else {
            // Cycle detected: discard the edge.

            // Step: Edge Rejected
            steps.push({
                sortedEdges: sortedEdges.map(e => e.id),
                currentEdgeId: id,
                mstEdges: [...mstEdges],
                stepType: 'reject'
            });
        }
    }

    return steps;
};

/* ==== Topological Sort ==== */

export const generateTopologicalSortSteps = (nodes, edges) => {
    const steps = [];
    const sortedOrder = [];

    // 1. Calculate in-degrees for every node.
    const inDegree = {};
    nodes.forEach(node => inDegree[node.id] = 0);
    edges.forEach(edge => {
        if (inDegree[edge.end] !== undefined) {
            inDegree[edge.end]++;
        }
    });

    // 2. Initialize a queue with all nodes that have an in-degree of 0.
    const queue = nodes.filter(node => inDegree[node.id] === 0);

    steps.push({
        description: "Calculated all in-degrees. Initializing queue with nodes having an in-degree of 0.",
        inDegrees: { ...inDegree },
        queue: [...queue.map(n => n.id)],
        sortedOrder: [],
        currentNode: null,
    });

    // 3. Process the queue.
    let visitedCount = 0;
    while (queue.length > 0) {
        const u = queue.shift();
        sortedOrder.push(u.id);
        visitedCount++;

        steps.push({
            description: `Dequeued node ${u.value} and added it to the sorted list.`,
            inDegrees: { ...inDegree },
            queue: [...queue.map(n => n.id)],
            sortedOrder: [...sortedOrder],
            currentNode: u.id,
        });

        // Find all neighbors of u and decrease their in-degree.
        const neighbors = edges.filter(edge => edge.start === u.id);
        for (const edge of neighbors) {
            const v_id = edge.end;
            if (inDegree[v_id] !== undefined) {
                inDegree[v_id]--;

                // If a neighbor's in-degree becomes 0, add it to the queue.
                if (inDegree[v_id] === 0) {
                    const v_node = nodes.find(n => n.id === v_id);
                    if (v_node) queue.push(v_node);
                }
            }
        }

        steps.push({
            description: `Decremented in-degrees for neighbors of ${u.value}.`,
            inDegrees: { ...inDegree },
            queue: [...queue.map(n => n.id)],
            sortedOrder: [...sortedOrder],
            currentNode: u.id,
        });
    }

    // 4. Check for cycles.
    if (visitedCount !== nodes.length) {
        // Find nodes involved in the cycle (nodes with in-degree > 0)
        const cycleNodes = nodes
            .filter(node => inDegree[node.id] > 0)
            .map(node => node.id);

        steps.push({
            description: `Error: Cycle detected! Not all nodes were visited. The remaining nodes form a cycle.`,
            inDegrees: { ...inDegree },
            queue: [],
            sortedOrder: [...sortedOrder],
            currentNode: null,
            cycleDetected: true,
            cycleNodes: cycleNodes
        });
        return { steps, sortedOrder, cycleDetected: true, cycleNodes };
    }

    steps.push({
        description: "Topological sort complete!",
        inDegrees: { ...inDegree },
        queue: [],
        sortedOrder: [...sortedOrder],
        currentNode: null,
        cycleDetected: false
    });

    return { steps, sortedOrder, cycleDetected: false };
};

/* ==== Find Cycle ==== */

export const findCycle = (nodes, edges, graphType) => {
    if (nodes.length < 3 && graphType === 'undirected') return null;
    if (nodes.length < 1) return null;

    const adj = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set();

    for (const node of nodes) {
        if (!visited.has(node.id)) {
            const path = [node.id];
            const recursionStack = new Set([node.id]);
            const cycle = dfs(node.id, -1, visited, recursionStack, adj, path, graphType);
            if (cycle) {
                return cycle;
            }
        }
    }
    return null;
};

// Helper DFS function for cycle detection
function dfs(u, parent, visited, recursionStack, adj, path, graphType) {
    visited.add(u);

    const neighbors = adj[u] || [];
    for (const neighbor of neighbors) {
        const v = neighbor.node;

        if (graphType === 'undirected' && v === parent) {
            continue; // Don't go back to the immediate parent in an undirected graph
        }

        if (recursionStack.has(v)) {
            // Cycle detected!
            const cycleStartIndex = path.indexOf(v);
            return path.slice(cycleStartIndex);
        }

        if (!visited.has(v)) {
            path.push(v);
            recursionStack.add(v);
            const cycle = dfs(v, u, visited, recursionStack, adj, path, graphType);
            if (cycle) return cycle;
            // Backtrack
            path.pop();
            recursionStack.delete(v);
        }
    }
    return null;
}

/* ==== Find Connected Component ==== */

export const findConnectedComponents = (nodes, edges, graphType) => {
    if (nodes.length === 0) return { components: [], count: 0 };

    if (graphType === 'undirected') {
        return findUndirectedComponents(nodes, edges);
    } else {
        return findStronglyConnectedComponents(nodes, edges);
    }
};

// --- Helper for Undirected Graphs ---
function findUndirectedComponents(nodes, edges) {
    const adj = buildAdjacencyList(nodes, edges, 'undirected');
    const visited = new Set();
    const components = [];

    for (const node of nodes) {
        if (!visited.has(node.id)) {
            const component = [];
            const queue = [node.id];
            visited.add(node.id);

            while (queue.length > 0) {
                const u = queue.shift();
                component.push(u);

                const neighbors = adj[u] || [];
                for (const neighbor of neighbors) {
                    const v = neighbor.node;
                    if (!visited.has(v)) {
                        visited.add(v);
                        queue.push(v);
                    }
                }
            }
            components.push(component);
        }
    }
    return { components, count: components.length };
}

// --- Helper for Directed Graphs (Kosaraju's Algorithm for SCCs) ---
function findStronglyConnectedComponents(nodes, edges) {
    const adj = buildAdjacencyList(nodes, edges, 'directed');
    const visited = new Set();
    const finishOrderStack = [];

    // 1st Pass: DFS to get the finish order of nodes
    for (const node of nodes) {
        if (!visited.has(node.id)) {
            dfs1(node.id, visited, finishOrderStack, adj);
        }
    }

    // 2nd Pass: Get the graph with all edges reversed (transposed)
    const reversedEdges = edges.map(edge => ({ start: edge.end, end: edge.start, weight: edge.weight }));
    const adjReversed = buildAdjacencyList(nodes, reversedEdges, 'directed');

    // 3rd Pass: DFS on the reversed graph in the order of the stack
    visited.clear();
    const components = [];
    while (finishOrderStack.length > 0) {
        const u = finishOrderStack.pop();
        if (!visited.has(u)) {
            const component = [];
            dfs2(u, visited, component, adjReversed);
            components.push(component);
        }
    }

    return { components, count: components.length };
}

// Helper DFS for Kosaraju's 1st pass
function dfs1(u, visited, stack, adj) {
    visited.add(u);
    const neighbors = adj[u] || [];
    for (const neighbor of neighbors) {
        const v = neighbor.node;
        if (!visited.has(v)) {
            dfs1(v, visited, stack, adj);
        }
    }
    stack.push(u);
}

// Helper DFS for Kosaraju's 2nd pass
function dfs2(u, visited, component, adjReversed) {
    visited.add(u);
    component.push(u);
    const neighbors = adjReversed[u] || [];
    for (const neighbor of neighbors) {
        const v = neighbor.node;
        if (!visited.has(v)) {
            dfs2(v, visited, component, adjReversed);
        }
    }
}