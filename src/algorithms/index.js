// src/algorithms/index.js

import { buildAdjacencyList } from '../utils/graphUtils';

/* ==== BFS ==== */

export const generateBfsSteps = (nodes, edges, graphType, startNode) => {
    if (!startNode || nodes.length === 0) return [];

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set([startNode]);
    const queue = [{ nodeId: startNode, sourceNode: null, edgeId: null }];
    const visitedOrder = [startNode];
    const steps = [];

    // Initial state: Show the start node as current
    steps.push({
        currentStep: startNode,
        sourceNode: null,
        edgeId: null,
        visitedOrder: [...visitedOrder],
        exploringEdgeIds: [],
    });

    while (queue.length > 0) {
        const { nodeId, sourceNode } = queue.shift();
        const neighbors = adjacencyList[nodeId] || [];

        // --- NEW: Exploring Phase ---
        // Get edges to unvisited neighbors for the "scan" effect
        const exploringEdges = neighbors
            .filter(neighbor => !visited.has(neighbor.node))
            .map(neighbor => neighbor.edgeId);

        if (exploringEdges.length > 0) {
            steps.push({
                currentStep: nodeId,
                sourceNode: sourceNode,
                edgeId: null, // No single edge is being traversed yet
                visitedOrder: [...visitedOrder],
                exploringEdgeIds: exploringEdges, // Highlight edges being considered
            });
        }

        // --- NEW: Traversing Phase (for each neighbor) ---
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                visitedOrder.push(neighbor.node);
                queue.push({ nodeId: neighbor.node, sourceNode: nodeId, edgeId: neighbor.edgeId });

                // Create a step for the actual traversal
                steps.push({
                    currentStep: neighbor.node, // The new node is now current
                    sourceNode: nodeId,        // The node we came from
                    edgeId: neighbor.edgeId,   // The edge we used
                    visitedOrder: [...visitedOrder],
                    exploringEdgeIds: [], // Clear exploring edges
                });
            }
        }
    }
    return steps;
};


/* ==== DFS ==== */

// --- UPDATED: Complete rewrite of DFS to be more descriptive ---
export const generateDfsSteps = (nodes, edges, graphType, startNode) => {
    if (!startNode || nodes.length === 0) return [];

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const visited = new Set();
    const steps = [];
    const pathStack = []; // Simulates the recursion call stack
    const visitedEdges = new Set();

    const dfs = (nodeId, parentNode, edgeId) => {
        visited.add(nodeId);
        pathStack.push(nodeId);
        if (edgeId) visitedEdges.add(edgeId);

        // "Go Deeper" Step
        steps.push({
            type: 'go_deeper',
            currentNode: nodeId,
            currentEdgeId: edgeId,
            pathStack: [...pathStack],
            visitedNodes: [...visited],
            visitedEdgeIds: [...visitedEdges],
            backtrackingNode: null,
        });

        const neighbors = adjacencyList[nodeId] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                // Before going deeper, we might want a step to show we are 'considering'
                dfs(neighbor.node, nodeId, neighbor.edgeId);
            }
        }

        pathStack.pop();

        // "Backtrack" Step
        steps.push({
            type: 'backtrack',
            currentNode: parentNode, // The node we are returning to
            currentEdgeId: null,
            pathStack: [...pathStack],
            visitedNodes: [...visited],
            visitedEdgeIds: [...visitedEdges],
            backtrackingNode: nodeId, // The node we are leaving
        });
    };

    dfs(startNode, null, null);
    return steps;
};


/* ==== Dijkstra ==== */

