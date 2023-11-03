const data = {
    "directed": true,
    "multigraph": false,
    "graph": {},
    "nodes": [
        {"x": 50, "y": 50, "label": "Start", "id": "Start"},
        {"x": 150, "y": 50, "label": "Step 1", "id": "Step 1"},
        {"x": 250, "y": 50, "label": "Step 2", "id": "Step 2"},
        {"x": 350, "y": 50, "label": "End", "id": "End"}
    ],
    "links": [
        {"source": "Start", "target": "Step 1"},
        {"source": "Step 1", "target": "Step 2"},
        {"source": "Step 2", "target": "End"},
        {"source": "End", "target": "Start"}
    ]
};

// Creating Flowy blocks for nodes
data.nodes.forEach(node => {
    const block = document.createElement('div');
    block.textContent = node.label;
    block.style.left = node.x + 'px';
    block.style.top = node.y + 'px';
    block.className = 'block';
    block.id = node.id;
    document.querySelector('.flowy').appendChild(block);
});

// Connecting blocks in Flowy
data.links.forEach(link => {
    const sourceBlock = document.getElementById(link.source);
    const targetBlock = document.getElementById(link.target);

    if (sourceBlock && targetBlock) {
        const connection = document.createElement('div');
        connection.className = 'connection';
        connection.style.position = 'absolute';
        connection.style.left = sourceBlock.offsetLeft + (sourceBlock.offsetWidth / 2) + 'px';
        connection.style.top = sourceBlock.offsetTop + (sourceBlock.offsetHeight / 2) + 'px';
        connection.style.width = targetBlock.offsetLeft - sourceBlock.offsetLeft + 'px';
        connection.style.height = '2px';
        connection.style.background = 'black';
        document.querySelector('.flowy').appendChild(connection);
    }
});
