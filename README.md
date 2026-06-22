# Scribble.io Clone

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Players can create or join rooms, draw words, guess answers, earn points, and compete on a live leaderboard.

## Live Demo

https://skriblle-yq6z.vercel.app

---

## Features

### Multiplayer Rooms

* Public matchmaking (Quick Play)
* Private room creation with room code
* Join private room using room code
* Host-controlled game start

### Real-Time Drawing

* HTML5 Canvas based drawing
* Real-time drawing synchronization using Socket.IO
* Drawer-only drawing permissions

### Word System

* Random word selection
* Drawer chooses from multiple words
* Hidden word display for guessers
* Progressive hint system

### Game Flow

* Turn-based drawing system
* Automatic drawer rotation
* Multiple rounds support
* Configurable draw time
* Configurable player limit

### Scoring System

* Points awarded based on remaining time
* Live leaderboard
* Automatic winner calculation
* End-game winner popup

### Chat & Guessing

* Real-time chat
* Guess validation
* Correct guess notifications
* Word reveal at round end

---

## Tech Stack

### Frontend

* React
* Vite
* Socket.IO Client
* HTML5 Canvas
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
Frontend/
│
├── src/
│   ├── components/
│   ├── view/
│   ├── socket.js
│   └── App.jsx
│
└── package.json

Backend/
│
├── game/
├── rooms/
├── Socket/
├── server.js
└── package.json
```

---

## WebSocket Events

### Room Management

* quick_play
* create_private_room
* join_private_room
* room_joined
* room_update

### Game Events

* choose_word
* word_selected
* round_started
* round_end
* game_over

### Drawing Events

* draw_start
* draw_move
* draw_end

### Chat Events

* chat_message
* guess
* word_hint

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Scribble
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---


## Game Flow

1. Player enters username.
2. Create or join a room.
3. Host starts the game.
4. Drawer selects a word.
5. Other players guess the word.
6. Correct guesses earn points.
7. Turns rotate between players.
8. Game ends after configured rounds.
9. Winner is displayed based on highest score.

---



---

## Author

Sanyam Jain

B.Tech AI & Data Science

University School of Automation and Robotics (USAR)
