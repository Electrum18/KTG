import Head from "next/head";
import Image from "next/image";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("Что такое горилка?");

  const [quotes, setQuotes] = useState([
    "Маленькая обезьянка",
    "Паяльная лампа",
    "Водка на украинском",
    "Медийная личность",
  ]);

  const [rightQueue, setRightQueue] = useState("Водка на украинском");

  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <img
          className="h-full max-w-none pointer-events-none"
          src="/assets/game background.png"
          alt="Задний фон игры"
        />

        <div id="tablet" className="absolute bottom-0 mx-auto">
          <div
            onPointerLeave={() => setSelectedId(null)}
            className="absolute z-10 w-full h-full py-48"
          >
            <h2 className="text-4xl text-center">{question}</h2>

            <div className="mx-8 my-16 flex flex-col px-8">
              {quotes.map((quote, id) => (
                <button
                  onPointerEnter={() => setSelectedId(id)}
                  className="text-gray-800 border-2 border-gray-800 rounded-lg p-2 my-2 font-bold"
                >
                  {quote}
                </button>
              ))}
            </div>

            <div
              className="absolute pointer-events-none"
              style={{
                right: -22 + (selectedId === null && -20) + "rem",
                top: 19 + (selectedId || 0) * 3.8 + "rem",
              }}
            >
              <Image
                src="/assets/arm.png"
                alt="Рука"
                width={820 * 0.6}
                height={780 * 0.6}
              />
            </div>
          </div>

          <div className="z-0 pointer-events-none">
            <Image
              src="/assets/clipboard.png"
              alt="Клипборд"
              width={512}
              height={512 * 1.5}
            />
          </div>
        </div>
      </main>
    </>
  );
}
