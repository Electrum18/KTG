import Image from "next/image";

import { useEffect, useState } from "react";
import shallow from "zustand/shallow";

import useSound from "use-sound";

import useQuestions from "../../helpers/questions";

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
        loading="eager"
      />
    </div>
  );
}

function Sounds() {
  const [playStart] = useSound("/sound/pen-at-paper.mp3", {
    volume: 0.25,
  });

  const [playPlacePaper] = useSound("/sound/item-placed.mp3", {
    volume: 0.25,
  });

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  return [playStart, playPlacePaper, playChoose];
}

export default function QuestionViewerTablet({
  selectedId,
  choosedQuestion,
  setChoosedQuestion,
  socket,
}) {
  const [animationState, setAnimationState] = useState(0);

  const [playStart, playPlacePaper, playChoose] = Sounds();

  const [inLevel, inStage, inQuestion, inVariants] = useQuestions(
    (state) => [state.level, state.stage, state.question, state.variants],
    shallow
  );

  const [level, setLevel] = useState(0);
  const [question, setQuestion] = useState();
  const [variants, setVariants] = useState();

  useEffect(() => setLevel(inLevel), [inLevel]);
  useEffect(() => setAnimationState(inStage), [inStage]);
  useEffect(() => setQuestion(inQuestion), [inQuestion]);
  useEffect(() => {
    setVariants(inVariants);
    setChoosedQuestion(false);
  }, [inVariants]);

  useEffect(() => {
    let timer;

    if (animationState == 0 && playStart) {
      playStart();

      timer = setTimeout(() => setAnimationState(1), 1500);
    }

    return timer;
  }, [animationState, playStart]);

  useEffect(() => {
    switch (animationState) {
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
      <div className="absolute z-10 w-full h-full pt-48">
        <h2
          className={
            ((question || "").length < 32 ? "text-4xl" : "text-2xl") +
            " mx-8 text-center break-all"
          }
        >
          {question}
        </h2>

        <div
          className={
            ((question || "").length < 32 ? "mt-8" : "mt-4") +
            " mx-8 flex flex-col px-8"
          }
        >
          {(variants || []).map((quote, id) => (
            <button
              key={quote}
              className={
                "choose-button borders " +
                (choosedQuestion && choosedQuestion === quote ? "" : "disabled")
              }
            >
              {quote}
            </button>
          ))}
        </div>

        {animationState > 1 && !choosedQuestion && (
          <Hand selectedId={selectedId} />
        )}
      </div>

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/clipboard.png"
          alt="Клипборд"
          width={512}
          height={512 * 1.5}
          loading="eager"
        />
      </div>
    </div>
  );
}
