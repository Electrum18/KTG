import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import useSound from "use-sound";

import Background from "../components/background";
import Light from "../components/lighting";
import Metadata from "../components/metadata";

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
    transform: "translate(-50%, -50%) rotate(5deg)",
  },
  text: { transform: "rotate(-5deg)" },
};

const prices = [
  1_000_000, 500_000, 250_000, 125_000, 64_000, 32_000, 16_000, 8_000, 4_000,
  2_000, 1_000, 500, 300, 200, 100, 0,
];

function addSpaces(value) {
  if (value.length > 6) {
    return value.replace(/(\d+)(\d{3})(\d{3})/g, "$1 $2 $3");
  } else {
    return value.replace(/(\d+)(\d{3})/g, "$1 $2");
  }
}

function Paper() {
  const router = useRouter();

  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [playEnd] = useSound("/sound/the-end.mp3", {
    volume: 0.2,
  });

  const [title, setTitle] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (playEnd) playEnd();
  }, [playEnd]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    setScore(queryParams.get("score") || 0);
    setTitle(
      queryParams.get("player") === "lead"
        ? "Результат игрока"
        : "Ваш результат"
    );
  }, []);

  return (
    <div style={style.paper}>
      <div
        className="absolute z-20 w-full h-full p-8 flex flex-col justify-center"
        style={style.text}
      >
        <h2 className="text-4xl mt-auto tracking-widest text-center">
          {title}
        </h2>

        <p className="text-xl mt-4 tracking-widest text-center">
          Количество очков:{" "}
          {addSpaces(prices[prices.length - 1 - score].toString())}
        </p>

        <div className="my-auto w-full flex flex-col">
          <button
            className="choose-button borders"
            onClick={() => {
              router.push("/");
              playChoose();
            }}
          >
            назад
          </button>
        </div>
      </div>

      <div className="z-10">
        <Image
          src="/assets/paper2.png"
          alt="Результат"
          width={270 * 2}
          height={220 * 2}
          loading="eager"
        />
      </div>
    </div>
  );
}

export default function Result() {
  return (
    <>
      <Metadata page="result" />

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />

        <div className="absolute bottom-10 mx-auto" style={style.corckboard}>
          <div className="absolute w-full h-full top-0 z-10">
            <Paper />
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

      <Light />
    </>
  );
}
