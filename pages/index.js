import Head from "next/head";
import Image from "next/image";

import QuestionTablet from "../components/question-tablet";
import NotepadScore from "../components/notepad-score";
import IconsImages from "../components/icons-images";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <div className="flex flex-col justify-end h-screen pointer-events-none">
          <Image
            src="/assets/game background.png"
            alt="Задний фон игры"
            width={1920}
            height={1080}
          />
        </div>

        <div id="loading-paper" className="absolute bottom-0 mx-auto">
          <div className="absolute z-10 w-full h-full flex flex-col justify-center">
            <p className="mx-8 text-center text-4xl">
              Загрузка, <br /> пожалуйста подождите
            </p>
          </div>

          <div className="z-0 pointer-events-none">
            <Image
              src="/assets/paper.png"
              alt="Бумага загрузки"
              width={220 * 1.5}
              height={270 * 1.5}
            />
          </div>
        </div>

        <IconsImages />
        <NotepadScore />
        <QuestionTablet />
      </main>
    </>
  );
}
