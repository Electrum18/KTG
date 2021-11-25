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
  text: { transform: "rotate(-5deg)" },
};

const joinPlayerTextEnum = [
  "Ждем присоедение игрока",
  "Игрок еще не готов",
  "Игрок готов к игре!",
];

function PaperUpper({ joinIndex }) {
  const [joinLink, setJoinLink] = useState();

  useEffect(() => {
    setJoinLink(location.origin + "/join/" + joinIndex);
  }, [joinIndex]);

  return (
    <div style={style.paper2}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 justify-center"
        style={style.text}
      >
        <p className="text-2xl"> Приглашение в игру </p>

        <input
          type="text"
          placeholder="Введите ваш логин"
          className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
          onChange={() =>
            joinIndex && setJoinLink(location.origin + "/join/" + joinIndex)
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

function Paper({ joinPhase, socket }) {
  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [playPlayerJoin] = useSound("/sound/notice.mp3", {
    volume: 0.5,
  });

  useEffect(() => {
    if (
      playPlayerJoin &&
      joinPlayerTextEnum[joinPhase[0]] === joinPlayerTextEnum[2]
    ) {
      playPlayerJoin();
    }
  }, [playPlayerJoin, joinPhase]);

  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Ждем игрока
        </h1>

        <h2 className="text-xl tracking-widest mt-8">
          <span>{joinPlayerTextEnum[joinPhase[0]]}</span>

          {joinPhase[1] && <div> Ник: {joinPhase[1]} </div>}
        </h2>

        <div className="mt-4 w-full flex flex-col">
          <button
            className={
              "choose-button2 borders " + (joinPhase[0] === 2 ? "" : "disabled")
            }
            onClick={() => {
              socket.emit("start game");
              playChoose();
            }}
          >
            старт
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

export default function JoinGamePhase({ joinIndex, joinPhase, socket }) {
  return (
    <>
      <Paper joinPhase={joinPhase} socket={socket} />
      <PaperUpper joinIndex={joinIndex} />
    </>
  );
}
