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
    {
  gameOverData && (

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

       <button
       className="play-again-btn"
  onClick={() => {
    navigate("/");
    socket.emit(
  "play_again",
  () => {

    deleteRoom(
      socket.roomId
    );

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

          />

        </aside>

        <section className="canvas-area">

  {room?.status === "WAITING" && (
    <div className="waiting-screen">
      Waiting for players...
    </div>
  )}

  {room?.status === "COUNTDOWN" && (
    <div className="waiting-screen">
      Game starting soon...
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