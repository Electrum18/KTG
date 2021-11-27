import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import Light from "../../components/lighting";
import NotepadScore from "../../components/notepad-score";
import IconsImages from "../../components/icons-images";
import QuestionViewerTablet from "../../components/tablets/question-viewer";

import useQuestions from "../../helpers/questions";

export default function Game() {
  const [gameIndex, setGameIndex] = useState();

  const router = useRouter();

  const { index } = router.query;

  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    if (index && gameIndex && index !== gameIndex) router.push("/");
  }, [index, gameIndex, socket]);

  const setQuestions = useQuestions((state) => state.setQuestions);

  const [selectedId, setSelectedId] = useState(null);
  const [choosedQuestion, setChoosedQuestion] = useState(null);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("get view index");
      });

      socket.on("leave", () => location.reload());

      socket.on("set game index", setGameIndex);
      socket.on("set game phase", setQuestions);
      socket.on("set game questions", setQuestions);

      socket.on("get game players", setPlayers);

      socket.on("game ended", (score) => {
        router.push(`/result?score=${score}&player=lead`);
      });

      socket.on("variant pointed", setSelectedId);
      socket.on("choosed question", setChoosedQuestion);

      setSocket(socket);

      return () => {
        socket.disconnect();

        setSocket(null);
      };
    });
  }, []);

  return (
    <>
      <Head>
        <title>Страница игры | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />
        <IconsImages players={players} />
        <NotepadScore />
        <QuestionViewerTablet
          selectedId={selectedId}
          choosedQuestion={choosedQuestion}
          setChoosedQuestion={setChoosedQuestion}
          socket={socket}
        />
      </main>

      <Light />
    </>
  );
}
