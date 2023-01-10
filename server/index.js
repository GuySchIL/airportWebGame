// Import the necessary libraries
const express = require('express');
const app = express();

const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { emit } = require('process');
const { resolve } = require('path');
const mysql = require('mysql2');


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

//DB connection - mySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'airport_db'
});

const connectToDb = () => {
    connection.connect((err) => {
        if (err) {
            console.log('Failed to connect to the database: ', err);
        } else {
            console.log('Successfully connected to the database.');
        }
    });
}

connectToDb();

// Check if the "airplanes" table already exists
const createTableIfNotExist = () => {
    const createTable = `CREATE TABLE IF NOT EXISTS airplanes (
                                 id INT NOT NULL AUTO_INCREMENT,
                                 name VARCHAR(255) NOT NULL,
                                 arriving TINYINT NOT NULL,
                                 positionX INT,
                                 positionY INT,
                                 station INT,
                                 startTime TIMESTAMP NOT NULL,
                                 emergency TINYINT NOT NULL,
                                 PRIMARY KEY (id)
                               )`;
    connection.query(createTable, (err, result) => {
        if (err) {
            console.log("Error creating table: " + err);
        } else {
            console.log("Table created successfully");
        }
    });
}
createTableIfNotExist();

const stations = [
    { id: 1, name: 'Contact Tower', airplane: null, isOccupied: false, positionX: 950, positionY: 215, timer: null },
    { id: 2, name: 'Approach', airplane: null, isOccupied: false, positionX: 850, positionY: 215, timer: null },
    { id: 3, name: 'Round Out', airplane: null, isOccupied: false, positionX: 760, positionY: 215, timer: null },
    { id: 4, name: 'Runway', airplane: null, isOccupied: false, positionX: 600, positionY: 215, timer: null },
    { id: 5, name: 'Passengers', airplane: null, isOccupied: false, positionX: 90, positionY: 550, timer: null },
    { id: 6, name: 'Luggage', airplane: null, isOccupied: false, positionX: 220, positionY: 670, timer: null },
    { id: 7, name: 'Fuel', airplane: null, isOccupied: false, positionX: 470, positionY: 665, timer: null },
    { id: 8, name: 'Taxiway 1', airplane: null, isOccupied: false, positionX: 90, positionY: 215, timer: null },
    { id: 9, name: 'Taxiway 2', airplane: null, isOccupied: false, positionX: 600, positionY: 550, timer: null },
];

const airplanes = [];

connection.connect((err) => {
    if (err) {
      console.log(`Error connecting to MySQL: ${err.message}`);
      return;
    }
    console.log('Connected to MySQL.');
  
    // Fetch data from the airplanes table
    connection.query('SELECT * FROM airplanes', (err, rows) => {
      if (err) {
        console.log(`Error fetching data from MySQL: ${err.message}`);
        return;
      }
      console.log('Fetched data from MySQL.');
  
      // Iterate through the result set and populate the airplanes array
      rows.forEach((row) => {
        airplanes.push({
          id: row.id,
          name: row.name,
          arriving: row.arriving === 1,
          positionX: row.positionX,
          positionY: row.positionY,
          station: row.station,
          startTime: row.startTime,
          emergency: row.emergency === 1
        });
      });
  
    //   console.log('Populated the airplanes array:', airplanes);
    // console.log(`This is the airplanes array: ${airplanes}`);
        console.log(airplanes.length);
        airplanes.forEach((airplane) => {
            console.log(`${airplane.id} - ${airplane.name} - ${airplane.arriving} - ${airplane.positionX} - ${airplane.positionY} - ${airplane.station} - ${airplane.startTime} - ${airplane.emergency}`);
        })
    });


  });

// const airplanes = [
//     { id: 1, name: 'Airplane 1', arriving: true, positionX: null, positionY: null, station: 0, startTime: null,emergency: false },
//     { id: 2, name: 'Airplane 2', arriving: true, positionX: null, positionY: null, station: 0, startTime: null,emergency: false },
//     { id: 3, name: 'Airplane 3', arriving: true, positionX: null, positionY: null, station: 0, startTime: null,emergency: true },
//     { id: 4, name: 'Airplane 4', arriving: true, positionX: null, positionY: null, station: 0, startTime: null,emergency: false },
//     { id: 5, name: 'Airplane 5', arriving: true, positionX: null, positionY: null, station: 0, startTime: null,emergency: false },
// ];

let pottentialCrashes = 0;

const airport = {
    stations,
    airplanes,
    pottentialCrashes
};


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

