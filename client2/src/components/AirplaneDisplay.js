import React, { useState, useEffect } from 'react';


const AirplaneDisplay = (props) => {
  const { airplane, socket, positionX, positionY } = props;
  const [isHovered, setIsHovered] = useState(false);

  const handleMoveAirplaneClick = () => {
    socket.emit('moveAirplaneClick', airplane);
  };

  return (
    <div className="airplane">

      <h4>{airplane.name}</h4>
      <p>ID: {airplane.id}</p>
      <p>Arriving: {airplane.arriving ? 'Yes' : 'No'} </p>
      <p>Arriving Time: {airplane.startTime}</p>
      <button onClick={() => handleMoveAirplaneClick(airplane)}>Move Airplane</button>
    </div>
  );
};

export default AirplaneDisplay;
