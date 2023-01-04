// Import the necessary libraries
const express = require('express');
const app = express();

const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const { emit } = require('process');
const { resolve } = require('path');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const stations = [
    { id: 1, name: 'Contact Tower', airplane: null, isOccupied: false, positionX: 450, positionY: 50, timer: null },
    { id: 2, name: 'Approach', airplane: null, isOccupied: false, positionX: 450, positionY: 150, timer: null },
    { id: 3, name: 'Round Out', airplane: null, isOccupied: false, positionX: 450, positionY: 250, timer: null },
    { id: 4, name: 'Runway', airplane: null, isOccupied: false, positionX: 450, positionY: 350, timer: null },
    { id: 5, name: 'Passengers', airplane: null, isOccupied: false, positionX: 450, positionY: 450, timer: null },
    { id: 6, name: 'Luggage', airplane: null, isOccupied: false, positionX: 450, positionY: 550, timer: null },
    { id: 7, name: 'Fuel', airplane: null, isOccupied: false, positionX: 450, positionY: 650, timer: null },
    { id: 8, name: 'Taxiway 1', airplane: null, isOccupied: false, positionX: 450, positionY: 750, timer: null },
    { id: 9, name: 'Taxiway 2', airplane: null, isOccupied: false, positionX: 450, positionY: 850, timer: null },
  ];
  

const airplanes = [
    { id: 1, name: 'Airplane 1', arriving: true, positionX: null, positionY: null, station: 0, startTime: null },
    { id: 2, name: 'Airplane 2', arriving: true, positionX: null, positionY: null, station: 0, startTime: null },
    { id: 3, name: 'Airplane 3', arriving: true, positionX: null, positionY: null, station: 0, startTime: null },
    { id: 4, name: 'Airplane 4', arriving: true, positionX: null, positionY: null, station: 0, startTime: null },
    { id: 5, name: 'Airplane 5', arriving: true, positionX: null, positionY: null, station: 0, startTime: null },
];

const airport = {
    stations,
    airplanes
};

let airplaneIndex = 0;

// Set up an interval to inject airplanes into the first station at regular intervals
// const interval = setInterval(() => {
//     // Check if there are more airplanes to inject
//     if (airplaneIndex >= airplanes.length) {
//       clearInterval(interval);
//       console.log('No more arrivals');
//       return;
//     }
  
//     // Inject the next airplane into the first station
//     const airplane = airplanes[airplaneIndex];
//     airplaneIndex++;
//     stations[0].airplane = { ...airplane, startTime: Date.now() };
//     stations[0].isOccupied = true;
  
//     console.log(`Airplane ID: ${airplane.id}, expected arrival: ${airplane.startTime}`);

//     io.emit('update', {stations });
// }, 60000);


//Function for adding a new plane
function addPlane(){

    if (stations[0].isOccupied){
        let msg = "Station 1 is already occupied. Can't accept another traffic.";
        // io.emit('StationOccupiedAlert', message);
        console.log(msg);
        return;
    }

    if (airplaneIndex >= airplanes.length) {
      console.log('No more arrivals');
      return;
    }

    else {
        const current = new Date();

        const time = current.toLocaleTimeString("en-US", {
        //   hour: "2-digit",
        //   minute: "2-digit",
          hour12: false
        });
    
        const nextAirplane = airplanes.find((a) => a.station === 0);
        nextAirplane.station = 1;
        nextAirplane.startTime = time;
        stations[0].airplane = nextAirplane;
        stations[0].isOccupied = true;
        // airplanes[airplaneIndex] = nextAirplane;
    
        console.log(`${nextAirplane.name} arrived to station ${stations[0].name} on ${nextAirplane.startTime}`)
    }

}


