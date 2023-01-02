import React from 'react';
import Station from './Station';

const Airport = (props) => {
  const { airport, socket } = props;
  return (
    <div className="airport">
      <h2>Airport</h2>
      <ul>
        {airport.stations.map((station) => (
          <li key={station.id}>
            <Station station={station} socket={socket} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Airport;
