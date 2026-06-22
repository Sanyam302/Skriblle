import "./Header.css";

function Header({
  roomId,
  round,
  maxRounds,
  timeLeft,
  word
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

    </header>
  );
}

export default Header;