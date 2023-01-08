import React from "react";
import Airplane from "./Airplane";

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
            />
          </div>
        ) : (
          <p></p>
        )}
        {station.airplane === null && station.isOccupied ? (
          <img
            src="https://media.istockphoto.com/id/1142309900/vector/simple-vector-flame-icon-in-flat-style.jpg?s=612x612&w=0&k=20&c=SjJ4hpkJhpbbmitE4iXQ4aAKLM_8qdnSNVNDZ9wjfCw="
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
