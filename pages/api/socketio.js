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

const joinIndex = Math.random().toString(36).substring(2);

function Socket(socket) {
  socket.on("get questions", () => {
    socket.emit("responce", {
      stage: 1,
      question,
      variants: variants.split(";"),
      result,
    });
  });

  socket.on("get join index", () => {
    socket.emit("set join index", joinIndex);
  });
}

export default function (req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", Socket);

    res.socket.server.io = io;
  }

  res.end();
}
