PostData();
let iconFlightsDict = {};
let writtenFlights = [];
let latlngs = [];
let polylines;
let clickedMarker;
let isMarkerClicked;
let clickedMarkerId;
let clickedMarkerLine;

// Initial the map
var mymap = L.map('mapid').setView([32, 35], 8);

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


let myIconReplc = L.Icon.extend({
    options: {
        iconUrl: "plan.png",
    iconSize: [38, 95] // size of the icon
    }
});

GetData();

//our map icon definition



setInterval(function () {
    GetData();
}, 250);
// Gets data from the server 4 times in a second and pass it's value.
function GetData() {
    try {
        GetFlightsData().then(value => SendData(value));
    } catch (error) {
        console.log(error);
    }
}

// Gets the flights data from the server asynchronously.
async function GetFlightsData() {
    let date = new Date().toISOString()
    let url = "/api/Flights?relative_to=" + date;
    //let url = "https://localhost:44355/index.html/api/Flights?relative_to=" + date;
    let resp = await fetch(url);
    let FlightData = await resp.json();
    return FlightData;
}

// Send the data to specific functions.
function SendData(data) {
    DrawIcons(data);
    DisplayFlights(data);

}


// Function to remove clicked mark 
function removeMarker(marker) {
    mymap.removeLayer(marker);
}
// Function to remove clicked mark route lines
function deleteLinesFromMap() {
    mymap.removeLayer(polylines); 
}
// Function to remove clicked mark table light light up.
function removeMarkerLine() {
    clickedMarkerLine.style.backgroundColor = "lightblue";
}
// Function to empty info table
function resetInfoTable() {

    let table = document.getElementById("clickedFlight");

    table.innerHTML = " ";
}

// Map click event handler
function onMapClick(e) {
    if (isMarkerClicked) {

        deleteLinesFromMap();
        removeMarkerLine();
        resetInfoTable();

        isMarkerClicked = false;
        clickedMarker = null;
        clickedMarkerId = null;
        clickedMarkerLine = null;
    }

}


//Mark the right line in the table
function markTableLine(id) {
    if (clickedMarkerLine != undefined && clickedMarkerLine != null) {
        removeMarkerLine();
    }
    clickedMarkerLine = document.getElementById(id);
    clickedMarkerLine.style.backgroundColor = "lightgrey";
}

// This function fill the clicked flight info table
function fillFlightInfoTable(data) {

    let segArray = data["segments"];
    let lastSeg = segArray[segArray.length - 1];
    //getting data from the data jdon object
    let flightId = clickedMarkerId;
    let airLine = data["company_name"];
    let dateTime = data["initial_location"]["date_time"];
    let startingLat = data["initial_location"]["latitude"];
    let startingLong = data["initial_location"]["longitude"];
    let endLat = lastSeg["latitude"];
    let endLong = lastSeg["longitude"];
    let passengers = data["passengers"];
    //initial inner table elements
    let s = "<th style =\"font-size : x-small\">" + flightId + "</th>" +
        "<th style =\"font-size : x-small\">" + airLine + "</th>" +
        "<th style =\"font-size : x-small\">" + startingLat.toFixed(2) + "," + startingLong.toFixed(2) + "</th>" +
        "<th style =\"font-size : x-small\">" + endLat.toFixed(2) + "," + endLong.toFixed(2)  + "</th>" +
        "<th style =\"font-size : x-small\">" + passengers + "</th>" + 
        "<th style =\"font-size : x-small\">" + dateTime + "</th>";

    let table = document.getElementById("clickedFlight");
    
    let newItem = document.createElement('tr');
    //newItem.id = id;
    newItem.innerHTML = s;
    table.innerHTML = " ";
    table.append(newItem);}



// This function draw that clicked flight marker route
function drawFlightLines(data) {
    // Remove all lines
    if (latlngs.length > 0 && polylines != undefined) {
        deleteLinesFromMap()
    }
    //free old data
    while (latlngs.length > 0) {
        latlngs.pop();
    }
    let segArray = data["segments"];
    //pushing initial location point
    latlngs.push([data["initial_location"]["latitude"], data["initial_location"]["longitude"]]);
    //pushing segments points
    for (let i = 0; i < segArray.length; i++) {
        latlngs.push([segArray[i]["latitude"],segArray[i]["longitude"]]);
    }

    polylines = L.polyline(latlngs, { color: 'red' }).addTo(mymap);
}


function initialClickedEvent(data, id) {
    //if this marker last clicked , not need to initial again.
    if (id == clickedMarkerId) {
        return;
    } else {
        clickedMarkerId = id;
        markTableLine(id);
        fillFlightInfoTable(data);
        drawFlightLines(data);
    }
}


function getFlightPlan(id) {
    try {
        GetSingleFlightData(id).then(value => initialClickedEvent(value,id));
    } catch (error) {
        console.log(error);
    }
}

