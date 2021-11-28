import ImageNext from "next/image";

import { useEffect, useRef, useState } from "react";

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

function Avatar({ setAvatar }) {
  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const canvas = useRef();

  const [file, setFile] = useState();

  const [image, setImage] = useState("");

  useEffect(() => {
    if (canvas.current && image) {
      const ctx = canvas.current.getContext("2d");
      const img = new Image();

      ctx.fillRect(0, 0, 256, 256);

      img.src = image;

      img.onload = function () {
        const hRatio = 256 / img.width;
        const vRatio = 256 / img.height;

        const ratio = Math.max(hRatio, vRatio);

        const centerShift_x = (256 - img.width * ratio) / 2;
        const centerShift_y = (256 - img.height * ratio) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );

        setAvatar(canvas.current.toDataURL());
      };
    }
  }, [canvas, image]);

  useEffect(() => {
    if (file && file.target.files.length) {
      const fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        const data = fileLoadedEvent.target.result;

        setImage(data ? data : "");
      };

      fileReader.readAsDataURL(file.target.files[0]);
    }
  }, [file]);

  return (
    <div className="absolute -mt-16 right-2" style={style.photo}>
      <div className="absolute z-10 w-full h-full flex flex-col justify-end">
        <input
          type="file"
          accept="image/*"
          placeholder="Выбрать аватар"
          className="choose-button2 borders"
          onChange={(e) => {
            playChoose();
            setFile(e);
          }}
        />
      </div>

      <div className="z-0 pointer-events-none">
        <canvas
          className="absolute w-full p-2"
          ref={canvas}
          width={256}
          height={256}
        />

        <ImageNext
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

  useEffect(() => {
    if (playPen) playPen();
  }, [playPen]);

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");

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
              <Avatar setAvatar={setAvatar} />
            </div>
          </div>

          <div className="w-full justify-center flex flex-row">
            <button
              className={
                "mx-16 w-full choose-button borders " +
                (nickname.length && avatar ? "" : "disabled")
              }
              onClick={() => {
                socket.emit("player ready", { nickname, avatar });

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
        <ImageNext
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
