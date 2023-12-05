export function createAndUpdatePreprocessing(data, callback){
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

export function createDynamicTabsGreedy(targetElement) {
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
                                <h4 class="info-title " style="color: #32325d; margin-top: 10px ;">Greedy Tuner
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
                                                of leaves of a node</li>
                                            <li>More the nodes, lesser the chance of getting selected</li>
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
                                            8 <span style="color: #f96332;; font-size: large;">
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

export function createDynamicTabsBayesian(targetElement) {
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

export function createAccordionBayesian(accordionId, data) {
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

export function createAndUpdateTunerBayesian(data){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsBayesian(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const accordionDiv = createAccordionBayesian(key, value);
        casualnexContainer.appendChild(accordionDiv);
    })
};

export function createFigureCardWithAccordionGreedy(value) {
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

    // Continue with the rest of the paragraph text
    const additionalText = document.createTextNode(' as it has the highest probability; null values represnt the parent of the hyperparameter from the Trie');
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

export function createAndUpdateTunerGreedy(data){
    const casualnexContainer = document.getElementById('tuner-explanation-div');
    createDynamicTabsGreedy(casualnexContainer);
    Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value)
        const figureCard = createFigureCardWithAccordionGreedy(value);
        casualnexContainer.appendChild(figureCard);
    })
};
