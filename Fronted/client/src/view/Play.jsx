import "../Play.css";

import { useEffect, useState ,useRef} from "react";
import { useLocation } from "react-router-dom";
import {
  useNavigate
} from "react-router-dom";

import { socket } from "../socket";

import Header from "../components/Header";
import Player from "../components/Player";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";


export default function Play() {
  const navigate =
  useNavigate();
  const [gameOverData,
  setGameOverData] =
  useState(null);

  const [hint, setHint] =
  useState("");

  const [room, setRoom] =
    useState(null);

  const [wordOptions,
       setWordOptions] =
  useState([]);
  const [choose_word, setChooseWord] =
  useState(null);
  const [celebration, setCelebration] = useState(null);
  const [isCorrectFlash, setIsCorrectFlash] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [now, setNow] = useState(Date.now());

  const location =
    useLocation();

  const username =
    location.state?.username;
const joinedRef = useRef(false);

const sortedPlayers =
  [...(room?.players || [])]
    .sort(
      (a, b) =>
        b.score - a.score
    );

    const mode =
  location.state?.mode;
  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username, navigate]);

  useEffect(() => {
    const handleError = (errorMsg) => {
      alert(`Error: ${errorMsg}`);
      navigate("/");
    };
    socket.on("error", handleError);
    return () => {
      socket.off("error", handleError);
    };
  }, [navigate]);

  useEffect(() => {
    if (room?.status !== "COUNTDOWN") return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, [room?.status]);

  useEffect(() => {
    if (!gameOverData) return;
    const colors = ["#f43f5e", "#3b82f6", "#10b981", "#eab308", "#a855f7", "#ec4899", "#f97316"];
    const newConfetti = [];
    for (let i = 0; i < 75; i++) {
      const angle = 45 + (Math.random() - 0.5) * 35;
      const speed = 15 + Math.random() * 25;
      const angleRad = (angle * Math.PI) / 180;
      newConfetti.push({
        id: `l-${i}`,
        x: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        endX: `${Math.cos(angleRad) * speed * 3.5}vw`,
        endY: `${-Math.sin(angleRad) * speed * 3.5}vh`,
        rotation: `${Math.random() * 360 + 720}deg`,
        size: 8 + Math.random() * 10,
        delay: Math.random() * 0.3
      });
    }
    for (let i = 0; i < 75; i++) {
      const angle = 135 + (Math.random() - 0.5) * 35;
      const speed = 15 + Math.random() * 25;
      const angleRad = (angle * Math.PI) / 180;
      newConfetti.push({
        id: `r-${i}`,
        x: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        endX: `${Math.cos(angleRad) * speed * 3.5}vw`,
        endY: `${-Math.sin(angleRad) * speed * 3.5}vh`,
        rotation: `${Math.random() * 360 + 720}deg`,
        size: 8 + Math.random() * 10,
        delay: Math.random() * 0.3
      });
    }
    setConfetti(newConfetti);
  }, [gameOverData]);

useEffect(() => {

  const handleGameOver =
    (data) => {
      setGameOverData(data);
    };

  socket.on(
    "game_over",
    handleGameOver
  );

  return () => {
    socket.off(
      "game_over",
      handleGameOver
    );
  };

}, []);



useEffect(() => {

  const handleHint = (
    data
  ) => {

    setHint(data.hint);

  };

  socket.on(
    "word_hint",
    handleHint
  );

  return () => {

    socket.off(
      "word_hint",
      handleHint
    );

  };

}, []);

  useEffect(() => {
    const handleCorrectGuess = (data) => {
      console.log("Correct Guess Received:", data);
      setIsCorrectFlash(true);
      setTimeout(() => setIsCorrectFlash(false), 1200);

      if (data.username === username) {
        setCelebration({
          points: data.points,
          message: "You guessed it!"
        });
        setTimeout(() => setCelebration(null), 2000);
      } else {
        setCelebration({
          points: null,
          message: `${data.username} guessed correctly!`
        });
        setTimeout(() => setCelebration(null), 1800);
      }
    };

    socket.on("correct_guess", handleCorrectGuess);

    return () => {
      socket.off("correct_guess", handleCorrectGuess);
    };
  }, [username]);
  // Join room
  useEffect(() => {

  if (
    !username ||
    joinedRef.current
  ) {
    return;
  }

  joinedRef.current =
    true;

  console.log(
    "MODE:",
    mode
  );

  if (
    mode ===
    "join_private_room"
  ) {

    console.log(
      "JOIN EVENT"
    );

    socket.emit(
      "join_private_room",
      {
        username,
        roomCode:
          location.state
            ?.roomCode
      }
    );

    return;
  }

  if (
    mode ===
    "create_private"
  ) {

    console.log(
      "CREATE EVENT"
    );

    socket.emit(
      "create_private_room",
      {
        username,
        maxPlayers:
          location.state
            ?.maxPlayers,

        maxRounds:
          location.state
            ?.maxRounds,

        drawTime:
          location.state
            ?.drawTime
      }
    );

    return;
  }

  socket.emit(
    "quick_play",
    {
      username
    }
  );

}, []);

  // Receive room data
  useEffect(() => {
  console.log(
    "CURRENT STATUS:",
    room?.status
  );
}, [room]);
useEffect(() => {

  const handleRoomJoined =
    (roomData) => {

      console.log(
        "Room Joined:",
        roomData
      );

      setRoom(roomData);
    };

  const handleRoomUpdate =
    (roomData) => {

      console.log(
        "Room Updated:",
        roomData
      );

      setRoom(roomData);
        console.log(
      "RECEIVED ROOM UPDATE",
      socket.id,
      roomData
    );
    };

  const handleRoundStarted =
    (roomData) => {

      console.log(
        "Round Started:",
        roomData
      );

      setRoom(roomData);
    };

  socket.on(
    "room_joined",
    handleRoomJoined
  );

  socket.on(
    "room_update",
    handleRoomUpdate
  );

  socket.on(
    "round_started",
    handleRoundStarted
  );

  return () => {

    socket.off(
      "room_joined",
      handleRoomJoined
    );

    socket.off(
      "room_update",
      handleRoomUpdate
    );

    socket.off(
      "round_started",
      handleRoundStarted
    );

  };

}, []);
useEffect(() => {

  socket.on(
    "choose_word",
    (words) => {

      console.log(
        "WORDS RECEIVED",
        words
      );

      setWordOptions(words);
    }
  );

  return () => {
    socket.off(
      "choose_word"
    );
  };

}, []);
console.log(
  "DrawerId:",
  room?.currentDrawerId
);


  return (
    <>
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            '--end-x': p.endX,
            '--end-y': p.endY,
            '--rotate-deg': p.rotation,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * (Math.random() > 0.5 ? 1.5 : 1)}px`,
            left: p.x === 0 ? '0vw' : '100vw',
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
      {celebration && (
        <div className="points-celebration">
          <div className="celebration-badge">
            {celebration.points ? "🎉" : "⭐"} {celebration.message}
          </div>
          {celebration.points && (
            <div className="celebration-points">
              +{celebration.points}
            </div>
          )}
        </div>
      )}
      {gameOverData && (

    <div className="game-over-overlay">

      <div className="winner-popup">

        <h1>
          🎉 Congratulations 🎉
        </h1>

        <h2>
          {gameOverData.winner.username}
        </h2>

        <p>
          Won the game!
        </p>

        {gameOverData.leaderboard && (
          <div className="leaderboard-summary">
            <h3>Final Standings</h3>
            {gameOverData.leaderboard.slice(0, 5).map((player, idx) => (
              <div key={player.socketId} className="summary-row">
                <span>
                  {idx === 0 ? "👑" : `${idx + 1}.`} {player.username}
                </span>
                <span>{player.score} pts</span>
              </div>
            ))}
          </div>
        )}

       <button
       className="play-again-btn"
  onClick={() => {
    navigate("/");
    socket.emit(
  "play_again",
  () => {

   
  }
);
  }}
>
  Play Again
</button>

      </div>

    </div>

  )
}
    <div className="play-page">

     <Header
  roomId={
    room?.roomId ||
    "Loading..."
  }
  round={
    room?.currentRound || 1
  }
  maxRounds={
    room?.maxRounds || 3
  }
  timeLeft={
    room?.timeLeft || 60
  }
  word={
    hint
  }

  isPrivate={
    room?.isPrivate
  }

  isHost={
    room?.hostId ===
    socket.id
  }

  roomStatus={
    room?.status
  }
/>

      <main className="game-area">

        <aside className="players">

          <Player
            players={sortedPlayers}
            currentDrawerId={room?.currentDrawerId}
          />

        </aside>

        <section className={`canvas-area ${isCorrectFlash ? "correct-flash" : ""}`}>

  {(room?.status === "WAITING" || room?.status === "LOBBY") && (
    <div className="waiting-screen">
      <h2>Lobby</h2>
      <p>Waiting for the host to start the game...</p>
    </div>
  )}

  {room?.status === "COUNTDOWN" && (
    <div className="waiting-screen countdown-screen">
      <span className="countdown-label">Game Starting Soon</span>
      <span className="countdown-number">
        {room?.closeAt ? Math.max(0, Math.ceil((room.closeAt - now) / 1000)) : 5}
      </span>
    </div>
  )}

  {room?.status === "WORD_SELECTION" && (

    room.currentDrawerId === socket.id ? (

      <div className="word-selection">

        <h2>
          Choose a Word
        </h2>

        <div className="word-buttons">

          {wordOptions.map(
            (word) => (

             <button
  key={word}
  className="word-btn"
  onClick={() => {

    socket.emit(
      "word_selected",
      word
    );
    console.log(
      "WORD SELECTED:",
      word,
      "in room:",
      room.roomId
    );
    setChooseWord(word);
    setWordOptions([]);
  }}
>
  {word}
</button>

            )
          )}

        </div>

      </div>

    ) : (

      <div className="waiting-screen">

        <h2>
          {
            room.players.find(
              p =>
                p.socketId ===
                room.currentDrawerId
            )?.username
          }
        </h2>

        <p>
          is choosing a word...
        </p>

      </div>

    )

  )}

  {room?.status === "DRAWING" && (
    <Canvas  canDraw={
    room?.currentDrawerId ===
    socket.id
  } />
  )}

</section>

        <aside className="chat">

          <Chat
            username={username}
          />

        </aside>

      </main>

      <footer className="guess-bar">

        

      </footer>

    </div>
    </>
  );
}