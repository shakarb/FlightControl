

(function () {
    "use strict";
    var dropZone = document.getElementById('dropzone');

    //drag over drop zone handler
    dropZone.ondragover = function() {
        this.className = 'dropzone-dragover';
        return false; 
    }
    
    //drag leave case handler
    dropZone.ondragleave = function() {
        this.className = 'dropzone';
        return false; 
    }

    function handleFiles(files) {
        ([...files]).forEach(upload)
    }

    const toSend = {
        "passenger": 150,
        "company_name": "SwissAir",
        "initial_location": {
            "longitude": 20.0,
            "latitude": 30.2,
            "date_time": "2020-12-27T01:56:21Z"
        },
        "segments": [
            {
                "longitude": 33.23,
                "latitde": 31.56,
                "timespan_seconds": 850.0
            }
        ]
    };

    //upload to server function
    var upload = function (files) {
        var formData = new FormData(),
            xhr = new XMLHttpRequest(),
            x;
        for(x=0 ; x < files.length ; x= x+1) {
            formData.append('file[]', files[x]);
        }
       
        ////event handler to check if trasfer succeed
        xhr.onload = function() {
            var data = this.responseText;
            console.log(data);
        }
       
        //open our connection
        xhr.open('post', 'api/FlighPlan');
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(formData);
    }
    let test = function (files) {
        let file = files[0];

        let reader = new FileReader();

        reader.readAsText(file);

        console.log(file);
    };

    //on file drop case handler
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'dropzone';
        var data = e.dataTransfer.getData("Text");
        //console.log(e.dataTransfer.files);
        test(e.dataTransfer.files);
    }
}());