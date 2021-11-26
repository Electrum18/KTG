import NextImage from "next/image";

import { useEffect, useRef, useState } from "react";

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
    <div className="absolute mt-12 right-12" style={style.photo}>
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

        <NextImage
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
        <NextImage
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

function Paper({ socket, nickname, avatar }) {
  const [playChoose] = useSound("/sound/click.mp3", {
    volume: 0.5,
  });

  const [file, setFile] = useState();

  const [fileInvalid, setFileInvalid] = useState(false);
  const [questions, setQuestions] = useState("");

  function validateFile(text) {
    if (/\[.+?,.+?,.+?\]/g.test(text)) {
      const data = text.match(/\[.+?,.+?,.+?\]/g);

      if (data.length === 16) {
        const [_, ...questions] = data;

        const validated = questions.reduce(
          (prev, question) =>
            /\[((('|").+?('|"),?)),? ((('|")(.+?;.+?;.+?;.+?)('|"),?)),? ((('|").+?('|"),?)),?\]/g.test(
              question
            )
              ? prev
              : false,
          true
        );

        if (validated) {
          return text;
        }
      }
    }
  }

  useEffect(() => {
    if (file && file.target.files.length) {
      const fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        const data = validateFile(fileLoadedEvent.target.result);

        setFileInvalid(!data);
        setQuestions(data ? data : "");
      };

      fileReader.readAsText(file.target.files[0], "UTF-8");
    }
  }, [file]);

  return (
    <div style={style.paper}>
      <div
        className="absolute z-30 w-full h-full flex flex-col p-8 pb-12"
        style={style.text}
      >
        <h1 className="text-2xl tracking-widest text-center mt-auto">
          Создание игры
        </h1>

        {fileInvalid && (
          <p className="text-base tracking-widest text-center mt-2 text-red-500">
            Файл не прошел проверку!
          </p>
        )}

        <h2 className="text-xl tracking-widest mt-8">Выбор вопросов</h2>

        <input
          type="file"
          placeholder="Введите ваш логин"
          accept=".txt"
          onChange={(e) => {
            playChoose();
            setFile(e);
          }}
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
              "choose-button2 borders " +
              (nickname.length && questions && avatar ? "" : "disabled")
            }
            onClick={() => {
              socket.emit("login lead", { nickname, questions, avatar });

              playChoose();
            }}
          >
            создать
          </button>
        </div>
      </div>

      <div className="z-10">
        <NextImage
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
  const [avatar, setAvatar] = useState("");

  return (
    <>
      <Paper socket={socket} nickname={nickname} avatar={avatar} />
      <PaperUpper nickname={nickname} setNickname={setNickname} />
      <Avatar setAvatar={setAvatar} />
    </>
  );
}
