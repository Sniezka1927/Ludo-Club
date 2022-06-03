// Timer
// Wygrywanie - aler koneic rozgrywki / mechanika zrobiona
// Podwietlenie mozliwych pionkow
// Brak mozliwosci ruchu - next gracz

var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
const Datastore = require("nedb");
app.use(express.static("static"));
app.use(express.json());
app.use(express.text());
const leaderboard = new Datastore({
  filename: "./data/leaderboard.db",
  autoload: true,
  corruptAlertThreshold: 1,
});
let databaseUpdatedStarted = false;
let users = [];
let isGameUp = false;

let playerOneTurn = true;
let playerTwoTurn = false;
let playerThreeTurn = false;
let playerFourTurn = false;
let previousPos = {};
let currentPos = {};
let removedPawnPos;
let color;
let removedSpawnPlace;
let gameMode = "Default";

let redPawnsLeft = 4;
let bluePawnsLeft = 4;
let greenPawnsLeft = 4;
let yellowPawnsLeft = 4;

let redSpawn = [
  { x: -20, y: 1, z: 40, empty: false },
  { x: -20, y: 1, z: 30, empty: false },
  { x: -30, y: 1, z: 40, empty: false },
  { x: -30, y: 1, z: 30, empty: false },
];
let blueSpawn = [
  { x: 40, y: 1, z: 30, empty: false },
  { x: 40, y: 1, z: 40, empty: false },
  { x: 50, y: 1, z: 40, empty: false },
  { x: 50, y: 1, z: 30, empty: false },
];
let greenSpawn = [
  { x: -30, y: 1, z: -30, empty: false },
  { x: -40, y: 1, z: -30, empty: false },
  { x: -30, y: 1, z: -40, empty: false },
  { x: -40, y: 1, z: -40, empty: false },
];
let yellowSpawn = [
  { x: -10, y: 1, z: 40, empty: false },
  { x: -10, y: 1, z: 40, empty: false },
  { x: -10, y: 1, z: 40, empty: false },
  { x: -10, y: 1, z: 40, empty: false },
];

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

app.post("/adduser", (req, res) => {
  checkers = [];
  if (isGameUp == true) return;
  let username = JSON.parse(req.body);
  let nickname = username.nick;
  if (users[0] == undefined && users.length == 0) {
    users.push(nickname);
    let endObj = { users: users, isGameUp: isGameUp };
    res.send(JSON.stringify(endObj));
  } else if (
    users[0] != undefined &&
    users[0] != nickname &&
    users.length == 1
  ) {
    users.push(nickname);
    let endObj = { users: users, isGameUp: isGameUp };
    res.send(JSON.stringify(endObj));
  } else if (
    users[0] != undefined &&
    users[1] != undefined &&
    users[0] != nickname &&
    users[1] != nickname &&
    users.length == 2
  ) {
    users.push(nickname);
    let endObj = { users: users, isGameUp: isGameUp };
    res.send(JSON.stringify(endObj));
  } else if (
    users[0] != undefined &&
    users[1] != undefined &&
    users[2] != undefined &&
    users[0] != nickname &&
    users[1] != nickname &&
    users[2] != nickname &&
    users.length == 3
  ) {
    users.push(nickname);
    let endObj = { users: users, isGameUp: isGameUp };
    res.send(JSON.stringify(endObj));
  }
});

app.post("/clearusers", (req, res) => {
  users = [];
  checkers = [];
  res.send(JSON.stringify(users));
});

app.post("/checkusers", (req, res) => {
  let resObj = { users: users, mode: gameMode };
  res.send(JSON.stringify(resObj));
});
app.post("/changeGameStage", (req, res) => {
  isGameUp = true;
  let endObj = { isGameUp: isGameUp };
  res.send(JSON.stringify(endObj));
});
app.post("/checkGameStage", (req, res) => {
  let endObj = { isGameUp: isGameUp };
  res.send(JSON.stringify(endObj));
});

