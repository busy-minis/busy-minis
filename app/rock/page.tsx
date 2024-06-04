"use client";
import React, { useEffect } from "react";
import Image from "next/image";
export default function Page() {
  const [choice, setChoice] = React.useState("rock");
  const choices = ["rock", "paper", "scissors"];
  const [computerChoice, setComputerChoice] = React.useState("");

  const [gameStarted, setGameStarted] = React.useState(false);
  const [draw, setDraw] = React.useState(false);
  const [win, setWin] = React.useState(false);
  const [lose, setLose] = React.useState(false);

  const playGame = (props: { choice: string }) => {
    const chosenChoice = props.choice;
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    setGameStarted(true);
    setChoice(chosenChoice);
    setComputerChoice(computerChoice);

    if (chosenChoice === computerChoice) {
      setDraw(true);
    } else if (
      (chosenChoice === "rock" && computerChoice === "scissors") ||
      (chosenChoice === "scissors" && computerChoice === "paper") ||
      (chosenChoice === "paper" && computerChoice === "rock")
    ) {
      setWin(true);
    } else {
      setLose(true);
    }
  };
  return (
    <div className="  flex flex-col items-center h-screen bg-[#FFEA00]  ">
      <h1 className="mb-24 mt-8 text-5xl title tracking-tighter font-bold">
        ROCK PAPER SCISSORS
      </h1>
      <div className="h-96 w-full bg">
        {gameStarted && (
          <section className="flex w-full justify-around">
            <PlayerImage choice={choice} />
            <ComputerImage choice={computerChoice} />
          </section>
        )}
      </div>

      {!gameStarted && (
        <section className="flex gap-8 mb-8  ">
          <Choice playGame={playGame} choice="rock" setChoice={setChoice} />
          <Choice playGame={playGame} choice="paper" setChoice={setChoice} />
          <Choice playGame={playGame} choice="scissors" setChoice={setChoice} />
        </section>
      )}

      {}
      {draw && (
        <div className="text-6xl tracking-tighter font-bold">ITS A DRAW </div>
      )}
      {win && (
        <div className="text-6xl tracking-tighter font-bold">YOU WIN </div>
      )}
      {lose && (
        <div className="text-6xl tracking-tighter font-bold">YOU LOSE </div>
      )}
      {gameStarted && (
        <button
          onClick={() => {
            setGameStarted(false);
            setDraw(false);
            setWin(false);
            setLose(false);
          }}
          className="text-2xl bg-neutral-800 -700 py-4 rounded-md mt-8 text-neutral-200 px-8 font-bold tracking-tighter"
        >
          Play Again
        </button>
      )}
    </div>
  );
}

const PlayerImage = (props: { choice: string }) => {
  return (
    <div>
      <Image
        src={`/p/${props.choice}.png`}
        alt="Rock"
        width={300}
        height={300}
        className=" shadow-md "
      />
    </div>
  );
};
const ComputerImage = (props: { choice: string }) => {
  return (
    <div>
      <Image
        src={`/e/${props.choice}.png`}
        alt="Rock"
        width={300}
        height={300}
        className=" shadow-md"
      />
    </div>
  );
};

const Choice = (props: { playGame: any; choice: string; setChoice: any }) => {
  return (
    <div onClick={() => props.setChoice(props.choice)}>
      <div
        onClick={() => props.playGame({ choice: props.choice })}
        className="bg-neutral-800 -700 px-8 py-2 rounded-md text-2xl title cursor-pointer hover:bg-orange-800 transition-colors duration-500 text-neutral-200"
      >
        {props.choice}
      </div>
    </div>
  );
};
