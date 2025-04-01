import React, { useEffect, useRef, useState } from "react";
import GameBoard from "./components/GameBoard";

const BOARD_SIZE = 20;
const CELL_SIZE = 24;
const SPEED = 150;

const getRandomPos = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const generateFood = (snake) => {
  const positions = [];

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const isOccupied = snake.some((seg) => seg.x === x && seg.y === y);
      if (!isOccupied) positions.push({ x, y });
    }
  }

  if (positions.length === 0) return { x: 0, y: 0 }; // fallback if grid full

  const idx = Math.floor(Math.random() * positions.length);
  return positions[idx];
};

const initialSnake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
];

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(() => generateFood(initialSnake));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore") || "0")
  );
  const [isGameOver, setIsGameOver] = useState(false);

  const dir = useRef({ x: 1, y: 0 });
  const gameRef = useRef();

  useEffect(() => {
    const preventZoom = (e) => {
      if (
        (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) || // Ctrl + / -
        e.metaKey || // Cmd on Mac
        e.ctrlKey
      ) {
        e.preventDefault();
      }
    };

    const preventWheelZoom = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    window.addEventListener("keydown", preventZoom);
    window.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      window.removeEventListener("keydown", preventZoom);
      window.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      const d = dir.current;
      if ((key === "arrowup" || key === "w") && d.y !== 1)
        dir.current = { x: 0, y: -1 };
      if ((key === "arrowdown" || key === "s") && d.y !== -1)
        dir.current = { x: 0, y: 1 };
      if ((key === "arrowleft" || key === "a") && d.x !== 1)
        dir.current = { x: -1, y: 0 };
      if ((key === "arrowright" || key === "d") && d.x !== -1)
        dir.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    gameRef.current = setInterval(() => {
      setSnake((prev) => {
        const next = [...prev];
        const head = { ...next[0] };
        head.x += dir.current.x;
        head.y += dir.current.y;

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= BOARD_SIZE ||
          head.y >= BOARD_SIZE ||
          next.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
          clearInterval(gameRef.current);
          setIsGameOver(true);
          return next;
        }

        next.unshift(head);
        const ate = head.x === food.x && head.y === food.y;
        if (ate) {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snakeHighScore", newScore.toString());
          }
          setFood(generateFood(next));
        } else {
          next.pop();
        }

        return next;
      });
    }, SPEED);

    return () => clearInterval(gameRef.current);
  }, [food, score, highScore]);

  const restart = () => {
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsGameOver(false);
    dir.current = { x: 1, y: 0 };
    gameRef.current = null;
  };

  return (
    <div className="app">
      <h1 className="game-title">🐍 Snake</h1>

      <div className="game-layout">
        <div className="info left">
          <h3>🎮 How to Play</h3>
          <p>
            Use <strong>WASD</strong> or <strong>arrow keys</strong> to control
            the snake.
          </p>
          <p>Avoid hitting the wall or yourself!</p>
        </div>

        <div className="game-container">
          <div className="scoreboard">
            <span>Score: {score}</span>
            <span>Best: {highScore}</span>
          </div>

          <div className="board-wrapper">
            <GameBoard
              snake={snake}
              food={food}
              boardSize={BOARD_SIZE}
              cellSize={CELL_SIZE}
            />
            {isGameOver && (
              <div className="overlay">
                <h2>Game Over</h2>
                <button className="play-again" onClick={restart}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="info right">
          <h3>🔥 Tips</h3>
          <p>Eat to grow. The longer you survive, the higher the score.</p>
          <p>Stay sharp, stay smooth, stay alive!</p>
        </div>
      </div>
    </div>
  );
}
