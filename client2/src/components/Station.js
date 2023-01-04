import React from 'react';
import Airplane from './Airplane';

const Station = (props) => {
  const { station, socket } = props;
  return (
    <div className="station">
      <h3>{station.name}</h3>
      <img
        src="https://cdn.dribbble.com/users/1025386/screenshots/4130792/media/45b835b493f5b9ff20f5eae8f1404c79.png?compress=1&resize=400x300"
        alt="Airplane"
        style={{ width: '50px', height: '50px' , position: 'absolute', left: `${station.positionX}px`, top: `${station.positionY}px`}}
      />
      {station.isOccupied ? (
        <div>
          <p>Occupied</p>
          <Airplane airplane={station.airplane} socket={socket} positionX={station.positionX} positionY={station.positionY} />
        </div>
      ) : (
        <p>Not occupied</p>
      )}
    </div>
  );
};

export default Station;
