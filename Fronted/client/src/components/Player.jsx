import "./Player.css";

function Player({ players = [], currentDrawerId }) {
  return (
    <div className="player-panel">
      <div className="player-header">
        Players ({players.length})
      </div>

      <div className="player-list">
        {players.map((player, index) => {
          const isDrawer = player.socketId === currentDrawerId;
          return (
            <div
              key={player.socketId}
              className={`player-card ${isDrawer ? "active-drawer" : ""}`}
            >
              <div className="player-info">
                <span className="player-icon">
                  {index === 0 ? "👑" : "👤"}
                </span>

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