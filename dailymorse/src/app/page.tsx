"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GiSpeaker } from "react-icons/gi";
const morsify = require('morsify');

const words = ['cat', 'dog', 'sun', 'hat', 'book', 'tree', 'fish', 'ball', 'house', 'bird'];
const dailyWord = words[Math.floor(Math.random() * words.length)]

export default function Home() {
  const [won, setWon] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const guessRef = useRef<HTMLInputElement>(null);


  const playDailyMorseSound = () => {
    const audio = morsify.audio(dailyWord, {
      unit: 0.2, // period of one unit, in seconds, 1.2 / c where c is speed of transmission, in words per minute
      fwUnit: 0.3, // period of one Farnsworth unit to control intercharacter and interword gaps
      //oscillator: {
      //  type: 'sine', // sine, square, sawtooth, triangle
      //  frequency: 500,  // value in hertz
      //  onended: function () { // event that fires when the tone stops playing
      //    console.log('ended');
      //  }
      //}
    });

    audio.play(); // play audio
  }

  const checkGuess = () => {
    setGuessed(true);
    if (guessRef.current && guessRef.current.value === dailyWord) {
      setWon(true);
      console.log("You win")
    } else {
      setWon(false);
      console.log("You lose")
    }
  }


  useEffect(() => {
    //const encoded = morsify.encode('SOS'); // ... --- ...
    //const decoded = morsify.decode('... --- ...'); // SOS
    //const characters = morsify.characters(); // {'1': {'A': '.-', ...}, ..., '11': {'ㄱ': '.-..', ...}}
    //audio.stop(); // stop audio
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cyan-700">
      <div>
        <h1 className=" text-6xl">Daily Morse</h1>
        <div className="h-32"></div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button onClick={() => {
            playDailyMorseSound();
          }} className=""><GiSpeaker className=" text-6xl"/></button>

          <div className="flex">
            <input ref={guessRef} className=" bg-transparent border-b border-white font-mono text-2xl text-white text-center focus:outline-none"></input>
            <button className="aspect-square h-16 text-4xl" onClick={() => {
              checkGuess()
            }}>&gt;</button>
          </div>
          {guessed && (won ? <p>You win!!!!!!!!!</p> : <p>You lose, the word was {dailyWord}</p>)}
        </div>

      </div>
    </main>
  );
}
