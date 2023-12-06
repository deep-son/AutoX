const socket = io.connect('http://127.0.0.1:8082');
var trials = {};
var models = {};
var bestValues = {};
var project_name = "structured_data_classifier";
var train_file_path = "C:\\Users\\Deepanshu\\.keras\\datasets\\train.csv";
var target_name = "survived";


function createArchModal(tabId, imageUrl){
        // Create the modal structure (hidden by default)
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = `arch-${tabId}`;
        modal.tabIndex = '-1';
        modal.role = 'dialog';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Trial Architecture</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <p class=""><img src="${imageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
    
        // Append the modal to the body
        document.body.appendChild(modal);
    
        // Create and return the anchor tag
        const anchorTag = document.createElement('a');
        anchorTag.href = `#arch-${tabId}`;
        // anchorTag.className = 'btn btn-primary btn-round';
        anchorTag.dataset.toggle = 'modal';
        anchorTag.innerText = `${tabId} architecture`;
    
        return anchorTag;

}

function createHyperModal(tabId, values){
    // Create the modal structure (hidden by default)
    var valuesTable = '<table class="table table-striped"><thead class="text-primary"><tr><th>Component</th><th>Value</th></tr></thead><tbody>';
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                valuesTable += `<tr><td>${key}</td><td>${values[key]}</td></tr>`;
            }
        }
        valuesTable += '</tbody></table>';
        
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `hyper-${tabId}`;
    modal.tabIndex = '-1';
    modal.role = 'dialog';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Hyperparameters</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            ${valuesTable}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Append the modal to the body
    document.body.appendChild(modal);

    // Create and return the anchor tag
    const anchorTag = document.createElement('a');
    anchorTag.href = `#hyper-${tabId}`;
    // anchorTag.className = 'btn btn-primary btn-round';
    anchorTag.dataset.toggle = 'modal';
    anchorTag.innerText = `${tabId} hps`;

    return anchorTag;

}

function createMetricModal(tabId, metrics){
    // Create the modal structure (hidden by default)
    var metricsTable = '<table class="table table-striped"><thead class="text-primary"><tr><th>Metric</th><th>Value</th></tr></thead><tbody>';
    for (var metricKey in metrics.metrics) {
        if (metrics.metrics.hasOwnProperty(metricKey)) {
            var metric = metrics.metrics[metricKey];
            metricsTable += `<tr><td>${metricKey}</td><td>${metric.observations[0].value[0]}</td></tr>`;
        }
    }
    metricsTable += '</tbody></table>';
        
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `metric-${tabId}`;
    modal.tabIndex = '-1';
    modal.role = 'dialog';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Best Metrics</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            ${metricsTable}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Append the modal to the body
    document.body.appendChild(modal);

    // Create and return the anchor tag
    const anchorTag = document.createElement('a');
    anchorTag.href = `#metric-${tabId}`;
    // anchorTag.className = 'btn btn-primary btn-round';
    anchorTag.dataset.toggle = 'modal';
    anchorTag.innerText = `${tabId} metrics`;

    return anchorTag;

}

function createGraphModal(tabId){

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `graph-${tabId}`;
    modal.tabIndex = '-1';
    modal.role = 'dialog';
    modal.innerHTML = `
        <div class="modal-dialog modal-xxl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Epoch Graphs</h5></br>
                <button class="btn btn-secondary tensor-api-class" type="button" id="btn-${tabId}" aria-expanded="false">
                    Refresh
                </button>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 plot-container" style="min-height:300px;" id="accuracy-${tabId}">
                        </div>
                        <div class="col-md-12 plot-container" style="min-height:300px;" id="loss-${tabId}">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Append the modal to the body
    document.body.appendChild(modal);

    // Create and return the anchor tag
    const anchorTag = document.createElement('a');
    anchorTag.href = `#graph-${tabId}`;
    // anchorTag.className = 'btn btn-primary btn-round';
    anchorTag.dataset.toggle = 'modal';
    anchorTag.innerText = `${tabId} epochs`;

    return anchorTag;

}

function addTrialToTable(tabId, imageUrl, values, metrics){
    const tableBody = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    
    // Check if a row with this item's ID already exists
    if (!document.getElementById(`row-${tabId}`)) {
        const row = tableBody.insertRow();
        row.id = `row-${tabId}`; // Assign a unique ID to the row

        row.insertCell(0).innerHTML = tabId;

        const archAnchor = createArchModal(tabId, imageUrl);
        const archCell = row.insertCell(1);
        archCell.appendChild(archAnchor);

        const hyperAnchor = createHyperModal(tabId, values)
        const hyperCell = row.insertCell(2);
        hyperCell.appendChild(hyperAnchor);

        const metricAnchor = createMetricModal(tabId, metrics)
        const metricCell = row.insertCell(3);
        metricCell.appendChild(metricAnchor);

        const graphAnchor = createGraphModal(tabId)
        const graphCell = row.insertCell(4);
        graphCell.appendChild(graphAnchor);
    }
    else{
        const existingRow = document.getElementById(`row-${tabId}`);

        const existingModal = document.getElementById(`metric-${tabId}`);

        // If the modal already exists, remove it
        if (existingModal) {
            existingModal.parentNode.removeChild(existingModal);
        }
        const metricAnchor = createMetricModal(tabId, metrics);
        const metricCell = existingRow.cells[3];
        metricCell.innerHTML = '';
        metricCell.appendChild(metricAnchor);
    }
}

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

