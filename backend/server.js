const http = require("http");
const url = require("url");
const userHandler = require("./userHandler");

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const reqPath = reqUrl.pathname;

    if (reqPath.startsWith("/users")) {
        userHandler.handleRequest(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
