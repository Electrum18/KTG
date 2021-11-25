import Image from "next/image";

import { useEffect, useState } from "react";

import useSound from "use-sound";

const tabletStyles = [
  {
    filter: "drop-shadow(10rem 20rem 30rem black)",
    transform:
      "translateY(140%) scale(1.2) perspective(10rem) rotate3d(1, 0, 0, 0deg) rotate(0deg)",
  },
  {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform:
      "translateY(20%) perspective(10rem) rotate3d(1, 0, 0, 5deg) rotate(-10deg)",
  },
];

const style = {
  photo: {
    transform: "rotate(5deg)",
  },
};

function Avatar() {
  return (
    <div className="absolute -mt-16 right-2" style={style.photo}>
      <div className="absolute z-10 w-full h-full flex flex-col justify-end">
        <button className="choose-button2 borders">выбрать аватар</button>
      </div>

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/icon-frame.png"
          alt="Аватар игрока"
          width={400 * 0.4}
          height={480 * 0.4}
          loading="eager"
        />
      </div>
    </div>
  );
}

export default function LoginTablet({ socket, preWaiting, setPreWaiting }) {
  const [animationState, setAnimationState] = useState(0);

  const [playPlacePaper] = useSound("/sound/item-placed.mp3", {
    volume: 0.25,
  });

  const [playPen] = useSound("/sound/pen-at-paper.mp3", {
    volume: 0.25,
  });

  useEffect(() => {
    if (animationState === 0) {
      setTimeout(playPen, 500);

      setTimeout(() => {
        setAnimationState(1);
      }, 3000);
    } else {
      setTimeout(playPlacePaper, 300);
    }
  }, [animationState]);

  const [nickname, setNickname] = useState("");

  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setWaiting(preWaiting), 1e3 * +preWaiting);
  }, [preWaiting]);

  return (
    <div
      id="tablet"
      className={"absolute bottom-0 mx-auto transition-all duration-500"}
      style={tabletStyles[animationState]}
    >
      {waiting ? (
        <div className="absolute z-10 w-full h-full pt-48">
          <h2 className="text-4xl mx-8 text-center"> Ожидание разрешения </h2>

          <div className="w-full justify-center flex flex-row">
            <button
              className={"mx-16 w-full choose-button borders"}
              onClick={() => socket.emit("player changing")}
            >
              Изменить
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute z-10 w-full h-full pt-48">
          <h2 className="text-4xl mx-8 text-center"> Вход в игру </h2>

          <div className="flex flex-row mt-8 mx-8 p-8 mb-4">
            <div className="flex flex-col w-3/5">
              <p className="text-2xl"> Логин </p>

              <input
                type="text"
                placeholder="Введите ваш логин"
                className="border-2 border-gray-800 borders bg-gray-100 p-2 my-2"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.substring(0, 16))}
              />
            </div>

            <div className="flex flex-col w-2/5">
              <Avatar />
            </div>
          </div>

          <div className="w-full justify-center flex flex-row">
            <button
              className={
                "mx-16 w-full choose-button borders " +
                (nickname.length ? "" : "disabled")
              }
              onClick={() => {
                socket.emit("player ready", { nickname });

                setPreWaiting(true);
                setAnimationState(0);
                playPlacePaper();
              }}
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/clipboard.png"
          alt="Клипборд"
          width={512}
          height={512 * 1.5}
          loading="eager"
        />
      </div>
    </div>
  );
}
