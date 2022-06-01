class Net {
  constructor() {
    this.displayLeaderboard();
  }

  checkGameStage = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/checkGameStage", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => ui.updateStatus(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  changeGameStage = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/changegameStage", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => ui.updateStatus(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  checkGameStatus = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/checkGameStatus", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => game.assignMoveOrder(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  sendRoundStatus = async (round) => {
    const data = JSON.stringify({
      roundStatus: round,
    });

    const options = {
      method: "POST",
      body: data,
    };

    await fetch("/sendRoundStatus", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => game.assignMoveOrder(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };
  clearKill = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/clearKill", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => console.log("kill cleared")) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  sendNewPos = async (previousPos, currentPos, pawnColor) => {
    const data = JSON.stringify({
      previousPos: previousPos,
      currentPos: currentPos,
      pawnColor: pawnColor,
    });

    const options = {
      method: "POST",
      body: data,
    };

    await fetch("/sendNewPos", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => game.assignMoveOrder(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  updateSpawn = async (removedPawnPos, removedPawn, pawnColorToRemove) => {
    const data = JSON.stringify({
      removedPawnPos: removedPawnPos,
      removedPawn: removedPawn,
      color: pawnColorToRemove,
    });

    const options = {
      method: "POST",
      body: data,
    };

    await fetch("/animateSpawnUpdate", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => game.assignMoveOrder(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  checkUserCount = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/checkusers", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => ui.displayPlayers(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  sendUserData = async () => {
    const data = JSON.stringify({
      nick: document.getElementById("nickname").value,
    });

    const options = {
      method: "POST",
      body: data,
    };

    await fetch("/adduser", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => ui.updateStatus(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  clearUserData = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/clearusers", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => console.log(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  resetGame = async (winner) => {
    const data = JSON.stringify({
      winnerColor: winner,
    });
    const options = {
      method: "POST",
      body: data,
    };

    await fetch("/resetgame", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => game.resetGame()) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  changeGameMode = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/changeGameMode", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => console.log(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };

  displayLeaderboard = async () => {
    const options = {
      method: "POST",
    };

    await fetch("/displayLeaderboard", options)
      .then((response) => response.text()) // konwersja na json
      .then((data) => ui.displayLeaderboard(data)) // dane odpowiedzi z serwera
      .catch((error) => console.log(error));
  };
}
