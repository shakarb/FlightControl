console.log('Test');


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

    //upload to server function
    var upload = function(files) {
        var formDAta = new FormData(),
            xhr = new XMLHttpRequest(),
            x;

            for(x=0 ; x < files.length ; x= x+1) {
                formDara.append
            }

            //event handler to check if trasfer succeed
            xhr.onload = function() {
                var data = this.responseText;
                console.log(data);
            }

            //open our connection
            xhr.open('post', 'https://localhost:44355/api/FlightPlan');
            xhr.send(ourData);
    }

    //on file drop case handler
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className='dropzone';
        console.log(e.dataTransfer.files);
    }
}());