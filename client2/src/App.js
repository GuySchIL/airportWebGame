import React, { useState, useEffect } from 'react';
import Airport from './components/Airport';
import io from 'socket.io-client';
import './style/Airplane.css'
import './style/Station.css'
import './App.css'
import Background from './images/Background.PNG'
import Background2 from './images/AirportBackground3.jpg'

const socket = io('http://localhost:3001');

function App() {
  const [airport, setAirport] = useState(null);
  const [autoAirport, setAutoAirport] = useState(false);
  const [isAirportOpen, setIsAirportOpen] = useState(false); // new state variable to keep track of airport open/closed state

  useEffect(() => {

    console.log(`Entered the first useEffect, data should be updated...`);

    socket.on('update', (data) => {
      setAirport(data);
    });

    // socket.on('alert', (message) => {
    //   alert(message);
    // });

  }, []);

  useEffect(() => {

  }, [airport])

  const handleGetAirplaneClick = () => {
    socket.emit('getAirplane');
  };
  const handleOpenAirportClick = () => {
    socket.emit('openAirport');
    setIsAirportOpen(true); // update state to reflect that the airport is now open
  };
  const handleCloseAirportClick = () => {
    socket.emit('closeAirport');
    setIsAirportOpen(false); // update state to reflect that the airport is now closed
  };
  const handleObstacleClick = () => {
    socket.emit('setObstacle')
  }

  return (
    <div className="App" style={{
      backgroundImage: `url(${Background})`,
      backgroundRepeat: 'no-repeat',
      width: '1000px',
      height: '1000px'
    }}>
      {airport ? <Airport airport={airport} socket={socket} /> : <p>Loading...</p>}
      <button className="button" onClick={handleGetAirplaneClick}>Get airplane</button>
      <label className="switch">
        {isAirportOpen ? (
          <input type="checkbox" onClick={handleCloseAirportClick} checked />
        ) : (
          <input type="checkbox" onClick={handleOpenAirportClick} />
        )}
        <span className="slider round"></span>
      </label>
      {/* render "Open Airport" button if airport is currently closed, otherwise render "Close Airport" button */}

      <button className="button" onClick={handleObstacleClick}>Set obstacle</button>
      <div className="status">
        {isAirportOpen ? (
          <div className="status-box status-open">
            <span>Airport Is Open</span>
          </div>
        ) : (
          <div className="status-box status-closed">
            <span>Airport Is Closed</span>
          </div>
        )}
      </div>




    </div>
  );


}

export default App;