export const generateDijkstraResult = (nodes, edges, graphType, startId, targetId) => {
    if (!startId || !targetId || nodes.length === 0) return null;

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const distances = {};
    const previous = {}; // Will store { nodeId, edgeId }
    const visited = new Set();
    const steps = [];

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[startId] = 0;

    // Initial state step
    steps.push({
        type: 'initial',
        distances: { ...distances },
        currentNodeId: null,
        relaxingEdgeId: null,
        visitedOrder: [],
    });

    const unvisited = new Set(nodes.map(n => n.id));

    while (unvisited.size > 0) {
        // Find the unvisited node with the smallest distance
        let closest = null;
        for (const nodeId of unvisited) {
            if (closest === null || distances[nodeId] < distances[closest]) {
                closest = nodeId;
            }
        }

        // If no reachable node is found, stop.
        if (closest === null || distances[closest] === Infinity) break;

        unvisited.delete(closest);
        visited.add(closest);

        // Step: Select Node
        steps.push({
            type: 'select_node',
            currentNodeId: closest,
            relaxingEdgeId: null,
            distances: { ...distances },
            visitedOrder: [...visited],
        });

        if (closest === targetId) break;

        const neighbors = adjacencyList[closest] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
                const alt = distances[closest] + neighbor.weight;

                // Step: Relax Edge (before update)
                steps.push({
                    type: 'relax_edge',
                    currentNodeId: closest,
                    relaxingEdgeId: neighbor.edgeId,
                    distances: { ...distances },
                    visitedOrder: [...visited],
                });

                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    previous[neighbor.node] = { nodeId: closest, edgeId: neighbor.edgeId };
                }
            }
        }
    }

    // Path reconstruction
    const path = [];
    const pathEdges = [];
    let current = targetId;

    if (distances[current] !== Infinity) {
        while (current !== null) {
            path.unshift(current);
            const prev = previous[current];
            if (prev) {
                if (prev.edgeId) {
                    pathEdges.unshift(prev.edgeId);
                }
                current = prev.nodeId;
            } else {
                break; // Reached the start node
            }
        }
    }

    if (path[0] !== startId) {
        return { path: [], pathEdges: [], distances, visitedOrder: [...visited], steps };
    }

    return { path, pathEdges, distances, visitedOrder: [...visited], steps };
};

/* ==== A-Star ==== */

export const generateAStarResult = (nodes, edges, graphType, startId, targetId, heuristicType) => {
    if (!startId || !targetId || nodes.length === 0) return { steps: [] };

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const openSet = new Set([startId]);
    const closedSet = new Set();
    const cameFrom = {};

    const gScores = {}, fScores = {}, hScores = {};
    nodes.forEach(node => {
        gScores[node.id] = Infinity;
        fScores[node.id] = Infinity;
    });
    
    const heuristic = (aId, bId) => {
        const nodeA = nodes.find(n => n.id === aId), nodeB = nodes.find(n => n.id === bId);
        if (!nodeA || !nodeB) return Infinity;
        if (heuristicType === 'manhattan') return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
        return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
    };
    
    nodes.forEach(node => { hScores[node.id] = heuristic(node.id, targetId); });
    gScores[startId] = 0;
    fScores[startId] = hScores[startId];

    const steps = [];
    steps.push({
        type: 'initial',
        openSet: new Set(openSet), closedSet: new Set(closedSet),
        gScores: { ...gScores }, fScores: { ...fScores }, hScores: { ...hScores },
        currentNodeId: null, relaxingEdgeId: null, path: [], pathEdges: []
    });

    while (openSet.size > 0) {
        let current = null;
        for (const nodeId of openSet) {
            if (current === null || fScores[nodeId] < fScores[current]) {
                current = nodeId;
            }
        }

        if (current === targetId) break;

        openSet.delete(current);
        closedSet.add(current);

        steps.push({
            type: 'select_node',
            openSet: new Set(openSet), closedSet: new Set(closedSet),
            gScores: { ...gScores }, fScores: { ...fScores }, hScores: { ...hScores },
            currentNodeId: current, relaxingEdgeId: null, path: [], pathEdges: []
        });

        const neighbors = adjacencyList[current] || [];
        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor.node)) continue;

            const tentativeGScore = gScores[current] + neighbor.weight;
            
            steps.push({
                type: 'relax_edge',
                openSet: new Set(openSet), closedSet: new Set(closedSet),
                gScores: { ...gScores }, fScores: { ...fScores }, hScores: { ...hScores },
                currentNodeId: current, relaxingEdgeId: neighbor.edgeId, path: [], pathEdges: []
            });
            
            if (tentativeGScore < gScores[neighbor.node]) {
                cameFrom[neighbor.node] = { prevNode: current, edgeId: neighbor.edgeId };
                gScores[neighbor.node] = tentativeGScore;
                fScores[neighbor.node] = tentativeGScore + hScores[neighbor.node];
                if (!openSet.has(neighbor.node)) {
                    openSet.add(neighbor.node);
                }
            }
        }
    }
    
    // --- THE FIX IS HERE ---
    let finalPath = [], finalPathEdges = [], totalDistance = Infinity;

    if (closedSet.has(targetId) || openSet.has(targetId)) {
        totalDistance = gScores[targetId]; // Get the final cost
        let temp = targetId;
        while(cameFrom[temp]){
            finalPath.unshift(temp);
            const {prevNode, edgeId} = cameFrom[temp];
            finalPathEdges.unshift(edgeId);
            temp = prevNode;
        }
        finalPath.unshift(startId);
        
        steps.push({
            type: 'found_path',
            path: finalPath, pathEdges: finalPathEdges, openSet, closedSet,
            gScores, fScores, hScores,
            currentNodeId: targetId, relaxingEdgeId: null
        });
    } else {
        steps.push({ type: 'no_path', openSet, closedSet, gScores, fScores, hScores, path: [], pathEdges: [] });
    }
    
    // Return the steps and the final calculated distance
    return { steps, totalDistance };
};

