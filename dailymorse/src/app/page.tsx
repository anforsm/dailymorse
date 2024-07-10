"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GiSpeaker } from "react-icons/gi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { GiSnail } from "react-icons/gi";
import { SiRabbitmq } from "react-icons/si";
import { useLocalStorage } from "@uidotdev/usehooks";
import Game from "./game";

const wordsPerDay = 3;

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

const todaysDate = new Date();
const startDate = new Date("2024-06-06")
const day = Math.ceil((todaysDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
console.log(day)

//const dailyWords = words[day % words.length]
let dailyWords: string[] = [];
for (let i = 0; i < wordsPerDay; i++) {
  dailyWords.push(words[(day * i) % words.length])
}
const dailyWord = dailyWords.join(" ");

export default function Home() {
  const [currentWordI, setCurrentWordI] = useState(0);
  const [gameEnded, setGameEnded] = useState(false)
  const [wonGame, setWonGame] = useState(false)
  //const [stats, setStats] = useLocalStorage("stats", {
  //  history: [],
  //  today: {
  //    day: day,
  //    words: [
  //      {
  //        word: dailyWord,
  //        status: "incomplete", // correct, incorrect or incomplete
  //        guess: null,
  //      }
  //    ]
  //  },
  //})

  //useEffect(() => {
  //  if (stats["today"]["day"] !== day) {
  //    let newStats = {...stats}
  //    newStats["today"]["day"] = day
  //    newStats["today"]["words"] = []
  //    newStats["today"]["words"][0]["word"] = dailyWord
  //    newStats["today"]["words"][0]["status"] = "incomplete"
  //    setStats(newStats)
  //  }
  //}, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cyan-700 font-mono">
      <div className="absolute top-0 left-0">
        <p>Words Deciphered: 0</p>
        <p>Daily Streak: 0</p>
      </div>

      <div className="flex flex-col items-center">
        <h1 className=" text-6xl">Daily Morse</h1>
        <div className=" h-20"></div>

        
        <Game 
          word={dailyWords[currentWordI]} 
          onGameEnded={(correct: boolean) => {
            setGameEnded(true)
            setWonGame(correct)
          }}
          onSoundPlay={(intercharacterGap: number) => console.log(intercharacterGap)}
          />
        {gameEnded && <div className="flex items-center mt-2">
          {<p>{
            wonGame ? 
            "You deciphered the word!" :
            "Incorrect, the word was " + dailyWords[currentWordI] + "."
          }</p>}
          {currentWordI + 1 < dailyWords.length && <button 
            onClick={() => {
              setCurrentWordI(currentWordI + 1)
              setGameEnded(false)
            }}
            className="border-b border-white px-1 ml-1"
            >Next Word
          </button>}
          <p className="ml-1">{`[${currentWordI + 1}/${dailyWords.length}]`}</p>
        </div>}
        

      </div>
    </main>
  );
}
