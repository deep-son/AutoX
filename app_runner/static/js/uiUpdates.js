export function update_training_ui_start(data) {
    $('#training-task').text(data['task'])
    $('#training-start-time').text(data['start_time']);
    // $('#training-end-time').find('span').text(endTime);
    $('#training-max-trial').text(data['max_trials']);
};
export function update_training_ui_end(data) {
    $('#training-end-time').text(data['end_time']);
    document.getElementById("explore-preprocessing").removeAttribute("disabled");
    document.getElementById("explore-tuner").removeAttribute("disabled");

};

export function updateTime(id) {
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