function update_training_ui_start(data) {
    $('#training-task').text(data['task'])
    $('#training-start-time').text(data['start_time']);
    // $('#training-end-time').find('span').text(endTime);
    $('#training-max-trial').text(data['max_trials']);
};
function update_training_ui_end(data) {
    $('#training-end-time').text(data['end_time']);
    document.getElementById("explore-preprocessing").removeAttribute("disabled");
    document.getElementById("explore-tuner").removeAttribute("disabled");

};

function displayNormalizationDataWithAccordion(data) {
    if (Object.keys(data).length === 0) {
        var div = document.createElement('div');
        div.textContent = 'Normalization in Preprocessing is not used in this model';
        return div;

    };
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

    
    return accordion
};

function updatePlot(id, data){
    console.log(data);
    var element = document.getElementById(id);
    var chartData = JSON.parse(data);
    var config = {
        displayModeBar: false,
    };
    
    Plotly.newPlot(element, chartData,{}, config);
}

function updatePlotBayesian(parent_id, id, data) {
    console.log(data);

    var parentElement = document.getElementById(parent_id);
    if (!parentElement) {
        console.error('Parent element not found');
        return;
    }

    var element = parentElement.querySelector('#' + id);
    if (!element) {
        console.error('Element with ID ' + id + ' not found within parent');
        return;
    }

    var chartData = JSON.parse(data);

    var layout = {
        // other layout properties,
        margin: {
          l: 50,  // left margin
          r: 50,  // right margin
          b: 50,  // bottom margin
          t: 50,  // top margin, increase this to give more space for modebar
          pad: 4
        },
        // other layout properties
      };

    Plotly.newPlot(element, chartData, layout);
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

                  
                const col1 = $('<div>').addClass('col-md-12');
                const card1 = $('<div>').addClass('card');
                const cardHeader1 = $('<div>').addClass('card-header')
                const h4_1 = $('<h4>').text('NaN in dataset');
                const p1 = $('<p>').addClass('card-text')
                                .text('Should the dataset contain any NaNs, AutoKeras will automatically substitute them with a randomly selected value from the respective column');
                const cardBody1 = $('<div>').addClass('card-body');
                
                const chartContainer1 = $('<div>').attr('id', 'chart-container-1');
                cardBody1.append(chartContainer1);
                cardHeader1.append(h4_1);
                cardHeader1.append(p1);
                card1.append(cardHeader1).append(cardBody1);
                col1.append(card1);

                const col2 = $('<div>').addClass('col-md-12');
                const card2 = $('<div>').addClass('card');
                const cardHeader2 = $('<div>').addClass('card-header');
                const h4_2 = $('<h4>').text('Encoding Details');
                const p2 = $('<p>').addClass('card-text').text('AutoKeras converts categorical columns to numbers using the tf.keras.layers.StringLookup() function. It doesn\'t use One-hot-encoding or other types of encoding methods.');
                
                const cardBody2 = $('<div>').addClass('card-body').text('Add another chart here');
                
                cardHeader2.append(h4_2);
                cardHeader2.append(p2);
                card2.append(cardHeader2).append(cardBody2);
                col2.append(card2);

                const card3 = $('<div>').addClass('card');
                const cardHeader3 = $('<div>').addClass('card-header');
                const h4_3 = $('<h4>').text('Type of features');
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

function createDynamicTabsGreedy(targetElement) {
    targetElement.innerHTML = `
    <div class="col-md-12">
    <div class="col-md-12">
        <div class="card mb-4">
            <ul class="nav nav-tabs px-1 py-3  bg-light flex-column flex-lg-row justify-content-md-center text-center">
                <li class="nav-item">
                    <a class="nav-link active show" href="" data-toggle="tab" data-target="#tabone">
                        Greedy</a>
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
                            <h4 class="info-title">Your Current Tuner:</h4>
                            <h3 class="info-title blink"><p style="color: #f96332;">Greedy</p>
                            </h3>
                            <!-- Greedy Tuner Information Section with Creative Styling -->
                            <div class="info-section"
                                style="background-color: #f4f5f7; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
                                <h4 class="info-title " style="color: #32325d; margin-top: 10px ;">Greedy
                                    in
                                    AutoKeras</h4>
                                <div class="description" style="color: #525f7f;">
                                    <strong>Incremental Refinement: </strong> Gradually improves hyperparameters for better performance.</br>
                                    <strong>Efficiency Oriented: </strong> Targets promising hyperparameters for faster results.</br>
                                    <strong>Real-time Adaptation: </strong> Adjusts strategy based on immediate feedback.</br>
                                </div>
                                <a href="#tabtwo" style="margin:20px ;" class="btn btn-primary"
                                    id="learnMoreButton">Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade text-center" id="tabtwo" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        Note: Greedy Tuner works by optimizing one hyperparameter at a time; i.e only
                                        one hyperparameter value is optimized with every new Trial.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header" style="background-color: #f96332; color: white;">
                                        <h5 class="card-title">Trial Initialization Process</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            1 <span style="color: #f96332;; font-size: large;">
                                                Start Trial
                                            </span>
                                        </p>
                                        <p class="card-description">
                                            The autokeras is designed to start a new trial phase once the old trial is
                                            completed.
                                            This ensures continuous progress and efficient
                                            utilization of resources.
                                        </p>
                                        <ul style="text-align: left;">
                                            <li><strong>Current Trial Check</strong>: Verifies if the ongoing number of
                                                trials is below the maximum trial threshold.</li>
                                            <li><strong>Automatic Initiation</strong>: If conditions are met, a new
                                                trial begins.
                                            </li>

                                        </ul>
                                    </div>
                                    <!-- <div class="card-footer">
                                        <button type="button" class="btn btn-info btn-round">Learn More</button>
                                    </div> -->
                                </div>
                                <div class="card" data-background-color="black">
                                    <div class="card-body content-danger">
                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            2 <span style="color: #f96332;; font-size: large;">
                                                Populate Hyperspace
                                            </span>
                                        </p>
                                        <h6 class="category-social">
                                            Understanding Hyperspace
                                        </h6>
                                        <p class="card-description">

                                        <ul style="text-align: left;">
                                            <li>This phase involves exploring the possibilities of untested
                                                hyperparameters,
                                                identifying potential candidates for optimal performance.</li>
                                            <li>Autokeras however has a starting template for each of the tasks.
                                            </li>

                                        </ul>
                                        </p>
                                        <div class="card-footer text-center">
                                            <a href="#" data-toggle="modal" data-target="#modal-initial-hps"
                                                class="btn btn-default btn-round">See the initial
                                                hyperspace</a>
                                        </div>
                                    </div>

                                </div>

                                <div class="card card-blog">
                                    <div class="card-header" style="background-color: #f96332; color: white;">
                                        <h5 class="card-title">Trie</h5>
                                    </div>
                                    <div class="card-body text-center">

                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            3 <span style="color: #f96332;; font-size: large;">
                                                Initializing the Hyperparameter Trie
                                            </span>
                                        </p>
                                        <p class="card-description">
                                            A <span class="text-danger">Trie structure</span> is crafted
                                            for each hyperparameter space, where each node of the Trie is indicates a
                                            hyperparameter
                                        </p>

                                        <div class="card-footer text-center">
                                            <a href="https://en.wikipedia.org/wiki/Trie"
                                                class="btn btn-default btn-round">More About Trie</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card card-blog">
                                    <div class="card-body">
                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            4 <span style="color: #f96332;; font-size: large;">
                                                Selecting Hyperparameters and Inserting in Trie
                                            </span>
                                        </p>
                                        <p class="card-description">
                                            This step involves selecting the set of best hyperparameters from the
                                            previous trials.
                                        </p>
                                        <p class="card-description" style="color: #333; text-align: left;">
                                            For example, if hyperparameter
                                            'structured_data_block_1/dense_block_1/dropout' is selected it is
                                            represented in the Trie as follows:
                                        <ul style="text-align: left;">
                                            <li>Parent Node: structured_data_block_1</li>
                                            <li>Child Node (of the Parent): dense_block_1</li>
                                            <li>Sub-child Node: dropout</li>
                                        </ul>
                                        </p>
                                        <div class="card-footer text-center">
                                            <a href="#card-0" class="btn btn-default btn-round">See Trie for your runs</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card card-blog">
                                    <div class="card-body">
                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            5 <span style="color: #f96332;; font-size: large;">
                                                Converting to Probabilities
                                            </span>
                                        </p>
                                        <p class="card-description">
                                        <ul style="text-align: left;">
                                            <li>Each node in the trie gets a probability, which depends upon the number
                                                of leaves of a node eg. <code>probabilities = np.array([1 / node.num_leaves for node in all_nodes])</code></li>
                                            <li>More leaves or children, lesser the chance of getting selected</li>
                                            <li>A node is selected randomly with the given probabilities in mind</li>
                                        </ul>
                                        </p>
                                        <div class="card-footer text-center">
                                            <a href="#card-0" class="btn btn-default btn-round">See Probabilities below</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" style="background-color: #f96332; color: white;">
                                        <h5 class="card-title">Best Hyperparameter Value</h5>
                                    </div>
                                    <div class="card-body">

                                        <p style="text-align: left;color: #f96332;; font-size: x-large;">
                                            6 <span style="color: #f96332;; font-size: large;">
                                                Getting a value for the hyperparameter
                                            </span>
                                        </p>
                                        <ul style="text-align: left; color:black;">
                                            <li><strong>Retrieval of Best Hyperparameter value:</strong> Begins by
                                                fetching
                                                the best hyperparameter value from previous tuning iterations.</li>
                                            <li><strong>Unique Set Generation:</strong> Iteratively generates new sets
                                                of hyperparameters, ensuring uniqueness in each iteration.</li>
                                            <li><strong>Random Sampling with Checks:</strong> Employs random sampling
                                                for hyperparameter values, incorporating checks to avoid repeats.</li>
                                            <li><strong>Collision Handling:</strong> Includes a mechanism to count and
                                                limit 'collisions'—instances of generating previously tried
                                                combinations.</li>
                                            <li><strong>Threshold for Collision:</strong> If the process exceeds a
                                                predefined number of collisions, it stops, preventing infinite loops.
                                            </li>
                                            <li><strong>Outcome:</strong> Returns a unique set of hyperparameter value
                                                if
                                                successful; aborts the process if it hits the collision limit and return
                                                the current best value.</li>
                                        </ul>
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

<div class="modal fade" id="modal-initial-hps" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Initial Hyperparameter Space</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="code-block">
                    <pre><code class="language-python">
                                    STRUCTURED_DATA_CLASSIFIER = [
                                    {
                                        "structured_data_block_1/normalize": True,
                                        "structured_data_block_1/dense_block_1/num_layers": 2,
                                        "structured_data_block_1/dense_block_1/use_batchnorm": False,
                                        "structured_data_block_1/dense_block_1/dropout": 0,
                                        "structured_data_block_1/dense_block_1/units_0": 32,
                                        "structured_data_block_1/dense_block_1/units_1": 32,
                                        "classification_head_1/dropout": 0.0,
                                        "optimizer": "adam",
                                        "learning_rate": 0.001,
                                    }
                                ]
                                </code></pre>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
    
    `;
    const learnMoreButton = document.getElementById('learnMoreButton');
    
    // button for tuner description
    learnMoreButton.addEventListener("click", function(event) {
        console.log("in here");
        event.preventDefault(); // Prevent the default anchor behavior
    
        // Deactivate current active tab and tab content
        document.querySelector('.nav-link.active').classList.remove('active', 'show');
        document.querySelector('.tab-pane.active').classList.remove('active', 'show');
    
        // Activate the tabtwo tab and content
        document.querySelector('a[data-target="#tabtwo"]').classList.add('active', 'show');
        document.getElementById("tabtwo").classList.add('active', 'show');
    });
    
  };

function createDynamicTabsBayesian(targetElement) {
    // var tabPane = document.createEl++ement("div");
    targetElement.innerHTML = `
    <div class="col-md-12">
    <div class="col-md-12">
        <div class="card mb-4">
            <ul class="nav nav-tabs px-1 py-3  bg-light flex-column flex-lg-row justify-content-md-center text-center">
                <li class="nav-item">
                    <a class="nav-link active show" href="" data-toggle="tab" data-target="#tabone">
                        Bayesian</a>
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
                            <h4 class="info-title">Your Current Tuner:</h4>
                            <h5 class="info-title blink">
                                <p style="color: #f96332;">Bayesian</p>
                            </h5>


                            <div class="info-section"
                                style="background-color: #f4f5f7; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
                                <h4 class="info-title" style="color: #32325d; margin-top: 10px ;">Bayesian Tuner
                                    in
                                    AutoKeras</h4>
                                <div class="description" style="color: #525f7f;">
                                    <strong>Smart Prediction: </strong> Learns from past evaluations for optimal
                                    hyperparameter choices. </br>
                                    <strong>Balanced Search:</strong> Efficiently navigates between exploring
                                    and exploiting hyperparameters.</br>
                                    <strong>Adaptive Tuning:</strong> Customizes search based on results and
                                    prior knowledge.</br>
                                </div>
                                <a href="#tabtwo" style="margin:20px ;" class="btn btn-primary"
                                    id="learnMoreButton">Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade text-center" id="tabtwo" role="tabpanel">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <p>Note: The Bayesian tuner relies on the history of previous trials. If the
                                            number of trials is insufficient to fit a Gaussian process regressor, it
                                            resorts to random sampling. By default, AutoKeras uses thrice the
                                            dimensionality of the hyperspace as the default number of random points.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-lg-4">
                                <!-- Bayesian Tuner: Trial Initialization -->
                                <div class="card">
                                    <div class="card-header" style="background-color: #007bff; color: white;">
                                        <h5 class="card-title">Trial Initialization Process</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="text-align: left;color: #007bff; font-size: x-large;">
                                            1 <span style="text-align: left;color: #007bff; font-size: large;">
                                                Start Trial
                                            </span>
                                        </p>
                                        <p class="card-description">
                                            Initializes a trial to efficiently explore the
                                            hyperparameter space based on prior probability models.
                                        </p>
                                    </div>
                                </div>
                                <div class="card" data-background-color="black">
                                    <div class="card-body content-danger">
                                        <p style="text-align: left;color:#007bff; font-size: x-large;">
                                            2 <span style="color: #007bff; font-size: large;">
                                                Populate Hyperspace
                                            </span>
                                        </p>
                                        <h6 class="category-social">
                                            Understanding Hyperspace
                                        </h6>
                                        <p class="card-description">

                                        <ul style="text-align: left;">
                                            <li>This phase involves exploring the possibilities of untested
                                                hyperparameters,
                                                identifying potential candidates for optimal performance.</li>
                                            <li>Autokeras however has a starting template for each of the tasks.
                                            </li>

                                        </ul>
                                        </p>
                                        <div class="card-footer text-center">
                                            <a href="#" data-toggle="modal" data-target="#modal-initial-hps"
                                                class="btn btn-default btn-round">See the initial
                                                hyperspace</a>
                                        </div>
                                    </div>

                                </div>
                                <div class="card" data-background-color="black">
                                    <div class="card-body content-danger">
                                        <p style="text-align: left; color: #007bff; font-size: x-large;">
                                            3 <span style="color: #007bff; font-size: large;">Check if enough Points are
                                                available</span>
                                        </p>
                                        <h6 class="category-social">Understanding Decision Making</h6>
                                        <p class="card-description">
                                            By Default Autokeras uses 3 times the dimensionality of the space as the
                                            default number of Hyperparameter points.
                                        </p>
                                        <div class="code-block">
                                            <code>
                                        num_initial_points = self.num_initial_points or max(3 * dimensions, 3)
                                        if len(completed_trials) < num_initial_points:
                                            return self._random_populate_space()
                                            </code>
                                        </div>
                                        <p>
                                            The variable <code>num_initial_points</code> is set to either
                                            <code>max(3 * dimensions, 3)</code> or a specified value, where
                                            <code>dimensions</code> refers to the length of all the hyperparameters that
                                            have been tried so far. If the number of completed trials is less than
                                            <code>num_initial_points</code>, random tuning occurs, where a random
                                            hyperparameter is selected for the current trial. Otherwise, the Bayesian
                                            Process continues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <!-- Bayesian Tuner: Model Training and Evaluation -->
                                <div class="card">
                                    <div class="card-header" style="background-color: #007bff; color: white;">
                                        <h5 class="card-title">Bayesian Tuner</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="text-align: left; color: #007bff; font-size: x-large;">
                                            4 <span style="color: #007bff; font-size: large;">Vectorize Trials</span>
                                        </p>
                                        <p class="card-description">
                                            Trials are vectorized because the Bayesian process operates exclusively in a
                                            euclidean space and hyperparameters are not in euclidean space.
                                        </p>
                                        <p class="card-description">
                                            The vectorization process involves translating hyperparameter (HP) values
                                            into the continuous space [0, 1], there are fixed rules defined to convert int_hp, float_hp and fixed_hp to Additionally, scores are calculated by
                                            adding the mean and standard deviation from the Gaussian process regressor
                                            for the continuous hyperparameter values of each trial:
                                        </p>
                                        <div class="code-block">
                                            <pre><code>
                                        y_h_mean, y_h_std = self.gpr.predict(x_h, return_std=True)
                                        score = y_h_mean[0] + y_h_std[0]
                                            </code></pre>
                                        </div>
                                        <p class="card-description">
                                            These vector values and scores from all trials are then compiled together to
                                            form two arrays: <code>x = appended_vector</code> and
                                            <code>y = appended_score</code>, which are used in the Bayesian optimization
                                            process.
                                        </p>
                                    </div>
                                </div>


                                <div class="card">
                                    <div class="card-header" style="background-color: #007bff; color: white;">
                                        <h5 class="card-title">Upper Confidence Bound Computation</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="text-align: left; color: #007bff; font-size: x-large;">
                                            5 <span style="color: #007bff; font-size: large;">Optimizing the
                                                Hyperparameters</span>
                                        </p>
                                        <p class="card-description">
                                            The function computes the upper confidence bound for given hyperparameter
                                            values. This involves predicting the mean and standard deviation using a
                                            Gaussian process regressor and adjusting the confidence level with a beta
                                            parameter.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                                <!-- Bayesian Tuner: Final Hyperparameter Selection -->
                                <div class="card">
                                    <div class="card-body">
                                        <p style="text-align: left; color: #007bff; font-size: x-large;">
                                            6 <span style="color: #007bff; font-size: large;">Optimizing Trial
                                                Parameters</span>
                                        </p>
                                        <p class="card-description">
                                            Multiple restarts are used to optimize the hyperparameter values, seeking
                                            the minimum of the upper confidence bound. The best hyperparameters are
                                            identified based on the lowest score achieved during optimization.
                                        </p>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-header" style="background-color: #007bff; color: white;">
                                        <h5 class="card-title">Model Fitting and Decision Making</h5>
                                    </div>
                                    <div class="card-body">
                                        <p style="text-align: left; color: #007bff; font-size: x-large;">
                                            7 <span style="color: #007bff; font-size: large;">Finalizing the Optimal
                                                Hyperparameters</span>
                                        </p>
                                        <p class="card-description">
                                            After iterating through trials, the optimal set of hyperparameters is
                                            finalized based on the Gaussian process regressor's predictions. This
                                            set is used for subsequent model training and evaluations.
                                        </p>
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
<div class="modal fade" id="modal-initial-hps" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Initial Hyperparameter Space</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="code-block">
                    <pre><code class="language-python">
                                    STRUCTURED_DATA_CLASSIFIER = [
                                    {
                                        "structured_data_block_1/normalize": True,
                                        "structured_data_block_1/dense_block_1/num_layers": 2,
                                        "structured_data_block_1/dense_block_1/use_batchnorm": False,
                                        "structured_data_block_1/dense_block_1/dropout": 0,
                                        "structured_data_block_1/dense_block_1/units_0": 32,
                                        "structured_data_block_1/dense_block_1/units_1": 32,
                                        "classification_head_1/dropout": 0.0,
                                        "optimizer": "adam",
                                        "learning_rate": 0.001,
                                    }
                                ]
                                </code></pre>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
    `;
    const learnMoreButton = document.getElementById('learnMoreButton');
    
    // button for tuner description
    learnMoreButton.addEventListener("click", function(event) {
        console.log("in here");
        event.preventDefault(); // Prevent the default anchor behavior
    
        // Deactivate current active tab and tab content
        document.querySelector('.nav-link.active').classList.remove('active', 'show');
        document.querySelector('.tab-pane.active').classList.remove('active', 'show');
    
        // Activate the tabtwo tab and content
        document.querySelector('a[data-target="#tabtwo"]').classList.add('active', 'show');
        document.getElementById("tabtwo").classList.add('active', 'show');
    });
  };

function createAccordionBayesian(accordionId, data, callback) {
    
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

    function addToAccordionGraphs(data) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
    
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-12';
    
        // Explanation for vectorized trials
        const vectorizedDescription = document.createElement('p');
        vectorizedDescription.textContent = 'Below are the graphs showcasing the vectorized trials. Each bar in the graph represents a hyperparameter value within the vector. The "Score" for each trial is calculated as the sum of the mean and standard deviation obtained from the Gaussian Process Regressor (GPR) prediction based on the vectorized trial values.';
        colDiv.appendChild(vectorizedDescription);
    
        // Div for vectorized graph
        const vectorizedGraph = document.createElement('div');
        vectorizedGraph.id = 'vectorized';
        colDiv.appendChild(vectorizedGraph);
    
        // Explanation for optimal hyperparameters
        const optimalDescription = document.createElement('p');
        optimalDescription.textContent = 'After fitting the GPR with the vectorized trials and their corresponding scores, the optimization process identified the following set of optimal vectorized hyperparameters.';
        colDiv.appendChild(optimalDescription);
    
        // Div for optimal graph
        const optimalGraph = document.createElement('div');
        optimalGraph.id = 'optimal';
        colDiv.appendChild(optimalGraph);
    
        // Explanation for conversion back to hyperparameters
        const conversionDescription = document.createElement('p');
        conversionDescription.textContent = 'These optimal vectorized hyperparameters are then translated back into actual hyperparameter values following specific conversion rules.';
        colDiv.appendChild(conversionDescription);
    
        rowDiv.appendChild(colDiv);

        cardBody.appendChild(rowDiv);

    }

    if (data && data.vectorized) {
        addToAccordionGraphs(data);
    } else {
        addToAccordion('<p>Not enough Trials to do Bayesian Optimization, selecting hyperparameters randomly</p>');
    }

    accordionDiv.appendChild(cardDiv);

    return accordionContainer;
};

