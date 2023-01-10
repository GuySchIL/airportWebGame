import React from 'react';
import Station from './Station';
import StationDisplay from './StationDisplay';

const Airport = (props) => {
  const { airport, socket } = props;

  return (
    <div >
      <div >
        {airport.stations.map((station) => (
          <p key={station.id}>
            <Station station={station} socket={socket} />
          </p>
        ))}
      </div>
      <div
        className="card"
        style={{ width: '600px', height: '600px', position: 'absolute', left: `1000px`, top: `50px`, backgroundColor: '#000000' }}
      >
        <div className="airport" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
          {airport.stations.map((station) => (
            <p key={station.id}>
              <StationDisplay station={station} socket={socket} />
            </p>
          ))}
        </div>
        <h2>
          Crashes: {airport.pottentialCrashes}
        </h2>

      </div>
    </div>
  );
};

export default Airport;
