let uploadButton = document.getElementById('inputFiles');

function sendInputData(jsonData) {
    //out http request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/FlightPlan", true);
    xhr.onload = function () {
        //means we got an error
        if (!(xhr.status >= 200 && xhr.status < 400)) {
            // eslint-disable-next-line no-undef
            toastr["error"]("Status code:" + xhr.status + ". Error occur in the uploaded file, Fix your JSON!. ")
        }
    }
    //define the needed header information
    xhr.setRequestHeader("Content-Type", "application/json");
    //sendig our jason
    xhr.send(jsonData);
}

function readFile(file) {
    //we define a reader to read input file
    let reader = new FileReader();
    //read file as text
    reader.readAsText(file);
    //initial variable to hold out data from reader
    let data;
    //prepare our json data for post
    reader.onload = function () {
        data = reader.result.replace('/r', '');
        // Sending data to the server function
        sendInputData(data);
    };

    //msg if we got an error
    reader.onerror = function () {
        console.log(reader.error);
    };

}



//this function first iterate our files and send them to read file function
uploadButton.onchange = function (event) {
    let files = uploadButton.files;
    let file;

    let x;

    for (x = 0; x < files.length; x = x + 1) {
        file = files[x];
        readFile(file);
    }
    event.target.value = '';
};