//Function for handling nextstation TODO: add logic
const nextStation = (airplane) => {

    return new Promise((resolve) => {

        let airplaneToMove = airplanes.find((a) => a.id === airplane.id);
        let airplaneToMoveIndex = airplanes.findIndex((a) => a.id === airplane.id);
    
        console.log(`The airplane you are moving from the airplanes array is: ${airplaneToMove.id} - ${airplaneToMove.name} and it's index in the airplanes array is: ${airplaneToMoveIndex}`)
    
        const arrivalStations = [1, 2, 3, 4, 8, 5, 6];
        const departureStations = [7, 8, 4];

        const currentStationId = airplaneToMove.station;
        console.log(`Current Station ID: ${currentStationId}`);
    
        let nextStationId;
        let station = stations.find((station) => station.id === currentStationId);
    
        //find the index inside the stations array of the station where the airplane moved from.
        let fromStation = stations.findIndex((station) => station.id === currentStationId);
        console.log(`First from station Index (in Stations array): ${fromStation}`)
    
        let didMove = false;
    
        // If the airplane is arriving, find the next station in the arrival stations array
        if (airplaneToMove.arriving) {
    
            if (currentStationId === 4){
    
                if (stations[7].isOccupied){
    
                    if (stations[8].isOccupied){
                        console.log("Both taxiways are occupied...")
                        return;
                    }
    
                    else {
                        //call for the event to move a station.
                        airplaneToMove.station = stations[8];
                        didMove = true;
                    }
                }
            }
    
            else if (currentStationId === 6){
                airplaneToMove.station = stations[6];
                didMove = true;
            }
    
            else if (currentStationId === 8){
                airplaneToMove.station = stations[4];
                didMove = true;
            }
    
            else {
                const currentStationIndex = arrivalStations.findIndex((station) => station === currentStationId);
                console.log(`The current station index inside the arrival stations array is: ${currentStationIndex}`);
    
                nextStationId = arrivalStations[currentStationIndex + 1];
                console.log(`The next station ID is: ${nextStationId}`);
                let movedToStation = stations.find((station) => station.id === nextStationId);
                airplaneToMove.station = movedToStation.id;
                console.log(`The airplane you are moving is not in stations 4, 6 or 8. It was moved to station with the ID: ${airplaneToMove.station}`)
                didMove = true;
            }
        }
    
    
          // If the airplane is departing, find the next station in the departure stations array
        else {
    
            if (currentStationId === 7){
    
                if (stations[7].isOccupied){
    
                    if (stations[8].isOccupied){
                        console.log("Both taxiways are occupied...")
                        return;
                    }
    
                    else {
                        //call for the event to move a station.
                        airplaneToMove.station = stations[8];
                        didMove = true;
                    }
                }
            }
    
            else if (currentStationId === 8){
                airplaneToMove.station = stations[3];
                didMove = true;
            }
            
    
            else {
                //Airplane departed
                airplaneToMove.station = null;
                didMove = true;
            }
        }
    
        if (didMove){
    
            console.log(`Index of the second From station (In the stations array): ${fromStation}`)
    
            stations[fromStation].isOccupied = false;
            stations[fromStation].airplane = null;
            
            console.log(`Station ${stations[fromStation].name} is Occupied? ${stations[fromStation].isOccupied}, contains airplane? ${stations[fromStation].airplane}`);
    
    
            //in the station that the airplane is now at, update isOccupied to true and airplane field.
            console.log(`The updated station ID inside the airplane object: ${airplaneToMove.station}`)
    
            let toStation = stations.findIndex((station) => station.id === airplaneToMove.station);
            console.log(`Index of the station the airplane moved to in the stations array: ${toStation}`)
    
            stations[toStation].isOccupied = true;
            stations[toStation].airplane = airplane;
    
            console.log(`Station ${stations[toStation].name} is Occupied? ${stations[toStation].isOccupied}, contains airplane? ${stations[toStation].airplane}`);
    
    
            airplanes[airplaneToMoveIndex] = airplaneToMove;
    
            console.log(`The airplanes array is now changed, index that was changed: ${airplaneToMoveIndex}, new properties are: ${airplanes[airplaneToMoveIndex].name} - moved to station with the ID: ${airplanes[airplaneToMoveIndex].station}`)
        }

        resolve();
    });
};

