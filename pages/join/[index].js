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

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("get join index");
        socket.emit("is joining");
      });

      socket.on("leave", () => router.push("/"));

      socket.on("set join index", setJoinIndex);

      socket.on("game created", (statusOrIndex) => {
        if (statusOrIndex === "exit") {
          router.push("/");
        } else {
          try {
            router.push("/game/" + statusOrIndex);
          } catch (_) {
            router.push("/");
          }
        }
      });

      setSocket(socket);
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
        <LoginTablet socket={socket} />
      </main>
    </>
  );
}
