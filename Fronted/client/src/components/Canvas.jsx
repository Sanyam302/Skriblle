import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import "./Canvas.css";

function Canvas(props) {
   console.log(
  "Canvas canDraw:",
  props.canDraw
);

  const { canDraw } = props;
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#8b4513",
    "#808080",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
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

    socket.on("draw_start", handleDrawStart);
    socket.on("draw_move", handleDrawMove);
    socket.on("draw_end", handleDrawEnd);

    return () => {
      socket.off("draw_start", handleDrawStart);
      socket.off("draw_move", handleDrawMove);
      socket.off("draw_end", handleDrawEnd);
    };
  }, []);

  const startDrawing = (e) => {
    if (!canDraw) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");

    const drawColor = isEraser
      ? "#ffffff"
      : color;

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

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = isEraser
      ? "#ffffff"
      : color;

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

    const ctx =
      canvasRef.current.getContext("2d");

    ctx.beginPath();

    setIsDrawing(false);

    socket.emit("draw_end");
  };

  return (
    <div className="canvas-wrapper">

      <div className="toolbar">

        <div className="colors">
          {colors.map((c) => (
            <div
              key={c}
              className={`color ${
                color === c && !isEraser
                  ? "selected"
                  : ""
              }`}
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

        <button
          className={`eraser-btn ${
            isEraser ? "active" : ""
          }`}
          onClick={() =>
            setIsEraser(!isEraser)
          }
        >
          {isEraser
            ? "Brush"
            : "Eraser"}
        </button>

        <div className="size-control">
          <span>
            Size: {size}
          </span>

          <input
            type="range"
            min="1"
            max="30"
            value={size}
            onChange={(e) =>
              setSize(
                Number(e.target.value)
              )
            }
          />
        </div>

      </div>

      <canvas
        ref={canvasRef}
        width={900}
        height={550}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

    </div>
  );
}

export default Canvas;