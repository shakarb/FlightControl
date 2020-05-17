function getFlightsData() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://learnwebcode.github.io/json-example/animals-' + pageCounter + '.json');
    ourRequest.onload = function () {

        if (ourRequest.status >= 200 && ourRequest.status < 400) {
            var ourData = JSON.parse(ourRequest.responseText);
            renderFlights(ourData)
        } else {
            console.log("server returned an error")
        }
    };
    ourRequest.onerror = function () {
        console.log("connection error")
    };
    ourRequest.send();
    pageCounter++;
    if (pageCounter > 3) {
        btn.style.display = "none";
    }
}

//here we get data from server 4 times a second
setInterval(function () {
    getFlightsData();
}, 250);
//Here we undate our flights lists
function renderFlights(data) {
    var htmlString = "";

    for (i = 0; i < data.length; i++) {
        htmlString += "<p>" + data[i].name + " is a "
            + data[i].species + " thats like to eat ";

        for (ii = 0; ii < data[i].foods.likes.length; ii++) {
            if (ii == 0) {
                htmlString += data[i].foods.likes[ii];
            } else {
                htmlString += " and " + data[i].foods.likes[ii];
            }
        }

        htmlString += " and dislike "
        for (ii = 0; ii < data[i].foods.dislikes.length; ii++) {
            if (ii == 0) {
                htmlString += data[i].foods.dislikes[ii];
            } else {
                htmlString += " and " + data[i].foods.dislikes[ii];
            }
        }
        htmlString += ".</p>";
    }
    animalContainer.insertAdjacentHTML('beforeend', htmlString);
}