let iconFlightsDict = {};
let writtenFlights = [];
let latlngs = [];
let polylines;
let clickedMarker;
let isMarkerClicked;
let clickedMarkerId;
let clickedMarkerLine;


// Define alert msg
// eslint-disable-next-line no-undef
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

// Define my flights map icon
// eslint-disable-next-line no-undef
let flightIcon = L.icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/000000/airport.png',
    iconSize: [35, 35],
})

// Define clicked flights map icon
// eslint-disable-next-line no-undef
let clickedFlightIcon = L.icon({
    iconUrl: 'https://img.icons8.com/dusk/64/000000/airport.png',
    iconSize: [38, 38],
})

// Initial the map
// eslint-disable-next-line no-undef
let mymap = L.map('mapid').setView([32, 35], 8);
// eslint-disable-next-line no-undef
L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=hobXqF8UYeIDF2PiEdyE', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 12,
    minZoom: 1,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
// Define map click event handler
mymap.on('click', onMapClick);

setInterval(function () {
    getData();
}, 1250);

// Gets data from the server 4 times in a second and pass it's value.
function getData() {
    try {
        getFlightsData().then(value => sendData(value));
    } catch (error) {
        console.log(error);
        // eslint-disable-next-line no-undef
        toastr["error"]("Error on getting flights from server , please refresh and try again, or check if the server is running")
    }
}

// Gets the flights data from the server asynchronously.
async function getFlightsData() {
    let date = new Date().toISOString()
    let url = "/api/Flights?relative_to=" + date + "&sync_all";
    //let url = "https://localhost:44355/index.html/api/Flights?relative_to=" + date + "&sync_all";
    let resp = await fetch(url);
    let FlightData = await resp.json();
    return FlightData;
}

// Send the data to specific functions.
function sendData(data) {
    drawIcons(data);
    displayFlights(data);
}

// Function to remove clicked mark 
function removeMarker(marker) {
    if (marker != undefined && marker != null) {
        mymap.removeLayer(marker);
    }
}
// Function to remove clicked mark route lines
function deleteLinesFromMap() {
    if (polylines != undefined && polylines != null) {
        mymap.removeLayer(polylines);
    }
}
// Function to remove clicked mark table light light up.
function removeMarkerLine() {
    if (clickedMarkerLine != undefined && clickedMarkerLine != null) {
        clickedMarkerLine.style.backgroundColor = "aliceblue";
    }
}
// Function to empty info table
function resetInfoTable() {

    let table = document.getElementById("clickedFlight");

    table.innerHTML = " ";
}

// Map click event handler
function onMapClick() {
    if (isMarkerClicked) {
        clickedMarker.setIcon(flightIcon);
        deleteLinesFromMap();
        removeMarkerLine();
        resetInfoTable();

        isMarkerClicked = false;
        clickedMarker = null;
        clickedMarkerId = null;
        clickedMarkerLine = null;
    }
}

// Mark the right line in the table
function markTableLine(id) {
    if (clickedMarkerLine != undefined && clickedMarkerLine != null) {
        removeMarkerLine();
    }
    // Getting new flight table element
    clickedMarkerLine = document.getElementById(id);
    if (clickedMarkerLine != undefined && clickedMarkerLine != null) {
        clickedMarkerLine.style.backgroundColor = "rgb(204, 217, 255)";
    }

}

// This function fill the clicked flight info table
function fillFlightInfoTable(data) {

    let segArray = data["segments"];
    let lastSeg = segArray[segArray.length - 1];
    // Getting data from the data jdon object
    let flightId = clickedMarkerId;
    let airLine = data["company_name"];
    let dateTime = data["initial_location"]["date_time"];
    let startingLat = data["initial_location"]["latitude"];
    let startingLong = data["initial_location"]["longitude"];
    let endLat = lastSeg["latitude"];
    let endLong = lastSeg["longitude"];
    let passengers = data["passengers"];
    // Initial inner table elements
    let s = "<th style =\"font-size : x-small\">" + flightId + "</th>" +
        "<th style =\"font-size : x-small\">" + airLine + "</th>" +
        "<th style =\"font-size : x-small\">" + startingLat.toFixed(2) + "," + startingLong.toFixed(2) + "</th>" +
        "<th style =\"font-size : x-small\">" + endLat.toFixed(2) + "," + endLong.toFixed(2) + "</th>" +
        "<th style =\"font-size : x-small\">" + passengers + "</th>" +
        "<th style =\"font-size : x-small\">" + new Date(dateTime).toUTCString() + "</th>";

    let table = document.getElementById("clickedFlight");

    let newItem = document.createElement('tr');
    newItem.innerHTML = s;
    table.innerHTML = " ";
    table.append(newItem);
}



// This function draw that clicked flight marker route
function drawFlightLines(data) {
    // Remove all lines
    if (latlngs.length > 0 && polylines != undefined) {
        deleteLinesFromMap()
    }
    // Free old data
    while (latlngs.length > 0) {
        latlngs.pop();
    }
    let segArray = data["segments"];
    // Pushing initial location point
    latlngs.push([data["initial_location"]["latitude"], data["initial_location"]["longitude"]]);
    // Pushing segments points
    for (let i = 0; i < segArray.length; i++) {
        latlngs.push([segArray[i]["latitude"], segArray[i]["longitude"]]);
    }

    // eslint-disable-next-line no-undef
    polylines = L.polyline(latlngs, { color: 'lightgrey' }).addTo(mymap);
}

