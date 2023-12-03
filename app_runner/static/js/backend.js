const socket = io.connect('http://127.0.0.1:8082');
var trials = {};
var models = {};
var bestValues = {};
var project_name = "structured_data_classifier"
var train_file_path = "C:\\Users\\Deepanshu\\.keras\\datasets\\train.csv"


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
                    <h5 class="modal-title">Epoch Graphs</h5>
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
        div.textContent = 'Normalization is not used in this model';
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
                const h4_2 = $('<h4>').text('Encoding Details');
                const cardBody2 = $('<div>').addClass('card-body').text('Add another chart here');
                
                cardHeader2.append(h4_2);
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
                    <ul
                        class="nav nav-tabs px-1 py-3  bg-light flex-column flex-lg-row justify-content-md-center text-center">
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
                                    <h4 class="info-title">Your Current Tuner:<p style="color: #f96332;">Bayesian</p>
                                    </h4>
                                    <!-- Greedy Tuner Information Section with Creative Styling -->
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
                                                Note: Bayesian tuner works on the history of previous trial, if the
                                                numer of trials are not enough to fit a probabilistic model, then it
                                                would do a random sampling.
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
                                                        Start Bayesian Trial
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Initializes a Bayesian trial to efficiently explore the
                                                    hyperparameter space based on prior probability models.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Probabilistic Modeling -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Probabilistic Modeling</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    2 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Generate Probabilistic Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Constructs a probabilistic model to predict performance and guide
                                                    the search towards promising hyperparameters.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Optimal Hyperparameter Selection -->
                                        <div class="card">
                                            <div class="card-body text-center">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    3 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Optimal Hyperparameter Selection
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Selects hyperparameters that maximize the acquisition function,
                                                    balancing exploration and exploitation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-lg-4">
                                        <!-- Bayesian Tuner: Model Training and Evaluation -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    4 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Model Training and Evaluation
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Trains models using selected hyperparameters and evaluates their
                                                    performance to update the probabilistic model.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Updating Probabilistic Model -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    5 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Updating Probabilistic Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Updates the probabilistic model with new evaluation results,
                                                    refining predictions for subsequent trials.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Iterative Process -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Iterative Optimization Process</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    6 <span style="color: #007bff; font-size: large;">
                                                        Iterate Until Convergence
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Continuously iterates the selection, training, evaluation, and
                                                    update process until reaching convergence or exhausting the trial
                                                    limit.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                                        <!-- Bayesian Tuner: Final Hyperparameter Selection -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    7 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Final Hyperparameter Selection
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Selects the best hyperparameter configuration based on the highest
                                                    performing trials.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Training Final Model -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Training the Final Model</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    8 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Train Final Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Trains the final model using the best hyperparameter set discovered
                                                    during the Bayesian optimization process.
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
                    <ul
                        class="nav nav-tabs px-1 py-3  bg-light flex-column flex-lg-row justify-content-md-center text-center">
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
                                    <h4 class="info-title">Your Current Tuner:<p style="color: #f96332;">Bayesian</p>
                                    </h4>
                                    <!-- Greedy Tuner Information Section with Creative Styling -->
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
                                                Note: Bayesian tuner works on the history of previous trial, if the
                                                numer of trials are not enough to fit a probabilistic model, then it
                                                would do a random sampling.
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
                                                        Start Bayesian Trial
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Initializes a Bayesian trial to efficiently explore the
                                                    hyperparameter space based on prior probability models.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Probabilistic Modeling -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Probabilistic Modeling</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    2 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Generate Probabilistic Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Constructs a probabilistic model to predict performance and guide
                                                    the search towards promising hyperparameters.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Optimal Hyperparameter Selection -->
                                        <div class="card">
                                            <div class="card-body text-center">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    3 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Optimal Hyperparameter Selection
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Selects hyperparameters that maximize the acquisition function,
                                                    balancing exploration and exploitation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-lg-4">
                                        <!-- Bayesian Tuner: Model Training and Evaluation -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    4 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Model Training and Evaluation
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Trains models using selected hyperparameters and evaluates their
                                                    performance to update the probabilistic model.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Updating Probabilistic Model -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    5 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Updating Probabilistic Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Updates the probabilistic model with new evaluation results,
                                                    refining predictions for subsequent trials.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Iterative Process -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Iterative Optimization Process</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    6 <span style="color: #007bff; font-size: large;">
                                                        Iterate Until Convergence
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Continuously iterates the selection, training, evaluation, and
                                                    update process until reaching convergence or exhausting the trial
                                                    limit.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                                        <!-- Bayesian Tuner: Final Hyperparameter Selection -->
                                        <div class="card">
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    7 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Final Hyperparameter Selection
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Selects the best hyperparameter configuration based on the highest
                                                    performing trials.
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Bayesian Tuner: Training Final Model -->
                                        <div class="card">
                                            <div class="card-header" style="background-color: #007bff; color: white;">
                                                <h5 class="card-title">Training the Final Model</h5>
                                            </div>
                                            <div class="card-body">
                                                <p style="text-align: left;color: #007bff; font-size: x-large;">
                                                    8 <span style="text-align: left;color: #007bff; font-size: large;">
                                                        Train Final Model
                                                    </span>
                                                </p>
                                                <p class="card-description">
                                                    Trains the final model using the best hyperparameter set discovered
                                                    during the Bayesian optimization process.
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
    `;
    // targetElement.appendChild(tabPane);
  };

function createAccordionBayesian(accordionId, data) {
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

function createAndUpdateTunerBayesian(data){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsBayesian(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const accordionDiv = createAccordionBayesian(key, value);
        casualnexContainer.appendChild(accordionDiv);
    })
};

function createFigureCardWithAccordionGreedy(value) {
    const card = document.createElement('div');
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

    // Continue with the rest of the paragraph text
    const additionalText = document.createTextNode(' as it has the highest probability');
paragraph.appendChild(additionalText);

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
        project_name = data["project_name"]
        train_file_path = data["x"]
        update_training_ui_start(data)
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
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></br`,
                });
                $('#final-arch-card').append($imageElementPreProcess);

                models[tValue] = finalArchImageUrl

            }
        }
        else if (final_arch.includes("preprocessing_model")) {
            const finalArchImageUrl = `/get_final_image/preprocessing_model`;
            const tValue = 'preprocessing_model'
            if (!(tValue in models)) {
                // call element here to add
                const $imageElementPreProcess = $('<p>', {
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;"></br`,
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
                    html: `<img class="card-img-top" src="${finalArchImageUrl}" alt="Model Image" style="max-width: 100%; max-height: 100%;">`,
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
            bestValues = updateBestValues(bestValues, newValues);
        };

        const imageUrl = `/get_image/${encodeURIComponent(trialValue)}/model`;
        
            // createAndAppendTabPaneCarousel(trialValue, imageUrl, '#arch-carousel', data["values"], data["metrics"]);
        addTrialToTable(trialValue, imageUrl, data["values"], data["metrics"])
        

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
        const url = '/load_data/?project_name=' + encodeURIComponent(project_name) + '&train_file_path=' + encodeURIComponent(train_file_path) + '&explanation_type=' + encodeURIComponent(explanation_type) + '&num_rows=' + encodeURIComponent(num_rows);
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
        const url = '/load_data/?project_name=' + encodeURIComponent(project_name) + '&train_file_path=' + encodeURIComponent(train_file_path) + '&explanation_type=' + encodeURIComponent(explanation_type);
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



