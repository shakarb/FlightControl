PostData();
let iconFlightsDict = {};
let writtenFlights = [];
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

// Draws the icon for every flight.
function DrawIcons(data) {
    for (let i = 0; i < data.length; i++) {
        let lon = data[i]["longitude"];
        let lat = data[i]["latitude"];
        // If the flight exists already then just update it's marker, else - create new one.
        if (data[i]["flight_id"] in iconFlightsDict) {
            iconFlightsDict[data[i]["flight_id"]].setLatLng([lat, lon]);
        } else {
            //let marker = L.marker([31.771959, 35.217018], { icon: mapIcon } );
            let marker = L.marker([lat, lon]);
            marker.addTo(mymap);
            iconFlightsDict[data[i]["flight_id"]] = marker;
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