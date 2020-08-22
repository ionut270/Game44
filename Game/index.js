const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Player {
  constructor(isNpc, maxHealth, name, x, y) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.name = name;

    //coordinates
    this.x = x;
    this.y = y;

    //if is npc disable keyboard inputs
    this.npc = isNpc;

    this.spriteY = 0;
    this.spriteX = 0;
    this.orientation = 1;
    this.idle = 0;
  }

  move(axis, value) {
    // move x by 1 unit
    if (axis === "x") {
      this.x += value;
    } else if (axis === "y") {
      this.y += value;
    }
  }

  heal(value) {
    // can have a positive or a negative value
    this.health += value;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth; // player fully healed !
    }
  }

  // Getters
  get _x() {
    return this.x;
  }
  get _y() {
    return this.y;
  }
  get _health() {
    return this.health;
  }
  get _npc() {
    return this.npc;
  }
  get _maxHealth() {
    return this.maxHealth;
  }
  get _name() {
    return this.name;
  }
  get _spriteY() {
    return this.spriteY;
  }
  get _spriteX() {
    return this.spriteX;
  }
  get _orientation() {
    return this.orientation;
  }
  get _idle() {
    return this.idle;
  }

  animate() {
    this.spriteY += 48 - this.idle;
    if (this.idle >= 1) {
      this.idle--;
    } else {
      this.idle++;
    }
    if (this.spriteY > 144) {
      this.spriteY = 0;
    }
  }

  enableInput() {
    var self = this;

    setInterval(() => {
      self.animate();
    }, 300);

    document.addEventListener("keydown", function (event) {
      if (event.keyCode == 38) {
        self.y += (-1 * canvas.height) / 100;
        self.spriteX = 96;
      }
      if (event.keyCode == 40) {
        self.y += (1 * canvas.height) / 100;
        self.spriteX = 0;
      }
      if (event.keyCode == 37) {
        self.x += (-1 * canvas.width) / 100;
        self.spriteX = 48;
      }
      if (event.keyCode == 39) {
        self.x += (1 * canvas.width) / 100;
        self.spriteX = 144;
      }
    });
  }
}

class Map {
  constructor() {}

  get _map(){
    return genMap;
  }

  genMap() {
    var allowedTiles = [
       [1, 2],
       [1, 3],
       [2, 2],
       [2, 3],
  
       [2, 4],
       [3, 2],
       [3, 3],
       [3, 4],
  
      [2, 5],
      [3, 5],
    ];
  
    var map = [];
  
    for (var i = 0; i < canvas.width; i += 50) {
      map[i / 50] = [];
      for (var j = 0; j < canvas.height; j += 50) {
        map[i / 50][j / 50] = [];
        var tileset = Math.floor(Math.random() * allowedTiles.length);
        map[i / 50][j / 50] = [
          allowedTiles[tileset][0],
          allowedTiles[tileset][1],
        ];
      }
    }
    return map;
  }

  drawTile(row, collumn, x, y) {
    var unit = {
      x: 16,
      y: 16,
    };
    ctx.drawImage(
      document.getElementById("Tilemap"),
      unit.x * collumn,
      unit.y * row,
      15,
      17 * 0.89,
      x,
      y,
      50,
      50 * 0.89
    ); // seccond row, third collumn
  }
}

var user = new Player(false, 100, "Hero", 0, 0); // cords 0, 0 should be the center of the map
user.enableInput();

var map = new Map();
var generatedMap = map.genMap();

function draw() {
  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Player sprite
  ctx.imageSmoothingEnabled = false;

  // ctx.shadowOffsetX = 0;
  // ctx.shadowOffsetY = 15;
  // ctx.shadowColor = "rgba(23, 23, 23, 0.7)";
  // ctx.shadowBlur = 10;


  ctx.drawImage(
    document.getElementById("Player"),
    user._spriteX,
    user._spriteY,
    50,
    50,
    user._x,
    user._y,
    80,
    80
  );
  ctx.save();

  ctx.fillStyle = `rgba(23, 23, 23, .3`;
  ctx.beginPath();
  ctx.ellipse(user._x+40, user._y+70 , 10, 20, Math.PI / 2 + user._idle/50, 0, 2 * Math.PI );
  ctx.fill();
  ctx.save();

  //map sprite
  ctx.imageSmoothingEnabled = false;

  for (var i = 0; i < canvas.width / 50; i++) {
    for (var j = 0; j < canvas.height / 50; j++) {
      //what tile do we draw
      map.drawTile(
        generatedMap[i][j][0],generatedMap[i][j][1],
        i*50 + 4*i,j*50 + 4*j
      ); // +2 to even out the tiles
    }
  }
  ctx.save();

  window.requestAnimationFrame(draw);
}

draw();
