import React from 'react';
import Airplane from './Airplane';

const Station = (props) => {
  const { station, socket } = props;
  return (
    <div className="station">
      <h3>{station.name}</h3>
      {station.isOccupied ? (
        <div>
          <p>Occupied</p>
          <Airplane airplane={station.airplane} socket={socket} />
        </div>
      ) : (
        <p>Not occupied</p>
      )}
    </div>
  );
};

export default Station;
