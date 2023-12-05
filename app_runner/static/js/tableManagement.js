export function createTable(data) {
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

export function createTableFromObject(data) {
    const table = $('<table>').addClass('table');

    Object.keys(data).forEach((key) => {
        const row = $('<tr>');
        row.append($('<td>').text(key));
        row.append($('<td>').text(data[key]));

        table.append(row);
    });

    return table;
}

export function addTrialToTable(tabId, imageUrl, values, metrics){
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

export function updateBestValuesDisplay(Values) {
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

export function updateBestValues(bestValues, newValues) {
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