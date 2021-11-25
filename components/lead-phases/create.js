import Image from "next/image";
import { useState } from "react";

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
    transform: "translate(-50%, -50%) rotate(5deg)",
  },
  photo: {
    transform: "rotate(5deg)",
  },
  text: { transform: "rotate(-5deg)" },
};

function Avatar() {
  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  return (
    <div className="absolute mt-12 right-12" style={style.photo}>
      <div className="absolute z-10 w-full h-full flex flex-col justify-end">
        <button className="choose-button2 borders" onClick={() => playChoose()}>
          выбрать аватар
        </button>
      </div>

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/icon-frame.png"
          alt="Аватар игрока"
          width={400 * 0.5}
          height={480 * 0.5}
          loading="eager"
        />
      </div>
    </div>
  );
}

function PaperUpper({ nickname, setNickname }) {
  return (
    <div style={style.paper2}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 justify-center"
        style={style.text}
      >
        <p className="text-2xl"> Логин </p>

        <input
          type="text"
          placeholder="Введите ваш логин"
          className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.substring(0, 16))}
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

function Paper({ socket, nickname }) {
  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Создание игры
        </h1>

        <h2 className="text-xl tracking-widest mt-8">Выбор вопросов</h2>

        <input
          type="file"
          placeholder="Введите ваш логин"
          className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
        />

        <a
          href="/docs/questions.txt"
          className="choose-button3 borders"
          onClick={() => playChoose()}
          download
        >
          скачать пример
        </a>

        <div className="mt-4 w-full flex flex-col">
          <button
            className={
              "choose-button2 borders " + (nickname.length ? "" : "disabled")
            }
            onClick={() => {
              socket.emit("login lead", {
                nickname,
              });

              playChoose();
            }}
          >
            создать
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

export default function CreateGame({ socket }) {
  const [nickname, setNickname] = useState("");

  return (
    <>
      <Paper socket={socket} nickname={nickname} />
      <PaperUpper nickname={nickname} setNickname={setNickname} />
      <Avatar />
    </>
  );
}