// Gets the flights data from the server asynchronously.
async function GetSingleFlightData(id) {
    let url = "/api/FlightPlan/" + id;
    let resp = await fetch(url);
    let FlightData = await resp.json();
    return FlightData;
}

// Draws the icon for every flight.
function DrawIcons(data) {
     var flightsID = [];

    for (let i = 0; i < data.length; i++) {
        //getting marker point dara
        let lon = data[i]["longitude"];
        let lat = data[i]["latitude"];
        // If the flight exists already then just update it's marker, else - create new one.
        if (data[i]["flight_id"] in iconFlightsDict) {
            iconFlightsDict[data[i]["flight_id"]].setLatLng([lat, lon]);
        } else {
            //let marker = L.marker([31.771959, 35.217018], { icon: mapIcon } );
            let marker = new L.marker([lat, lon])
            
            /*
             * mark click event handler anonymouse function
             */ 
            marker.on('click', function () {
                var id = data[i]["flight_id"];
                //console.log(id);
                isMarkerClicked = true;
                clickedMarker = marker;
                //this function handle the click mark event logic.
                getFlightPlan(id);
            });
            //add marker to map
            marker.addTo(mymap);
            iconFlightsDict[data[i]["flight_id"]] = marker;
        }
        flightsID.push(data[i]["flight_id"]);
        //console.log(data[i]["flight_id"]);
    }

    if (isMarkerClicked == true) {
        //here need to update clicked marker lines
    }
     ////iterate over our flights markers
    for (var flight in iconFlightsDict) {
        //if flight no in new flights data need to remove her
        if (!flightsID.includes(flight)) {
            //console.log(flightsID.length);
            mymap.removeLayer(iconFlightsDict[flight]);
        }
    }
}

// Display the flights in the corresponding tables.
function DisplayFlights(data) {
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
        if (!(writtenFlights.includes(id))) {
            writtenFlights.push(id);
            let airLine = data[i]["company_name"];
            let arrivalTime = data[i]["date_time"];

            let s = "<th style =\"font-size : x-small\">" + id + "</th>" +
                "<th style =\"font-size : x-small\">" + arrivalTime + "</th>" +
                "<th style =\"font-size : x-small\">" + airLine + "</th>";
            let table;
            if (data[i]["is_external"] === false) {
                table = document.getElementById("myFlightsBody");
                
            } else {
                table = document.getElementById("externalFlightsTable");
            }
            let newItem = document.createElement('tr');
            newItem.id = id;
            newItem.innerHTML = s;
            table.append(newItem);
        }
    }
}


/*
 * PostData is only for testing.
 */
function PostData() {
    let req1 = new XMLHttpRequest();
    //req1.open("POST", "https://localhost:44355/index.html/api/FlightPlan", false);
    req1.open("POST", "/api/FlightPlan", false);
    req1.setRequestHeader("Content-Type", "application/json");
    let jsonObject = {
        "passengers": 150,
        "company_name": "SwissAir",
        "initial_location": {
            "longitude": 35,
            "latitude": 20.9,
            "date_time": "2020-05-22T18:52:00Z"
        },
        "segments": [
            {
                "longitude": 39,
                "latitude": 25,
                "timespan_seconds": 20.0
            }, 
            {
                "longitude": 43,
                "latitude": 27.8,
                "timespan_seconds": 10.0
            }
        ]
    };
    req1.send(JSON.stringify(jsonObject));

    let req2 = new XMLHttpRequest();
    //req2.open("POST", "https://localhost:44355/index.html/api/FlightPlan", false);
    req2.open("POST", "/api/FlightPlan", false);
    req2.setRequestHeader("Content-Type", "application/json");
    jsonObject = {
        "passengers": 150,
        "company_name": "SwissAir",
        "initial_location": {
            "longitude": 35.5,
            "latitude": 20.7,
            "date_time": "2020-05-22T18:52:20Z"
        },
        "segments": [
            {
                "longitude": 37.5,
                "latitude": 31.7,
                "timespan_seconds": 20.0
            },
            {
                "longitude": 38.5,
                "latitude": 33,
                "timespan_seconds": 10.0
            }
        ]
    };
    req2.send(JSON.stringify(jsonObject));

    let req3 = new XMLHttpRequest();
    //req3.open("POST", "https://localhost:44355/index.html/api/FlightPlan", false);
    req3.open("POST", "/api/FlightPlan", false);
    req3.setRequestHeader("Content-Type", "application/json");
    jsonObject = {
        "passengers": 150,
        "company_name": "SwissAir",
        "initial_location": {
            "longitude": 35.0,
            "latitude": 32.0,
            "date_time": "2020-05-22T18:52:00Z"
        },
        "segments": [
            {
                "longitude": 35,
                "latitude": 34,
                "timespan_seconds": 6.0
            },
            {
                "longitude": 36,
                "latitude": 34.6,
                "timespan_seconds": 7.0
            }
        ]
    };
    req3.send(JSON.stringify(jsonObject));
}