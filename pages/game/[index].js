import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import QuestionTablet from "../../components/tablets/question";
import NotepadScore from "../../components/notepad-score";
import IconsImages from "../../components/icons-images";

import useQuestions from "../../helpers/questions";

export default function Game() {
  const [gameIndex, setGameIndex] = useState();

  const [level, setLevel] = useState(0);

  const router = useRouter();

  const { index } = router.query;

  const [socket, setSocket] = useState(null);

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

      socket.on("leave", () => router.push("/"));

      socket.on("set game index", setGameIndex);
      socket.on("set game phase", setQuestions);
      socket.on("set game questions", setQuestions);

      setSocket(socket);
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
        <IconsImages />
        <NotepadScore />
        <QuestionTablet />
      </main>
    </>
  );
}
