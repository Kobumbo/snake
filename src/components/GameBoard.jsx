import React from "react";
import Snake from "./Snake";
import Food from "./Food";

function GameBoard({ snake, food, boardSize, cellSize }) {
  const size = boardSize * cellSize;

  return (
    <div
      className="board"
      style={{
        width: size,
        height: size,
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
      }}
    >
      <Snake segments={snake} cellSize={cellSize} />
      <Food food={food} cellSize={cellSize} />
    </div>
  );
}

export default GameBoard;
