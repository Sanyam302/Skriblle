 import { useState } from "react";
import {socket }from "../socket";
import { useNavigate } from "react-router-dom";
import "../Home.css";

export default function Home() {

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
        username
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

        <input
          type="text"
          placeholder="Enter Room Code"
        />

        <div className="room-buttons">
          <button>Join Room</button>
          <button>Create Room</button>
        </div>

      </div>
    </div>
  );
}