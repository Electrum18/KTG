import { Server } from "socket.io";

import { readFileSync } from "fs";
import path from "path";

const questions = readFileSync(path.resolve("./docs/questions.txt"), "utf8");

const parsedQuestions = questions
  .split("\n")
  .map((question) => {
    const parsed = question.match(/'.+?'/g);

    return parsed && parsed.map((part) => part.replace(/'/g, ""));
  })
  .filter((value) => value);

const [question, variants, result] = parsedQuestions[0];

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateId = () => Math.random().toString(36).substring(2);

const lead = {
  id: undefined,
  nickname: undefined,
};

const join = {
  id: generateId(),
  socketId: undefined,
};

const game = {
  id: undefined,
  socketId: undefined,
  nickname: undefined,
};

function Socket(socket, io) {
  socket.emit("set join index", join.id);

  socket.on("get questions", () => {
    socket.emit("responce", {
      stage: 1,
      question,
      variants: variants.split(";"),
      result,
    });
  });

  socket.on("get lead exist", () => {
    socket.emit("is lead exist", lead.id && lead.nickname);
  });

  socket.on("get join index", () => {
    socket.emit("set join index", join.id);
  });

  socket.on("login lead", (data) => {
    if (!data.nickname && !lead.nickname && !lead.id) return;

    lead.nickname = data.nickname;
    lead.id = socket.id;

    join.id = generateId();

    socket.emit("set join index", join.id);
    socket.emit("set stage", 1);

    socket.broadcast.emit("lead joined");
  });

  socket.on("is joining", () => {
    if (game.socketId) return;

    join.socketId = socket.id;

    socket.broadcast.emit("player joined");
  });

  socket.on("player register", (data) => {
    if (!data.nickname || game.socketId) return;

    game.nickname = data.nickname;
    game.socketId = socket.id;

    game.id = generateId();

    socket.emit("game created", game.id);
    socket.broadcast.emit("game created", "exit");
  });

  socket.on("disconnect", () => {
    if (join.socketId === socket.id) {
      join.socketId = undefined;

      socket.broadcast.emit("player unjoined");
    } else if (lead.id === socket.id) {
      lead.id = undefined;
      lead.nickname = undefined;

      join.id = generateId();

      io.emit("leave");
    }
  });
}

export default function (req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => Socket(socket, io));

    res.socket.server.io = io;
  }

  res.end();
}
