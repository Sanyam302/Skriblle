import { useState, useMemo } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import "../Home.css";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [maxRounds, setMaxRounds] = useState(3);
  const [drawTime, setDrawTime] = useState(60);
  const [username, setUsername] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(
    Math.random().toString(36).substring(7)
  );

  const avatarSvg = useMemo(() => {
    return createAvatar(adventurer, {
      seed: avatarSeed,
      size: 32
    }).toString();
  }, [avatarSeed]);

  const navigate = useNavigate();

  const handlePlay = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    navigate("/play", {
      state: {
        username,
        mode: "quick",
        avatarSeed
      }
    });
  };

  return (
    <div className="home">
      <div className="lobby-logo">
        <span className="live-badge">🟢 Live • Free • No Account</span>
        <h1>scribble.io</h1>
        <span className="logo-subtitle">Draw • Guess • Win</span>
      </div>

      <div className="card">
        <div className="setting-group">
          <label>Your Name</label>
          <div className="name-input-container">
            <div className="avatar-preview" dangerouslySetInnerHTML={{ __html: avatarSvg }} />
            <input
              type="text"
              placeholder="Enter Your Name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setAvatarSeed(e.target.value || Math.random().toString(36).substring(7));
              }}
            />
            <button 
              className="refresh-avatar-btn"
              title="Random Avatar"
              onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
            >
              🔄
            </button>
          </div>
        </div>

        <button
          className="play-btn"
          onClick={handlePlay}
        >
          ⚡ Play Now
        </button>

        <div className="divider">
          Private Rooms
        </div>

        <div className="setting-group">
          <label>Sketch ID</label>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
        </div>

        <div className="room-buttons">
          <button
            onClick={() => {
              if (!username.trim()) {
                alert("Enter username");
                return;
              }
              if (!roomCode.trim()) {
                alert("Enter Room Code");
                return;
              }
              console.log(roomCode);
              navigate(
                "/play",
                {
                  state: {
                    username,
                    mode: "join_private_room",
                    roomCode,
                    avatarSeed
                  }
                }
              );
            }}
          >
            ↪ Join Room
          </button>
          <button
            onClick={() => {
              if (!username.trim()) {
                alert("Enter username");
                return;
              }
              setShowCreateModal(true);
            }}
          >
            ➕ Create Room
          </button>
        </div>
      </div>

      <div className="how-it-works">
        <div className="step-item">
          <span className="step-num">01</span>
          <span className="step-title">Enter your name</span>
          <span className="step-desc">Pick a name, configure your avatar, and get ready to draw.</span>
        </div>
        <div className="step-item">
          <span className="step-num">02</span>
          <span className="step-title">Create or join</span>
          <span className="step-desc">Start a private sketch lobby or enter an existing code to join friends.</span>
        </div>
        <div className="step-item">
          <span className="step-num">03</span>
          <span className="step-title">Draw & guess</span>
          <span className="step-desc">Take turns drawing custom words while others guess in real-time.</span>
        </div>
      </div>

      <div className="features-row">
        <span>Private Rooms</span>
        <span>Real-Time Sync</span>
        <span>Zero Friction</span>
      </div>

      <div className="lobby-footer">
        <span>Built with ❤️ for WEB3TASK by Sanyam Jain</span>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Room Settings</h2>
            <p>Configure details for your private room</p>

            <div className="setting-group">
              <label>Max Players</label>
              <input
                type="number"
                min="2"
                max="20"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Number of Rounds</label>
              <input
                type="number"
                min="2"
                max="10"
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Drawing Time (seconds)</label>
              <input
                type="number"
                min="15"
                max="240"
                value={drawTime}
                onChange={(e) => setDrawTime(Number(e.target.value))}
              />
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  navigate("/play", {
                    state: {
                      username,
                      mode: "create_private",
                      maxPlayers,
                      maxRounds,
                      drawTime,
                      avatarSeed
                    }
                  });
                }}
              >
                Create & Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}