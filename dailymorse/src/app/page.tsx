"use client";
import { useEffect, useRef, useState } from "react";
import GameWrapper from "./gamewrapper";


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
const dayConst = Math.ceil((todaysDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

const getDailyWords = (day: number) => {
  let dailyWordsTemp: string[] = [];
  for (let i = 0; i < wordsPerDay; i++) {
    dailyWordsTemp.push(words[(day * i) % words.length])
  }
  return dailyWordsTemp
}


export default function Home() {
  const [devMode, setDevMode] = useState(false);
  const [day, setDay] = useState(dayConst);
  const [dailyWords, setDailyWords] = useState(getDailyWords(dayConst));

  useEffect(() => {
    setDevMode(window.location.hostname === "localhost" && window.location.hash === "#dev")
  }, [])

  useEffect(() => {
    // @ts-ignore
    setDailyWords(getDailyWords(day))
  }, [day])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cyan-700 font-mono">
      {devMode && <div className="absolute top-0 right-8 text-red-800 flex flex-col">
        <p>DEV MODE</p>
        <div className="flex gap-4">
          <button onClick={() => {
            setDay(day - 1)
          }}>&lt;</button>
          <p className="mx-4">Day: {day}</p>
          <button onClick={() => {
            setDay(day + 1)
          }}>&gt;</button>
        </div>
        <button onClick={() => {
          localStorage.clear()
          window.location.reload()
        }}
          className="px-2 border border-red-800 rounded-md"
        
        >Reset Stats</button>
        <p>Answer: {dailyWords.join(" ")}</p>
      </div>}

      <GameWrapper
        day={day}
        words={dailyWords}
      />

    </main>
  );
}
