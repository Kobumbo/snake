import React from "react";

function Snake({ segments, cellSize }) {
  return segments.map((seg, i) => {
    const isHead = i === 0;

    return (
      <div
        key={i}
        className={`cell snake ${isHead ? "head" : ""}`}
        style={{
          transform: `translate(${seg.x * cellSize}px, ${seg.y * cellSize}px)`,
        }}
      >
        {isHead && (
          <>
            <div className="eye left" />
            <div className="eye right" />
          </>
        )}
      </div>
    );
  });
}

export default Snake;
