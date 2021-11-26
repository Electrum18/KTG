import Image from "next/image";

import { useEffect, useState } from "react";

import useSound from "use-sound";

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

const prices = [
  1_000_000, 500_000, 250_000, 125_000, 64_000, 32_000, 16_000, 8_000, 4_000,
  2_000, 1_000, 500, 300, 200, 100, 0,
];

function PaperUpper({ gameIndex }) {
  const [joinLink, setJoinLink] = useState();

  useEffect(() => {
    setJoinLink(location.origin + "/view/" + gameIndex);
  }, [gameIndex]);

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
            gameIndex && setJoinLink(location.origin + "/view/" + gameIndex)
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

function Paper({ gameLevel, gameQuestion, gamePhase, gameChoose, socket }) {
  const [disabled, setDisabled] = useState();

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [playPlayerChoosed] = useSound("/sound/notice.mp3", {
    volume: 0.5,
  });

  useEffect(() => {
    setDisabled(gamePhase === 1);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === 2 && playPlayerChoosed) playPlayerChoosed();
  }, [gamePhase, playPlayerChoosed]);

  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Вопрос {gameLevel}
        </h1>

        <p className="text-xl tracking-widest text-center my-6">
          {gameQuestion}
        </p>

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
}) {
  return (
    <>
      <Paper
        gameLevel={gameLevel}
        gameQuestion={gameQuestion}
        gamePhase={gamePhase}
        gameChoose={gameChoose}
        socket={socket}
      />

      <PaperUpper gameIndex={gameIndex} />

      <PaperUpperRight userInfo={userInfo} />
    </>
  );
}
