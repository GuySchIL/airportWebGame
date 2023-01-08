import React, { useState, useEffect } from 'react';


const Airplane = (props) => {
  const { airplane, socket, positionX, positionY } = props;
  const [isHovered, setIsHovered] = useState(false);
  


  useEffect(() => {
    const interval = setInterval(() => {
      handleMoveAirplaneClick();
    }, 5000); // 5 seconds in milliseconds

    return () => clearInterval(interval);
  }, []);

  const handleMoveAirplaneClick = () => {
    socket.emit('moveAirplaneClick', airplane);
  };

  return (
    <div className="airplane">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/001/208/452/small/airplane.png"
        alt="Airplane"
        style={{ width: '50px', height: '50px', position: 'absolute', left: `${positionX}px`, top: `${positionY}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMoveAirplaneClick}

      />
      {isHovered && (
        <div
          className="airplane-card"
          style={{ position: 'absolute', left: `${positionX + 50}px`, top: `${positionY}px` }}
        >
          <h4>{airplane.name}</h4>
          <p>ID: {airplane.id}</p>
          <p>Arriving: {airplane.arriving ? 'Yes' : 'No'} </p>
          <p>Arriving Time: {airplane.startTime}</p>
        </div>
      )}

    </div>
  );
};

export default Airplane;
