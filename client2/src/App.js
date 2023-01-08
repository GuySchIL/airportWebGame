import React, { useState, useEffect } from 'react';
import Airport from './components/Airport';
import io from 'socket.io-client';
import './style/Airplane.css'
import './style/Station.css'
import Background from './images/Background.PNG'

const socket = io('http://localhost:3001');

function App() {
  const [airport, setAirport] = useState(null);
  const [autoAirport, setAutoAirport] = useState(false);

  useEffect(() => {

    console.log(`Entered the first useEffect, data should be updated...`);

    socket.on('update', (data) => {
      setAirport(data);
    });

    // socket.on('alert', (message) => {
    //   alert(message);
    // });

  }, []);

  useEffect(()=>{

  },[airport])

  const handleGetAirplaneClick = () => {
    socket.emit('getAirplane');
  };
  const handleOpenAirportClick = () => {
    socket.emit('openAirport');
  };
  const handleObstacleClick = () => {
    socket.emit('setObstacle')
  }

  return (
    <div className="App" style={{backgroundImage: `url(${Background})`,
    backgroundRepeat: 'no-repeat',
    width:'1000px',
    height:'1000px'

    }}>
      {airport ? <Airport airport={airport} socket={socket} /> : <p>Loading...</p>}
      <button onClick={handleGetAirplaneClick}>Get airplane</button>
      <button onClick={handleOpenAirportClick}>Open Airport</button>
      <button onClick={handleObstacleClick}>Set obstacle</button>

    </div>
  );
  
  
}

export default App;
