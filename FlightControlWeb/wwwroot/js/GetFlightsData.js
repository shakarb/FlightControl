PostData();
let iconFlightsDict = {};

let markerIdDict = {};

let myFlightsTable = document.getElementById('myFlightsTable');

let clickedFlightInfo = document.getElementById('myFlightsTable');

let clickedMarker;

let isMarkerClicked;

//

/*
var greenIcon = new L.icon({
    iconUrl: 'airplane.jpg',
    iconSize: [38, 95] // size of the icon

});
*/
GetData();


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

function onClick(e) {
    console.log(markerIdDict[this]);
    console.log(markerIdDict[e]);
}

// Draws the icon for every flight.
function DrawIcons(data) {

    var flightsID = [];

    for (let i = 0; i < data.length; i++) {
        let lon = data[i]["longitude"];
        let lat = data[i]["latitude"];
        //console.log(lon + " , " + lat);
        // If the flight exists already then just update it's marker, else - create new one.
        if (data[i]["flight_id"] in iconFlightsDict) {
            iconFlightsDict[data[i]["flight_id"]].setLatLng([lat, lon]);
        } else {
            //let marker = L.marker([31.771959, 35.217018], { icon: mapIcon } );
            let marker = L.marker([lat, lon]);
            //marker.bindPopup('hi');
            marker.addTo(mymap).on('click', onClick);;
            console.log("adding flight");
            iconFlightsDict[data[i]["flight_id"]] = marker;
            markerIdDict[marker] = data[i]["flight_id"];
        }
        flightsID.push(data[i]["flight_id"]);
        //console.log(data[i]["flight_id"]);
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

}

/*
setInterval(function () {
    GetFlightsData();
}, 250);*/
// Gets the flights data from the server 4 times per a second.
/*
function GetFlightsData(data) {

    let req = new XMLHttpRequest();
    let date = new Date().toISOString()
    let url = "https://localhost:44355/index.html/api/Flights?relative_to=" + date;
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let FlightData = JSON.parse(this.responseText);
            DrawIcon(FlightData);
        }
    };
    req.open('GET', url, true);
    req.send();
}*/



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
            "date_time": "2020-05-20T20:50:00Z"
        },
        "segments": [
            {
                "longitude": 35,
                "latitude": 20.9,
                "timespan_seconds": 600.0
            }, 
            {
                "longitude": 35.5,
                "latitude": 20.9,
                "timespan_seconds": 600.0
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
            "date_time": "2020-05-20T20:50:21Z"
        },
        "segments": [
            {
                "longitude": 35.5,
                "latitude": 20.7,
                "timespan_seconds": 60.0
            },
            {
                "longitude": 35.5,
                "latitude": 21,
                "timespan_seconds": 60.0
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
            "longitude": 35.5,
            "latitude": 21,
            "date_time": "2020-05-20T20:50:21Z"
        },
        "segments": [
            {
                "longitude": 35.5,
                "latitude": 21,
                "timespan_seconds": 100.0
            },
            {
                "longitude": 35.5,
                "latitude": 20.5,
                "timespan_seconds": 100.0
            }
        ]
    };
    req3.send(JSON.stringify(jsonObject));
}