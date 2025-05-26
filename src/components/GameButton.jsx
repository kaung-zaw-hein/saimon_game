import React from 'react'

const GameButton = ({ color, onClick, disabled }) => {
  const colorClassMap = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
  };

  return (
    <button
      id={color}
      className={`${colorClassMap[color]} rounded-lg w-full h-full transition-opacity duration-150`}
      disabled={disabled}
      onClick={() => onClick(color)}
    ></button>
  );
};

export default GameButton;
