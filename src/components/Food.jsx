import React from "react";

function Food({ food, cellSize }) {
  return (
    <div
      className="cell food"
      style={{
        transform: `translate(${food.x * cellSize}px, ${food.y * cellSize}px)`,
      }}
    />
  );
}

export default Food;
