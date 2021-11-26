import { Server } from "socket.io";

let parsedQuestions;

function parseQuestions(questions) {
  return questions
    .split("\n")
    .map((question) => {
      const parsed = question.match(/'.+?'/g);

      return parsed && parsed.map((part) => part.replace(/('|")/g, ""));
    })
    .filter((value) => value);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateId = () => Math.random().toString(36).substring(2);

const lead = {
  id: undefined,
  nickname: undefined,
  avatar: undefined,
};

const join = {
  id: generateId(),
  socketId: undefined,
};

const game = {
  id: generateId(),
  socketId: undefined,
  nickname: undefined,
  avatar: undefined,
  choosedId: undefined,
  level: 13,
};

function getQuestions() {
  if (!parsedQuestions) return ["", ";;;;", ""];

  const [question, variants, result] = parsedQuestions[game.level];

  return [question, variants, result];
}

function getGameData(question, variants) {
  return {
    stage: 0,
    level: game.level,
    question,
    variants: variants.split(";"),
  };
}

function LeadAPI(socket, io) {
  socket.on("get lead exist", () => {
    socket.emit("is lead exist", lead.id && lead.nickname);
  });

  socket.on("login lead", (data) => {
    if (
      !data.nickname &&
      data.questions &&
      data.avatar &&
      !lead.nickname &&
      !lead.id
    )
      return;

    lead.nickname = data.nickname;
    lead.id = socket.id;
    lead.avatar = data.avatar;

    parsedQuestions = parseQuestions(data.questions);

    join.id = generateId();

    socket.emit("set join index", join.id);
    socket.emit("set stage", 1);

    socket.broadcast.emit("lead joined");
  });

  socket.on("question readed", () => {
    io.to(game.socketId).emit("set game phase", { stage: 2 });

    socket.emit("lead telled");
  });
}

function JoinAPI(socket, io) {
  socket.on("get join index", () => {
    socket.emit("set join index", join.id);
  });

  socket.on("is joining", () => {
    if (game.socketId) return;

    join.socketId = socket.id;

    socket.broadcast.emit("player joined");
  });

  socket.on("player ready", (data) => {
    if (!data.nickname || !data.avatar || game.socketId) {
      return socket.emit("set join index", generateId());
    }

    game.nickname = data.nickname;
    game.socketId = socket.id;
    game.avatar = data.avatar;

    game.id = generateId();
    game.level = 0;

    socket.broadcast.emit("player ready", game.nickname);
  });

  socket.on("player changing", () => {
    game.nickname = undefined;
    game.socketId = undefined;

    game.id = generateId();
    game.level = 0;

    io.emit("player joined");
  });
}

function GameAPI(socket, io) {
  socket.on("get game index", () => {
    const [question, variants] = getQuestions();

    game.socketId = socket.id;

    socket.emit("set game index", game.id);
    socket.emit("set game questions", getGameData(question, variants));

    socket.emit("get game players", {
      lead: lead.nickname,
      player: game.nickname,
      avatars: {
        lead: lead.avatar,
        player: game.avatar,
      },
    });
  });

  socket.on("start game", () => {
    if (!game.id && !game.socketId) return;

    const [question] = getQuestions();

    socket.emit("set stage", 2);

    socket.emit("set game level", 1);
    socket.emit("set game question", question);

    socket.emit("get player data", {
      nickname: game.nickname,
      level: game.level,
    });

    io.to(game.socketId).emit("game created", game.id);
  });

  socket.on("choosed question", (id) => {
    game.choosedId = id;

    const [_, variants, __] = getQuestions();

    io.to(lead.id).emit("choosed question", variants.split(";")[id]);
  });

  socket.on("question taken", () => {
    function endGame() {
      socket.broadcast.emit("game ended", game.level);

      setTimeout(() => socket.emit("game ended", game.level), 1e3);
    }

    if (game.level < 15) {
      const [_, variants, result] = getQuestions();

      const takenQuestion = variants.split(";")[game.choosedId];

      if (takenQuestion === result) {
        game.level++;

        const [question2, variants2] = getQuestions();

        socket.emit("set stage", 2);

        io.emit("set game level", 2);
        io.emit("set game question", question2);

        io.emit("set game questions", getGameData(question2, variants2));

        socket.emit("get player data", {
          nickname: game.nickname,
          level: game.level,
        });
      } else {
        endGame();
      }
    } else {
      endGame();
    }
  });
}

function Socket(socket, io) {
  socket.emit("set join index", join.id);
  socket.emit("set game index", game.id);

  LeadAPI(socket, io);
  JoinAPI(socket, io);
  GameAPI(socket, io);

  socket.on("disconnect", () => {
    if (join.socketId === socket.id) {
      join.socketId = undefined;

      socket.broadcast.emit("player unjoined");
    } else if (game.socketId === socket.id) {
      io.emit("leave");

      lead.id = undefined;
      lead.nickname = undefined;
      lead.avatar = undefined;

      join.id = generateId();

      game.nickname = undefined;
      game.socketId = undefined;
      game.avatar = undefined;

      parsedQuestions = undefined;

      game.id = generateId();
      game.level = 0;
    } else if (lead.id === socket.id) {
      io.emit("leave");

      lead.id = undefined;
      lead.nickname = undefined;
      lead.avatar = undefined;

      join.id = generateId();

      game.nickname = undefined;
      game.socketId = undefined;
      game.avatar = undefined;

      parsedQuestions = undefined;

      game.id = generateId();
      game.level = 0;
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