let airplaneIndex = 0;

//Function for adding a new plane
function addPlane() {
    console.log(`We are on airplane index: ${airplaneIndex}`);
    if (stations[0].isOccupied) {
        let msg = "Station 1 is already occupied. Can't accept another traffic.";
        // io.emit('StationOccupiedAlert', message);
        console.log(msg);
        airport.pottentialCrashes++;
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
        airplaneIndex++;
        // airplanes[airplaneIndex] = nextAirplane; - mistake?

        console.log(`${nextAirplane.name} arrived to station ${stations[0].name} on ${nextAirplane.startTime}`)
    }
    console.log(`Pottential crashes so far: ${airport.pottentialCrashes}`);

}



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
    if (airplaneToMove.arriving) { //Possible routes are routeArrival1 and routeArrival2
        if (currentStationId === 4) {

            //Airplane is at station id 4, and taxiway 1 is not occupied -> moves to taxiway 1 (routeArrival1)
            currentStationIndex = routeArrival1.findIndex((station) => station === currentStationId);
            toStationID = routeArrival1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);

            if (stations[7].isOccupied) {
                if (stations[8].isOccupied) {
                    //Airplane is at station id 4, and both taxiways are occupied. Alert the user!
                    console.log(`${airplaneToMove.name} can not move to the next station.`);
                    airport.pottentialCrashes++;
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
        if (currentStationId === 7) {
            //Airplane is at station id 7, and taxiway 1 is not occupied -> moves to taxiway 1 (routeArrival1)
            currentStationIndex = routeDeprture1.findIndex((station) => station === currentStationId);
            toStationID = routeDeprture1[currentStationIndex + 1];
            toStationsIndex = stations.findIndex((station) => station.id === toStationID);
            if (stations[7].isOccupied) {
                if (stations[8].isOccupied) {
                    //Airplane is at station id 7, and both taxiways are occupied. Alert the user!
                    console.log(`${airplaneToMove.name} can not move to the next station.`)
                    airport.pottentialCrashes++;
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
    if (stations[toStationsIndex].isOccupied) { //Next station is occupied. Airplane did not move
        didAirplaneMove = false;
        console.log(`${stations[toStationsIndex].name} is already occupied. ${airplanes[airplaneToMoveIndex].name} did not move to it's next station.`);
        airport.pottentialCrashes++;
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
let airportInterval;
// Function to start the 'getairplane' event
function startGetAirplaneEvent() {
    // Set up an interval to send airplanes to clients at random intervals between 45 and 60 seconds
    airportInterval = setInterval(() => {
        console.log("Sending airport data to client");
        addPlane();
        // Emit the 'getairplane' event to all connected clients with the airport data
        io.emit('update', airport);
    }, 30000 + Math.random() * 15000); // 45 seconds + random number of seconds between 0 and 15
}
function stopGetAirplaneEvent() {
    clearInterval(airportInterval);
}



function setObstacle() {
    // Generate a random number between 3 and 8
    const randomNumber = Math.floor(Math.random() * 6) + 3;
  
    if (stations[randomNumber].airplane) {
      console.log("Cant put an obstacble, the runway is busy");
    } else {
      stations[randomNumber].isOccupied = true;
      io.emit('update', airport);
      setTimeout(function() {
        stations[randomNumber].isOccupied = false;
        io.emit('update', airport);
      }, 30000);  // 30 seconds in milliseconds
    }
  }
  
  


// Set up a Socket.IO connection event handler
io.on('connection', (socket) => {
    console.log('A client has connected, socket id: ' + socket.id);

    // Send the current game state to the client when it connects
    socket.on('update', (airport) => {
        console.log(`Received update:`, airport);
        // Update the rendering of the airport here
    });
    socket.on('setObstacle',()=>{
        setObstacle();
    });

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id)
    });

    socket.on('getAirplane', () => {
        console.log("Sending airport data to client");
        addPlane();
        socket.emit('update', airport);
    });

    socket.on('openAirport', ()=>{
        console.log('Airport is open');
        startGetAirplaneEvent();
    })
    socket.on('closeAirport',()=>{
        console.log('Airport is closed');
        stopGetAirplaneEvent();
    })

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

        console.log(`Just to check that the data was updated: Airplane name that was changed ${airport.airplanes[airplaneIndex].name}, moved to station: ${airport.airplanes[airplaneIndex].station}`)
        console.log(`Pottential crashes so far: ${airport.pottentialCrashes}`);

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