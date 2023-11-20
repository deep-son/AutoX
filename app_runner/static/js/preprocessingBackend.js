
document.addEventListener("DOMContentLoaded", function () {

    const explorePreprocessingbutton = document.getElementById("explore-preprocessing");
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
});