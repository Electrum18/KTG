import { Server } from "socket.io";

import { readFileSync } from "fs";
import path from "path/posix";

const questions = readFileSync(
  path.resolve(__dirname, "../docs/questions.txt"),
  "utf8"
);

const parsedQuestions = questions
  .split("\n")
  .map((question) => {
    const parsed = question.match(/'.+?'/g);

    return parsed && parsed.map((part) => part.replace(/'/g, ""));
  })
  .filter((value) => value);

const [question, variants, result] = parsedQuestions[0];

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("get questions", () => {
        socket.emit("responce", {
          stage: 2,
          question,
          variants: variants.split(";"),
          result,
        });
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
