import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import io from "socket.io-client";

import Background from "../components/background";

import CreateGame from "../components/lead-phases/create";
import JoinGamePhase from "../components/lead-phases/join-player";
import GameControl from "../components/lead-phases/game-control";

const style = {
  corckboard: {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform: "perspective(10rem) rotate3d(1, 0, 0, 5deg)",
  },
};

function LeadPhase({
  phase,
  joinIndex,
  joinPhase,
  gameIndex,
  gamePhase,
  socket,
}) {
  switch (phase) {
    case 2:
      return (
        <GameControl
          gameIndex={gameIndex}
          gamePhase={gamePhase}
          socket={socket}
        />
      );

    case 1:
      return (
        <JoinGamePhase
          joinIndex={joinIndex}
          joinPhase={joinPhase}
          socket={socket}
        />
      );

    case 0:
    default:
      return <CreateGame socket={socket} />;
  }
}

export default function Lead() {
  const [phase, setPhase] = useState(0);

  const [joinIndex, setJoinIndex] = useState();
  const [joinPhase, setJoinPhase] = useState([0, undefined]);

  const [gameIndex, setGameIndex] = useState();
  const [gamePhase, setGamePhase] = useState([0, undefined]);

  const [socket, setSocket] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("get lead exist");
      });

      socket.on("is lead exist", (exist) => exist && router.push("/"));
      socket.on("lead joined", () => router.push("/"));
      socket.on("leave", () => location.reload());

      socket.on("set join index", setJoinIndex);
      socket.on("set game index", setGameIndex);

      socket.on("lead telled", () => setGamePhase(1));

      socket.on("set stage", setPhase);

      socket.on("player ready", (nickname) => setJoinPhase([2, nickname]));
      socket.on("player joined", () => setJoinPhase([1, undefined]));
      socket.on("player unjoined", () => setJoinPhase([0, undefined]));

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
              socket={socket}
              joinIndex={joinIndex}
              joinPhase={joinPhase}
              gameIndex={gameIndex}
              gamePhase={gamePhase}
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
