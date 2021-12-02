import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import io from "socket.io-client";

import Background from "../../components/background";
import Light from "../../components/lighting";

import CreateGame from "../../components/lead-phases/create";
import JoinGamePhase from "../../components/lead-phases/join-player";
import GameControl from "../../components/lead-phases/game-control";
import Metadata from "../../components/metadata";

const style = {
  corckboard: {
    filter: "drop-shadow(2rem 5rem 5rem black)",
    transform: "perspective(10rem) rotate3d(1, 0, 0, 5deg)",
  },
};

function LeadPhase({
  phase,
  socket,

  joinIndex,
  joinPhase,

  gameLevel,
  gameQuestion,
  gameIndex,
  gamePhase,
  gameChoose,

  userInfo,

  viewIndex,
  needsHelp,
  voting,
}) {
  switch (phase) {
    case 2:
      return (
        <GameControl
          gameLevel={gameLevel}
          gameQuestion={gameQuestion}
          gameIndex={gameIndex}
          gamePhase={gamePhase}
          gameChoose={gameChoose}
          socket={socket}
          userInfo={userInfo}
          viewIndex={viewIndex}
          needsHelp={needsHelp}
          voting={voting}
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
  const [viewIndex, setViewIndex] = useState();
  const [leadIndex, setLeadIndex] = useState();

  const [gamePhase, setGamePhase] = useState(0);
  const [gameChoose, setGameChoose] = useState("");
  const [gameLevel, setGameLevel] = useState(0);
  const [gameQuestion, setQameQuestion] = useState("");

  const [needsHelp, setNeedsHelp] = useState();

  const [userInfo, setUserInfo] = useState({});
  const [voting, setVoting] = useState(false);

  const [socket, setSocket] = useState(null);

  const router = useRouter();

  const { index } = router.query;

  useEffect(() => {
    if (index && leadIndex && index !== leadIndex) router.push("/");
  }, [index, leadIndex, socket]);

  useEffect(() => {
    const socket = io({ transports: ["polling"] });

    socket.on("connect", () => {
      socket.emit("get lead index");
    });

    socket.on("set lead index", setLeadIndex);

    socket.on("lead joined", () => router.push("/"));
    socket.on("leave", () => location.reload());

    socket.on("set join index", setJoinIndex);
    socket.on("set game index", setGameIndex);
    socket.on("set view index", setViewIndex);

    socket.on("lead telled", () => setGamePhase(1));

    socket.on("set game level", setGameLevel);
    socket.on("set game question", (question) => {
      setQameQuestion(question);
      setGamePhase(0);
      setGameChoose("");
      setNeedsHelp(false);
    });

    socket.on("choosed question", (question) => {
      setGamePhase(2);
      setGameChoose(question);
    });

    socket.on("set stage", setPhase);

    socket.on("player ready", (nickname, avatar) =>
      setJoinPhase([2, nickname, avatar])
    );

    socket.on("player joined", () => setJoinPhase([1, undefined, undefined]));
    socket.on("player unjoined", () => setJoinPhase([0, undefined, undefined]));

    socket.on("get player data", setUserInfo);

    socket.on("game ended", (score) => {
      router.push(`/result?score=${score}&player=lead`);
    });

    socket.on("player needs help", () => setNeedsHelp(true));

    socket.on("player help by viewers", () => setVoting(true));
    socket.on("player help by viewers stop", () => setVoting(false));

    setSocket(socket);

    return () => {
      socket.disconnect();

      setSocket(null);
    };
  }, []);

  return (
    <>
      <Metadata page="lead" />

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />

        <div className="absolute bottom-10 mx-auto" style={style.corckboard}>
          <div className="absolute w-full h-full top-0 z-10">
            <LeadPhase
              phase={phase}
              socket={socket}
              joinIndex={joinIndex}
              joinPhase={joinPhase}
              gameLevel={gameLevel}
              gameQuestion={gameQuestion}
              gameIndex={gameIndex}
              gamePhase={gamePhase}
              gameChoose={gameChoose}
              userInfo={userInfo}
              viewIndex={viewIndex}
              needsHelp={needsHelp}
              voting={voting}
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

      <Light />
    </>
  );
}
