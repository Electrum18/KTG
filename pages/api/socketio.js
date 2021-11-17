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

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("get questions", () => {
        socket.emit("responce", {
          stage: 1,
          question,
          variants: variants.split(";"),
          result,
        });

        setTimeout(() => socket.emit("responce", { stage: 3 }), 3e3);
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
