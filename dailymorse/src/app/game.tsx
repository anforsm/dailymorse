"use client"

import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

const morse = require('morse-decoder');


const playMorseSound = (text: string, intercharacterGap: number) => {
  let ended = false;
  let audio = morse.audio(text, {
    unit: 0.1,
    fwUnit: intercharacterGap,
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
      props.onGameEnded(guess === props.word)
  }

  return <div className="flex flex-col items-center justify-center gap-4">
    <button onClick={() => {
      console.log(cancelSound)
      if (cancelSound()) {
        setCancelSound(() => () => false)
        return
      }

      console.log("hi")
      let intercharacterGap = (5 - speed) / 10
      let cancel = playMorseSound(props.word, intercharacterGap)
      if (props.onSoundPlay)
        props.onSoundPlay(intercharacterGap)
      setCancelSound(() => cancel)

    }} className="border border-white rounded-md px-4 py-2 text-2xl">
      Play Sound
    </button>

    <div className="flex flex-col items-center">
      <div className="text-4xl flex gap-2">
        <button onClick={() => setSpeed(prev => prev > minSpeed ? prev - 1 : prev)}><MdOutlineKeyboardDoubleArrowLeft /></button>
        <p>{speed}</p>
        <button onClick={() => setSpeed(prev => prev < maxSpeed ? prev + 1 : prev)}><MdOutlineKeyboardDoubleArrowRight /></button>
      </div>
      <p className=" text-xs">Speed</p>
    </div>

    <div className="h-4"/>

    <div className="flex">
      <div className="flex border border-white rouned-md">
      <div className="w-8 h-2"/>
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