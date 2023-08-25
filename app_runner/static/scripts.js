function fetchData() {
    $.get('/get_data', function (data) {
        // Update the table with new data
        $('#data-table tbody').empty();
        data.forEach(function (row) {
            $('#data-table tbody').append(`
                <tr>
                    <td>${row[0]}</td>
                    <td><div class="visualization-container" id="visualization-${row[0]}"></div></td>
                </tr>
            `);
            createVisualization(row[0], row[1]); // Create visualization for the row
        });
    });
}


// Function to create a D3 visualization for a row
function createVisualization(rowId, path) {
    // Select the visualization container
    const container = d3.select(`#visualization-${rowId}`);

    // Clear the container
    container.selectAll('*').remove();

    // Define the width and height of the visualization
    const width = 100;
    const height = 50;

    // Create an SVG element within the container
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Example: Create a rectangle for the visualization
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'green');
}