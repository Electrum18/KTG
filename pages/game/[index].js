import { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import QuestionTablet from "../../components/tablets/question";
import NotepadScore from "../../components/notepad-score";
import IconsImages from "../../components/icons-images";

import useQuestions from "../../helpers/questions";

const rightIndex = "123";

export default function Game() {
  const router = useRouter();

  const { index } = router.query;

  const setQuestions = useQuestions((state) => state.setQuestions);

  useEffect(() => index && index !== rightIndex && router.push("/"), [index]);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");

        socket.emit("get questions");
      });

      socket.on("responce", (data) => {
        console.log(data);
        setQuestions(data);
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
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
