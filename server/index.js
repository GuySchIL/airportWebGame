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
        io.emit('StationOccupiedAlert', message);
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
        airplanes[airplaneIndex] = nextAirplane;
    
        console.log(nextAirplane.startTime)
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

        const routeArrival1 = [1, 2, 3, 4, 8, 5, 6];
        const routeArrival2 = [1, 2, 3, 4, 9, 5, 6];

        const routeDeprture1 = [7, 8, 4];
        const routeDeprture2 = [7, 9, 4];

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

      socket.on('moveAirplaneClick', async airplane => {
        let airplaneMoved = airplane;
        await nextStation(airplane);

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