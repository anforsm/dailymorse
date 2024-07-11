"use client"

import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

const morse = require('morse-decoder');
const speeds = [0, 5, 10, 15, 20, 25]


const playMorseSound = (text: string, wpm: number) => {
  let ended = false;
  let audio = morse.audio(text, {
    //unit: 0.1,
    //fwUnit: intercharacterGap,
    wpm: wpm,
    oscillator: {
      type: 'sine', // sine, square, sawtooth, triangle
      frequency: 500,  // value in hertz
      onended: function () { // event that fires when the tone stops playing
        console.log('ended');
        ended = true;
      }
    }
  })

  audio.play()

  const cancel = () => {
    audio.stop()
    return !ended
  } // returns if the sound was stopped or not

  return cancel

}

const maxSpeed = 5;
const minSpeed = 1;

const Game = (props: any) => {
  const [speed, setSpeed] = useState(3);
  const [guess, setGuess] = useState("");
  const [gameEnded, setGameEnded] = useState(false)
  const [cancelSound, setCancelSound] = useState(() => () => false)

  useEffect(() => {
    setCancelSound(() => () => false)
    setGameEnded(false)
    setGuess("")

  }, [props.word])

  const checkGuess = () => {
    setGameEnded(true)

    if (props.onGameEnded)
      props.onGameEnded(guess === props.word, guess)
  }

  return <div className="flex flex-col items-center justify-center gap-4">
    <button onClick={() => {
      console.log(cancelSound)
      if (cancelSound()) {
        setCancelSound(() => () => false)
        return
      }

      console.log("hi")
      let wpm = speeds[speed]
      let cancel = playMorseSound(props.word, wpm)
      if (props.onSoundPlay)
        props.onSoundPlay(wpm)
      setCancelSound(() => cancel)

    }} className="border border-white rounded-md px-4 py-2 text-2xl">
      Play Sound
    </button>

    <div className="flex flex-col items-center">
      <p className=" text-sm">Speed</p>
      <div className="text-4xl flex gap-2">
        <button onClick={() => setSpeed(prev => prev > minSpeed ? prev - 1 : prev)}><MdOutlineKeyboardDoubleArrowLeft /></button>
        <p>{speed}</p>
        <button onClick={() => setSpeed(prev => prev < maxSpeed ? prev + 1 : prev)}><MdOutlineKeyboardDoubleArrowRight /></button>
      </div>
      <p className="text-xs">{speeds[speed]} wpm</p>
    </div>

    <div className="h-4"/>

    <div className="flex">
      <div className="w-8 h-2"/>
      <div className="flex border border-white rouned-md">
        <input 
          pattern="[a-zA-Z]*" 
          className=" bg-transparent font-mono text-2xl text-white text-center focus:outline-none uppercase"
          value={guess}
          disabled={gameEnded}
          onChange={(e) => {
            if (gameEnded) 
              return

            setGuess(e.target.value)
          }}
          >
        </input>
        <button className="aspect-square h-16 text-6xl border-l" onClick={() => {
          checkGuess()
        }}><MdOutlineKeyboardArrowRight /></button>
      </div>
    </div>
    
  </div>
}

export default Game