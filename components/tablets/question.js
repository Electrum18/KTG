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

const style = {
  note: {
    width: "fit-content",
    right: "-30%",
    position: "absolute",
    bottom: "20%",
    transform: "scaleX(-1)",
  },
  text: { transform: "rotate(-10deg) scaleX(-1)" },
};

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

function Note({ voting, socket }) {
  const helpers = useQuestions((state) => state.helpers);

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;

    if (time) {
      timer = setTimeout(() => setTime(time - 1), 1e3);
    }

    if (!voting) clearTimeout(timer);

    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  useEffect(() => {
    setTime(+voting * 60);
  }, [voting]);

  return (
    <div style={style.note}>
      <div
        className="absolute z-20 w-full h-full flex flex-col mt-4 justify-center pl-12 pr-6"
        style={style.text}
      >
        {time ? (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-widest text-center">
              Голосование
            </h1>

            <p className="text-4xl font-bold tracking-widest text-center">
              {time}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-widest text-center">
              Подсказки
            </h1>

            <button
              className={
                "choose-button2 borders " +
                (helpers.percent50 ? "" : "disabled")
              }
              onClick={() => {
                socket.emit("help 50 percent");
                playChoose();
              }}
            >
              50 на 50
            </button>

            <button
              className={
                "choose-button2 borders " +
                (helpers.helpByLead ? "" : "disabled")
              }
              onClick={() => {
                socket.emit("help by lead");
                playChoose();
              }}
            >
              помощь ведущего
            </button>

            <button
              className={
                "choose-button2 borders " +
                (helpers.helpByViewers ? "" : "disabled")
              }
              onClick={() => {
                socket.emit("help by viewers");
                playChoose();
              }}
            >
              помощь зрителей
            </button>
          </div>
        )}
      </div>

      <div className="z-10">
        <Image
          src="/assets/note.png"
          alt="Логотип"
          width={565 / 2}
          height={480 / 2}
          loading="eager"
        />
      </div>
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

  const [playVoted] = useSound("/sound/vote.mp3", {
    volume: 0.5,
  });

  return [playStart, playPlacePaper, playChoose, playVoted];
}

export default function QuestionTablet({
  exludedVariants,
  voting,
  votes,
  socket,
}) {
  const [animationState, setAnimationState] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [choosed, setChoosed] = useState(false);

  const [playStart, playPlacePaper, playChoose, playVoted] = Sounds();

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
    setChoosed(false);
  }, [inVariants]);

  useEffect(() => {
    let timer;

    if (animationState == 0 && playStart) {
      playStart();

      timer = setTimeout(() => setAnimationState(1), 1500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [animationState, playStart]);

  useEffect(() => {
    if (socket) {
      socket.emit("get stage", animationState);

      switch (animationState) {
        case 2:
          playPlacePaper();
          break;
      }
    }
  }, [socket, animationState]);

  useEffect(() => {
    if (socket && selectedId !== undefined && choosed) {
      socket.emit("choosed question", selectedId);
    }
  }, [socket, choosed, selectedId]);

  useEffect(() => {
    socket && socket.emit("variant pointed", selectedId);
  }, [socket, selectedId]);

  const [votePercent, setVotePercent] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const max = votes.reduce((acc, val) => acc + val, 0);

    setVotePercent(votes.map((val) => Math.round((val / max) * 100)));

    if (max > 0) playVoted();
  }, [votes]);

  return (
    <div
      id="tablet"
      className={"absolute bottom-0 mx-auto transition-all duration-500"}
      style={tabletStyles[animationState]}
    >
      <div
        onPointerLeave={() => !choosed && setSelectedId(null)}
        className="absolute z-10 w-full h-full pt-48"
      >
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
              onPointerEnter={() => !choosed && setSelectedId(id)}
              onClick={() => {
                playChoose();
                setChoosed(true);
              }}
              className={
                "choose-button borders " +
                ((choosed && id !== selectedId) || exludedVariants[id]
                  ? "disabled"
                  : "")
              }
            >
              {quote}
              {votePercent[id] > 0 && (
                <span className="text-blue-500">
                  {" " + votePercent[id] + "%"}
                </span>
              )}
            </button>
          ))}
        </div>

        <Note voting={voting} socket={socket} />

        {animationState > 1 && !choosed && <Hand selectedId={selectedId} />}
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
