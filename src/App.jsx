import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';


const App = () => {
  const colorLists = ['green', 'red', 'yellow', 'blue'];
  const colorClassMap = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
  };
  
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
        <div className='min-h-30 w-full '>
          {level > 0 && (
              <button
                onClick={resetGame}
                className="my-4 text-white text-xl border px-4 py-2 rounded hover:bg-white hover:text-black"
              >
                Restart Game
              </button>
          )}
          <div className="w-full flex justify-between items-center mb-5">
            { level > 0 ?(
                <h1 className="text-3xl text-white font-bold">Level: {level}</h1>
            ) 
            : (<h1 className="text-4xl text-white font-bold">Press Any Key to Start</h1>)
            }
            <h1 className="text-3xl text-white font-bold">Highest: {highestLevel}</h1>
          </div>
        </div>
        <div className='grid grid-cols-2 w-full h-full gap-4 mt-10'>
          {colorLists.map((color) => (
            <button
              id={color}
              key={color}
              className={`${colorClassMap[color]} rounded-lg w-full h-full transition-opacity duration-150`}
              disabled={!gameStarted}
              onClick={() => handleClick(color)}
            ></button>
          ))}
        </div>
      </main>
    </>
  )
}

export default App