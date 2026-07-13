import "./Player.css";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

function Player({ players = [], currentDrawerId }) {
  return (
    <div className="player-panel">
      <div className="player-header">
        Players ({players.length})
      </div>

      <div className="player-list">
        {players.map((player, index) => {
          const isDrawer = player.socketId === currentDrawerId;
          const avatarSvg = createAvatar(adventurer, {
            seed: player.avatarSeed || player.username,
            size: 28
          }).toString();

          return (
            <div
              key={player.socketId}
              className={`player-card ${isDrawer ? "active-drawer" : ""}`}
            >
              <div className="player-info" style={{ position: "relative" }}>
                {index === 0 && <span className="crown-badge">👑</span>}
                <div 
                  className="player-avatar-icon" 
                  dangerouslySetInnerHTML={{ __html: avatarSvg }} 
                />

                <span className="player-name">
                  {player.username}
                </span>

                {isDrawer && (
                  <span className="player-status-badge">
                    ✏️ Draw
                  </span>
                )}
              </div>

              <span className="player-score">
                {player.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Player;