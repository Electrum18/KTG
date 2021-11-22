import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import LoginTablet from "../../components/tablets/enter-to-game";

export default function Join() {
  const [joinIndex, setJoinIndex] = useState();

  const router = useRouter();

  const { index } = router.query;

  useEffect(() => {
    console.log(index, joinIndex);

    index && joinIndex && index !== joinIndex && router.push("/");
  }, [index, joinIndex]);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");

        socket.emit("get join index");
      });

      socket.on("responce", (data) => {
        console.log(data);
      });

      socket.on("set join index", setJoinIndex);

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Регистрация игрока | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />
        <LoginTablet />
      </main>
    </>
  );
}
