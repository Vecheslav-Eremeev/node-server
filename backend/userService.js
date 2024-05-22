const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("userdatabase.db");

db.serialize(() => {
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (err) {
        throw err;
      }
      if (!row) {
        db.run(
          "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)",
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    }
  );
});

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUsers(res) {
  allQuery("SELECT * FROM users")
    .then((rows) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    })
    .catch((err) => {
      throw err;
    });
}

function getUserById(id, res) {
  getQuery("SELECT * FROM users WHERE id = ?", [id])
    .then((row) => {
      if (row) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(row));
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("User Not Found");
      }
    })
    .catch((err) => {
      throw err;
    });
}

function addUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const newUser = JSON.parse(body);
    runQuery("INSERT INTO users (name, age) VALUES (?, ?)", [
      newUser.name,
      newUser.age,
    ])
      .then((id) => {
        newUser.id = id;
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      })
      .catch((err) => {
        throw err;
      });
  });
}

function updateUser(id, req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const updatedUser = JSON.parse(body);
    runQuery("UPDATE users SET name = ?, age = ? WHERE id = ?", [
      updatedUser.name,
      updatedUser.age,
      id,
    ])
      .then(() => {
        updatedUser.id = id;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      })
      .catch((err) => {
        throw err;
      });
  });
}

function deleteUser(id, res) {
  getQuery("SELECT * FROM users WHERE id = ?", [id])
    .then((row) => {
      if (row) {
        runQuery("DELETE FROM users WHERE id = ?", [id])
          .then(() => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(row));
          })
          .catch((err) => {
            throw err;
          });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("User Not Found");
      }
    })
    .catch((err) => {
      throw err;
    });
}

module.exports = { getUsers, getUserById, addUser, updateUser, deleteUser };
