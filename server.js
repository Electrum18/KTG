const app = require('express')();
const server = require('http').Server(app);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const port = process.env.port || 80;

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return nextHandler(req, res);
    })
    
    server.listen(80, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:' + port);
    })
})