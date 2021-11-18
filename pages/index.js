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
    top: "60%",
    transform: "translate(-50%, -50%) rotate(-85deg)",
  },
  note: {
    width: "fit-content",
    left: "50%",
    position: "absolute",
    top: "0%",
    transform: "translate(-50%, -50%) rotate(0eg)",
  },
  text: { transform: "rotate(85deg)" },
  text2: { transform: "rotate(-10deg)" },
};

function Paper() {
  return (
    <div style={style.paper}>
      <div
        className="absolute z-20 h-full flex flex-col justify-center"
        style={style.text}
      >
        <h2 className="text-4xl tracking-widest text-center">
          Дождитесь ссылки на приглашение в игру
        </h2>
      </div>

      <div className="z-10">
        <Image
          src="/assets/paper.png"
          alt="Доска"
          width={220 * 2}
          height={270 * 2}
          loading="eager"
        />
      </div>
    </div>
  );
}

function Note() {
  return (
    <div style={style.note}>
      <div
        className="absolute z-20 w-full h-full mt-4 flex flex-col justify-center"
        style={style.text2}
      >
        <h1 className="text-6xl font-bold tracking-widest text-center">КТГ</h1>
      </div>

      <div className="z-10">
        <Image
          src="/assets/note.png"
          alt="Доска"
          width={565 / 2}
          height={480 / 2}
          loading="eager"
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Меню игры | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />

        <div
          className="absolute bottom-10 mx-auto pointer-events-none"
          style={style.corckboard}
        >
          <div className="absolute w-full h-full top-0 z-10">
            <Paper />
            <Note />
          </div>

          <div className="z-0">
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
