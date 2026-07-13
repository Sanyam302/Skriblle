

import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./view/Home";
import Play from "./view/Play";
function App() {

  return (
     <div className="App">
       <div className="bg-spheres-container">
         <div className="bg-sphere sphere-1"></div>
         <div className="bg-sphere sphere-2"></div>
         <div className="bg-sphere sphere-3"></div>
         <div className="bg-sphere sphere-4"></div>
         <div className="bg-sphere sphere-5"></div>
       </div>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        ></Route>
       <Route
          path="/play"
          element={<Play />}
        ></Route>
       
      </Routes>
    </div>

  );
}

export default App;

  /*  <div>
      <div className="game-container">
  <div className="canvas-section">
    <Canvas />
  </div>

  <div className="chat-section">
    <Chat />
  </div>
</div>
    </div>*/
   