/* ==== Bellman Ford ==== */

export const generateBellmanFordSteps = (nodes, edges, graphType, startNodeId) => {
    if (nodes.length === 0 || !startNodeId) {
        return { steps: [], distances: {}, predecessors: {}, negativeCycle: null };
    }

    const steps = [];
    const distances = {};
    const predecessors = {};

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        predecessors[node.id] = null;
    });
    distances[startNodeId] = 0;

    steps.push({
        type: 'initial',
        description: `Initialization: Distance to start node is 0. All others are ∞.`,
        distances: { ...distances },
        highlightedEdgeId: null,
        updatedNodeId: null,
        passNumber: 0,
        negativeCyclePath: null,
    });

    for (let i = 1; i < nodes.length; i++) {
        let updatedInPass = false;
        for (const edge of edges) {
            steps.push({
                type: 'check_edge',
                description: `Pass ${i}: Checking edge ${edge.id}...`,
                distances: { ...distances },
                highlightedEdgeId: edge.id,
                updatedNodeId: null,
                passNumber: i,
            });

            // --- FIX: Check both directions for undirected graphs ---

            // Direction 1: start -> end
            if (distances[edge.start] !== Infinity && distances[edge.start] + edge.weight < distances[edge.end]) {
                distances[edge.end] = distances[edge.start] + edge.weight;
                predecessors[edge.end] = { nodeId: edge.start, edgeId: edge.id };
                updatedInPass = true;
                steps.push({
                    type: 'update_distance',
                    description: `Pass ${i}: Updated distance for node.`,
                    distances: { ...distances },
                    highlightedEdgeId: edge.id,
                    updatedNodeId: edge.end,
                    passNumber: i,
                });
            }

            // Direction 2: end -> start (for undirected)
            if (graphType === 'undirected' && distances[edge.end] !== Infinity && distances[edge.end] + edge.weight < distances[edge.start]) {
                distances[edge.start] = distances[edge.end] + edge.weight;
                predecessors[edge.start] = { nodeId: edge.end, edgeId: edge.id };
                updatedInPass = true;
                steps.push({
                    type: 'update_distance',
                    description: `Pass ${i}: Updated distance for node.`,
                    distances: { ...distances },
                    highlightedEdgeId: edge.id,
                    updatedNodeId: edge.start,
                    passNumber: i,
                });
            }
        }
        if (!updatedInPass) break;
    }

    let negativeCyclePath = null;
    for (const edge of edges) {
        if (distances[edge.start] !== Infinity && distances[edge.start] + edge.weight < distances[edge.end]) {
            let cycleNode = edge.end;
            for (let i = 0; i < nodes.length; i++) {
                cycleNode = predecessors[cycleNode]?.nodeId;
            }
            const cycle = [];
            let current = cycleNode;
            while (true) {
                cycle.push(current);
                const prev = predecessors[current];
                if (!prev) break;
                current = prev.nodeId;
                if (current === cycleNode) { cycle.push(current); break; }
            }
            negativeCyclePath = cycle.reverse();
            break;
        }
        // --- FIX: Check for negative cycles in reverse direction too ---
        if (graphType === 'undirected' && distances[edge.end] !== Infinity && distances[edge.end] + edge.weight < distances[edge.start]) {
            let cycleNode = edge.start;
            for (let i = 0; i < nodes.length; i++) {
                cycleNode = predecessors[cycleNode]?.nodeId;
            }
            const cycle = [];
            let current = cycleNode;
            while (true) {
                cycle.push(current);
                const prev = predecessors[current];
                if (!prev) break;
                current = prev.nodeId;
                if (current === cycleNode) { cycle.push(current); break; }
            }
            negativeCyclePath = cycle.reverse();
            break;
        }
    }

    if (negativeCyclePath) {
        steps.push({
            type: 'negative_cycle',
            description: "Negative weight cycle detected!",
            distances: { ...distances },
            highlightedEdgeId: null,
            updatedNodeId: null,
            passNumber: nodes.length,
            negativeCyclePath: negativeCyclePath,
        });
    } else {
        steps.push({
            type: 'done',
            description: "Algorithm finished. No negative cycles found.",
            distances: { ...distances },
            highlightedEdgeId: null,
            updatedNodeId: null,
            passNumber: nodes.length,
        });
    }

    return { steps, distances, predecessors, negativeCycle: negativeCyclePath };
};

