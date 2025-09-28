import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';

import GameButton from './components/GameButton';
import HeaderDisplay from './components/Header';

 
const App = () => {
  const colorLists = ['green', 'red', 'yellow', 'blue'];
  
  const [gameStarted, setGameStarted] = useState(false);
  const [userSequence, setUserSequence] = useState([]);
  const [gameSequence, setGameSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);

  useEffect(() => {
    const savedHigh = localStorage.getItem('highestLevel');
    if (savedHigh) {
      setHighestLevel(Number(savedHigh));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('highestLevel', highestLevel);
    const startGame = (() => {
     if(!gameStarted){
        setGameStarted(true);
        setTimeout(() => {
          nextSequence();
        }, 500)
     } 
    })

    document.addEventListener("keydown", startGame);
    
    return () => { document.removeEventListener("keydown", startGame)}
  }, [gameStarted, highestLevel])

  const nextSequence = async () => {
    setUserSequence([]);
    const newLevel = level + 1;
    setLevel(newLevel);
    if (newLevel > highestLevel) {
      setHighestLevel(newLevel);
    }

    const randomColor = colorLists[Math.floor(Math.random() * 4)];
    const newSequence = [...gameSequence, randomColor];
    setGameSequence(newSequence);
    
    const speed = Math.max(600 - newLevel * 30, 150);
    await playSequence(newSequence, speed);    
  }

  const playSequence = async (sequence, speed) => {
    for(let i = 0; i < sequence.length; i++){
      const color  = sequence[i];
      await new Promise((resolve) => {
        setTimeout(() => {
          flashButton(color);
          playSound(color);
          resolve();
        }, speed);
      });
    };
  };

  const flashButton = (color) => {
    const btn = document.getElementById(color);

    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate on click/flash
    }
    if(btn){
      btn.classList.add("opacity-50");
    
      setTimeout(() => {
        btn.classList.remove("opacity-50");
      }, 500)
    }
  }

  const handleClick = ((color)=> {
    const newSequence = [...userSequence, color];
    setUserSequence(newSequence);
    flashButton(color);
    playSound(color);

    const currentIndex = newSequence.length - 1;
    if(newSequence[currentIndex] !== gameSequence[currentIndex]){
      toast((t) => (
        <span>
          ❌ Wrong! Game Over.
          <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-sm underline">Dismiss</button>
        </span>
      ));
      playSound("wrong");
      resetGame();
      return;
    }
    console.log(newSequence.length, gameSequence.length);

    if (newSequence.length === gameSequence.length) {
      setTimeout(() => {
          nextSequence();
      }, 500)
    }
  })

  const resetGame  = async () => {
    await playSequence(gameSequence, 400);
    playSound("restart");
    setTimeout(() => {
      setLevel(0);
      setGameSequence([]);
      setUserSequence([]);
      setGameStarted(false);
    }, 1000)
  }

  const playSound = (color) => {
    const audio = new Audio(`/sounds/${color}.mp3`);
    audio.play();
  };

  return (
    <>
      <Toaster onClick={() => toast.dismiss()} />
      <main className=' w-screen h-screen bg-black flex flex-col px-5 py-10 justify-center items-center'>
        <HeaderDisplay level={level} highestLevel={highestLevel} onReset={resetGame} />
        <div className='grid grid-cols-2 w-full h-full gap-4 mt-10'>
          {colorLists.map((color) => (
            <GameButton
              key={color}
              color={color}
              disabled={!gameStarted}
              onClick={handleClick}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export default App