import Image from "next/image";

import { useEffect, useState } from "react";

import useSound from "use-sound";

import styles from "../styles/game.module.css";

const tabletStyles = [
  {
    filter: "drop-shadow(10rem 20rem 30rem black)",
    transform:
      "translateY(140%) scale(1.2) perspective(10rem) rotate3d(1, 0, 0, 0deg) rotate(0deg)",
  },
  {
    filter: "drop-shadow(10rem 20rem 30rem black)",
    transform:
      "translateY(70%) scale(1.2) perspective(10rem) rotate3d(1, 0, 0, 0deg) rotate(0deg)",
  },
  {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform:
      "translateY(20%) perspective(10rem) rotate3d(1, 0, 0, 5deg) rotate(-10deg)",
  },
];

function Hand({ selectedId }) {
  return (
    <div
      id="hand"
      className="absolute pointer-events-none transition-all duration-500"
      style={{
        right: -22 + (selectedId === null && -20) + "rem",
        top: 18 + (selectedId || 0) * 5 + "rem",
      }}
    >
      <Image
        src="/assets/arm.png"
        alt="Рука"
        width={820 * 0.6}
        height={780 * 0.6}
      />
    </div>
  );
}

export default function QuestionTablet() {
  const [animationState, setAnimationState] = useState(0);

  const [playStart] = useSound("/sound/pen-at-paper.mp3", {
    volume: 0.25,
    onend: () => {
      setAnimationState(1);
    },
  });

  const [playPlacePaper] = useSound("/sound/item-placed.mp3", {
    volume: 0.25,
  });

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
    onend: () => {
      console.log("end");
    },
  });

  const [question, setQuestion] = useState("Что такое горилка?");

  const [quotes, setQuotes] = useState([
    "Маленькая обезьянка",
    "Паяльная лампа",
    "Водка на украинском",
    "Медийная личность",
  ]);

  const [rightQueue, setRightQueue] = useState("Водка на украинском");

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (playStart) playStart();
  }, [playStart]);

  useEffect(() => {
    switch (animationState) {
      case 1:
        setTimeout(() => {
          setAnimationState(2);
        }, 2e3);
        break;

      case 2:
        playPlacePaper();
        break;
    }
  }, [animationState]);

  return (
    <div
      id="tablet"
      className={"absolute bottom-0 mx-auto transition-all duration-500"}
      style={tabletStyles[animationState]}
    >
      <div
        onPointerLeave={() => setSelectedId(null)}
        className="absolute z-10 w-full h-full pt-48"
      >
        <h2
          className={
            (question.length < 32 ? "text-4xl" : "text-2xl") +
            " mx-8 text-center break-all"
          }
        >
          {question}
        </h2>

        <div
          className={
            (question.length < 32 ? "mt-8" : "mt-4") +
            " mx-8 flex flex-col px-8"
          }
        >
          {quotes.map((quote, id) => (
            <button
              key={quote}
              onPointerEnter={() => setSelectedId(id)}
              onClick={() => playChoose()}
              className="choose-button borders"
            >
              {quote}
            </button>
          ))}
        </div>

        {animationState > 1 && <Hand selectedId={selectedId} />}
      </div>

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/clipboard.png"
          alt="Клипборд"
          width={512}
          height={512 * 1.5}
        />
      </div>
    </div>
  );
}
