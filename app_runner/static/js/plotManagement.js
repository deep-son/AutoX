export function updatePlot(id, data){
    var element = document.getElementById(id);
    var chartData = JSON.parse(data);
    var config = {
        displayModeBar: false,
    };
    
    Plotly.newPlot(element, chartData,{}, {modeBarButtonsToRemove: ['toImage']});
};

function createEvaluationElements(data) {
    const cm_container = document.getElementById("cm");
    var chartData = JSON.parse(data.confusion_matrix);
    Plotly.newPlot(cm_container, chartData, { responsive: true });
    const prc_container = document.getElementById("prc");
    var chartData = JSON.parse(data.precision_recall_curve);
    Plotly.newPlot(prc_container, chartData, { responsive: true });
    const roc_container = document.getElementById("roc");
    var chartData = JSON.parse(data.roc);
    Plotly.newPlot(roc_container, chartData, { responsive: true });
};

export     function plotGraph(containerId, title, dataSets) {
    // Create an array to hold the traces
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const traces = [];

    // Iterate over each key in the dataSets object
    for (const key in dataSets) {
        if (dataSets.hasOwnProperty(key)) {
            const dataSet = dataSets[key];
            const trace = {
                x: dataSet.map(item => item[1]), // Extract epoch
                y: dataSet.map(item => item[2]), // Extract value
                type: 'scatter',
                mode: 'lines+markers',
                name: key // Use the key as the trace name
            };
            traces.push(trace);
        }
    }

    const layout = {
        title: title,
        xaxis: { title: 'Epoch' },
        yaxis: { title: 'Value' },
        autosize: true, 
        margin: { l: 150, r: 150, b: 150, t: 50 },
        legend: {
            orientation: 'h', // Set legend orientation to horizontal
            x: 0, // Horizontal position
            y: -0.3, // Vertical position (negative to move it below the plot area)
            xanchor: 'left',
            yanchor: 'top'
        }        };
    
    const config = {
        responsive: true // Make the plot responsive to window size changes
    };

    Plotly.newPlot(containerId, traces, layout, config);
};