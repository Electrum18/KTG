import Image from "next/image";

import { useEffect, useState } from "react";

import useSound from "use-sound";

import prices from "../../configs/score";

const style = {
  paper: {
    width: "fit-content",
    left: "50%",
    position: "absolute",
    top: "65%",
    transform: "translate(-50%, -50%)",
  },
  paper2: {
    width: "fit-content",
    left: "30%",
    position: "absolute",
    top: "27%",
    transform: "translate(-50%, -50%) rotate(-5deg)",
  },
  paper3: {
    width: "fit-content",
    right: "-15%",
    position: "absolute",
    top: "30%",
    transform: "translate(-50%, -50%) rotate(5deg)",
  },
  text: { transform: "rotate(-5deg)" },
};

function PaperUpper({ viewIndex }) {
  const [joinLink, setJoinLink] = useState("");

  useEffect(() => {
    setJoinLink(location.origin + "/view/" + viewIndex);
  }, [viewIndex]);

  return (
    <div style={style.paper2}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 justify-center"
        style={style.text}
      >
        <p className="text-2xl"> Просмотр игры (для всех) </p>

        <input
          type="text"
          placeholder="Введите ваш логин"
          className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
          onChange={() =>
            viewIndex && setJoinLink(location.origin + "/view/" + viewIndex)
          }
          value={joinLink}
        />
      </div>

      <div className="z-20">
        <Image
          src="/assets/paper2.png"
          alt="Оповещение"
          width={270 * 1.2}
          height={220 * 0.8}
          loading="eager"
        />
      </div>
    </div>
  );
}

function PaperUpperRight({ userInfo }) {
  return (
    <div style={style.paper3}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 justify-center"
        style={style.text}
      >
        <p className="text-2xl"> Никнейм: {userInfo.nickname} </p>
        <p className="text-2xl"> Уровень: {userInfo.level + 1} </p>
        <p className="text-2xl">
          Очки: {prices[prices.length - 1 - userInfo.level]}
        </p>
      </div>

      <div className="z-20">
        <Image
          src="/assets/paper2.png"
          alt="Оповещение"
          width={270 * 1.2}
          height={220 * 0.8}
          loading="eager"
        />
      </div>
    </div>
  );
}

const subtextEnum = [
  "Назовите вопрос и нажмите далее",
  "Ожидайте выбор вопроса игроком",
  "Игрок выбрал вопрос, ваше мнение?",
];

const socketMethodEnum = ["question readed", undefined, "question taken"];

function Paper({
  gameLevel,
  gameQuestion,
  gamePhase,
  gameChoose,
  needsHelp,
  socket,
  voting,
}) {
  const [disabled, setDisabled] = useState();

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [playPlayerChoosed] = useSound("/sound/notice.mp3", {
    volume: 0.5,
  });

  const [playPlayerNotice] = useSound("/sound/notice2.mp3", {
    volume: 0.2,
  });

  useEffect(() => {
    setDisabled(gamePhase === 1);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === 2 && playPlayerChoosed) playPlayerChoosed();
  }, [gamePhase, playPlayerChoosed]);

  useEffect(() => {
    if (gamePhase === 1 && (needsHelp || voting)) playPlayerNotice();
  }, [gamePhase, needsHelp, voting]);

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
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Вопрос {gameLevel}
        </h1>

        <p className="text-xl tracking-widest text-center my-4">
          {gameQuestion}
        </p>

        {(voting || needsHelp) && (
          <p className="text-xl text-green-500 tracking-widest text-center mb-2">
            {voting
              ? `Зрители голосуют ${time} секунд`
              : "Игрок запросил помощь ведущего"}
          </p>
        )}

        <div className="text-base text-gray-500 tracking-widest mx-2">
          {gamePhase + 1 + " | " + subtextEnum[gamePhase]}
        </div>

        {gameChoose && (
          <div className="text-base text-gray-500 tracking-widest mx-2">
            Ответ: {gameChoose}
          </div>
        )}

        <div className="w-full flex flex-col">
          <button
            className={"choose-button2 borders " + (disabled ? "disabled" : "")}
            onClick={() => {
              if (socketMethodEnum[gamePhase]) {
                socket.emit(socketMethodEnum[gamePhase]);
                playChoose();
              }
            }}
          >
            далее
          </button>

          <button
            className="choose-button3 borders"
            onClick={() => {
              location.reload();
              playChoose();
            }}
          >
            заново
          </button>
        </div>
      </div>

      <div className="z-10">
        <Image
          src="/assets/paper2.png"
          alt="Оповещение"
          width={270 * 2}
          height={220 * 2}
          loading="eager"
        />
      </div>
    </div>
  );
}

export default function GameControl({
  gameLevel,
  gameQuestion,
  gameIndex,
  gamePhase,
  gameChoose,
  socket,
  userInfo,
  viewIndex,
  needsHelp,
  voting,
}) {
  return (
    <>
      <Paper
        gameLevel={gameLevel}
        gameQuestion={gameQuestion}
        gamePhase={gamePhase}
        gameChoose={gameChoose}
        socket={socket}
        needsHelp={needsHelp}
        voting={voting}
      />

      <PaperUpper viewIndex={viewIndex} />

      <PaperUpperRight userInfo={userInfo} />
    </>
  );
}
