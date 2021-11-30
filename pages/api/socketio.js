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
  id: generateId(),
  socketId: undefined,
  nickname: undefined,
  avatar: undefined,
  noticed: false,
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
  level: 0,
  stage: 0,
  phase: 0,
  choosedId: undefined,
  choosedVariant: null,
  viewId: undefined,

  helpers: {
    percent50: true,
    helpByLead: true,
    helpByViewers: true,
  },

  timer: undefined,
  voting: [0, 0, 0, 0],
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
  socket.on("get lead index", () => {
    socket.emit("set lead index", lead.id);
  });

  socket.on("login lead", (data) => {
    if (
      !data.nickname &&
      data.questions &&
      data.avatar &&
      !lead.nickname &&
      !lead.socketId
    )
      return;

    lead.nickname = data.nickname;
    lead.socketId = socket.id;
    lead.avatar = data.avatar;

    parsedQuestions = parseQuestions(data.questions);

    join.id = generateId();

    socket.emit("set join index", join.id);
    socket.emit("set stage", 1);

    socket.broadcast.emit("lead joined");
  });

  socket.on("question readed", () => {
    io.emit("set game phase", { stage: 2 });

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

    game.viewId = game.id = generateId();
    game.level = 0;

    socket.broadcast.emit("player ready", game.nickname, game.avatar);
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

    socket.to(lead.socketId).emit("set view index", game.viewId);

    socket.emit("get game helpers", { helpers: game.helpers });
    socket.emit("get game players", {
      lead: lead.nickname,
      player: game.nickname,
      avatars: {
        lead: lead.avatar,
        player: game.avatar,
      },
    });

    socket.emit("get game voting", game.voting);
  });

  socket.on("get stage", (stage) => {
    game.stage = stage;
  });

  socket.on("get view index", () => {
    const [question, variants] = getQuestions();

    socket.emit("set game index", game.viewId);
    socket.emit("set game questions", getGameData(question, variants));

    socket.emit("set game phase", { stage: game.stage });

    socket.emit("variant pointed", game.choosedVariant);
    socket.emit(
      "choosed question",
      game.choosedVariant && variants.split(";").indexOf(game.choosedVariant)
    );

    socket.emit("get game helpers", { helpers: game.helpers });
    socket.emit("get game players", {
      lead: lead.nickname,
      player: game.nickname,
      avatars: {
        lead: lead.avatar,
        player: game.avatar,
      },
    });

    socket.emit("get game voting", game.voting);

    if (game.timer) socket.emit("player help by viewers");
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

    if (game.timer) {
      clearInterval(game.timer);
      game.timer = undefined;

      io.emit("player help by viewers stop");
    }

    socket.broadcast.emit("choosed question", variants.split(";")[id]);
  });

  socket.on("question taken", () => {
    function endGame() {
      socket.broadcast.emit("game ended", game.level);

      setTimeout(() => socket.emit("game ended", game.level), 1e3);
    }

    if (game.timer) {
      clearInterval(game.timer);
      game.timer = undefined;

      io.emit("player help by viewers stop");
    }

    if (game.level < 15) {
      const [_, variants, result] = getQuestions();

      const takenQuestion = variants.split(";")[game.choosedId];

      if (takenQuestion === result) {
        game.level++;

        const [question2, variants2] = getQuestions();

        io.emit("set stage", 2);

        game.phase = 2;

        if (game.level === 4 || game.level === 9) {
          game.helpers = {
            percent50: true,
            helpByLead: true,
            helpByViewers: true,
          };
        }

        game.voting = [0, 0, 0, 0];

        io.emit("set game level", 2);
        io.emit("set game question", question2);

        io.emit("get game helpers", { helpers: game.helpers });
        io.emit("set game questions", getGameData(question2, variants2));

        io.emit("get player data", {
          nickname: game.nickname,
          level: game.level,
        });

        io.emit("get game voting", game.voting);
      } else {
        endGame();
      }
    } else {
      endGame();
    }
  });

  socket.on("phase setted", (phase) => {
    game.phase = phase;

    socket.broadcast.emit("phase setted", phase);
  });

  socket.on("variant pointed", (variant) => {
    game.choosedVariant = variant;

    socket.broadcast.emit("variant pointed", variant);
  });

  socket.on("help 50 percent", () => {
    const [_, variants_, result] = getQuestions();

    const variants = variants_.split(";");
    const rightId = variants.indexOf(result);

    function getRandom(exclude = undefined) {
      const variant = Math.floor(Math.random() * variants.length);

      return variant === rightId || variant === exclude
        ? getRandom(exclude)
        : variant;
    }

    const exclude1 = getRandom();
    const exclude2 = getRandom(exclude1);

    game.helpers.percent50 = false;

    io.emit("get game helpers", { helpers: game.helpers });
    socket.emit("exclude variants", { [exclude1]: true, [exclude2]: true });
  });

  socket.on("help by lead", () => {
    game.helpers.helpByLead = false;

    io.emit("get game helpers", { helpers: game.helpers });
    io.to(lead.socketId).emit("player needs help");
  });

  socket.on("help by viewers", () => {
    game.helpers.helpByViewers = false;

    io.emit("get game helpers", { helpers: game.helpers });
    io.emit("player help by viewers");

    game.timer = setTimeout(() => {
      io.emit("player help by viewers stop");
      game.timer = undefined;
    }, 60e3);
  });

  socket.on("vote", (id) => {
    game.voting[id]++;

    io.emit("get game voting", game.voting);
  });
}

function Socket(socket, io) {
  socket.emit("set join index", join.id);
  socket.emit("set game index", game.id);

  LeadAPI(socket, io);
  JoinAPI(socket, io);
  GameAPI(socket, io);

  socket.on("get lead notice", () => {
    if (lead.noticed) return;
    
    socket.emit("get page notice", lead.id);

    lead.noticed = true;
  });

  socket.on("disconnect", () => {
    if (join.socketId === socket.id) {
      join.socketId = undefined;

      socket.broadcast.emit("player unjoined");
    } else if (game.socketId === socket.id) {
      io.emit("leave");

      lead.socketId = undefined;
      lead.nickname = undefined;
      lead.avatar = undefined;

      join.id = generateId();

      game.nickname = undefined;
      game.socketId = undefined;
      game.avatar = undefined;

      game.helpers = {
        percent50: true,
        helpByLead: true,
        helpByViewers: true,
      };

      game.voting = [0, 0, 0, 0];

      if (game.timer) {
        clearInterval(game.timer);
        game.timer = undefined;
      }

      parsedQuestions = undefined;

      game.viewId = game.id = generateId();
      game.level = 0;
    } else if (lead.socketId === socket.id) {
      io.emit("leave");

      lead.socketId = undefined;
      lead.nickname = undefined;
      lead.avatar = undefined;

      join.id = generateId();

      game.nickname = undefined;
      game.socketId = undefined;
      game.avatar = undefined;

      game.helpers = {
        percent50: true,
        helpByLead: true,
        helpByViewers: true,
      };

      game.voting = [0, 0, 0, 0];

      if (game.timer) {
        clearInterval(game.timer);
        game.timer = undefined;
      }

      parsedQuestions = undefined;

      game.viewId = game.id = generateId();
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