/* ==== Prim's ==== */

export const generatePrimSteps = (nodes, edges, graphType) => {
    if (nodes.length === 0) return [];

    const adjacencyList = buildAdjacencyList(nodes, edges, graphType);
    const mstNodes = new Set();
    const mstEdges = [];
    const steps = [];

    // Start with the first node arbitrarily
    const startNodeId = nodes[0].id;
    mstNodes.add(startNodeId);

    steps.push({
        type: 'start',
        mstNodes: new Set(mstNodes),
        mstEdges: [...mstEdges],
        fringeEdgeIds: [],
        cheapestEdgeId: null,
        currentNodeId: startNodeId,
    });

    while (mstNodes.size < nodes.length) {
        const fringe = [];
        let cheapestEdge = null;

        // Find all edges on the fringe
        for (const nodeId of mstNodes) {
            const neighbors = adjacencyList[nodeId] || [];
            for (const neighbor of neighbors) {
                if (!mstNodes.has(neighbor.node)) {
                    fringe.push(neighbor.edgeId);
                    if (cheapestEdge === null || neighbor.weight < cheapestEdge.weight) {
                        cheapestEdge = {
                            from: nodeId,
                            to: neighbor.node,
                            weight: neighbor.weight,
                            id: neighbor.edgeId,
                        };
                    }
                }
            }
        }
        
        // Step to show all considered fringe edges
        if (fringe.length > 0) {
            steps.push({
                type: 'consider_fringe',
                mstNodes: new Set(mstNodes),
                mstEdges: [...mstEdges],
                fringeEdgeIds: fringe,
                cheapestEdgeId: null,
                currentNodeId: null,
            });
        }
        
        // If no cheapest edge is found, graph is disconnected. Stop.
        if (cheapestEdge === null) break;

        // Step to highlight the chosen cheapest edge
        steps.push({
            type: 'select_edge',
            mstNodes: new Set(mstNodes),
            mstEdges: [...mstEdges],
            fringeEdgeIds: fringe,
            cheapestEdgeId: cheapestEdge.id,
            currentNodeId: null,
        });

        // Add the new node and edge to the MST
        mstNodes.add(cheapestEdge.to);
        mstEdges.push(cheapestEdge);

        // Step to commit the new node and edge to the MST
        steps.push({
            type: 'add_to_mst',
            mstNodes: new Set(mstNodes),
            mstEdges: [...mstEdges],
            fringeEdgeIds: [],
            cheapestEdgeId: null,
            currentNodeId: cheapestEdge.to,
        });
    }

    return steps;
};

/* ==== Kruskal ==== */

