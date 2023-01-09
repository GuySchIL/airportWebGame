import React from "react";
import Airplane from "./Airplane";
import Fire from '../images/Fire.png'


const Station = (props) => {
  const { station, socket } = props;
  return (
    <div>
      <div className="station">
        {station.airplane ? (
          <div>
            <Airplane
              airplane={station.airplane}
              socket={socket}
              positionX={station.positionX}
              positionY={station.positionY}
              stationId={station.id}
            />
          </div>
        ) : (
          <p></p>
        )}
        {station.airplane === null && station.isOccupied ? (
          <img
            src={Fire}
            alt="obstacle"
            style={{
              position: "absolute",
              left: `${station.positionX}px`,
              top: `${station.positionY}px`,
              width: "100px",
            }}
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Station;
