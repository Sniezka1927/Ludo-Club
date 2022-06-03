class Game {
  constructor() {
    console.log("game");
    this.raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
    this.mouseVector = new THREE.Vector2(); // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
    this.size = 10;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xadd8e6);
    this.renderer.setSize(600, 600); // window.innerWidth, window.innerHeight
    this.userCount = 0;
    this.diceRoll = 0;
    this.previousPos = {};
    this.currentPos = {};
    this.gameModeSettings = 0;
    this.startTimer;
    this.remainTime = 15;
    this.timerStatus = false;

    this.redPawnsLeft = this.gameModeSettings;
    this.bluePawnsLeft = this.gameModeSettings;
    this.greenPawnsLeft = this.gameModeSettings;
    this.yellowPawnsLeft = this.gameModeSettings;

    document.getElementById("root").append(this.renderer.domElement);
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(this.scene.position);

    /*

       0  - Basic Field        0xffffff
       1  - Red                0xff000a
       2  - Green              0x03a149
       3  - Blue               0x29b1ff
       4  - Yellow             0xfed21b
       5  - RedArrow
       6  - GreenArrow
       7  - BlueArrow
       8  - YellowArrow
       9  - GlobalSafeBox
       10 - RedSpawn
       11 - GreenSpawn
       12 - BlueSpawn
       13 - YellowSpawn
       14 - RedSafeBox
       15 - GreenSafeBox
       16 - BlueSafeBox
       17 - YellowSafeBox

       */

    this.szachownica = [
      [2, 2, 2, 2, 0, 6, 0, 1, 1, 1, 1],
      [2, 11, 11, 2, 11, 2, , 1, 10, 10, 1],
      [2, 11, 11, 2, 0, 2, 9, 1, 10, 10, 1],
      [2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 1],
      [0, 0, 9, 0, 15, 2, 14, 0, 0, 10, 0],
      [8, 4, 4, 4, 4, 18, 1, 1, 1, 1, 5],
      [0, 13, 0, 0, 16, 3, 17, 0, 9, 0, 0],
      [4, 4, 4, 4, 0, 3, 0, 3, 3, 3, 3],
      [4, 13, 13, 4, 9, 3, 0, 3, 12, 12, 3],
      [4, 13, 13, 4, 0, 3, 12, 3, 12, 12, 3],
      [4, 4, 4, 4, 0, 7, 0, 3, 3, 3, 3],
    ];

    /*
       101  - Red                0xff000a
       102  - Green              0x03a149
       103  - Blue               0x29b1ff
       104  - Yellow             0xfed21b

        */
    this.checkers = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 102, 102, 0, 0, 0, 0, 0, 101, 101, 0],
      [0, 102, 102, 0, 0, 0, 0, 0, 101, 101, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 104, 104, 0, 0, 0, 0, 0, 103, 103, 0],
      [0, 104, 104, 0, 0, 0, 0, 0, 103, 103, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.pawns = [];

    this.redSpawn = [
      { x: -20, y: 1, z: 40, empty: false },
      { x: -20, y: 1, z: 30, empty: false },
      { x: -30, y: 1, z: 40, empty: false },
      { x: -30, y: 1, z: 30, empty: false },
    ];
    this.blueSpawn = [
      { x: 40, y: 1, z: 30, empty: false },
      { x: 40, y: 1, z: 40, empty: false },
      { x: 50, y: 1, z: 40, empty: false },
      { x: 50, y: 1, z: 30, empty: false },
    ];
    this.greenSpawn = [
      { x: -30, y: 1, z: -30, empty: false },
      { x: -40, y: 1, z: -30, empty: false },
      { x: -30, y: 1, z: -40, empty: false },
      { x: -40, y: 1, z: -40, empty: false },
    ];
    this.yellowSpawn = [
      { x: -10, y: 1, z: 40, empty: false },
      { x: -10, y: 1, z: 40, empty: false },
      { x: -10, y: 1, z: 40, empty: false },
      { x: -10, y: 1, z: 40, empty: false },
    ];

    this.safeZone = [
      { x: -30, y: 1, z: 10 },
      { x: 10, y: 1, z: 30 },
      { x: -10, y: 1, z: -30 },
      { x: 30, y: 1, z: -10 },
      { x: -10, y: 1, z: 40 },
      { x: 40, y: 1, z: 10 },
      { x: -40, y: 1, z: -10 },
      { x: 10, y: 1, z: -40 },
    ];

    this.redPath = [
      { x: -10, y: 1, z: 40 },
      { x: -10, y: 1, z: 30 },
      { x: -10, y: 1, z: 20 },
      { x: -20, y: 1, z: 10 },
      { x: -30, y: 1, z: 10 },
      { x: -40, y: 1, z: 10 },
      { x: -50, y: 1, z: 10 },
      { x: -50, y: 1, z: 0 },
      { x: -50, y: 1, z: -10 },
      { x: -40, y: 1, z: -10 },
      { x: -30, y: 1, z: -10 },
      { x: -20, y: 1, z: -10 },
      { x: -10, y: 1, z: -20 },
      { x: -10, y: 1, z: -30 },
      { x: -10, y: 1, z: -40 },
      { x: -10, y: 1, z: -50 },
      { x: 0, y: 1, z: -50 },
      { x: 10, y: 1, z: -50 },
      { x: 10, y: 1, z: -40 },
      { x: 10, y: 1, z: -30 },
      { x: 10, y: 1, z: -20 },
      { x: 20, y: 1, z: -10 },
      { x: 30, y: 1, z: -10 },
      { x: 40, y: 1, z: -10 },
      { x: 50, y: 1, z: -10 },
      { x: 50, y: 1, z: 0 },
      { x: 50, y: 1, z: 10 },
      { x: 40, y: 1, z: 10 },
      { x: 30, y: 1, z: 10 },
      { x: 20, y: 1, z: 10 },
      { x: 10, y: 1, z: 20 },
      { x: 10, y: 1, z: 30 },
      { x: 10, y: 1, z: 40 },
      { x: 10, y: 1, z: 50 },
      { x: 0, y: 1, z: 50 },
      { x: 0, y: 1, z: 40 },
      { x: 0, y: 1, z: 30 },
      { x: 0, y: 1, z: 20 },
      { x: 0, y: 1, z: 10 },
    ];

    this.bluePath = [
      { x: 40, y: 1, z: 10 },
      { x: 30, y: 1, z: 10 },
      { x: 20, y: 1, z: 10 },
      { x: 10, y: 1, z: 20 },
      { x: 10, y: 1, z: 30 },
      { x: 10, y: 1, z: 40 },
      { x: 10, y: 1, z: 50 },
      { x: 0, y: 1, z: 50 },
      { x: -10, y: 1, z: 50 },
      { x: -10, y: 1, z: 40 },
      { x: -10, y: 1, z: 30 },
      { x: -10, y: 1, z: 20 },
      { x: -20, y: 1, z: 10 },
      { x: -30, y: 1, z: 10 },
      { x: -40, y: 1, z: 10 },
      { x: -50, y: 1, z: 10 },
      { x: -50, y: 1, z: 0 },
      { x: -50, y: 1, z: -10 },
      { x: -40, y: 1, z: -10 },
      { x: -30, y: 1, z: -10 },
      { x: -20, y: 1, z: -10 },
      { x: -10, y: 1, z: -20 },
      { x: -10, y: 1, z: -30 },
      { x: -10, y: 1, z: -40 },
      { x: -10, y: 1, z: -50 },
      { x: 0, y: 1, z: -50 },
      { x: 10, y: 1, z: -50 },
      { x: 10, y: 1, z: -40 },
      { x: 10, y: 1, z: -30 },
      { x: 10, y: 1, z: -20 },
      { x: 20, y: 1, z: -10 },
      { x: 30, y: 1, z: -10 },
      { x: 40, y: 1, z: -10 },
      { x: 50, y: 1, z: -10 },
      { x: 50, y: 1, z: 0 },
      { x: 40, y: 1, z: 0 },
      { x: 30, y: 1, z: 0 },
      { x: 20, y: 1, z: 0 },
      { x: 10, y: 1, z: 0 },
    ];

    this.greenPath = [
      { x: -40, y: 1, z: -10 },
      { x: -30, y: 1, z: -10 },
      { x: -20, y: 1, z: -10 },
      { x: -10, y: 1, z: -20 },
      { x: -10, y: 1, z: -30 },
      { x: -10, y: 1, z: -40 },
      { x: -10, y: 1, z: -50 },
      { x: 0, y: 1, z: -50 },
      { x: 10, y: 1, z: -50 },
      { x: 10, y: 1, z: -40 },
      { x: 10, y: 1, z: -30 },
      { x: 10, y: 1, z: -20 },
      { x: 20, y: 1, z: -10 },
      { x: 30, y: 1, z: -10 },
      { x: 40, y: 1, z: -10 },
      { x: 50, y: 1, z: -10 },
      { x: 50, y: 1, z: 0 },
      { x: 50, y: 1, z: 10 },
      { x: 40, y: 1, z: 10 },
      { x: 30, y: 1, z: 10 },
      { x: 20, y: 1, z: 10 },
      { x: 10, y: 1, z: 20 },
      { x: 10, y: 1, z: 30 },
      { x: 10, y: 1, z: 40 },
      { x: 10, y: 1, z: 50 },
      { x: 0, y: 1, z: 50 },
      { x: -10, y: 1, z: 50 },
      { x: -10, y: 1, z: 40 },
      { x: -10, y: 1, z: 30 },
      { x: -10, y: 1, z: 20 },
      { x: -20, y: 1, z: 10 },
      { x: -30, y: 1, z: 10 },
      { x: -40, y: 1, z: 10 },
      { x: -50, y: 1, z: 10 },
      { x: -50, y: 1, z: 0 },
      { x: -40, y: 1, z: 0 },
      { x: -30, y: 1, z: 0 },
      { x: -20, y: 1, z: 0 },
      { x: -10, y: 1, z: 0 },
    ];

    this.yellowPath = [
      { x: 10, y: 1, z: -40 },
      { x: 10, y: 1, z: -30 },
      { x: 10, y: 1, z: -20 },
      { x: 20, y: 1, z: -10 },
      { x: 30, y: 1, z: -10 },
      { x: 40, y: 1, z: -10 },
      { x: 50, y: 1, z: -10 },
      { x: 50, y: 1, z: 0 },
      { x: 50, y: 1, z: 10 },
      { x: 40, y: 1, z: 10 },
      { x: 30, y: 1, z: 10 },
      { x: 20, y: 1, z: 10 },
      { x: 10, y: 1, z: 20 },
      { x: 10, y: 1, z: 30 },
      { x: 10, y: 1, z: 40 },
      { x: 10, y: 1, z: 50 },
      { x: 0, y: 1, z: 50 },
      { x: -10, y: 1, z: 50 },
      { x: -10, y: 1, z: 40 },
      { x: -10, y: 1, z: 30 },
      { x: -10, y: 1, z: 20 },
      { x: -20, y: 1, z: 10 },
      { x: -30, y: 1, z: 10 },
      { x: -40, y: 1, z: 10 },
      { x: -50, y: 1, z: 10 },
      { x: -50, y: 1, z: 0 },
      { x: -50, y: 1, z: -10 },
      { x: -40, y: 1, z: -10 },
      { x: -30, y: 1, z: -10 },
      { x: -20, y: 1, z: -10 },
      { x: -10, y: 1, z: -20 },
      { x: -10, y: 1, z: -30 },
      { x: -10, y: 1, z: -40 },
      { x: -10, y: 1, z: -50 },
      { x: 0, y: 1, z: -50 },
      { x: 0, y: 1, z: -40 },
      { x: 0, y: 1, z: -30 },
      { x: 0, y: 1, z: -20 },
      { x: 0, y: 1, z: -10 },
    ];

    this.render();
    this.resize();
    this.generateCheckers();
    this.generateBoard();
  }

  render = () => {
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };

  rollDice = (data) => {
    const dice = document.querySelector(".dice");
    dice.addEventListener("click", () => {
      const diceContainer = document.querySelector(".cubeContainer");
      const oneDice = "<img class='diceRolled' src='./img/cube/cube01.jpg'>";
      const twoDice = "<img class='diceRolled' src='./img/cube/cube02.jpg'>";
      const threeDice = "<img class='diceRolled' src='./img/cube/cube03.jpg'>";
      const fourDice = "<img class='diceRolled' src='./img/cube/cube04.jpg'>";
      const fiveDice = "<img class='diceRolled' src='./img/cube/cube05.jpg'>";
      const sixDice = "<img class='diceRolled' src='./img/cube/cube06.jpg'>";

      const diceIndex = Math.ceil(Math.random() * 6);
      diceContainer.innerHTML = "";
      if (diceIndex == 1 && dice != undefined)
        diceContainer.innerHTML = oneDice;
      else if (diceIndex == 2 && dice != undefined)
        diceContainer.innerHTML = twoDice;
      else if (diceIndex == 3 && dice != undefined)
        diceContainer.innerHTML = threeDice;
      else if (diceIndex == 4 && dice != undefined)
        diceContainer.innerHTML = fourDice;
      else if (diceIndex == 5 && dice != undefined)
        diceContainer.innerHTML = fiveDice;
      else if (diceIndex == 6 && dice != undefined)
        diceContainer.innerHTML = sixDice;

      this.raycasterFunction(data, diceIndex);
    });
  };

  raycasterFunction = async (data, diceIndex) => {
    this.diceRoll = diceIndex;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    let clickedPawn = null;

    let pawnColor;
    let materialColor;
    let playerOneTurn = data.playerOneTurn;
    let playerTwoTurn = data.playerTwoTurn;
    let playerThreeTurn = data.playerThreeTurn;
    let playerFourTurn = data.playerFourTurn;
    const playerColor = document.querySelector(".checkerColor").innerText;

    if (playerOneTurn == true && playerColor == "czerwonymi") {
      pawnColor = "red";
      materialColor = 0xff000a;
    } else if (playerTwoTurn == true && playerColor == "niebieskimi") {
      pawnColor = "blue";
      materialColor = 0x03a149;
    } else if (playerThreeTurn == true && playerColor == "zielonymi") {
      pawnColor = "green";
      materialColor = 0x29b1ff;
    } else if (playerFourTurn == true && playerColor == "zoltymi") {
      pawnColor = "yellow";
      materialColor = 0xfed21b;
    }
    window.addEventListener("mousedown", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.intersects = this.raycaster.intersectObjects(this.scene.children);

      if (this.diceRoll == 0) return;

      if (this.intersects.length > 0) {
        if (this.intersects[0].object.cube.name == pawnColor) {
          clickedPawn = this.intersects[0].object;
          this.previousPos = clickedPawn.position;
          switch (pawnColor) {
            case "red":
              this.checkIfIsItInSpawn(clickedPawn, pawnColor, data);
              break;
            case "blue":
              this.checkIfIsItInSpawn(clickedPawn, pawnColor, data);
              break;
            case "green":
              this.checkIfIsItInSpawn(clickedPawn, pawnColor, data);

              break;
            case "yellow":
              this.checkIfIsItInSpawn(clickedPawn, pawnColor, data);

              break;
          }
        }
      }
    });
  };

  checkIfIsItInSpawn = async (clickedPawn, pawnColor, data) => {
    let path;
    if (pawnColor == "red") path = this.redPath;
    else if (pawnColor == "blue") path = this.bluePath;
    else if (pawnColor == "green") path = this.greenPath;
    else if (pawnColor == "yellow") path = this.yellowPath;
    let outOfSpawn = false;
    for (let i = 0; i < path.length; i++) {
      if (
        clickedPawn.position.x == path[i].x &&
        clickedPawn.position.z == path[i].z
      ) {
        console.log("pawn is out of spawn");
        outOfSpawn = true;
      }
    }

    if (outOfSpawn == false) {
      const verifyMove = await this.checkIfThereIsPawnInSpawn(
        clickedPawn,
        path
      );
      console.log(verifyMove);
      if (verifyMove == false) {
        console.log("blocked move");
        return;
      }
      new TWEEN.Tween(clickedPawn.position) // co
        .to({ x: path[0].x, z: path[0].z }, 1000) // do jakiej pozycji, w jakim czasie
        .easing(TWEEN.Easing.Exponential.Out) // typ easingu (zmiana w czasie)
        .start();

      this.currentPos = path[0];
      this.endTurn(data, pawnColor);
      return;
    }

    if (outOfSpawn == true) {
      this.checkCurrentPawnPosition(clickedPawn, path, data, pawnColor);
      return;
    }
  };
  checkIfThereIsPawnInSpawn = async (clickedPawn, path) => {
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < this.pawns.length; i++) {
          if (
            this.pawns[i].position.x == path[0].x &&
            this.pawns[i].position.z == path[0].z
          ) {
            console.log("there is a pawn");
            resolve(false);
          }
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  checkIfThereIsPawn = async (clickedPawn, path, pathId) => {
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < this.pawns.length; i++) {
          if (
            this.pawns[i].position.x == path[pathId].x &&
            this.pawns[i].position.z == path[pathId].z
          ) {
            console.log("there is a pawn");
            resolve(false);
          }
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  checkCurrentPawnPosition = async (clickedPawn, path, data, pawnColor) => {
    for (let i = 0; i < path.length; i++)
      if (
        clickedPawn.position.x == path[i].x &&
        clickedPawn.position.z == path[i].z
      )
        await this.movePawn(clickedPawn, path, i, data, pawnColor);
  };

  movePawn = async (clickedPawn, path, i, data, pawnColor) => {
    if (this.diceRoll == 0) return;
    let verifyMove = true;
    let killed = false;
    let nextMoveField = i + this.diceRoll;
    console.log(path.length);
    console.log(nextMoveField);
    for (let j = 0; j < this.pawns.length; j++) {
      if (nextMoveField == path.length - 1) {
        console.log("przesuniete na koniec!");
        verifyMove = true;
        //     this.pawns[j].position.x = path[nextMoveField].x;
        //     this.pawns[j].position.z = path[nextMoveField].z;
        //     new TWEEN.Tween(clickedPawn.position) // co
        //     .to({ x: path[nextMoveField].x, z: path[nextMoveField].z }, 1000) // do jakiej pozycji, w jakim czasie
        //     .easing(TWEEN.Easing.Exponential.Out) // typ easingu (zmiana w czasie)
        //     .start();
        // this.endTurn(data, pawnColor);
        //     return
      } else if (
        this.pawns[j].position.x == path[nextMoveField].x &&
        this.pawns[j].position.z == path[nextMoveField].z &&
        this.pawns[j].cube.name == pawnColor
      ) {
        verifyMove = false;
        console.log("juz tam jest pionek!");
      } else if (
        this.pawns[j].position.x == path[nextMoveField].x &&
        this.pawns[j].position.z == path[nextMoveField].z &&
        this.pawns[j].cube.name != pawnColor
      ) {
        for (let l = 0; l < this.safeZone.length; l++) {
          if (
            path[nextMoveField].x == this.safeZone[l].x &&
            path[nextMoveField].z == this.safeZone[l].z
          ) {
            return;
          }
        }
        console.log("removing pawn");
        let pawnToRemove = this.pawns[j];
        let removedPawnPos = path[nextMoveField];
        let pawnColorToRemove = this.pawns[j].cube.name;
        switch (pawnColorToRemove) {
          case "red":
            for (let k = 0; k < this.redSpawn.length; k++) {
              if (this.redSpawn[k].empty == true) {
                pawnToRemove.position.x = this.redSpawn[k].x;
                pawnToRemove.position.z = this.redSpawn[k].z;
                console.log("pawn removed");
                killed = true;
                this.updateSpawn(
                  removedPawnPos,
                  pawnToRemove.position,
                  pawnColorToRemove
                );

                return;
              }
            }
            break;
          case "blue":
            for (let k = 0; k < this.blueSpawn.length; k++) {
              if (this.blueSpawn[k].empty == true) {
                pawnToRemove.position.x = this.blueSpawn[k].x;
                pawnToRemove.position.z = this.blueSpawn[k].z;
                console.log("pawn removed");
                killed = true;
                this.updateSpawn(
                  removedPawnPos,
                  pawnToRemove.position,
                  pawnColorToRemove
                );

                return;
              }
            }
            break;
          case "green":
            for (let k = 0; k < this.greenSpawn.length; k++) {
              if (this.greenSpawn[k].empty == true) {
                pawnToRemove.position.x = this.greenSpawn[k].x;
                pawnToRemove.position.z = this.greenSpawn[k].z;
                console.log("pawn removed");
                killed = true;
                this.updateSpawn(
                  removedPawnPos,
                  pawnToRemove.position,
                  pawnColorToRemove
                );

                return;
              }
            }
            break;
          case "yellow":
            for (let k = 0; k < this.yellowSpawn.length; k++) {
              if (this.yellowSpawn[k].empty == true) {
                pawnToRemove.position.x = this.yellowSpawn[k].x;
                pawnToRemove.position.z = this.redSpawn[k].z;
                console.log("pawn removed");
                killed = true;
                this.updateSpawn(
                  removedPawnPos,
                  pawnToRemove.position,
                  pawnColorToRemove
                );

                return;
              }
            }
            break;
        }
      }
    }
    if (verifyMove == true) {
      let pathId;
      for (let j = 1; j <= this.diceRoll; j++) {
        pathId = i + j;
        this.currentPos = path[pathId];
        new TWEEN.Tween(clickedPawn.position) // co
          .to({ x: path[pathId].x, z: path[pathId].z }, 1000) // do jakiej pozycji, w jakim czasie
          .easing(TWEEN.Easing.Exponential.Out) // typ easingu (zmiana w czasie)
          .start();
      }
      this.endTurn(data, pawnColor, killed);
    }
  };

  newMove = async (data, pawnColor) => {
    const diceContainer = document.querySelector(".cubeContainer");
    diceContainer.innerHTML = "<img class='dice' src='./img/cube/dices.png'>";
    // console.log("next turn for you!");
    this.diceRoll = 0;
    this.rollDice(data);
    this.sendNewPos(pawnColor);
  };
  endTurn = async (data, pawnColor, killed) => {
    console.log(killed);
    if (this.diceRoll == 0) return;
    else if (this.diceRoll == 6 || killed == true) {
      const diceContainer = document.querySelector(".cubeContainer");
      diceContainer.innerHTML = "<img class='dice' src='./img/cube/dices.png'>";
      // console.log("next turn for you!");
      this.diceRoll = 0;
      this.rollDice(data);
      this.sendNewPos(pawnColor);
      return;
    } else {
      // console.log("next player");
      this.diceRoll = 0;
      this.finishRound(data);
      this.sendNewPos(pawnColor);
      this.changeDiceGraphic();
      return;
    }
  };

  sendNewPos = (pawnColor) => {
    console.log(pawnColor);
    net.sendNewPos(this.previousPos, this.currentPos, pawnColor);
  };
  updateSpawn = (removedPawnPos, removedPawn, pawnColorToRemove) => {
    net.updateSpawn(removedPawnPos, removedPawn, pawnColorToRemove);
  };

  animateSpawnUpdate = (removedPawnPos, color, removedPawnPlace) => {
    console.log(removedPawnPos, color, removedPawnPlace);
    for (let i = 0; i < this.pawns.length; i++) {
      if (
        this.pawns[i].position.x == removedPawnPos.x &&
        this.pawns[i].position.z == removedPawnPos.z &&
        this.pawns[i].cube.name == color
      ) {
        console.log("pawn moved to spawn");
        this.pawns[i].position.x = removedPawnPlace.x;
        this.pawns[i].position.z = removedPawnPlace.z;
        this.clearKill();
        return;
      }
    }
  };

  clearKill = () => {
    net.clearKill();
  };

  changeDiceGraphic = () => {
    const diceContainer = document.querySelector(".cubeContainer");
    diceContainer.innerHTML = "<img class='dice' src='./img/cube/timer.png'>";
  };
  finishRound = (data) => {
    let playerOneTurn = data.playerOneTurn;
    let playerTwoTurn = data.playerTwoTurn;
    let playerThreeTurn = data.playerThreeTurn;
    let playerFourTurn = data.playerFourTurn;
    if (playerOneTurn == true) {
      playerTwoTurn = true;
      playerOneTurn = false;
    } else if (playerTwoTurn == true) {
      if (this.userCount == 2) playerOneTurn = true;
      else playerThreeTurn = true;
      playerTwoTurn = false;
    } else if (playerThreeTurn == true) {
      if (this.userCount == 3) playerOneTurn = true;
      else playerFourTurn = true;
      playerThreeTurn = false;
    } else if (playerFourTurn == true) {
      playerOneTurn = true;
      playerFourTurn = false;
    }

    let turnsObject = {
      playerOneTurn: playerOneTurn,
      playerTwoTurn: playerTwoTurn,
      playerThreeTurn: playerThreeTurn,
      playerFourTurn: playerFourTurn,
    };
    this.stopTimer();
    net.sendRoundStatus(turnsObject);
  };

  moveOtherPlayerPawn = async (currentPos, previousPos) => {
    for (let i = 0; i < this.pawns.length; i++) {
      if (
        previousPos.x == this.pawns[i].position.x &&
        previousPos.y == this.pawns[i].position.y &&
        previousPos.z == this.pawns[i].position.z
      ) {
        // console.log("pionek znaleziony!");
        this.pawns[i].position.x = currentPos.x;
        this.pawns[i].position.y = currentPos.y;
        this.pawns[i].position.z = currentPos.z;
        this.currentPos = 0;
        this.previousPos = 0;
        previousPos = 0;
        currentPos = 0;
      }
    }
  };

  checkWin = (gameState) => {
    if (this.redPawnsLeft == this.gameModeSettings) {
      alert("Red Won!");
      let winner = "red";
      this.stopGame(gameState, winner);
      return;
    }
    if (this.bluePawnsLeft == this.gameModeSettings) {
      alert("Blue Won!");
      let winner = "blue";
      this.stopGame(gameState, winner);
      return;
    }
    if (this.greenPawnsLeft == this.gameModeSettings) {
      alert("Green Won!");
      let winner = "green";
      this.stopGame(gameState, winner);
      return;
    }
    if (this.yellowPawnsLeft == this.gameModeSettings) {
      alert("Yellow Won!");
      let winner = "yellow";
      this.stopGame(gameState, winner);
      return;
    }
  };

  stopGame = async (gameState, winner) => {
    gameState = true;
    net.resetGame(winner);
  };

  resetGame = () => {
    setTimeout(() => {
      location.reload();
    }, 3000);
  };

  timer = (data) => {
    this.timerStatus = true;
    this.startTimer = setInterval(() => {
      console.log(this.remainTime);
      this.remainTime--;
      ui.displayTimer(this.remainTime);
      if (this.remainTime == 0) {
        ui.displayTimer("finished");
        clearInterval(this.startTimer);
        setTimeout(() => {
          this.timerStatus = false;
          this.changeDiceGraphic();
        }, 1000);
        this.remainTime = 15;
        this.finishRound(data);
      }
    }, 1000);
  };

  stopTimer = () => {
    ui.displayTimer("finished");
    clearInterval(this.startTimer);
    setTimeout(() => {
      this.timerStatus = false;
      this.changeDiceGraphic();
    }, 1000);
    this.remainTime = 15;
  };
  assignMoveOrder = async (data) => {
    data = JSON.parse(data);
    let gameState = data.isGameUp;
    if (gameState == false) return;
    if (data.redSpawn != undefined) this.redSpawn = data.redSpawn;
    if (data.blueSpawn != undefined) this.blueSpawn = data.blueSpawn;
    if (data.greenSpawn != undefined) this.greenSpawn = data.greenSpawn;
    if (data.yellowSpawn != undefined) this.yellowSpawn = data.yellowSpawn;
    if (data.redPawnsLeft != undefined) this.redPawnsLeft = data.redPawnsLeft;
    if (data.bluePawnsLeft != undefined)
      this.bluePawnsLeft = data.bluePawnsLeft;
    if (data.greenPawnsLeft != undefined)
      this.greenPawnsLeft = data.greenPawnsLeft;
    if (data.yellowPawnsLeft != undefined)
      this.yellowPawnsLeft = data.yellowPawnsLeft;
    this.checkWin(gameState);
    let color = data.color;
    let removedPawnPos = data.removedPawnPos;
    let removedPawnPlace = data.removedSpawnPlace;
    if (
      color != undefined &&
      removedPawnPos != undefined &&
      removedPawnPlace != undefined
    )
      this.animateSpawnUpdate(removedPawnPos, color, removedPawnPlace);

    let currentPos = data.currentPos;
    let previousPos = data.previousPos;
    if (currentPos != undefined && previousPos != undefined)
      this.moveOtherPlayerPawn(currentPos, previousPos);
    this.userCount = data.userCount;
    let playerOneTurn = data.playerOneTurn;
    let playerTwoTurn = data.playerTwoTurn;
    let playerThreeTurn = data.playerThreeTurn;
    let playerFourTurn = data.playerFourTurn;
    let playerColor;
    if (document.querySelector(".checkerColor") != undefined)
      playerColor = document.querySelector(".checkerColor").innerText;

    if (document.querySelector(".dice") == undefined) return;

    if (playerOneTurn == true && playerColor == "czerwonymi") {
      // console.log("moja kolej!");
      const diceContainer = document.querySelector(".cubeContainer");
      const dice = document.querySelector(".dice");
      let srcArray = dice.src.split("/");
      if (srcArray[srcArray.length - 1] == "timer.png")
        diceContainer.innerHTML =
          "<img class='dice' src='./img/cube/dices.png'>";
      if (this.timerStatus == false) this.timer(data);
      this.rollDice(data);
    } else if (playerTwoTurn == true && playerColor == "niebieskimi") {
      // console.log("moja kolej!");
      const diceContainer = document.querySelector(".cubeContainer");
      const dice = document.querySelector(".dice");
      let srcArray = dice.src.split("/");
      if (srcArray[srcArray.length - 1] == "timer.png")
        diceContainer.innerHTML =
          "<img class='dice' src='./img/cube/dices.png'>";
      if (this.timerStatus == false) this.timer(data);
      this.rollDice(data);
    } else if (playerThreeTurn == true && playerColor == "zielonymi") {
      // console.log("moja kolej!");
      const diceContainer = document.querySelector(".cubeContainer");
      const dice = document.querySelector(".dice");
      let srcArray = dice.src.split("/");
      if (srcArray[srcArray.length - 1] == "timer.png")
        diceContainer.innerHTML =
          "<img class='dice' src='./img/cube/dices.png'>";
      if (this.timerStatus == false) this.timer(data);
      this.rollDice(data);
    } else if (playerFourTurn == true && playerColor == "zoltymi") {
      // console.log("moja kolej!");
      const diceContainer = document.querySelector(".cubeContainer");
      const dice = document.querySelector(".dice");
      let srcArray = dice.src.split("/");
      if (srcArray[srcArray.length - 1] == "timer.png")
        diceContainer.innerHTML =
          "<img class='dice' src='./img/cube/dices.png'>";
      if (this.timerStatus == false) this.timer(data);
      this.rollDice(data);
    }
  };

  setCamera = (usersList) => {
    console.log(usersList);
    if (
      usersList.length == 1 &&
      this.camera.position.x == 100 &&
      this.camera.position.y == 100 &&
      this.camera.position.z == 100
    ) {
      this.camera.position.set(0, 100, 100);
      this.camera.lookAt(this.scene.position);
    }
    if (
      usersList.length == 2 &&
      this.camera.position.x == 100 &&
      this.camera.position.y == 100 &&
      this.camera.position.z == 100
    ) {
      this.camera.position.set(100, 100, 0);
      this.camera.lookAt(this.scene.position);
    }
    if (
      usersList.length == 3 &&
      this.camera.position.x == 100 &&
      this.camera.position.y == 100 &&
      this.camera.position.z == 100
    ) {
      this.camera.position.set(-100, 100, 0);
      this.camera.lookAt(this.scene.position);
    }
    if (
      usersList.length == 4 &&
      this.camera.position.x == 100 &&
      this.camera.position.y == 100 &&
      this.camera.position.z == 100
    ) {
      this.camera.position.set(0, 100, -100);
      this.camera.lookAt(this.scene.position);
    }
  };

  sendBoard = () => {
    net.sendGameBoard(this.checkers);
  };

  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  generateBoard = () => {
    for (let i = 0; i < this.szachownica.length; i++) {
      for (let j = 0; j < this.szachownica.length; j++) {
        let BoardColor = 0xffffff;
        let img = "img/basicfield.jpg";
        //

        /*
        
               0  - Basic Field        0xffffff
               1  - Red                0xff000a
               2  - Green              0x03a149
               3  - Blue               0x29b1ff
               4  - Yellow             0xfed21b
               5  - RedArrow
               6  - GreenArrow
               7  - BlueArrow
               8  - YellowArrow
               9  - GlobalSafeBox
               10 - RedSpawn
               11 - GreenSpawn
               12 - BlueSpawn
               13 - YellowSpawn
               14 - RedSafeBox
               15 - GreenSafeBox
               16 - BlueSafeBox
               17 - YellowSafeBox
               */

        switch (this.szachownica[i][j]) {
          case 1:
            img = "img/basicfield.jpg";
            BoardColor = 0xff000a;
            break;
          case 2:
            img = "img/basicfield.jpg";
            BoardColor = 0x03a149;
            break;
          case 3:
            img = "img/basicfield.jpg";
            BoardColor = 0x29b1ff;
            break;
          case 4:
            img = "img/basicfield.jpg";
            BoardColor = 0xfed21b;
            break;
          case 5:
            img = "img/redarrow.jpg";
            break;
          case 6:
            img = "img/greenarrow.jpg";
            break;
          case 7:
            img = "img/bluearrow.jpg";
            break;
          case 8:
            img = "img/yellowarrow.jpg";
            break;
          case 9:
            img = "img/globalsafebox.jpg";
            break;
          case 10:
            img = "img/redSpawn.jpg";
            break;
          case 11:
            img = "img/greenSpawn.jpg";
            break;
          case 12:
            img = "img/blueSpawn.jpg";
            break;
          case 13:
            img = "img/yellowSpawn.jpg";
            break;
          case 14:
            img = "img/red-greencorner.jpg";
            break;
          case 15:
            img = "img/green-yellowcorner.jpg";
            break;
          case 16:
            img = "img/yellow-bluecorner.jpg";
            break;
          case 17:
            img = "img/blue-redcorner.jpg";
            break;
          case 18:
            img = "img/center.jpg";
            break;
        }
        const item = new Item(BoardColor, this.size, img);
        item.position.x = i * this.size - 50;
        item.position.z = j * this.size - 50;
        item.scale.set(1, 0.1, 1);
        this.scene.add(item);
      }
    }
  };

  generateCheckers = () => {
    for (let i = 0; i < this.checkers.length; i++) {
      for (let j = 0; j < this.checkers.length; j++) {
        /*
               101  - Red                0xff000a
               102  - Green              0x03a149
               103  - Blue               0x29b1ff
               104  - Yellow             0xfed21b
        
                */
        if (this.checkers[i][j] == 101) {
          let CheckerColor = 0xed3939;
          const checkerName = "red";
          const img = "img/redPawn.png";
          const checker = new Pionek(CheckerColor, checkerName, img);
          checker.position.x = i * this.size - 50;
          checker.position.y += 1;
          checker.position.z = j * this.size - 50;
          checker.scale.set(0.5, 5, 0.5);
          this.scene.add(checker);
          this.pawns.push(checker);
        } else if (this.checkers[i][j] == 102) {
          let CheckerColor = 0x03a149;
          const checkerName = "green";
          const img = "img/greenPawn.png";
          const checker = new Pionek(CheckerColor, checkerName, img);
          checker.position.x = i * this.size - 50;
          checker.position.y += 1;
          checker.position.z = j * this.size - 50;
          checker.scale.set(0.5, 5, 0.5);
          this.scene.add(checker);
          this.pawns.push(checker);
        } else if (this.checkers[i][j] == 103) {
          let CheckerColor = 0x29b1ff;
          const checkerName = "blue";
          const img = "img/bluePawn.png";
          const checker = new Pionek(CheckerColor, checkerName, img);
          checker.position.x = i * this.size - 50;
          checker.position.y += 1;
          checker.position.z = j * this.size - 50;
          checker.scale.set(0.5, 5, 0.5);
          this.scene.add(checker);
          this.pawns.push(checker);
        } else if (this.checkers[i][j] == 104) {
          let CheckerColor = 0xfed21b;
          const checkerName = "yellow";
          const img = "img/yellowPawn.png";
          const checker = new Pionek(CheckerColor, checkerName, img);
          checker.position.x = i * this.size - 50;
          checker.position.y += 1;
          checker.position.z = j * this.size - 50;
          checker.scale.set(0.5, 5, 0.5);
          this.scene.add(checker);
          this.pawns.push(checker);
        }
      }
    }
  };

  assignGameMode = (gameMode) => {
    console.log(gameMode);
    if (gameMode == "Quick Mode") this.gameModeSettings = 3;
    else if (gameMode == "Default") this.gameModeSettings = 0;
  };
}
