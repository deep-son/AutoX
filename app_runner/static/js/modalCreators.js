export function createArchModal(tabId, imageUrl){
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

export function createHyperModal(tabId, values){
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

export function createMetricModal(tabId, metrics){
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

export  function createGraphModal(tabId){

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