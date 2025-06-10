// src/constants/tutorial.js

export const TUTORIAL_STEPS = [
    // Step 1: Welcome
    "Welcome to the DSA Graph Visualizer! This interactive tool will help you build, analyze, and understand graph algorithms. Click 'Next' to begin.",

    // Step 2: The Basics - Adding Nodes
    "First, let's create some nodes. Find the 'Add Manually' panel in the sidebar. Type a name into the 'Node Value' input field and click the blue 'Add' button. Create 3-4 nodes.",

    // Step 3: The Basics - Adding Edges
    "To connect your nodes, use the 'Add Edge' form within the 'Add Manually' panel. Select a 'From' node and a 'To' node from the dropdowns, enter a numeric 'Weight', and click 'Add Edge'.",

    // Step 4: The Pro Method - Drag to Create Edges
    "Here's a faster way! Hold down the Shift key on your keyboard, then click and drag from a start node directly to a target node. A prompt will ask for the weight. Try it now!",

    // Step 5: The Power Tool - Graph Constructor
    "For complex graphs, use the 'Graph Constructor' panel. Here you can visually edit an Adjacency Matrix. Use the plus and minus buttons to change its size, fill in weights, and then click 'Build Graph from Matrix'.",

    // Step 6: Interacting with Your Graph
    "The canvas is your playground. Click and drag any node to move it. To see instant data, hover your mouse over a node to view its Degree, or hover over an edge to highlight it.",

    // Step 7: Running Pathfinding Algorithms
    "Time for the magic! In the 'Algorithms' panel, use the 'Select Start' and 'Select Target' dropdowns at the top. Then, click 'Run Dijkstra' or another pathfinding algorithm to see it in action.",

    // Step 8: Running Traversal & MST Algorithms
    "To run a traversal like BFS, you only need to select a 'Start Node'. For MST algorithms like Prim's or Kruskal's, you don't need to select any specific node—just click the run button!",
    
    // Step 9: Analyzing Graph Properties
    "Curious about your graph's structure? Open the 'Graph Analysis' panel. Click 'Find a Cycle' or 'Analyze Connectivity' to see properties visually highlighted on the canvas.",

    // Step 10: The Data Behind the Visuals
    "See how the visuals connect to theory! Below the canvas, the 'Data View Panel' shows the live Adjacency List and Adjacency Matrix. Watch them update in real-time as you edit your graph.",

    // Step 11: Customization and Control
    "Make the tool your own. Use the buttons in the header to switch between Directed and Undirected graph types, or toggle Light Mode. You can even resize the canvas with the handle at its bottom-right corner.",

    // Step 12: Saving Your Work
    "Don't lose your progress! Use the 'Save Graph' button in the 'Graph Actions' panel. Your saved graphs will appear in the 'Saved Graphs' section for you to load in future sessions.",
    
    // Step 13: Quick Actions
    "Remember to right-click on a node, an edge, or the empty canvas for a context menu with quick actions like deleting, editing, or adding new elements.",

    // Step 14: You're Ready!
    "That's it! You're ready to explore. Click 'Start Exploring' to close this tutorial. You can always bring it back with the 'Show Tutorial' button. Happy visualizing!"
];