import "./Header.css";
import { socket } from "../socket";

function Header({
   roomId,
  round,
  maxRounds,
  timeLeft,
  word,

  isPrivate,
  isHost,
  roomStatus
}) {
  return (
    <header className="game-header">

      <div className="header-card">
        Room: {roomId}
      </div>

      <div className="header-card">
        Round: {round}/{maxRounds}
      </div>

      <div className="header-card timer">
        ⏳ {timeLeft}s
      </div>

      <div className="header-card word">
        {word}
      </div>
   {
  isPrivate &&
  isHost &&
  roomStatus ===
    "LOBBY" && (

   <button
  className="start-game-btn"
  onClick={() => {

    socket.emit(
      "start_private_game"
    );

  }}
>
  Start Game
</button>

  )
}
    </header>
  );
}

export default Header;