app.post("/checkGameStatus", (req, res) => {
  let endObj = {
    userCount: users.length,
    playerOneTurn: playerOneTurn,
    playerTwoTurn: playerTwoTurn,
    playerThreeTurn: playerThreeTurn,
    playerFourTurn: playerFourTurn,
    previousPos: previousPos,
    currentPos: currentPos,
    color: color,
    removedPawnPos: removedPawnPos,
    removedSpawnPlace: removedSpawnPlace,
    redPawnsLeft: redPawnsLeft,
    bluePawnsLeft: bluePawnsLeft,
    greenPawnsLeft: greenPawnsLeft,
    yellowPawnsLeft: yellowPawnsLeft,
    gameState: isGameUp,
  };
  res.send(JSON.stringify(endObj));
});

app.post("/sendRoundStatus", (req, res) => {
  let rounds = JSON.parse(req.body);
  playerOneTurn = rounds.roundStatus.playerOneTurn;
  playerTwoTurn = rounds.roundStatus.playerTwoTurn;
  playerThreeTurn = rounds.roundStatus.playerThreeTurn;
  playerFourTurn = rounds.roundStatus.playerFourTurn;
  let endObj = {
    playerOneTurn: playerOneTurn,
    playerTwoTurn: playerTwoTurn,
    playerThreeTurn: playerThreeTurn,
    playerFourTurn: playerFourTurn,
  };
  res.send(JSON.stringify(endObj));
});

app.post("/sendNewPos", (req, res) => {
  let newPositions = JSON.parse(req.body);
  let pawnColor = newPositions.pawnColor;
  previousPos = newPositions.previousPos;
  currentPos = newPositions.currentPos;

  if (pawnColor == "red" && currentPos.x == 0 && currentPos.z == 10)
    redPawnsLeft = redPawnsLeft - 1;
  if (pawnColor == "blue" && currentPos.x == 10 && currentPos.z == 0)
    bluePawnsLeft = bluePawnsLeft - 1;
  if (pawnColor == "green" && currentPos.x == -10 && currentPos.z == 0)
    greenPawnsLeft = greenPawnsLeft - 1;
  if (pawnColor == "yellow" && currentPos.x == 0 && currentPos.z == -10)
    yellowPawnsLeft = yellowPawnsLeft - 1;

  for (let i = 0; i < redSpawn.length; i++) {
    if (previousPos.x == redSpawn[i].x && previousPos.z == redSpawn[i].z)
      redSpawn[i].empty = true;
  }
  for (let i = 0; i < blueSpawn.length; i++) {
    if (previousPos.x == blueSpawn[i].x && previousPos.z == blueSpawn[i].z)
      blueSpawn[i].empty = true;
  }
  for (let i = 0; i < greenSpawn.length; i++) {
    if (previousPos.x == greenSpawn[i].x && previousPos.z == greenSpawn[i].z)
      greenSpawn[i].empty = true;
  }
  for (let i = 0; i < yellowSpawn.length; i++) {
    if (previousPos.x == yellowSpawn[i].x && previousPos.z == yellowSpawn[i].z)
      yellowSpawn[i].empty = true;
  }
  console.log(previousPos, currentPos, pawnColor);
  let endObj = {
    previousPos: previousPos,
    currentPos: currentPos,
    redSpawn: redSpawn,
    blueSpawn: blueSpawn,
    greenSpawn: greenSpawn,
    yellowSpawn: yellowSpawn,
    color: color,
    removedPawnPos: removedPawnPos,
  };
  res.send(JSON.stringify(endObj));
});

app.post("/newSpawn", (req, res) => {
  let newSpawns = JSON.parse(req.body);
  redSpawn = newSpawns.redSpawn;
  blueSpawn = newSpawns.blueSpawn;
  greenSpawn = newSpawns.greenSpawn;
  yellowSpawn = newSpawns.yellowSpawn;
  let endObj = {};
  res.send(JSON.stringify(endObj));
});

