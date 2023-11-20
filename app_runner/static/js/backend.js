const socket = io.connect('http://127.0.0.1:8082');
var trials = {};
var models = {};
var bestValues = {};
var project_name = "structured_data_classifier"
var train_file_path = "'C:\\Users\\Deepanshu\\.keras\\datasets\\train.csv'"

// Function to create a tab element
function createTabElement(tabId, tabText, cardID) {
    const $li = $('<li>', {
        class: 'nav-item',
        id: tabId,
    });
    const $a = $('<a>', {
        class: 'nav-link show',
        href: '',
        'data-toggle': 'tab',
        'data-target': `#tab-${tabId}`,
        html: `<i class="now-ui-icons objects_umbrella-13 mr-1"></i>${tabText}`,
    });
    $li.append($a);
    $(cardID).append($li);
}


function createAndAppendTabPaneCarousel(tabId, imageUrl, cardID, values, metrics) {
        const $tabPane = $('<div >', {
            class: 'carousel-item',
            id: `tab-${tabId}`,
        });

        // Create the inner HTML structure for values
        // var valuesTable = '<table><tr><th>Component</th><th>Value</th></tr>';
        // for (var key in values) {
        //     if (values.hasOwnProperty(key)) {
        //         valuesTable += `<tr><td style="text-align: left;">${key}</td><td style="text-align: left;">${values[key]}</td></tr>`;
        //     }
        // }
        // valuesTable += '</table>';

        // // Create the inner HTML structure for metrics
        // var metricsTable = '<table><tr><th>Metric</th><th>Value</th></tr>';
        // for (var metricKey in metrics.metrics) {
        //     if (metrics.metrics.hasOwnProperty(metricKey)) {
        //         var metric = metrics.metrics[metricKey];
        //         metricsTable += `<tr><td style="text-align: left;">${metricKey}</td><td style="text-align: left;">${metric.observations[0].value[0]}</td></tr>`;
        //     }
        // }
        // metricsTable += '</table';

        var valuesTable = '<table class="table table-striped"><thead class="text-primary"><tr><th>Component</th><th>Value</th></tr></thead><tbody>';
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                valuesTable += `<tr><td>${key}</td><td>${values[key]}</td></tr>`;
            }
        }
        valuesTable += '</tbody></table>';

        var metricsTable = '<table class="table table-striped"><thead class="text-primary"><tr><th>Metric</th><th>Value</th></tr></thead><tbody>';
        for (var metricKey in metrics.metrics) {
            if (metrics.metrics.hasOwnProperty(metricKey)) {
                var metric = metrics.metrics[metricKey];
                metricsTable += `<tr><td>${metricKey}</td><td>${metric.observations[0].value[0]}</td></tr>`;
            }
        }
        metricsTable += '</tbody></table>';

        // Create the inner HTML structure
        const innerArch = `
            <div class="row">
                <div class="col-md-12">
                    <p class=""><img src="${imageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h6><b>Values</b></h6>
                    ${valuesTable}
                </div>
                <div class="col-md-6">
                    <h6><b>Metrics</b></h6>
                    ${metricsTable}
                </div>
            </div>
        `;

        $tabPane.html(innerArch); // Set the HTML content
        $(cardID).append($tabPane);
};



