import React, { useState, useEffect } from 'react';
import Airport from './components/Airport';
import io from 'socket.io-client';
import './Airplane.css'

const socket = io('http://localhost:3001');

function App() {
  const [airport, setAirport] = useState(null);

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


  return (
    <div className="App">
      {airport ? <Airport airport={airport} socket={socket} /> : <p>Loading...</p>}
      <button onClick={handleGetAirplaneClick}>Get airplane</button>
    </div>
  );
}

export default App;
