const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const port = process.env.port || 3000;

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return nextHandler(req, res);
    })

    io.on("connect", socket => {
        socket.on("get lead notice", () => {          
          socket.emit("get page notice", "TEST");
        });
    })

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:' + port);
    })
})