function createAndUpdateTunerBayesian(data){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsBayesian(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const accordionDiv = createAccordionBayesian(key, value);
        casualnexContainer.appendChild(accordionDiv);
        if (value.vectorized) {
            updatePlotBayesian(key, 'vectorized', value.vectorized);
        }
        if (value.optimal) {
            updatePlotBayesian(key, 'optimal', value.optimal);
        }
    })
};


function createFigureCardWithAccordionGreedy(value) {
    const card = document.createElement('div');
    card.id = `card-${value["trial_id"]}`
    card.classList.add('col-md-12', 'figure-card');
    card.style.padding = '20px';
    
    const tabHeader = document.createElement('h5');
    tabHeader.textContent = `Trial ${value["trial_id"]}`;
    tabHeader.classList.add('card-title');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.style.background = 'white';

    cardHeader.appendChild(tabHeader);

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
    
    const accordionSection = document.createElement('div');
    accordionSection.classList.add('collapse');
    accordionSection.setAttribute('id', `collapse${value["trial_id"]}`);
    accordionSection.setAttribute('data-parent', '.figure-card');
  
    const accordionCardBody = document.createElement('div');
    accordionCardBody.classList.add('card-body');
    
    // Create the first row div
    const firstRowDiv = document.createElement('div');
    firstRowDiv.classList.add('row');

    // Create the first column div inside the first row
    const firstColDiv = document.createElement('div');
    firstColDiv.classList.add('col-md-12');

    // Create the paragraph element with card text
    const paragraph = document.createElement('p');
    paragraph.classList.add('card-text');
    paragraph.textContent = `Hyper parameter selected in this trial is `;

    const boldText = document.createElement('strong');
    boldText.textContent = value['hp_names'];

    // Append the bold text to the paragraph
    paragraph.appendChild(boldText);
    
    const additionalText1 = document.createTextNode(' with a random choice from ');
    
    paragraph.appendChild(additionalText1);

    // Continue with the rest of the paragraph text
    const code_section = document.createElement('code');
    code_section.textContent = 'np.random.choice(all_nodes, p=probabilities)';

    paragraph.appendChild(code_section);

    const additionalText2 = document.createTextNode(' with the given probabilities');
    
    paragraph.appendChild(additionalText2);

    // Append paragraph to the first column div
    firstColDiv.appendChild(paragraph);

    // Append the first column div to the first row
    firstRowDiv.appendChild(firstColDiv);

    // Append the first row to the outer div
    accordionCardBody.appendChild(firstRowDiv);

    // Create the second row div
    const secondRowDiv = document.createElement('div');
    secondRowDiv.classList.add('row');

    // Create the second column div inside the second row
    const secondColDiv = document.createElement('div');
    secondColDiv.classList.add('col-md-12');

        // Create a table element
    const table = document.createElement('table');
    table.classList.add('table'); // Add Bootstrap class for styling, if using Bootstrap

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create and append the 'Key' header
    const keyHeader = document.createElement('th');
    keyHeader.textContent = 'Node';
    headerRow.appendChild(keyHeader);

    // Create and append the 'Value' header
    const valueHeader = document.createElement('th');
    valueHeader.textContent = 'Probability';
    headerRow.appendChild(valueHeader);

    // Append the header row to the table header
    thead.appendChild(headerRow);

    // Append the table header to the table
    table.appendChild(thead);

    // Create table body and append rows
    const tbody = document.createElement('tbody');

    var probabilities = value['probabilities']
    // Iterate over the object to create rows
    for (const [key, value] of Object.entries(probabilities)) {
        // Create a table row
        const row = document.createElement('tr');

        // Create a cell for the key
        const keyCell = document.createElement('td');
        keyCell.textContent = key;

        // Create a cell for the value
        const valueCell = document.createElement('td');
        valueCell.textContent = value;

        // Append cells to the row
        row.appendChild(keyCell);
        row.appendChild(valueCell);

        // Append row to the table body
        tbody.appendChild(row);
    }

    // Append the table body to the table
    table.appendChild(tbody);

    // Append the table to the secondColDiv
    secondColDiv.appendChild(table);

    // Append the second column div to the second row
    secondRowDiv.appendChild(secondColDiv);

    // Append the second row to the outer div
    accordionCardBody.appendChild(secondRowDiv);

  
    accordionSection.appendChild(accordionCardBody);
  
    const accordionButton = document.createElement('button');
    accordionButton.classList.add('btn', 'btn-link');
    accordionButton.setAttribute('data-toggle', 'collapse');
    accordionButton.setAttribute('data-target', `#collapse${value["trial_id"]}`);
    accordionButton.setAttribute('aria-expanded', 'true');
    accordionButton.setAttribute('aria-controls', `collapse${value["trial_id"]}`);
    accordionButton.textContent = 'Details';
  
    cardBody.appendChild(accordionButton);
    cardBody.appendChild(accordionSection);
  
    
    cardContent.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    

    return card;

};