function nextStationNew(airplane) {

    let airplaneToMove = airplanes.find((a) => a.id === airplane.id);
    let airplaneToMoveIndex = airplanes.findIndex((a) => a.id === airplaneToMove.id);
    //Testing to see if the airplane is the right one
    for (var i = 0; i < airplanes.length; i++) {
        console.log(`${i} - ${airplanes[i].id} - ${airplanes[i].name}`); 
    }
    console.log(`The airplane you are moving from the airplanes array is: ${airplaneToMove.id} - ${airplaneToMove.name} and it's index in the airplanes array is: ${airplaneToMoveIndex}`)

    const currentStationId = airplaneToMove.station;
    //Testing to see if the station is the right one
    console.log(`Current Station ID: ${currentStationId}`);

    //Possible routes - depends on if airplane is arriving + if taxiway is occupied
    const routeArrival1 = [1, 2, 3, 4, 8, 5, 6];
    const routeArrival2 = [1, 2, 3, 4, 9, 5, 6];
    const routeDeprture1 = [7, 8, 4];
    const routeDeprture2 = [7, 9, 4];

    //find the index inside the stations array of the station where the airplane moved from and moves to.
    let fromStationsIndex = stations.findIndex((station) => station.id === currentStationId);
    let toStationsIndex;

    //Create a variable too see if the airplane moved a station or not
    let didAirplaneMove = false;

    //Find index in the route of the airplane.
    let currentStationIndex;
    let toStationID;

    //The logic of the function
    if (airplaneToMove.arriving){ //Possible routes are routeArrival1 and routeArrival2
        if (currentStationId === 4){

            //Airplane is at station id 4, and taxiway 1 is not occupied -> moves to taxiway 1 (routeArrival1)
            currentStationIndex = routeArrival1.findIndex((station) => station === currentStationId);
            toStationID = routeArrival1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);

            if (stations[7].isOccupied){
                if (stations[8].isOccupied){
                    //Airplane is at station id 4, and both taxiways are occupied. Alert the user!
                    console.log(`${airplaneToMove.name} can not move to the next station.`)
                    return didAirplaneMove;
                }
                //Airplane is at station id 4, and taxiway 1 is occupied -> moves to taxiway 2 (routeArrival2)
                currentStationIndex = routeArrival2.findIndex((station) => station === currentStationId);
                toStationID = routeArrival2[currentStationIndex + 1];
                toStationsIndex = stations.findIndex((station) => station.id === toStationID);
                console.log(`U are here! line 287! --- currentStationIndex: ${currentStationIndex}, toStationID: ${toStationID}, toStationsIndex: ${toStationsIndex}`)
            }
        }
        else if (currentStationId === 6) { // We need to move the airplane to station 7 manually 
            currentStationIndex = routeArrival1.findIndex((station) => station === currentStationId);
            toStationID = routeDeprture1[0];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);
        }
        else { // Airplane is arriving and not in station id 4 -> routeArrival1/2 (does not matter).
            currentStationIndex = routeArrival1.findIndex((station) => station === currentStationId);
            if (currentStationIndex === -1) {
                currentStationIndex = routeArrival2.findIndex((station) => station === currentStationId);
            }
            toStationID = routeArrival1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);
            console.log(`U are here! line 302! --- currentStationIndex: ${currentStationIndex}, toStationID: ${toStationID}, toStationsIndex: ${toStationsIndex}`)
        }
    }
    else { //Airplane is departing (Possible routes are routeDeprture1 and routeDeprture2)
        if (currentStationId === 7){
            //Airplane is at station id 7, and taxiway 1 is not occupied -> moves to taxiway 1 (routeArrival1)
            currentStationIndex = routeDeprture1.findIndex((station) => station === currentStationId);
            toStationID = routeDeprture1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);
            if (stations[7].isOccupied){
                if (stations[8].isOccupied){
                    //Airplane is at station id 7, and both taxiways are occupied. Alert the user!
                    console.log(`${airplaneToMove.name} can not move to the next station.`)
                    return didAirplaneMove;
                }
                //Airplane is at station id 7, and taxiway 1 is occupied -> moves to taxiway 2 (routeArrival2)
                currentStationIndex = routeDeprture2.findIndex((station) => station === currentStationId);
                toStationID = routeDeprture2[currentStationIndex + 1];
                toStationsIndex = stations.findIndex((station) => station.id === toStationID);
            }
        }
        else if (currentStationId === 4) { //Airplane is departing from the runway 
            //tell the user the airplane is leaving
            console.log(`${airplaneToMove.name} is departing. Departure time: ${airplaneToMove.startTime}`);
            //set the logic for departure...
            stations[fromStationsIndex].airplane = null;
            stations[fromStationsIndex].isOccupied = false;
            airplanes[airplaneToMoveIndex].station = null;
            //Test the result
            console.log(`${stations[fromStationsIndex].name} contains ${stations[fromStationsIndex].airplane}. Occupied: ${stations[fromStationsIndex].isOccupied}. ${airplanes[airplaneToMoveIndex].name} current station: ${airplanes[airplaneToMoveIndex].station}`);
            return didAirplaneMove;
        }
        else { //Airplane is on taxiway 1 or 2
            //Airplane is at station id 8 or 9 -> moves to the runway
            currentStationIndex = routeDeprture1.findIndex((station) => station === currentStationId);
            if (currentStationIndex === -1) {
                currentStationIndex = routeDeprture2.findIndex((station) => station === currentStationId);
            }
            toStationID = routeDeprture1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);
            console.log(`U are here! line 339! ---currentStationId: ${currentStationId}, currentStationIndex: ${currentStationIndex}, toStationID: ${toStationID}, toStationsIndex: ${toStationsIndex}`)

        }
    }
    //Check to see if the next station is occupied or not
    console.log(`toStationsIndex = ${toStationsIndex}`);
    if (stations[toStationsIndex].isOccupied){ //Next station is occupied. Airplane did not move
        didAirplaneMove = false;
        console.log(`${stations[toStationsIndex].name} is already occupied. ${airplanes[airplaneToMoveIndex].name} did not move to it's next station.`);
        return didAirplaneMove;
    }
    else { //Next station is free, move the airplane.
        didAirplaneMove = true;
        //reset the origin station data
        stations[fromStationsIndex].airplane = null;
        stations[fromStationsIndex].isOccupied = false;
        //set new data for the destination station
        stations[toStationsIndex].airplane = airplanes[airplaneToMoveIndex];
        stations[toStationsIndex].isOccupied = true;
        //set the data for the airplane
        airplanes[airplaneToMoveIndex].station = stations[toStationsIndex].id;
        const current = new Date();
        const time = current.toLocaleTimeString("en-US", {
        //   hour: "2-digit",
        //   minute: "2-digit",
          hour12: false
        });
        airplanes[airplaneToMoveIndex].startTime = time;

        //Test the function
        console.log(`${airplanes[airplaneToMoveIndex].name} has moved from ${stations[fromStationsIndex].name} to ${stations[toStationsIndex].name}`);
        return didAirplaneMove;
    }
}
  


