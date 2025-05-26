import React from 'react'

const HeaderDisplay = ({ level, highestLevel, onReset }) => (
  <div className='min-h-30  w-full'>
    {level > 0 && (
      <button
        onClick={onReset}
        className="my-4 transition-all text-white text-xl border px-4 py-2 rounded hover:bg-white hover:text-black"
      >
        Restart Game
      </button>
    )}
    <div className="w-full  flex justify-between items-center mb-5">
      {level > 0 ? (
        <h1 className="text-3xl transition-all text-white font-bold">Level: {level}</h1>
      ) : (
        <h1 className="text-4xl transition-all text-white font-bold">Press Any Key to Start</h1>
      )}
      <h1 className="text-3xl transition-all text-white font-bold">Highest: {highestLevel}</h1>
    </div>
  </div>
);

export default HeaderDisplay;
