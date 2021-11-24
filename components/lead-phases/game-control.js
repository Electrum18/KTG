import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

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
  text: { transform: "rotate(-5deg)" },
};

const joinPlayerTextEnum = [
  "Ждем присоедение игрока",
  "Игрок еще не готов",
  "Игрок готов к игре!",
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

function Paper({ gamePhase, socket }) {
  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Вопрос 1
        </h1>

        <p className="text-xl tracking-widest text-center my-6">
          Что такое горилка?
        </p>

        <div className="text-base text-gray-500 tracking-widest mx-2">
          Назовите вопрос и нажмите далее
        </div>

        <div className="w-full flex flex-col">
          <button
            className="choose-button2 borders"
            onClick={() => socket.emit("question readed")}
          >
            далее
          </button>

          <button
            className="choose-button3 borders"
            onClick={() => location.reload()}
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

export default function GameControl({ gameIndex, gamePhase, socket }) {
  return (
    <>
      <Paper gamePhase={gamePhase} socket={socket} />
      <PaperUpper gameIndex={gameIndex} />
    </>
  );
}