function createAndUpdateTunerGreedy(data){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsGreedy(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const figureCard = createFigureCardWithAccordionGreedy(value);
        casualnexContainer.appendChild(figureCard);
    })
};

function updateTime(id) {
    const lastUpdatedElement = document.getElementById(id);
    const currentTime = new Date();

    let hours = currentTime.getHours(); // get current hours
    let minutes = currentTime.getMinutes(); // get current minutes
    let seconds = currentTime.getSeconds(); // get current seconds

    // Format the time to ensure two digits for hours, minutes, and seconds
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    lastUpdatedElement.textContent = 'Last updated at ' + hours + ':' + minutes + ':' + seconds;
};


socket.on('connect', () => {
    console.log("WebSocket connected");
});

socket.on('evaluation', (data) => {
    console.log(data);
    createEvaluationElements(data)
});

socket.on('initial', (data) => {
    if ("end_time" in data){
        update_training_ui_end(data)
    }
    else{
        project_name = data["project_name"];
        train_file_path = data["x"];
        target_name = data["y"];
        console.log(data);
        update_training_ui_start(data);
        // start_get_request()
    }
    
});

socket.on('update', (data) => {
    console.log(data)
    if (data.hasOwnProperty("data")) {
        const final_arch = data["data"]["filepath"];

        if (final_arch.includes("test_model")) {
            const finalArchImageUrl = `/get_final_image/final_model`;
            const tValue = 'test_model';
            if (!(tValue in models)) {
                const $imageElementPreProcess = $('<p>', {
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></br><p class="card-text"><small class="text-muted" id="lastUpdated1">Last updated 3 mins ago</small></p>`,
                });
                $('#final-arch-card').append($imageElementPreProcess);

                models[tValue] = finalArchImageUrl
                updateTime('lastUpdated1');

            }
        }
        else if (final_arch.includes("preprocessing_model")) {
            const finalArchImageUrl = `/get_final_image/preprocessing_model`;
            const tValue = 'preprocessing_model'
            if (!(tValue in models)) {
                // call element here to add
                const $imageElementPreProcess = $('<p>', {
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></br><p class="card-text"><small class="text-muted" id="lastUpdated2">Last updated 3 mins ago</small></p>`,
                });
                $('#preprocessing-arch-card').append($imageElementPreProcess);

                models[tValue] = finalArchImageUrl;
                updateTime('lastUpdated2');
            }
        }
        else if (final_arch.includes("dense_model")) {
            const finalArchImageUrl = `/get_final_image/dense_model`;
            const tValue = 'dense_model'
            if (!(tValue in models)) {
                // call element here to add
                const $imageElementDense = $('<p>', {
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"><p class="card-text"><small class="text-muted" id="lastUpdated3">Last updated 3 mins ago</small></p>`,
                });
                $('#dense-arch-card').append($imageElementDense);
                models[tValue] = finalArchImageUrl;
                updateTime('lastUpdated3');
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
            bestValues = updateBestValues(bestValues, newValues);
        };

        const imageUrl = `/get_image/${encodeURIComponent(trialValue)}/model`;
        
            // createAndAppendTabPaneCarousel(trialValue, imageUrl, '#arch-carousel', data["values"], data["metrics"]);
        addTrialToTable(trialValue, imageUrl, data["values"], data["metrics"])
        

    }
});



document.addEventListener("DOMContentLoaded", function () {
   
    const explorePreprocessingbutton = document.getElementById("explore-preprocessing");
    const exploreTunerButton = document.getElementById('explore-tuner');
    const closeAppButton = document.getElementById('disconnect-button');
    const igGraphButton = document.getElementById('ig-graph-button');
    const aleGraphButton = document.getElementById('ale-graph-button');
    // const testAPI = document.getElementById('test-api');
    
    closeAppButton.addEventListener('click', () => {
        window.location.href = '/close_app'; // Send a request to the server to close the Flask app
    });

    document.body.addEventListener('click', async function(event) {
        // Check if the clicked element has the desired class
        if (event.target && event.target.classList.contains('tensor-api-class')) {
            const buttonId = event.target.id;
            console.log('Clicked button ID:', buttonId);
            
            const tabId = buttonId.split('-')[1];
            const numberPart = formatNumberPart(buttonId);
            const pathList = createPathList(numberPart);

            const formData1 = new FormData();
            formData1.append('tag', 'epoch_accuracy');
            pathList.forEach(value => formData1.append("runs", value));

            const formData2 = new FormData();
            formData2.append('tag', 'epoch_loss');
            pathList.forEach(value => formData2.append("runs", value));
    
            try {
                const accuracyData = await postData('http://127.0.0.1:8082/proxy/data/plugin/scalars/scalars_multirun', formData1);
                const lossData = await postData('http://127.0.0.1:8082/proxy/data/plugin/scalars/scalars_multirun', formData2);
                console.log(accuracyData);
                console.log(lossData);
                plotGraph(`accuracy-${tabId}`, 'Accuracy Data', accuracyData);
                plotGraph(`loss-${tabId}`, 'Loss Data', lossData);

            } catch (error) {
                console.error('Error during fetch:', error);
            }
        }
    });

    function plotGraph(containerId, title, dataSets) {
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
    
    function formatNumberPart(buttonId) {
        const match = buttonId.match(/\d+$/);
        let numberPart = match ? match[0] : null;
        return numberPart 
    };
    
    function createPathList(numberPart) {
        return [
            numberPart + "\\execution0\\train",
            numberPart + "\\execution0\\validation"
        ];
    };
    
    async function postData(url, formData) {
        const response = await fetch(url, { method: 'POST', body: formData });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };
    
    


    explorePreprocessingbutton.addEventListener("click", function () {
        document.getElementById("explore-preprocessing").setAttribute("disabled", "");
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
        document.getElementById("explore-tuner").setAttribute("disabled", "");
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
                console.log("Tuner Explanation received");
                console.log(data)
                let firstKey = Object.keys(data)[0];
                if(data[firstKey]["tuner"] == "greedy"){
                    createAndUpdateTunerGreedy(data) ;
                }
                else{
                    createAndUpdateTunerBayesian(data);
                }
            });
    });

    igGraphButton.addEventListener("click", function () {

        var num_rows = document.getElementById('igGraphInputField').value;
        if (num_rows.trim() === '') {
            alert('Please enter number of rows next time');
            num_rows = 5
        }
        const explanation_type = 'IG'
        const url = '/load_data/?project_name=' + encodeURIComponent(project_name) + '&train_file_path=' + encodeURIComponent(train_file_path) + '&explanation_type=' + encodeURIComponent(explanation_type) + '&num_rows=' + encodeURIComponent(num_rows) + '&target_name=' + encodeURIComponent(target_name);
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
                return response.json(); 
            })
            .then(data => {
                const chartContainer = document.getElementById("ig-graph");
                var chartData = JSON.parse(data);

                var config = {
                    responsive: true,
                    displayModeBar: false, // Ensure the mode bar is displayed
                    modeBarButtonsToRemove: ['zoom2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
                };
                
                Plotly.newPlot(chartContainer, chartData, config);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    });

    aleGraphButton.addEventListener("click", function () {
        const explanation_type = 'ALE'
        const url = '/load_data/?project_name=' + encodeURIComponent(project_name) + '&train_file_path=' + encodeURIComponent(train_file_path) + '&explanation_type=' + encodeURIComponent(explanation_type) + '&target_name=' + encodeURIComponent(target_name);
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
                return response.json(); 
            })
            .then(data => {
                const chartContainer = document.getElementById("ale-graph");
                var chartData = JSON.parse(data);
                Plotly.newPlot(chartContainer, chartData, { responsive: true });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

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
        const homeSection = document.getElementById('nhome-sectio');
    
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

document.addEventListener('DOMContentLoaded', function() {
    // Function to filter the table
    function filterTable(event) {
        const filter = event.target.value.toUpperCase();
        const rows = document.querySelector("#myTable tbody").rows;
        
        for (const row of rows) {
            let text = row.textContent.toUpperCase();
            row.style.display = text.indexOf(filter) > -1 ? "" : "none";
        }
    }
    document.querySelector('#searchInput').addEventListener('keyup', filterTable, false);



    var dropdown = document.getElementsByClassName("dropdown-btn");
    for (var i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            // Toggle between adding and removing the "show" class to dropdown content
            this.nextElementSibling.classList.toggle("show");
        });
    }


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

    // Data for the plot
    createExamplePlotIG('igexample');
    createExamplePlotALE('aleexample');

});

function createExamplePlotIG(id){
    const divElement = document.getElementById(id);
    const features = ["Credit Score", "Income", "Loan Amount", "Employment Years"];
    const contributions = [0.35, 0.15, -0.25, 0.10];

    // Creating the trace
    const trace = {
    type: 'bar',
    x: contributions,
    y: features,
    orientation: 'h'
    };

    // Layout configuration
    const layout = {
    title: "Integrated Gradients: Loan Approval Model",
    xaxis: { title: "Attribution Score" },
    yaxis: { title: "Features" },
    bargap: 0.5
    };

    // Creating the plot
    Plotly.newPlot(divElement, [trace], layout);
};

function createExamplePlotALE(id){
    const divElement = document.getElementById(id);
    // Updated data for the plot (hypothetical)
    const houseSize = [1000, 1500, 2000, 2500, 3000]; // Size in square feet
    const houseSizeEffect = [100000, 200000, 300000, 400000, 500000]; // Corresponding average effect on price
    
    const numberOfBedrooms = [1, 2, 3, 4, 5]; // Number of bedrooms
    const bedroomEffect = [300000, 305000, 310000, 305000, 300000]; // Corresponding average effect on price
    
    // Creating the traces
    const sizeTrace = {
      x: houseSize,
      y: houseSizeEffect,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Size of House',
      line: { color: 'blue' }
    };

    // Layout configuration
    const layout = {
      title: 'ALE Plot: House Pricing Model',
      xaxis: { title: 'Feature Values' },
      yaxis: { title: 'Average Local Effect on Price' },
      showlegend: true
    };
    
    Plotly.newPlot(divElement, [sizeTrace], layout);

};



