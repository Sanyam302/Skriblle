import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import "./Canvas.css";

function Canvas(props) {
  const { canDraw } = props;
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    "#000000",
    "#ffffff",
    "#ff4444",
    "#ffaa00",
    "#ffeb3b",
    "#4caf50",
    "#00bcd4",
    "#2196f3",
    "#9c27b0",
    "#795548",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";

    const handleDrawStart = (data) => {
      ctx.beginPath();
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.size;
      ctx.moveTo(data.x, data.y);
    };

    const handleDrawMove = (data) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    };

    const handleDrawEnd = () => {
      ctx.beginPath();
    };

    const handleClearCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw_start", handleDrawStart);
    socket.on("draw_move", handleDrawMove);
    socket.on("draw_end", handleDrawEnd);
    socket.on("clear_canvas", handleClearCanvas);

    return () => {
      socket.off("draw_start", handleDrawStart);
      socket.off("draw_move", handleDrawMove);
      socket.off("draw_end", handleDrawEnd);
      socket.off("clear_canvas", handleClearCanvas);
    };
  }, []);

  const startDrawing = (e) => {
    if (!canDraw) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Account for responsive scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    const drawColor = isEraser ? "#ffffff" : color;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = size;

    setIsDrawing(true);

    socket.emit("draw_start", {
      x,
      y,
      color: drawColor,
      size,
    });
  };

  const draw = (e) => {
    if (!canDraw) return;
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = size;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("draw_move", {
      x,
      y,
    });
  };

  const stopDrawing = () => {
    if (!canDraw) return;
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();

    setIsDrawing(false);

    socket.emit("draw_end");
  };

  const clearBoard = () => {
    if (!canDraw) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear_canvas");
  };

  return (
    <div className="canvas-wrapper">
      {canDraw && (
        <div className="toolbar">
          <div className="colors">
            {colors.map((c) => (
              <div
                key={c}
                className={`color ${color === c && !isEraser ? "selected" : ""}`}
                style={{
                  backgroundColor: c,
                }}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
              />
            ))}
          </div>

          <div className="tool-actions">
            <button
              className={`eraser-btn ${isEraser ? "active" : ""}`}
              onClick={() => setIsEraser(!isEraser)}
            >
              🧹 {isEraser ? "Brush" : "Eraser"}
            </button>
            <button className="clear-btn" onClick={clearBoard}>
              🗑️ Clear
            </button>
          </div>

          <div className="size-control">
            <span>Size: {size}</span>
            <input
              type="range"
              min="1"
              max="30"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={900}
          height={550}
          className={`drawing-canvas ${!canDraw ? "disabled" : ""}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}

export default Canvas;