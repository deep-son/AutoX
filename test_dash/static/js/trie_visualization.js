d3.json("/get_trie_data", function(data) {
    // Your visualization code here

    // Create a hierarchy layout
    console.log("The Visulaization")
    var root = d3.hierarchy(data);
    root.x0 = 0;
    root.y0 = 0;
    var margin = { top: 20, right: 90, bottom: 30, left: 90 };

    // Set the dimensions of the tree
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#tree").append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a tree layout
    var tree = d3.tree()
        .size([height, width]);

    // Compute the new tree layout
    tree(root);

    // Define the links
    var links = root.links();

    // Create link paths
    svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + d.source.y + "," + d.source.x
                + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
                + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
                + " " + d.target.y + "," + d.target.x;
        });

    // Create nodes
    var nodes = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d) {
            return "node" + (d.children ? " internal" : " leaf");
        })
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Add circles to nodes
    nodes.append("circle")
        .attr("r", 4);

    // Add node labels
    nodes.append("text")
        .attr("dy", "-1.5em")
        .attr("x", function(d) {
            return d.children ? -6 : 6;
        })
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
        })
        .text(function(d) {
            return d.data.name;
        });

    // Add interaction (optional)
    nodes.on("click", function(d) {
        alert("Node Clicked: " + d.data.name);
    });
});

