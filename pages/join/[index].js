import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import io from "socket.io-client";

import Background from "../../components/background";
import Light from "../../components/lighting";
import LoginTablet from "../../components/tablets/enter-to-game";
import Metadata from "../../components/metadata";

export default function Join() {
  const [joinIndex, setJoinIndex] = useState();

  const router = useRouter();

  const { index } = router.query;

  useEffect(() => {
    index && joinIndex && index !== joinIndex && router.push("/");
  }, [index, joinIndex]);

  const [socket, setSocket] = useState(null);

  const [preWaiting, setPreWaiting] = useState(false);

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("get join index");
        socket.emit("is joining");
      });

      socket.on("leave", () => router.push("/"));

      socket.on("set join index", setJoinIndex);

      socket.on("player joined", () => {
        setPreWaiting(false);
      });

      socket.on("game created", (statusOrIndex) => {
        router.push("/game/" + statusOrIndex);
      });

      socket.on("game ended", () => router.push(`/`));

      setSocket(socket);

      return () => {
        socket.disconnect();

        setSocket(null);
      };
    });
  }, []);

  return (
    <>
      <Metadata page="join" />

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />
        <LoginTablet
          socket={socket}
          preWaiting={preWaiting}
          setPreWaiting={setPreWaiting}
        />
      </main>

      <Light />
    </>
  );
}
