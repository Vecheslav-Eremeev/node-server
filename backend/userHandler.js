const userService = require("./userService");

function handleRequest(req, res) {
    const reqPath = req.url.split("/");
    const userId = reqPath[reqPath.length - 1];

    if (req.method === "GET" && reqPath.length === 3) {
        console.log(reqPath)
        userService.getUserById(userId, res);
    } else if (req.method === "GET") {
        userService.getUsers(res);
    } else if (req.method === "POST") {
        userService.addUser(req, res);
    } else if (req.method === "PUT") {
        userService.updateUser(userId, req, res);
    } else if (req.method === "DELETE") {
        userService.deleteUser(userId, res);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
}

module.exports = { handleRequest };
