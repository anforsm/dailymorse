"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GiSpeaker } from "react-icons/gi";
const morsify = require('morsify');

const words = [
  "time", "year", "people", "way", "day",
  "man", "thing", "woman", "life", "child",
  "world", "school", "state", "family", "student",
  "group", "country", "problem", "hand", "part",
  "place", "case", "week", "company", "system",
  "program", "question", "work", "government", "number",
  "night", "point", "home", "water", "room",
  "mother", "area", "money", "story", "fact",
  "month", "lot", "right", "study", "book",
  "eye", "job", "word", "business", "issue",
  "side", "kind", "head", "house", "service",
  "friend", "father", "power", "hour", "game",
  "line", "end", "member", "law", "car",
  "city", "community", "name", "president", "team",
  "minute", "idea", "kid", "body", "information",
  "back", "parent", "face", "others", "level",
  "office", "door", "health", "person", "art",
  "war", "history", "party", "result", "change",
  "morning", "reason", "research", "girl", "guy",
  "moment", "air", "teacher", "force", "education"
];
const dailyWord = words[Math.floor(Math.random() * words.length)]

export default function Home() {
  const [won, setWon] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const guessRef = useRef<HTMLInputElement>(null);
  const [speed, setSpeed] = useState(3);
  const [audio, setAudio] = useState(null);


  const playDailyMorseSound = () => {
    if (audio !== null) {
      console.log(audio)
      //@ts-ignore
      let exit = audio.context.state === "running"
      //@ts-ignore
      audio.stop()
      setAudio(null)
      if (exit) {
        return
      }
    }
    let audio2 = morsify.audio(dailyWord, {
      unit: (5 - speed)/10, // period of one unit, in seconds, 1.2 / c where c is speed of transmission, in words per minute
      fwUnit: (5 - speed)/10, // period of one Farnsworth unit to control intercharacter and interword gaps
      //oscillator: {
      //  type: 'sine', // sine, square, sawtooth, triangle
      //  frequency: 500,  // value in hertz
      //  onended: function () { // event that fires when the tone stops playing
      //    console.log('ended');
      //  }
      //}
    });

    //@ts-ignore
    audio2.play(); // play audio
    setAudio(audio2)
  }

  const checkGuess = () => {
    setGuessed(true);
    if (guessRef.current && guessRef.current.value.toLowerCase() === dailyWord) {
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

          <p>Speed</p>
          <div className="">
            <input type="range" min="1" max="5" value={speed} step={1} onChange={val => {console.log(val); setSpeed(Number(val.target.value))}} className="" id=""/>
          </div>

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
