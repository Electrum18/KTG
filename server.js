const app = require("express")();
const server = require("http").Server(app);
const { SocketIOServer } = require("./server/socketio");
const next = require("next");

const nextApp = next({ dev: false });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  SocketIOServer(server);

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
