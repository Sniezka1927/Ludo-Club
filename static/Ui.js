class Ui {
  constructor() {
    this.isGameUp = false;
    this.checkUsers = setInterval(() => {
      net.checkUserCount();
    }, 1000);

    this.gameStage = setInterval(() => {
      net.checkGameStage();
    }, 1000);

    document.querySelector(".send").addEventListener("click", () => {
      net.sendUserData();
    });

    document.querySelector(".reset").addEventListener("click", () => {
      // if (this.isGameUp == false)
      net.clearUserData();
    });
  }

  updateStatus = (data) => {
    data = JSON.parse(data);
    this.isGameUp = data.isGameUp;
    const usersList = data.users;
    if (usersList == undefined) return;
    const nicknameCont = document.querySelector(".userNickname");
    if (this.isGameUp == true && nicknameCont == null) return;
    this.setPlayer(usersList);
  };

  setPlayer = (usersList) => {
    const nicknameCont = document.querySelector(".userNickname");
    const loginCont = document.querySelector(".login");
    let playerOneNickName = document.createElement("a");
    let playerTwoNickName = document.createElement("a");
    let playerThreeNickName = document.createElement("a");
    let playerFourNickname = document.createElement("a");
    playerOneNickName.classList = "userNickname";
    playerTwoNickName.classList = "userNickname";
    playerThreeNickName.classList = "userNickname";
    playerFourNickname.classList = "userNickname";
    let gameStatus = document.createElement("div");
    gameStatus.classList = "gameStatus";
    let playerOneCheckerColor = document.createElement("a");
    playerOneCheckerColor.classList.add("red");
    playerOneCheckerColor.classList.add("checkerColor");
    playerOneCheckerColor.innerText = "czerwonymi";
    let playerTwoCheckerColor = document.createElement("a");
    playerTwoCheckerColor.classList.add("blue");
    playerTwoCheckerColor.classList.add("checkerColor");
    playerTwoCheckerColor.innerText = "niebieskimi";
    let playerThreeCheckerColor = document.createElement("a");
    playerThreeCheckerColor.classList.add("green");
    playerThreeCheckerColor.classList.add("checkerColor");
    playerThreeCheckerColor.innerText = "zielonymi";
    let playerFourCheckerColor = document.createElement("a");
    playerFourCheckerColor.classList.add("yellow");
    playerFourCheckerColor.classList.add("checkerColor");
    playerFourCheckerColor.innerText = "zoltymi";

    if (usersList.length == 1) {
      const playerStatus = document.createElement("div");
      loginCont.innerHTML = "";
      const button = document.createElement("button");
      const gameButton = document.createElement("button");
      gameButton.innerText = "Change Game Mode";
      gameButton.addEventListener("click", () => {
        net.changeGameMode();
      });
      gameButton.style.margin = "10px";
      button.innerText = "Start Game";
      button.addEventListener("click", () => {
        gameStatus.innerText = "";
        button.remove();
        gameButton.remove();
        setInterval(() => {
          net.checkGameStatus();
        }, 1000);
        net.changeGameStage();
        clearInterval(this.checkUsers);
        clearInterval(this.checkGameStage);
      });

      playerOneNickName.innerText = usersList[0];
      playerStatus.innerHTML += `Zalogowano jako `;
      playerStatus.appendChild(playerOneNickName);
      playerStatus.innerHTML += `, grasz `;
      playerStatus.appendChild(playerOneCheckerColor);

      loginCont.appendChild(playerStatus);
      gameStatus.innerText = "Klinij przycisk, żeby wystartować gre.";
      loginCont.appendChild(gameStatus);
      loginCont.appendChild(gameButton);
      loginCont.appendChild(button);
      game.setCamera(usersList);
      setTimeout(() => {
        net.checkUserCount();
      }, 500);
    }
    if (usersList.length == 2 && nicknameCont == null) {
      const playerStatus = document.createElement("div");
      loginCont.innerHTML = "";
      playerTwoNickName.innerText = usersList[1];
      playerStatus.innerHTML += `Zalogowano jako `;
      playerStatus.appendChild(playerTwoNickName);
      playerStatus.innerHTML += `, grasz `;
      playerStatus.appendChild(playerTwoCheckerColor);

      gameStatus.innerText = "Oczekiwanie na start gry...";
      loginCont.appendChild(playerStatus);
      loginCont.appendChild(gameStatus);
      game.setCamera(usersList);
      setTimeout(() => {
        net.checkUserCount();
      }, 500);
    }
    if (usersList.length == 3 && nicknameCont == null) {
      const playerStatus = document.createElement("div");
      loginCont.innerHTML = "";
      playerThreeNickName.innerText = usersList[2];
      playerStatus.innerHTML += `Zalogowano jako `;
      playerStatus.appendChild(playerThreeNickName);
      playerStatus.innerHTML += `, grasz `;
      playerStatus.appendChild(playerThreeCheckerColor);

      gameStatus.innerText = "Oczekiwanie na start gry...";
      loginCont.appendChild(playerStatus);
      loginCont.appendChild(gameStatus);
      game.setCamera(usersList);
      setTimeout(() => {
        net.checkUserCount();
      }, 500);
    }
    if (usersList.length == 4 && nicknameCont == null) {
      const playerStatus = document.createElement("div");
      loginCont.innerHTML = "";
      playerFourNickname.innerText = usersList[3];
      playerStatus.innerHTML += `Zalogowano jako `;
      playerStatus.appendChild(playerFourNickname);
      playerStatus.innerHTML += `, grasz `;
      playerStatus.appendChild(playerFourCheckerColor);

      gameStatus.innerText = "Oczekiwanie na start gry...";
      loginCont.appendChild(playerStatus);
      loginCont.appendChild(gameStatus);
      game.setCamera(usersList);
    }
    if (usersList.length == 4 || this.isGameUp == true) {
      document.querySelector(".gameStatus").innerText =
        "Oczekiwanie na start gry...";
      // clearInterval(this.checkUsers)
    }
  };

  displayPlayers = (data) => {
    if (this.isGameUp == true) {
      if (document.querySelector(".gameStatus") != undefined)
        document.querySelector(".gameStatus").innerText = "";
      setInterval(() => {
        net.checkGameStatus();
      }, 1000);
      clearInterval(this.checkUsers);
      clearInterval(this.gameStage);
      return;
    }
    data = JSON.parse(data);
    let usersList = data.users;
    let gameMode = data.mode;
    const displayPlayers = document.querySelector(".players");
    const playerPrefix = document.createElement("div");
    const gameModeCont = document.createElement("div");
    gameModeCont.innerText = `Mode: ${gameMode}`;
    // let playerNick = document.createElement('div')
    displayPlayers.innerHTML = "";
    playerPrefix.innerText = "players ingame:";
    displayPlayers.appendChild(gameModeCont);
    displayPlayers.appendChild(playerPrefix);
    if (usersList.length == undefined) return;
    for (let i = 0; i < usersList.length; i++) {
      let playerNick = document.createElement("div");
      playerNick.innerText = usersList[i];
      if (i == 0) playerNick.style.color = "red";
      if (i == 1) playerNick.style.color = "blue";
      if (i == 2) playerNick.style.color = "green";
      if (i == 3) playerNick.style.color = "yellow";
      displayPlayers.appendChild(playerNick);
    }

    game.assignGameMode(gameMode);
  };

  displayLeaderboard = (data) => {
    data = JSON.parse(data);
    data.sort(function (a, b) {
      console.log(a, b);
      let first = a.quickMode + a.defaultMode;
      let second = b.quickMode + b.defaultMode;
      return second - first;
    });

    for (let i = 0; i < 3; i++) {
      const container = document.querySelector(".leaderboard");
      const playerContainer = document.createElement("div");
      playerContainer.innerText = `${i + 1}. ${data[i].nickname}, Wins: ${
        data[i].quickMode + data[i].defaultMode
      }!`;
      container.appendChild(playerContainer);
    }
    console.log(data);
  };
}
