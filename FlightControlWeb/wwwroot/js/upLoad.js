
var uploadButton = document.getElementById('inputFiles');

function sendData(jsonData) {
    //out http request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/FlightPlan", true);
    //define the needed header information
    xhr.setRequestHeader("Content-Type", "application/json");
    //sendig our jason
    xhr.send(jsonData);
};

function readFile(file) {
    console.log('on eadFile');

    //we define a reader to read input file
    let reader = new FileReader();
    //read file as text
    reader.readAsText(file);
    //initial variable to hold out data from reader
    let data;
    //prepare our json data for post
    reader.onload = function () {
        data = reader.result.replace('/r', '');
        console.log(data);
        sendData(data);
    };

    //msg if we got an error
    reader.onerror = function () {
        console.log(reader.error);
    };
    
};



//this function first iterate our files and send them to read file function
uploadButton.onchange = function (event) {
    console.log('on OnChnge');
    let files = uploadButton.files;
    let file;

    var x;

    for (x = 0; x < files.length; x = x + 1) {
        file = files[x];
        readFile(file);
    }
    event.target.value = '';
};

