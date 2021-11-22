import Image from "next/image";

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

function Paper() {
  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Ждем игрока
        </h1>

        <h2 className="text-xl tracking-widest mt-8">Игрок еще не готов</h2>

        <div className="mt-4 w-full flex flex-col">
          <button className="choose-button2 borders">старт</button>
          <button className="choose-button3 borders">заново</button>
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

export default function JoinGamePhase({ setPhase, joinIndex, socket }) {
  return (
    <>
      <Paper />
      <PaperUpper joinIndex={joinIndex} />
    </>
  );
}
