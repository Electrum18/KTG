import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import Light from "../../components/lighting";
import QuestionTablet from "../../components/tablets/question";
import NotepadScore from "../../components/notepad-score";
import IconsImages from "../../components/icons-images";

import useQuestions from "../../helpers/questions";

export default function Game() {
  const [gameIndex, setGameIndex] = useState();

  const router = useRouter();

  const { index } = router.query;

  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    if (index && gameIndex && index !== gameIndex) {
      router.push("/");
    } else if (socket) {
      socket.emit("register success");
    }
  }, [index, gameIndex, socket]);

  const setQuestions = useQuestions((state) => state.setQuestions);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("get game index");
      });

      socket.on("leave", () => location.reload());

      socket.on("set game index", setGameIndex);
      socket.on("set game phase", setQuestions);
      socket.on("set game questions", setQuestions);

      socket.on("get game players", setPlayers);

      socket.on("game ended", (score) => {
        router.push(`/result?score=${score}`);
      });

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
        <QuestionTablet socket={socket} />
      </main>

      <Light />
    </>
  );
}
