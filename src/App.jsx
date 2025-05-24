import React from 'react'

const App = () => {
  return (
    <main className='w-screen h-screen flex flex-col justify-center items-center py-10 px-5 bg-black'>
        <h1 className=" text-5xl text-white  font-bold ">Press A Key to Start</h1>
        <div class="grid grid-cols-2 gap-4 w-full h-full mx-auto mt-10">
          <button id="green" class="bg-green-500 rounded-lg w-full h-full"></button>
          <button id="red" class="bg-red-500 rounded-lg w-full h-full"></button>
          <button id="yellow" class="bg-yellow-400 rounded-lg w-full h-full"></button>
          <button id="blue" class="bg-blue-500 rounded-lg w-full h-full"></button>
        </div>
    </main>
  )
}

export default App