// Set up a Socket.IO connection event handler
io.on('connection', (socket) => {
    console.log('A client has connected, socket id: '+ socket.id);
  
    // Send the current game state to the client when it connects
    socket.on('update', (airport) => {
      console.log(`Received update:`, airport);
      // Update the rendering of the airport here
    });
  
     socket.on('disconnect', ()=>{
          console.log("User disconnected", socket.id)
      });

      socket.on('getAirplane', () => {
        console.log("Sending airport data to client");
        addPlane();
        socket.emit('update', airport);
      });

    //   socket.on('moveAirplaneClick', async airplane => {
    //     let airplaneMoved = airplane;
    //     await nextStation(airplane);

    //     let airplaneIndex = airplanes.findIndex((a) => a.id === airplaneMoved.id);
    //     if (airplanes[airplaneIndex].station === 7) {
    //         console.log(`The airplane index I want to change it's arriving field is: ${airplaneIndex}`)
    //         airplanes[airplaneIndex].arriving = false;
    //     }

    //     console.log(`Just to check that the data was updated: Airplane name that was changed ${airport.airplanes[airplaneIndex].name}, moved to station: ${airport.airplanes[airplaneIndex].station }`)

    //     socket.emit('update', airport);
    //   });

      socket.on('moveAirplaneClick', airplane => {
        let airplaneMoved = airplane;
        nextStationNew(airplane);

        let airplaneIndex = airplanes.findIndex((a) => a.id === airplaneMoved.id);
        if (airplanes[airplaneIndex].station === 7) {
            console.log(`The airplane index I want to change it's arriving field is: ${airplaneIndex}`)
            airplanes[airplaneIndex].arriving = false;
        }

        console.log(`Just to check that the data was updated: Airplane name that was changed ${airport.airplanes[airplaneIndex].name}, moved to station: ${airport.airplanes[airplaneIndex].station }`)

        socket.emit('update', airport);
      });


      //event for handling the next station
    //   socket.on('nextStation',(plane)=>{
    //     console.log("plane:" + plane.name + "moving to the next station");
    //     nextStation(plane);  //TODO : make the nextStation function a boolean so that you can do an if statment
    //     socket.emit('update', airport);
    //   });
      
    });
     
      
  
  
server.listen(3001, () => {
    console.log('Server is running on port 3001')
});