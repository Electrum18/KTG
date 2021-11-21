import Head from "next/head";
import Image from "next/image";

import Background from "../components/background";

const style = {
  corckboard: {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform: "perspective(10rem) rotate3d(1, 0, 0, 5deg)",
  },
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
  return (
    <div className="absolute mt-12 right-12" style={style.photo}>
      <div className="absolute z-10 w-full h-full flex flex-col justify-end">
        <button className="choose-button2 borders">выбрать аватар</button>
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

function PaperUpper() {
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
        className="absolute z-30 w-full h-full flex flex-col p-8"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center">Создание игры</h1>

        <h2 className="text-xl tracking-widest mt-8">Выбор вопросов</h2>

        <input
          type="file"
          placeholder="Введите ваш логин"
          className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
        />

        <button className="choose-button3 borders">скачать пример</button>

        <div className="mt-4 w-full flex flex-col">
          <button className="choose-button2 borders">создать</button>
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

export default function Lead() {
  return (
    <>
      <Head>
        <title>Панель ведущего | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />

        <div className="absolute bottom-10 mx-auto" style={style.corckboard}>
          <div className="absolute w-full h-full top-0 z-10">
            <Paper />
            <PaperUpper />
            <Avatar />
          </div>

          <div className="z-0 pointer-events-none">
            <Image
              src="/assets/cork board.png"
              alt="Доска"
              width={782}
              height={560}
              loading="eager"
            />
          </div>
        </div>
      </main>
    </>
  );
}
