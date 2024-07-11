"use client"
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Game from "./game";

const getStats = (stats: any) => {
  let history = [...stats["history"]]
  history.push({...stats["today"]})

  if (history.length === 0) {
    return {
      wordsDeciphered: 0,
      dailyStreak: 0,
    }
  }

  let wordsDeciphered = 0
  history.forEach((day: any) => {
    wordsDeciphered += day["words"].filter((w: any) => w["status"] === "correct").length
  })

  let dailyStreak = 0
  let lastDay = history[0]["day"] - 1
  history.forEach((day: any) => {
    if (day["day"] === lastDay + 1 && day["words"].filter((w: any) => w["status"] !== "incomplete").length > 0) {
      dailyStreak += 1
    } else {
      console.log(stats["today"]["day"], lastDay + 1)
      if (stats["today"]["day"] !== lastDay + 1)
        dailyStreak = 0
    }
    lastDay = day["day"]
  })
  return {
    wordsDeciphered: wordsDeciphered,
    dailyStreak: dailyStreak
  }
}

const GameWrapper = (props: any) => {
  const [currentWordI, setCurrentWordI] = useState(0);
  const [gameEnded, setGameEnded] = useState(false)
  const [wonGame, setWonGame] = useState(false)
  const [readableStats, setReadableStats] = useState({
    wordsDeciphered: 0,
      dailyStreak: 0
  })

  const [stats, setStats] = useLocalStorage("stats", {
    history: [],
    today: {
      day: -1,
      words: [
        {
          word: "placeholder",
          status: "incomplete", // correct, incorrect or incomplete
          guess: null,
          wpms: []
        }
      ]
    },
  })

  useEffect(() => {
    setCurrentWordI(0)
  }, [props.words])

  useEffect(() => {
    if (stats["today"]["day"] !== props.day) {
      console.log("Creating default daily stats")
      console.log(props.words)
      let newStats = {...stats}
      if (newStats["today"]["day"] !== -1) {
        console.log("Pushing daily to history")
        console.log(newStats["today"])
        // check if any of the history days are the same as today
        // if so, dont push to history
        // if not, push today to history

        let daysInHistory = newStats["history"].map((h: any) => h["day"])
        if (!daysInHistory.includes(props.day)) {
          // @ts-ignore
          newStats["history"].push({...newStats["today"]})
        }
      } else {
        console.log("Skipped moving placeholder to history")
      }

      newStats["today"] = {
        day: props.day,
        words: props.words.map((word: string) => {
          return {
            word: word,
            status: "incomplete",
            guess: null,
            wpms: []
          }
        })
      }
      console.log(newStats)
      setStats(newStats)
    }
  }, [props.day, props.words])

  useEffect(() => {
    setReadableStats(getStats(stats))
  }, [stats])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cyan-700 font-mono">
      <div className="absolute top-0 left-0">
        <p>Words Deciphered: {readableStats["wordsDeciphered"]}</p>
        <p>Daily Streak: {readableStats["dailyStreak"]}</p>
      </div>

      <div className="flex flex-col items-center">
        <h1 className=" text-6xl">Daily Morse</h1>
        <div className=" h-20"></div>
        
        <Game 
          word={props.words[currentWordI]} 
          onGameEnded={(correct: boolean, wordGuess: string) => {
            setGameEnded(true)
            setWonGame(correct)

            let newStats = {...stats}
            newStats["today"]["words"][currentWordI]["status"] = correct ? "correct" : "incorrect"
            // @ts-ignore
            newStats["today"]["words"][currentWordI]["guess"] = wordGuess
            setStats(newStats)
          }}
          onSoundPlay={(wpm: number) => {
            let newStats = {...stats}
            console.log("played sound")
            // @ts-ignore
            newStats["today"]["words"][currentWordI]["wpms"].push(wpm)
            setStats(newStats)

          }}
          />
        {gameEnded && <div className="flex items-center mt-2">
          {<p>{
            wonGame ? 
            "You deciphered the word!" :
            "Incorrect, the word was " + props.words[currentWordI] + "."
          }</p>}
          {currentWordI + 1 < props.words.length && <button 
            onClick={() => {
              setCurrentWordI(currentWordI + 1)
              setGameEnded(false)
            }}
            className="border-b border-white px-1 ml-1"
            >Next Word
          </button>}
          <p className="ml-1">{`[${currentWordI + 1}/${props.words.length}]`}</p>
        </div>}
        

      </div>
    </main>
  );
}

export default GameWrapper