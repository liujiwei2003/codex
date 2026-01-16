const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const ballsEl = document.getElementById("balls");
const hudEl = document.getElementById("hud");
const restartBtn = document.getElementById("restart");

const state = {
  score: 0,
  balls: 3,
  launched: false,
  running: true,
};

const board = {
  width: canvas.width,
  height: canvas.height,
  gravity: 0.25,
  friction: 0.995,
};

const ball = {
  x: board.width / 2,
  y: board.height - 80,
  radius: 10,
  vx: 0,
  vy: 0,
};

const flipperLeft = {
  x: board.width / 2 - 90,
  y: board.height - 90,
  width: 90,
  height: 16,
  angle: -0.2,
  active: false,
};

const flipperRight = {
  x: board.width / 2 + 90,
  y: board.height - 90,
  width: 90,
  height: 16,
  angle: 0.2,
  active: false,
};

const bumpers = [
  { x: 120, y: 140, radius: 18, score: 50 },
  { x: 300, y: 160, radius: 22, score: 75 },
  { x: 210, y: 240, radius: 20, score: 60 },
  { x: 150, y: 320, radius: 18, score: 40 },
  { x: 280, y: 340, radius: 18, score: 40 },
];

const walls = {
  left: 18,
  right: board.width - 18,
  top: 18,
};

const keyState = {
  left: false,
  right: false,
};

function resetBall() {
  ball.x = board.width / 2;
  ball.y = board.height - 80;
  ball.vx = 0;
  ball.vy = 0;
  state.launched = false;
  showHud();
}

function updateScore(points) {
  state.score += points;
  scoreEl.textContent = state.score;
}

function updateBalls() {
  ballsEl.textContent = state.balls;
}

function showHud() {
  hudEl.classList.remove("hidden");
}

function hideHud() {
  hudEl.classList.add("hidden");
}

function launchBall() {
  if (!state.launched && state.running) {
    ball.vy = -7;
    ball.vx = Math.random() * 2 - 1;
    state.launched = true;
    hideHud();
  }
}

function circleCollision(bumper) {
  const dx = ball.x - bumper.x;
  const dy = ball.y - bumper.y;
  const dist = Math.hypot(dx, dy);
  if (dist < ball.radius + bumper.radius) {
    const angle = Math.atan2(dy, dx);
    const targetX = bumper.x + Math.cos(angle) * (ball.radius + bumper.radius);
    const targetY = bumper.y + Math.sin(angle) * (ball.radius + bumper.radius);
    ball.x = targetX;
    ball.y = targetY;
    const speed = Math.hypot(ball.vx, ball.vy) + 1.2;
    ball.vx = Math.cos(angle) * speed;
    ball.vy = Math.sin(angle) * speed;
    updateScore(bumper.score);
  }
}

function applyFlipper(flipper, direction) {
  const dx = ball.x - flipper.x;
  const dy = ball.y - flipper.y;
  const dist = Math.hypot(dx, dy);
  if (dist < flipper.width / 1.4 && dy > -12 && dy < 30) {
    ball.vy = -Math.abs(ball.vy) - 4;
    ball.vx += direction * 2.4;
    updateScore(10);
  }
}

function handleWalls() {
  if (ball.x - ball.radius < walls.left) {
    ball.x = walls.left + ball.radius;
    ball.vx *= -0.9;
  }
  if (ball.x + ball.radius > walls.right) {
    ball.x = walls.right - ball.radius;
    ball.vx *= -0.9;
  }
  if (ball.y - ball.radius < walls.top) {
    ball.y = walls.top + ball.radius;
    ball.vy *= -0.9;
  }
}

function updateFlippers() {
  flipperLeft.active = keyState.left;
  flipperRight.active = keyState.right;
}

function stepPhysics() {
  if (!state.launched) {
    return;
  }

  ball.vy += board.gravity;
  ball.vx *= board.friction;
  ball.vy *= board.friction;

  ball.x += ball.vx;
  ball.y += ball.vy;

  handleWalls();
  bumpers.forEach(circleCollision);

  if (flipperLeft.active) {
    applyFlipper(flipperLeft, -1);
  }
  if (flipperRight.active) {
    applyFlipper(flipperRight, 1);
  }

  if (ball.y - ball.radius > board.height) {
    state.balls -= 1;
    updateBalls();
    if (state.balls <= 0) {
      state.running = false;
      showHud();
      hudEl.querySelector("p").textContent = "游戏结束，点击重新开始。";
    } else {
      resetBall();
    }
  }
}

function drawBoard() {
  ctx.clearRect(0, 0, board.width, board.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, board.height);
  gradient.addColorStop(0, "rgba(56, 189, 248, 0.08)");
  gradient.addColorStop(1, "rgba(15, 23, 42, 0.0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(walls.left, walls.top);
  ctx.lineTo(walls.left, board.height - 40);
  ctx.moveTo(walls.right, walls.top);
  ctx.lineTo(walls.right, board.height - 40);
  ctx.stroke();

  bumpers.forEach((bumper) => {
    ctx.beginPath();
    ctx.fillStyle = "rgba(251, 191, 36, 0.9)";
    ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
    ctx.lineWidth = 4;
    ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  drawFlipper(flipperLeft, "#f472b6");
  drawFlipper(flipperRight, "#60a5fa");

  ctx.beginPath();
  ctx.fillStyle = "#e2e8f0";
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlipper(flipper, color) {
  ctx.save();
  ctx.translate(flipper.x, flipper.y);
  ctx.rotate(flipper.active ? (flipper === flipperLeft ? -0.8 : 0.8) : flipper.angle);
  ctx.fillStyle = color;
  ctx.fillRect(-flipper.width / 2, -flipper.height / 2, flipper.width, flipper.height);
  ctx.restore();
}

function loop() {
  if (state.running) {
    updateFlippers();
    stepPhysics();
  }
  drawBoard();
  requestAnimationFrame(loop);
}

function resetGame() {
  state.score = 0;
  state.balls = 3;
  state.running = true;
  hudEl.querySelector("p").textContent = "按空格发球，方向键或 A/D 控制挡板。";
  updateScore(0);
  updateBalls();
  resetBall();
}

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keyState.left = true;
  }
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keyState.right = true;
  }
  if (event.code === "Space") {
    launchBall();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    keyState.left = false;
  }
  if (event.code === "ArrowRight" || event.code === "KeyD") {
    keyState.right = false;
  }
});

restartBtn.addEventListener("click", resetGame);
canvas.addEventListener("click", launchBall);

resetGame();
loop();