export const generateKruskalSteps = (nodes, edges) => {
    if (nodes.length === 0 || edges.length === 0) return [];

    const steps = [];
    const mstEdges = [];
    
    // --- DSU Data Structure ---
    const parent = {};
    nodes.forEach(node => parent[node.id] = node.id);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) { parent[rootI] = rootJ; return true; }
        return false;
    };
    // Helper to get the current components for visualization
    const getDsuSets = () => {
        const sets = new Map();
        nodes.forEach(node => {
            const root = find(node.id);
            if (!sets.has(root)) sets.set(root, []);
            sets.get(root).push(node.id);
        });
        return Array.from(sets.values());
    };

    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

    steps.push({
        type: 'sort',
        mstEdges: [],
        dsuSets: getDsuSets(),
        currentEdgeId: null,
    });

    for (const edge of sortedEdges) {
        steps.push({
            type: 'check_edge',
            mstEdges: [...mstEdges],
            dsuSets: getDsuSets(),
            currentEdgeId: edge.id,
        });

        if (union(edge.start, edge.end)) {
            mstEdges.push(edge);
            steps.push({
                type: 'accept_edge',
                mstEdges: [...mstEdges],
                dsuSets: getDsuSets(), // Get sets *after* union
                currentEdgeId: edge.id,
            });
        } else {
            steps.push({
                type: 'reject_edge',
                mstEdges: [...mstEdges],
                dsuSets: getDsuSets(),
                currentEdgeId: edge.id,
            });
        }
    }
    
    steps.push({
        type: 'done',
        mstEdges: [...mstEdges],
        dsuSets: getDsuSets(),
        currentEdgeId: null,
    });

    return steps;
};

/* ==== Topological Sort ==== */

export const generateTopologicalSortSteps = (nodes, edges) => {
    const steps = [];
    const sortedOrder = [];
    const adj = buildAdjacencyList(nodes, edges, 'directed');

    const inDegree = {};
    nodes.forEach(node => inDegree[node.id] = 0);
    edges.forEach(edge => {
        if (inDegree[edge.end] !== undefined) inDegree[edge.end]++;
    });

    const queue = nodes.filter(node => inDegree[node.id] === 0).map(n => n.id);

    steps.push({
        type: 'initial',
        description: "Calculated all in-degrees. Initializing queue.",
        inDegrees: { ...inDegree },
        queue: [...queue],
        sortedOrder: [],
        currentNodeId: null,
        processedEdgeId: null,
    });

    let visitedCount = 0;
    while (queue.length > 0) {
        const uId = queue.shift();
        sortedOrder.push(uId);
        visitedCount++;

        steps.push({
            type: 'dequeue',
            description: `Dequeued node and added to sorted list.`,
            inDegrees: { ...inDegree },
            queue: [...queue],
            sortedOrder: [...sortedOrder],
            currentNodeId: uId,
            processedEdgeId: null,
        });

        const neighbors = adj[uId] || [];
        for (const neighbor of neighbors) {
            const vId = neighbor.node;
            if (inDegree[vId] !== undefined) {
                inDegree[vId]--;

                steps.push({
                    type: 'process_neighbor',
                    description: `Processing neighbor, decrementing in-degree.`,
                    inDegrees: { ...inDegree },
                    queue: [...queue],
                    sortedOrder: [...sortedOrder],
                    currentNodeId: uId,
                    processedEdgeId: neighbor.edgeId,
                });

                if (inDegree[vId] === 0) {
                    queue.push(vId);
                     steps.push({
                        type: 'enqueue',
                        description: `Neighbor's in-degree is 0. Enqueueing.`,
                        inDegrees: { ...inDegree },
                        queue: [...queue],
                        sortedOrder: [...sortedOrder],
                        currentNodeId: vId,
                        processedEdgeId: neighbor.edgeId,
                    });
                }
            }
        }
    }

    if (visitedCount !== nodes.length) {
        const cycleNodes = nodes
            .filter(node => inDegree[node.id] > 0)
            .map(node => node.id);
        steps.push({
            type: 'cycle_detected',
            description: `Error: Cycle detected! Not a DAG.`,
            inDegrees: { ...inDegree },
            queue: [],
            sortedOrder: [...sortedOrder],
            cycleNodes,
        });
        return { steps, sortedOrder, cycleDetected: true, cycleNodes };
    }

    steps.push({
        type: 'done',
        description: "Topological sort complete!",
        inDegrees: { ...inDegree },
        queue: [],
        sortedOrder: [...sortedOrder],
        cycleDetected: false,
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