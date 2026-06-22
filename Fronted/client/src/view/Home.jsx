 import { useState } from "react";
import {socket }from "../socket";
import { useNavigate } from "react-router-dom";
import "../Home.css";

export default function Home() {
  const [roomCode, setRoomCode] =
  useState("");

const [maxPlayers, setMaxPlayers] =
  useState(8);

const [maxRounds, setMaxRounds] =
  useState(3);

const [drawTime, setDrawTime] =
  useState(60);

 const [username, setUsername] =
    useState("");

  const navigate = useNavigate();

  const handlePlay = () => {

    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    navigate("/play", {
      state: {
        username,
        mode: "quick"
      }
    });
  };

  return (
    <div className="home">
      <div className="card">

        <h1>SCRIBBLE.IO</h1>

        <p>Draw • Guess • Win</p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <button
          className="play-btn"
          onClick={handlePlay}
        >
          Play Now
        </button>

        <div className="divider">
          Private Room
        </div>

   

<div className="setting-group">

  <label>
    Room Code
  </label>

  <input
    type="text"
    placeholder="Enter Room Code"
    value={roomCode}
    onChange={(e) =>
      setRoomCode(
        e.target.value.toUpperCase()
      )
    }
  />

</div>

<div className="setting-group">

  <label>
    Max Players
  </label>

  <input
    type="number"
    min="2"
    max="20"
    value={maxPlayers}
    onChange={(e) =>
      setMaxPlayers(
        Number(e.target.value)
      )
    }
  />

</div>

<div className="setting-group">

  <label>
    Number of Rounds
  </label>

  <input
    type="number"
    min="2"
    max="10"
    value={maxRounds}
    onChange={(e) =>
      setMaxRounds(
        Number(e.target.value)
      )
    }
  />

</div>

<div className="setting-group">

  <label>
    Drawing Time (seconds)
  </label>

  <input
    type="number"
    min="15"
    max="240"
    value={drawTime}
    onChange={(e) =>
      setDrawTime(
        Number(e.target.value)
      )
    }
  />

</div>

        <div className="room-buttons">
          <button
  onClick={() => {

    navigate(
      "/play",
      {
        state: {
          username,
          mode:
            "join_private_room",
          roomCode
        }
      }
    );

  }}
>
  Join Room
</button>
         <button
  onClick={() => {

    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    navigate("/play", {
  state: {
    username,
    mode: "create_private",
    maxPlayers,
    maxRounds,
    drawTime
  }
});
  }}
>
  Create Room
</button>
        </div>

      </div>
    </div>
  );
}