app.post("/animateSpawnUpdate", (req, res) => {
  let data = JSON.parse(req.body);
  removedPawnPos = data.removedPawnPos;
  removedSpawnPlace = data.removedPawn;
  color = data.color;
  for (let i = 0; i < redSpawn.length; i++) {
    if (
      removedSpawnPlace.x == redSpawn[i].x &&
      removedSpawnPlace.z == redSpawn[i].z
    )
      redSpawn[i].empty = false;
  }
  for (let i = 0; i < blueSpawn.length; i++) {
    if (
      removedSpawnPlace.x == blueSpawn[i].x &&
      removedSpawnPlace.z == blueSpawn[i].z
    )
      blueSpawn[i].empty = false;
  }
  for (let i = 0; i < greenSpawn.length; i++) {
    if (
      removedSpawnPlace.x == greenSpawn[i].x &&
      removedSpawnPlace.z == greenSpawn[i].z
    )
      greenSpawn[i].empty = false;
  }
  for (let i = 0; i < yellowSpawn.length; i++) {
    if (
      removedSpawnPlace.x == yellowSpawn[i].x &&
      removedSpawnPlace.z == yellowSpawn[i].z
    )
      yellowSpawn[i].empty = false;
  }
  let endObj = {
    removedPawnPos: removedPawnPos,
    color: color,
  };
  res.send(JSON.stringify(endObj));
});

app.post("/clearKill", (req, res) => {
  removedPawnPos = undefined;
  color = undefined;
  removedSpawnPlace = undefined;
});

app.post("/displayLeaderboard", (req, res) => {
  leaderboard.find({}, function (err, docs) {
    res.send(JSON.stringify(docs));
  });
});

app.post("/resetgame", (req, res) => {
  let data = JSON.parse(req.body);
  console.log(data);
  let winner;
  if (data.winnerColor == "red") winner = users[0];
  if (data.winnerColor == "blue") winner = users[1];
  if (data.winnerColor == "green") winner = users[2];
  if (data.winnerColor == "yellow") winner = users[3];

  console.log(winner);
  updateDB(winner);

  users = [];
  isGameUp = false;

  playerOneTurn = true;
  playerTwoTurn = false;
  playerThreeTurn = false;
  playerFourTurn = false;
  previousPos = {};
  currentPos = {};
  removedPawnPos;
  color;
  removedSpawnPlace;

  redPawnsLeft = 4;
  bluePawnsLeft = 4;
  greenPawnsLeft = 4;
  yellowPawnsLeft = 4;

  console.log("game resseted");
  res.send(JSON.stringify("Game Resetted"));
});

app.post("/changeGameMode", (req, res) => {
  if (gameMode == "Default") gameMode = "Quick Mode";
  else gameMode = "Default";
  res.send(JSON.stringify(gameMode));
});

const updateDB = (winner) => {
  if (databaseUpdatedStarted == true) return;
  databaseUpdatedStarted = true;
  leaderboard.findOne({ nickname: winner }, function (err, doc) {
    if (doc == null) {
      let databaseObject;
      if (gameMode == "Quick Mode")
        databaseObject = { nickname: winner, quickMode: 1, defaultMode: 0 };
      else databaseObject = { nickname: winner, quickMode: 0, defaultMode: 1 };

      leaderboard.insert(databaseObject, function (err, newDoc) {
        console.log(newDoc);
      });
    } else {
      let databaseObject;
      if (gameMode == "Quick Mode")
        databaseObject = {
          nickname: winner,
          quickMode: doc.quickMode + 1,
          defaultMode: doc.defaultMode,
        };
      else
        databaseObject = {
          nickname: winner,
          quickMode: doc.quickMode,
          defaultMode: doc.defaultMode + 1,
        };
      leaderboard.update(
        { nickname: winner },
        { $set: databaseObject },
        {},
        function (err, numUpdated) {
          console.log("database updated");
        }
      );
    }
    setTimeout(() => {
      databaseUpdatedStarted = false;
    }, 3000);
  });
};
