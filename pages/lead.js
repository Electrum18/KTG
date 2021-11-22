import Head from "next/head";
import Image from "next/image";

import { useEffect, useState } from "react";

import io from "socket.io-client";

import Background from "../components/background";

import CreateGame from "../components/lead-phases/create";
import JoinGamePhase from "../components/lead-phases/player-join";

const style = {
  corckboard: {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform: "perspective(10rem) rotate3d(1, 0, 0, 5deg)",
  },
};

function LeadPhase({ phase, setPhase, joinIndex, socket }) {
  switch (phase) {
    case 1:
      return (
        <JoinGamePhase
          setPhase={setPhase}
          joinIndex={joinIndex}
          socket={socket}
        />
      );

    case 0:
    default:
      return <CreateGame setPhase={setPhase} />;
  }
}

export default function Lead() {
  const [phase, setPhase] = useState(0);
  const [joinIndex, setJoinIndex] = useState();

  const [socket, setSocket] = useState(null);

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

      setSocket(socket);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Панель ведущего | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />

        <div className="absolute bottom-10 mx-auto" style={style.corckboard}>
          <div className="absolute w-full h-full top-0 z-10">
            <LeadPhase
              phase={phase}
              setPhase={setPhase}
              joinIndex={joinIndex}
              socket={socket}
            />
          </div>

          <div className="z-0 pointer-events-none">
            <Image
              src="/assets/cork board.png"
              alt="Доска"
              width={782}
              height={560}
              loading="eager"
            />
          </div>
        </div>
      </main>
    </>
  );
}