// This function Handle the click on idon event
function initialClickedEvent(data, id, marker) {
    let prevClickedMarker = clickedMarker;
    isMarkerClicked = true;
    clickedMarker = marker;
    // If this marker last clicked , no need to initial again.
    if (id == clickedMarkerId) {
        return;
    } else {
        if (prevClickedMarker != undefined) {
            prevClickedMarker.setIcon(flightIcon);
        }
        clickedMarkerId = id;
        clickedMarker.setIcon(clickedFlightIcon);
        markTableLine(id);
        fillFlightInfoTable(data);
        drawFlightLines(data);
    }
}


function getFlightPlan(id, marker) {
    try {
        getSingleFlightData(id).then(value => initialClickedEvent(value, id, marker));
    } catch (error) {
        console.log(error);
        // eslint-disable-next-line no-undef
        toastr["error"]("Error on clicking icon event , please refresh and try again")
    }
}

// Gets the flight data from the server asynchronously.
async function getSingleFlightData(id) {
    let url = "/api/FlightPlan/" + id;
    let resp = await fetch(url);
    let FlightData = await resp.json();
    return FlightData;
}

// Draws the icon for every flight.
function drawIcons(data) {
    let flightsID = [];

    for (let i = 0; i < data.length; i++) {
        // Getting marker point data
        let lon = data[i]["longitude"];
        let lat = data[i]["latitude"];
        // If the flight exists already then just update it's marker, else - create new one.
        if (data[i]["flight_id"] in iconFlightsDict) {
            iconFlightsDict[data[i]["flight_id"]].setLatLng([lat, lon]);
        } else {

            // eslint-disable-next-line no-undef
            let marker = L.marker([lat, lon], { icon: flightIcon });

            let id = data[i]["flight_id"];

            // Mark click event handler anonymouse function
            marker.on('click', function () {
                // This function handle the click mark event logic.
                getFlightPlan(id, marker);
            });

            // Add marker to map
            marker.addTo(mymap);
            
            iconFlightsDict[data[i]["flight_id"]] = marker;
        }
        flightsID.push(data[i]["flight_id"]);
    }

    // Iterate over our flights markers
    for (let id in iconFlightsDict) {
        // If flight no in new flights data need to remove her
        if (!flightsID.includes(id)) {
            removeMarker(iconFlightsDict[id]);
        }
    }
    if (!flightsID.includes(clickedMarkerId)) {
        resetClickedFinishedFlight();
    }
}

function resetClickedFinishedFlight() {
    deleteLinesFromMap();
    resetInfoTable()
}

// Display the flights in the corresponding tables.
function displayFlights(data) {
    // CuurentFlights will contain all the flight's ids that in data.
    let currentFlights = [];
    for (let i = 0; i < data.length; i++) {
        currentFlights.push(data[i]["flight_id"]);
    }
    // Remove all the flights which finished to fly.
    for (let id of writtenFlights) {
        if (!(currentFlights.includes(id))) {
            // Remove from table.
            let flightId = document.getElementById(id);
            flightId.remove();
            // Remove from list.
            const index = writtenFlights.indexOf(id);
            writtenFlights.splice(index, 1);
        }
    }
    for (let i = 0; i < data.length; i++) {
        let id = data[i]["flight_id"];
        // If the flight id is written already - we dont do anything.
        if (!(writtenFlights.includes(id)) && data[i]["is_external"] === false) {
            writtenFlights.push(id);
            let airLine = data[i]["company_name"];
            let arrivalTime = data[i]["date_time"];
            let date = new Date(arrivalTime);
            let table = document.getElementById("myFlightsTable").getElementsByTagName('tbody')[0];
            let row = table.insertRow();
            row.id = id;
            row.addEventListener("click", function () {
                // The clicked merker sets to be the row's corresponding marker.
                getFlightPlan(id, iconFlightsDict[row.id]);
            });
            // Insert cells to the row in the table.
            let cell1 = row.insertCell(0);
            cell1.innerHTML = id;
            let cell2 = row.insertCell(1);
            cell2.innerHTML = date.toUTCString();
            let cell3 = row.insertCell(2);
            cell3.innerHTML = airLine;
            cell1.style = cell2.style = cell3.style = "font-size : x-small";
            let cell4 = row.insertCell(3);
            // the x button:
            let x = document.createElement("input");
            x.setAttribute("type", "image");
            x.setAttribute("src", "images/Red_X.png");
            x.setAttribute("width", 12);
            x.setAttribute("height", 12);
            x.addEventListener("click", function (e) {
                chooseAction(id);
                e.stopPropagation();
            });
            cell4.appendChild(x);
        } else if (!(writtenFlights.includes(id)) && data[i]["is_external"] === true) {
            writtenFlights.push(id);
            let airLine = data[i]["company_name"];
            let arrivalTime = data[i]["date_time"];
            let date = new Date(arrivalTime);
            let table = document.getElementById("externalFlightsTable").getElementsByTagName('tbody')[0];
            let row = table.insertRow();
            row.id = id;
            row.addEventListener("click", function () {
                // The clicked merker sets to be the row's corresponding marker.
                getFlightPlan(id, iconFlightsDict[row.id]);
            });
            let cell1 = row.insertCell(0);
            cell1.innerHTML = id;
            let cell2 = row.insertCell(1);
            cell2.innerHTML = date.toUTCString();
            let cell3 = row.insertCell(2);
            cell3.innerHTML = airLine;
            cell1.style = cell2.style = cell3.style = "font-size : x-small";
        }
    }
}

function chooseAction(id) {
    if (isMarkerClicked && clickedMarkerId == id) {
        onMapClick();
    } else {
        eraseFlight(id);
    }
}

function eraseFlight(id) {
    fetch('/api/Flights/' + id, {
        method: 'DELETE',
    })
        .then(res => console.log(res))
}
