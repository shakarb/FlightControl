
var uploadButton = document.getElementById('inputFiles');



function readFile(file) {
    //we define a reader to read input file
    let reader = new FileReader();
    //read file as text
    reader.readAsText(file);
    //initial variable to hold out data from reader
    let data;

    reader.onload = function () {
        data = reader.result.replace('/r', '');
        console.log(data);
    };

}



//this function first iterate our files and send them to read file function
uploadButton.onchange =  function() {

    let files = uploadButton.files;
    let file;

    var x;

    for (x = 0; x < files.length; x = x + 1) {
        file = files[x];
        readFile(file);
    }

}