function createAndAppendTabPaneFinalArch(tabId, imageUrl, cardID) {
    const $tabPane = $('<div>', {
        class: 'tab-pane fade text-center show',
        id: `tab-${tabId}`,
        role: 'tabpanel',
    });

    // Create the inner HTML structure
    const innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <p class=""><img src="${imageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></p>
                <span class="badge badge-pill badge-success mr-1">BEST</span>
            </div>
        </div>
    `;

    $tabPane.html(innerHTML); // Set the HTML content
    $(cardID).append($tabPane);

};

// function createTabElementExplorePipeline(tabId, tabText, cardID) {
//     const $li = $('<li>', {
//         class: 'nav-item',
//         id: tabId,
//     });
//     const $a = $('<a>', {
//         class: 'nav-link show',
//         'data-toggle': 'tab',
//         'data-target': `#ex-trial_${tabId}`,
//         html: `<i class="now-ui-icons objects_umbrella-13 mr-1"></i>trial_${tabText}`,
//     });
//     $li.append($a);
//     $(cardID).append($li);
// }

// function createAndAppendTabPaneExplorePipeline(tabId, value, cardID, callback) {

//     console.log("Creating tab for tabId:", tabId); // Debug statement
//     const $tabPane = $('<div>', {
//         class: 'tab-pane fade text-center show',
//         id: `ex-trial_${tabId}`,
//         role: 'tabpanel',
//     });

//     // Create the inner HTML structure
//     const innerHTML = `
//     <div class="row">
//         <div class="col-md-6">
//             <div class="img" id="tree_${tabId}" style="width: 100%; height: 500px; overflow: hidden;">

//             </div>
//         </div>
//         <div class="col-md-4">
//             <p class="">Probability Table Here</p>
//         </div>
//     </div>
// `;

//     $tabPane.html(innerHTML); // Set the HTML content
//     $(cardID).append($tabPane);

//     callback(value, tabId);
// };

function initializeElement(value, tabId) {
    const chartContainer = document.getElementById(`tree_${tabId}`);
    if (chartContainer) {
        // Element exists, proceed with further operations
        const chartData = JSON.parse(value["plotly_figure"]);
        Plotly.newPlot(chartContainer, chartData, { responsive: true });
    } else {
        console.error(`Element with ID 'tree_${tabId}' not found.`);
    }
}

function addDropdownOption(tabId) {
    console.log("In callback")
    var option = $('<a>').addClass('dropdown-item').attr('href', '#').text(tabId);
    option.on('click', function () {
        $('#myCarousel').carousel(`tab-${tabId}`);
    });
    $('#dropdownOptions').append(option);

}

// function updateBestValuesDisplay(Values) {
//     var valuesTable = '<table><tr><th>Component</th><th>Value</th></tr>';
//     for (var key in Values) {
//         if (Values.hasOwnProperty(key)) {
//             valuesTable += `<tr><td style="text-align: left;">${key}</td><td style="text-align: left;">${Values[key][0].value[0]}</td><td style="text-align: left;">${Values[key][0].trialValue}</td></tr>`;
//         }
//     }
//     valuesTable += '</table>';

//     $('#metrics_values').append(valuesTable);
// };

function updateBestValuesDisplay(Values) {
    // Start the table with Now UI classes
    var valuesTable = '<table class="table table-striped"><thead class="text-primary"><tr><th>Component</th><th>Value</th><th>Trial Value</th></tr></thead><tbody>';

    // Loop through the values to create table rows
    for (var key in Values) {
        if (Values.hasOwnProperty(key)) {
            valuesTable += `<tr><td>${key}</td><td>${Values[key][0].value[0]}</td><td>${Values[key][0].trialValue}</td></tr>`;
        }
    }
    // Close the table body and the table
    valuesTable += '</tbody></table>';

    // Append the table to the container
    $('#metrics_values').html(valuesTable); // Changed from append to html to replace the content instead of appending
}

function updateBestValues(bestValues, newValues) {
    for (const metricName in newValues) {
        if (newValues.hasOwnProperty(metricName)) {
            const newObservations = newValues[metricName];

            if (!bestValues[metricName]) {
                bestValues[metricName] = [];
                bestValues[metricName].push(...newObservations);
            }

            if (newValues[metricName][0].direction === 'max') {
                if (newValues[metricName][0].value[0] > bestValues[metricName][0].value[0]) {
                    bestValues[metricName][0].value[0] = newValues[metricName][0].value[0];
                    bestValues[metricName][0].trialValue = newValues[metricName][0].trialValue;
                }
            } else {
                if (newValues[metricName][0].value[0] < bestValues[metricName][0].value[0]) {
                    bestValues[metricName][0].value[0] = newValues[metricName][0].value[0];
                    bestValues[metricName][0].trialValue = newValues[metricName][0].trialValue;
                }
            }
        }
    }
    $('#metrics_values').empty();
    updateBestValuesDisplay(bestValues);
    return bestValues;
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


function update_training_ui(data) {
    $('#training-task').text(data['task'])
    $('#training-start-time').find('span').text(data['start_time']);
    // $('#training-end-time').find('span').text(endTime);
    $('#training-max-trial').find('span').text(data['max_trials']);
};

function displayNormalizationDataWithAccordion(data) {
    const accordion = $('<div>').addClass('accordion');

    Object.keys(data).forEach((key, index) => {
        const card = $('<div>').addClass('card');
        const cardHeader = $('<div>').addClass('card-header');
        const h5 = $('<h5>').addClass('mb-0');

        const button = $('<button>')
            .addClass('btn btn-link')
            .attr('data-toggle', 'collapse')
            .attr('data-target', `#collapse-${index}`)
            .attr('aria-expanded', 'true')
            .attr('aria-controls', `collapse-${index}`)
            .text(key);

        h5.append(button);
        cardHeader.append(h5);

        const collapseDiv = $('<div>')
            .addClass('collapse')
            .attr('id', `collapse-${index}`)
            .attr('data-parent', '.accordion');

        const cardBody = $('<div>').addClass('card-body');

        const subData = data[key];

        const shapeDiv = $('<p>').text('Shape: ' + subData.shape);
        // add name of the feature here
        if (Array.isArray(subData.data)) {
            const dataList = $('<ul>');
            subData.data.forEach((item) => {
                const listItem = $('<li>').text(item);
                dataList.append(listItem);
            });

            cardBody.append(shapeDiv, dataList);
        } else {
            const dataValue = $('<p>').text('Data: ' + subData.data);
            cardBody.append(shapeDiv, dataValue);
        }

        collapseDiv.append(cardBody);
        card.append(cardHeader, collapseDiv);
        accordion.append(card);
    });

    // Append the accordion to the preprocessing-explanation-div
    
    return accordion
};

function updatePlot(id, data){
    var element = document.getElementById(id);
    var chartData = JSON.parse(data);
    Plotly.newPlot(element, chartData, {  responsive: true });
}

function createTable(data) {
    const table = $('<table>').addClass('table'); // Assuming the use of Bootstrap classes for table styling

    const headerRow = $('<tr>');
    headerRow.append($('<th>').text('Column Name')); 
    headerRow.append($('<th>').text('Encoded Columns')); 
    // Get the inner keys from the first entry in data

    table.append(headerRow); // Append the header row to the table
    // Iterate over the data object
    Object.keys(data).forEach((key) => {
        const row = $('<tr>');
        row.append($('<td>').text(key)); // Column for the category

        const innerData = data[key];
        // Iterate over the inner data object
        Object.keys(innerData).forEach((innerKey) => {
            row.append($('<td>').text(`${innerKey}: ${innerData[innerKey]}`)); // Column for the key-value pair
        });

        table.append(row); // Append the row to the table
    });

    return table;
}

function createTableFromObject(data) {
    const table = $('<table>').addClass('table');

    Object.keys(data).forEach((key) => {
        const row = $('<tr>');
        row.append($('<td>').text(key));
        row.append($('<td>').text(data[key]));

        table.append(row);
    });

    return table;
}

function createAndUpdatePreprocessing(data, callback){
    $('#dropdown-preprocessing').empty();

    // Add the default option
    $('#dropdown-preprocessing').append('<option value="">--Select--</option>');

    const dropdown = $('#dropdown-preprocessing');

    $.each(data, function(key, value) {
        // Create an option for the dropdown
        $('<option>')
            .val(key)
            .text(key)
            .appendTo(dropdown);
        
            let div = $('<div>');

            if (key === 'CategoricalToNumerical') {
                div = $('<div>')
                    .addClass('row mt-3 hidden-row cat-to-num-div')
                    .attr('data-option', key);

                    const icon = $('<i>')
                    .addClass('fas fa-info-circle'); // Font Awesome classes for the icon
                  
                  // Set up tooltip from Now UI Kit for the icon
                  icon.attr('data-toggle', 'tooltip');
                  icon.attr('data-placement', 'top');
                  icon.attr('title', 'Explanation for NaN in dataset');
                  icon.attr('data-original-title', 'Explanation for NaN in dataset'); // Needed for Now UI Kit
                  
                  const col1 = $('<div>').addClass('col-md-12');
                  const card1 = $('<div>').addClass('card');
                  const cardHeader1 = $('<div>').addClass('card-header').append(icon); // Append the icon to the card header
                  const h4_1 = $('<h4>').text('NaN in dataset');
                  const cardBody1 = $('<div>').addClass('card-body');
                  
                  const chartContainer1 = $('<div>').attr('id', 'chart-container-1');
                  cardBody1.append(chartContainer1);
                  cardHeader1.append(h4_1);
                  card1.append(cardHeader1).append(cardBody1);
                  col1.append(card1);

                const col2 = $('<div>').addClass('col-md-12');
                const card2 = $('<div>').addClass('card');
                const cardHeader2 = $('<div>').addClass('card-header');
                const h4_2 = $('<h4>').text('Chart 2');
                const cardBody2 = $('<div>').addClass('card-body').text('Add another chart here');
                
                cardHeader2.append(h4_2);
                card2.append(cardHeader2).append(cardBody2);
                col2.append(card2);

                const card3 = $('<div>').addClass('card');
                const cardHeader3 = $('<div>').addClass('card-header');
                const h4_3 = $('<h4>').text('Additional Card');
                const cardBody3 = $('<div>').addClass('card-body').text('Content for the additional card');

                cardHeader3.append(h4_3);
                card3.append(cardHeader3).append(cardBody3);
                col2.append(card3); // Append the third card to the same column


                const table = createTable(value['encoded_dict']);
                $('.card-body', col2).empty().append(table);
                
                const tableForCard3 = createTableFromObject(value['feature_type']);
                $('.card-body', card3).empty().append(tableForCard3);
        
                div.append(col1).append(col2);
                
                $('#preprocessing-explanation-div').append(div);

                callback('chart-container-1', value['null_graph']);
                
    
                // Add content for CategoricalToNumerical div type
                // Adjust content as necessary
            } else if (key === 'Normalization') {
                div = $('<div>')
                    .addClass('row mt-3 hidden-row normalization-div')
                    .attr('data-option', key);
    
                    const accordian = displayNormalizationDataWithAccordion(value);
                    div.append(accordian);
                    $('#preprocessing-explanation-div').append(div);
            }
    
            
    });

    $('#dropdown-preprocessing').change(function() {
        const selectedOption = $(this).val();
        $('[data-option]').hide();
        $(`[data-option=${selectedOption}]`).show();
    });

};

function createFigureCardWithAccordion(value) {
    const card = document.createElement('div');
    card.classList.add('col-md-12', 'figure-card');
    card.style.padding = '20px';

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.textContent = `Trial ${value["trial_id"]}`; // Set the card header text
    cardHeader.style.background = 'white';

    const cardContent = document.createElement('div');
    cardContent.classList.add('card');


    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create a unique ID for the graph container using the trial_id
    const graphContainerId = `graphContainer${value["trial_id"]}`;

    // Create a container for the Vis.js graph
    const graphContainer = document.createElement('div');
    graphContainer.style.height = '600px'; // Set a height for the graph
    graphContainer.style.width = '100%';
    graphContainer.style.background = '#001521';
    graphContainer.id = graphContainerId; // Assign the unique ID
    cardBody.appendChild(graphContainer);


    const jsonData = JSON.parse(value['casualnex_graph_path']);


    // Convert the JSON data into vis.js format
    // You may need to adapt this part based on the structure of your JSON data
    var nodes = jsonData.nodes;
    var edges = jsonData.edges;

    var nodeString = nodes.replace(/'/g, '"');
    nodeString = nodeString.replace(/True/g, 'true');
    nodeString = nodeString.replace(/False/g, 'false');
    var edgeString = edges.replace(/'/g, '"');
    edgeString = edgeString.replace(/True/g, 'true');
    edgeString = edgeString.replace(/False/g, 'false');

// Parse the JSON string into a JavaScript array
    const nodeFormat = JSON.parse(nodeString);
    const edgeFormat = JSON.parse(edgeString);

    console.log(nodeFormat);
    console.log(edgeFormat);

        // Create data object for vis.js
        var data = {
            nodes: nodeFormat,
            edges: edgeFormat
        };

        // Create options for the graph (customize as needed)
        var options = {
            layout: {
                hierarchical: {
                    direction: "UD",
                    sortMethod: "directed"
                }
            }
        };

    const network = new vis.Network(graphContainer, data, options);
    

    // cardBody.innerHTML += `<p>Trial ${value["trial_id"]}</p>`;

    const accordionSection = document.createElement('div');
    accordionSection.classList.add('collapse');
    accordionSection.setAttribute('id', `collapse${value["trial_id"]}`);
    accordionSection.setAttribute('data-parent', '.figure-card');
  
    const accordionCardBody = document.createElement('div');
    accordionCardBody.classList.add('card-body');
    accordionCardBody.innerHTML = `<p>Accordion content for Trial ${value["trial_id"]} goes here...</p>`;
  
    accordionSection.appendChild(accordionCardBody);
  
    const accordionButton = document.createElement('button');
    accordionButton.classList.add('btn', 'btn-link');
    accordionButton.setAttribute('data-toggle', 'collapse');
    accordionButton.setAttribute('data-target', `#collapse${value["trial_id"]}`);
    accordionButton.setAttribute('aria-expanded', 'true');
    accordionButton.setAttribute('aria-controls', `collapse${value["trial_id"]}`);
    accordionButton.textContent = 'Accordion Toggle';
  
    cardBody.appendChild(accordionButton);
    cardBody.appendChild(accordionSection);
  
    
    cardContent.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    

    return card;

};


function createDynamicTabsGreedy(targetElement) {
    var tabPane = document.createElement("div");
    tabPane.innerHTML = `
        <div class="tabs">
            <ul>
                <li class="tab-link current" data-tab="tab-1">Tab One</li>
                <li class="tab-link" data-tab="tab-2">Tab Two</li>
                <li class="tab-link" data-tab="tab-3">Tab Three</li>
            </ul>
            <div id="tab-1" class="tab-content current">
                Content for Tab One
            </div>
            <div id="tab-2" class="tab-content">
                Content for Tab Two
            </div>
            <div id="tab-3" class="tab-content">
                Content for Tab Three
            </div>
        </div>
    `;
    targetElement.appendChild(tabPane);
  };



  function createDynamicTabsBayesian(targetElement) {
    // var tabPane = document.createElement("div");
    targetElement.innerHTML = `
    <div class="col-md-12">
    <div class="card mb-4">
        <ul
            class="nav nav-tabs px-1 py-3  bg-light flex-column flex-lg-row justify-content-md-center text-center">
            <li class="nav-item">
                <a class="nav-link active show" href="" data-toggle="tab" data-target="#tabone">
                    Tuner</a>
                <!-- <i class="now-ui-icons travel_info mr-1"></i> -->
            </li>
            <li class="nav-item ">
                <a href="" class="nav-link" data-toggle="tab" data-target="#tabtwo">
                    Description</a>
            </li>
        </ul>
        <div class="card-body">
            <div class="tab-content mt-2">
                <div class="tab-pane fade text-center active show" id="tabone" role="tabpanel">

                    <div class="info info-hover">

                        <h4 class="info-title">Your Current Tuner:<p style="color: #f96332;">Greedy</p>
                        </h4>
                        <!-- Greedy Tuner Information Section with Creative Styling -->
                        <div class="info-section"
                            style="background-color: #f4f5f7; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">

                            <h4 class="info-title" style="color: #32325d; margin-top: 10px ;">Greedy Tuner
                                in
                                AutoKeras</h4>
                            <div class="description" style="color: #525f7f;">

                                <strong>Efficient:</strong> Selects optimal parameters quickly. </br>
                                <strong>Balanced:</strong> Precision with less computation.</br>
                                <strong>Streamlined:</strong> Ideal for complex models.</br>
                            </div>

                            <a href="#tabtwo" style="margin:20px ;" class="btn btn-primary"
                                id="learnMoreButton">Learn More</a>
                        </div>

                    </div>
                </div>

                <div class="tab-pane fade text-center" id="tabtwo" role="tabpanel">
                    <div class="row">
                        <div class="col-md-6 col-lg-4">
                            <div class="card" data-background-color="red">
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        1 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Start Trial
                                        </span>
                                    </p>

                                    </h4>
                                    <p class="card-description">
                                        Start the trial if no of trials< max_trails </p>

                                </div>
                            </div>
                            <div class="card card-blog">
                                <div class="card-image">
                                    <img class="img rounded" src="assets/img/project13.jpg">
                                </div>
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        4 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Get Best Hyperparameters
                                        </span>
                                    </p>
                                    <h5 class="card-title">
                                        <a href="#nuk">Stay Focused: Train Your Brain</a>
                                    </h5>
                                    <p class="card-description">
                                        Our brains are finely attuned to distraction, so today's digital
                                        environment makes it especially hard to focus...
                                    </p>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        7 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Return Node
                                        </span>
                                    </p>
                                    <h6 class="category text-danger">
                                        <i class="now-ui-icons media-2_sound-wave"></i> Trending
                                    </h6>
                                    <h5 class="card-title">
                                        <a href="#pablo">Here Be Dragons</a>
                                    </h5>
                                    <p class="card-description">
                                        An immersive production studio focused on virtual reality content,
                                        has closed a $10 million Series A round led by Discovery
                                        Communications
                                    </p>
                                    <div class="card-footer">
                                        <div class="author">
                                            <img src="assets/img/olivia.jpg" alt="..."
                                                class="avatar img-raised">
                                            <span>Lord Alex</span>
                                        </div>
                                        <div class="stats stats-right">
                                            <i class="now-ui-icons ui-2_favourite-28"></i> 342 ·
                                            <i class="now-ui-icons files_single-copy-04"></i> 45
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="card" data-background-color="black">
                                <div class="card-body content-danger">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        2 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Populate Space
                                        </span>
                                    </p>
                                    <h6 class="category-social">
                                        <i class="fab fa-apple"></i> New Apps
                                    </h6>
                                    <h4 class="card-title">
                                        <a href="#nuk">FiftyThree Files For Paper</a>
                                    </h4>
                                    <p class="card-description">
                                        Yesterday, as Facebook launched its news reader app Paper,
                                        design-focused startup FiftyThree called out Facebook publicly for
                                        using their brand name...
                                    </p>
                                    <div class="card-footer text-center">
                                        <a href="#pablo" class="btn btn-default btn-round">Read Article</a>
                                    </div>
                                </div>
                            </div>
                            <div class="card card-blog">
                                <div class="card-image">
                                    <a href="#pablo">
                                        <img class="img rounded" src="assets/img/card-blog2.jpg">
                                    </a>
                                </div>
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        5 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Populate Trie
                                        </span>
                                    </p>
                                    <h6 class="category text-primary">Features</h6>
                                    <h5 class="card-title">
                                        That’s One Way To Ditch Your Passenger
                                    </h5>
                                    <p class="card-description">
                                        As near as we can tell, this guy must have thought he was going over
                                        backwards and tapped the rear break to bring the nose down...
                                    </p>
                                    <div class="card-footer">
                                        <div class="author">
                                            <img src="assets/img/julie.jpg" alt="..."
                                                class="avatar img-raised">
                                            <span>Mike John</span>
                                        </div>
                                        <div class="stats stats-right">
                                            <i class="now-ui-icons tech_watch-time"></i> 5 min read
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card" data-background-color="blue">
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        8 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Return Value
                                        </span>
                                    </p>
                                    <h6 class="category-social">
                                        <i class="fab fa-twitter"></i> Twitter
                                    </h6>
                                    <p>
                                        "You Don't Have to Sacrifice Joy to Build a Fabulous Business and
                                        Life"
                                    </p>
                                    <div class="card-footer">
                                        <div class="author">
                                            <img src="assets/img/james.jpg" alt="..."
                                                class="avatar img-raised">
                                            <span>Tania Andrew</span>
                                        </div>
                                        <div class="stats stats-right">
                                            <i class="now-ui-icons ui-2_favourite-28"></i> 2.4K ·
                                            <i class="now-ui-icons files_single-copy-04"></i> 45
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                            <div class="card card-blog">
                                <div class="card-body text-center">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        3 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Create a Trie
                                        </span>
                                    </p>
                                    <h6 class="category text-danger">
                                        <i class="now-ui-icons media-2_sound-wave"></i> Business
                                    </h6>
                                    <h5 class="card-title">
                                        Axel Springer Spends $343M To Buy Business Insider
                                    </h5>
                                    <p class="card-description">
                                        German media giant Axel Springer has announced it’s acquiring online
                                        business news publication Business Inside...
                                    </p>
                                    <div class="card-footer">
                                        <a href="#nuk" class="btn btn-primary">Read Article</a>
                                    </div>
                                </div>
                            </div>
                            <div class="card card-blog">
                                <div class="card-image">
                                    <img class="img rounded" src="assets/img/card-blog3.jpg">
                                </div>
                                <div class="card-body">
                                    <p style="text-align: left;color: #f96332; font-size: x-large;">
                                        6 <span style="text-align: left;color: #f96332; font-size: large;">
                                            Convert to Probabilities
                                        </span>
                                    </p>
                                    <h6 class="category text-warning">
                                        <i class="now-ui-icons media-1_camera-compact"></i> Photo
                                    </h6>
                                    <h5 class="card-title">
                                        <a href="#pablo">Indispensible to nature photography: the hide</a>
                                    </h5>
                                    <div class="card-footer">
                                        <div class="stats stats-right">
                                            <i class="now-ui-icons ui-2_favourite-28"></i> 342 ·
                                            <i class="now-ui-icons files_single-copy-04"></i> 45
                                        </div>
                                        <div class="author">
                                            <img src="assets/img/james.jpg" alt="..."
                                                class="avatar img-raised">
                                            <span>Devin Coldewey</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
    targetElement.appendChild(tabPane);
  };

  
function createAndUpdateTunerGreedy(data, callback){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsGreedy(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const figureCard = createFigureCardWithAccordion(value);
        casualnexContainer.appendChild(figureCard);
    })
};


function createAccordion(accordionId, data) {
    // Create a row for the accordion
    
    // Create the accordion container inside the row
    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('col-md-12'); // Full width column
    
    // Create the main accordion div inside the container
    const accordionDiv = document.createElement('div');
    accordionDiv.id = accordionId;
    accordionDiv.className = 'accordion';
    accordionContainer.appendChild(accordionDiv);

    // Create a card for the accordion
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Create the card header with a dynamic title
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = '<a class="collapsed card-link" data-toggle="collapse" href="#' + accordionId + 'Body">Trial ' + accordionId + '</a>';
    cardDiv.appendChild(cardHeader);

    // Create the collapse div
    const collapseDiv = document.createElement('div');
    collapseDiv.id = accordionId + 'Body';
    collapseDiv.className = 'collapse';
    collapseDiv.setAttribute('data-parent', '#' + accordionId);
    cardDiv.appendChild(collapseDiv);

    // Create the card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    collapseDiv.appendChild(cardBody);

    // Function to add a div to the accordion body
    function addToAccordion(content) {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = content;
        cardBody.appendChild(newDiv);
    }

    // Add provided data to the accordion
    if (data && Array.isArray(data)) {
        data.forEach(content => addToAccordion(content));
    } else {
        addToAccordion('<p>No data provided</p>');
    }

    // Append the card to the accordion div
    accordionDiv.appendChild(cardDiv);

    // Return the row instead of the accordion div
    return accordionContainer;
};

function createAndUpdateTunerBayesian(data, callback){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsBayesian(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const accordionDiv = createAccordion(key, value);
        casualnexContainer.appendChild(accordionDiv);
    })
};



socket.on('connect', () => {
    console.log("WebSocket connected");
});

socket.on('evaluation', (data) => {
    console.log(data);
    createEvaluationElements(data)
});

socket.on('initial', (data) => {
    console.log(data);
    project_name = data["project_name"]
    train_file_path = data["x"]
    update_training_ui(data)
});

socket.on('update', (data) => {
    console.log(data)
    if (data.hasOwnProperty("data")) {
        const final_arch = data["data"]["filepath"];

        if (final_arch.includes("test_model")) {
            const finalArchImageUrl = `/get_final_image/final_model`;
            const tValue = 'test_model';
            if (!(tValue in models)) {
                createTabElement('arch', 'Architecture', '#final-arch-card-ul');
                createAndAppendTabPaneFinalArch('arch', finalArchImageUrl, '#final-arch-card');
                models[tValue] = finalArchImageUrl;

            }
        }
        else if (final_arch.includes("preprocessing_model")) {
            const finalArchImageUrl = `/get_final_image/preprocessing_model`;
            const tValue = 'preprocessing_model'
            if (!(tValue in models)) {
                // call element here to add
                const $imageElementPreProcess = $('<p>', {
                    html: `<img src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></br`,
                });
                $('#preprocessing-arch-card').append($imageElementPreProcess);

                models[tValue] = finalArchImageUrl
            }
        }
        else if (final_arch.includes("dense_model")) {
            const finalArchImageUrl = `/get_final_image/dense_model`;
            const tValue = 'dense_model'
            if (!(tValue in models)) {
                // call element here to add
                const $imageElementDense = $('<p>', {
                    html: `<img src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;">`,
                });
                $('#dense-arch-card').append($imageElementDense);
                models[tValue] = finalArchImageUrl
            }
        }
    }
    else {
        var newValues = {};
        var trialValue = data["model_path"].split('\\').slice(-2)[0];
        if (data["metrics"].metrics && Object.keys(data["metrics"].metrics).length > 0) {
            for (const metricName in data["metrics"].metrics) {
                if (data["metrics"].metrics.hasOwnProperty(metricName)) {
                    const metric = data["metrics"].metrics[metricName];
                    const observations = metric.observations.map(observation => {
                        return {
                            direction: metric.direction,
                            trialValue: trialValue,
                            value: observation.value,
                            step: observation.step

                        };
                    });
                    newValues[metricName] = observations;
                }
            }
        };
        if (Object.keys(newValues).length > 0) {
            // console.log("Sending to funtion")
            // console.log(newValues)
            bestValues = updateBestValues(bestValues, newValues);
            // console.log(bestValues);  // Corrected variable name to "bestValues"
        };

        const imageUrl = `/get_image/${encodeURIComponent(trialValue)}/model`;
        if (!(trialValue in trials)) {
            var element = document.getElementById(trialValue);
            var elementTabPane = document.getElementById(`tab-${trialValue}`);
            if (element) {
                element.parentNode.removeChild(element);
            }
            if (elementTabPane) {
                elementTabPane.parentNode.removeChild(elementTabPane);
            }
            createAndAppendTabPaneCarousel(trialValue, imageUrl, '#arch-carousel', data["values"], data["metrics"]);
        }

    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with class="dropdown-btn" and loop through them
    var dropdown = document.getElementsByClassName("dropdown-btn");
    for (var i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            // Toggle between adding and removing the "show" class to dropdown content
            this.nextElementSibling.classList.toggle("show");
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');
    const sidebarLinks = document.querySelectorAll('#sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show the clicked section
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const explorePreprocessingbutton = document.getElementById("explore-preprocessing");
    const exploreTunerButton = document.getElementById('explore-tuner');
    // const exploreFeatures = document.getElementById("explore-features");
    // const closeAppButton = document.getElementById('disconnect-button');
    // const igGraphButton = document.getElementById('ig-graph-button');
    // const aleGraphButton = document.getElementById('ale-graph-button');
    
    // document.getElementById("learnMoreButton").addEventListener("click", function(event) {
    //     console.log("in here");
    //     event.preventDefault(); // Prevent the default anchor behavior
    
    //     // Deactivate current active tab and tab content
    //     document.querySelector('.nav-link.active').classList.remove('active', 'show');
    //     document.querySelector('.tab-pane.active').classList.remove('active', 'show');
    
    //     // Activate the tabtwo tab and content
    //     document.querySelector('a[data-target="#tabtwo"]').classList.add('active', 'show');
    //     document.getElementById("tabtwo").classList.add('active', 'show');
    // });

    
    // closeAppButton.addEventListener('click', () => {
    //     window.location.href = '/close_app'; // Send a request to the server to close the Flask app
    // });

    // exploreFeatures.addEventListener("click", function () {
    //     // Make an AJAX request to your Flask-RESTful API endpoint
    //     var targetDiv = document.getElementById('explore-features-div');
    //     var offsetTop = targetDiv.offsetTop;

    //     // Scroll the window to the target div
    //     window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    // });


    explorePreprocessingbutton.addEventListener("click", function () {
        // // Make an AJAX request to your Flask-RESTful API endpoint
        // var targetDiv = document.getElementById('explore-preprocessing-div');
        // var offsetTop = targetDiv.offsetTop;

        // // Scroll the window to the target div
        // window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        
        const url = '/explore_preprocessing/?project_name=' + encodeURIComponent(project_name) + '&train_file_path=' + encodeURIComponent(train_file_path);
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the response as JSON
                })
                .then(data => {
                    console.log(data)
                    createAndUpdatePreprocessing(data, updatePlot)       
                });
    });

    exploreTunerButton.addEventListener("click", function () {

        // var targetDiv = document.getElementById('explore-tuner-div');
        // var offsetTop = targetDiv.offsetTop;

        // // Scroll the window to the target div
        // window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        const url = '/explore_tuner/?project_name=' + encodeURIComponent(project_name);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                console.log(data)
                if(data['00']["tuner"] == "greedy"){
                    createAndUpdateTunerGreedy(data, initializeElement) ;
                }
                else{
                    createAndUpdateTunerBayesian(data, initializeElement);
                }
                

            });
        // fetch('/return_html')
        // .then(response => response.text())
        // .then(data => {

        //     var htmlContent = document.getElementById('tuner-explanation-div');
        //     var iframe = document.createElement('iframe');
        //     iframe.style.width = '100%';
        //     iframe.style.height = '99%';
        //     iframe.scrolling = 'no';
        //     iframe.srcdoc = data;
        //     htmlContent.appendChild(iframe);

        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });



    });

 

    // igGraphButton.addEventListener("click", function () {

    //     fetch('/load_data_ig', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json(); // Parse the response as JSON
    //         })
    //         .then(data => {
    //             // Work with the JSON data here
    //             // Render the chart using Plotly
    //             const chartContainer = document.getElementById("ig-graph");
    //             var chartData = JSON.parse(data);
    //             Plotly.newPlot(chartContainer, chartData, { responsive: true });
    //         })
    //         .catch(error => {
    //             // Handle errors
    //             console.error('There was a problem with the fetch operation:', error);
    //         });

    // });

    // aleGraphButton.addEventListener("click", function () {

    //     fetch('/load_data_ale', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json(); // Parse the response as JSON
    //         })
    //         .then(data => {
    //             // Work with the JSON data here
    //             // Render the chart using Plotly
    //             const chartContainer = document.getElementById("ale-graph");
    //             var chartData = JSON.parse(data);
    //             Plotly.newPlot(chartContainer, chartData, { responsive: true });
    //         })
    //         .catch(error => {
    //             // Handle errors
    //             console.error('There was a problem with the fetch operation:', error);
    //         });

    // });

    document.addEventListener('DOMContentLoaded', function() {
        // Get all elements with class="dropdown-btn" and loop through them
        var dropdown = document.getElementsByClassName("dropdown-btn");
        for (var i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() {
                // Toggle between adding and removing the "show" class to dropdown content
                this.nextElementSibling.classList.toggle("show");
            });
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        const sections = document.querySelectorAll('.content-section');
        const sidebarLinks = document.querySelectorAll('#sidebar a');
        const homeSection = document.getElementById('home-section');
    
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
    
                // Hide all sections
                sections.forEach(section => section.classList.remove('active'));
    
                // Check if the clicked link is for the home section
                if(this.getAttribute('href') === '#home-section') {
                    homeSection.classList.add('active');
                } else {
                    // Hide the home section and show the clicked section
                    homeSection.classList.remove('active');
                    const sectionId = this.getAttribute('href');
                    document.querySelector(sectionId).classList.add('active');
                }
            });
        });
    });
});
