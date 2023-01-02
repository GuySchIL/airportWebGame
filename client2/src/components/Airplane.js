import React from 'react';

const Airplane = (props) => {
  const { airplane, socket } = props;

  const handleMoveAirplaneClick = () => {
    socket.emit('moveAirplaneClick', airplane);
  };

  return (
    <div className="airplane">
      <h4>{airplane.name}</h4>
      <p>ID: {airplane.id}</p>
      <p>Arriving: {airplane.arriving ? 'Yes' : 'No'} </p>
      <p>Arriving Time: {airplane.startTime}</p>
      <button onClick={()=>handleMoveAirplaneClick(airplane)}>Move Airplane</button>
    </div>
  );
};

export default Airplane;
