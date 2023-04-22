import patternsText from "../assets/patterns.txt";

async function loadPatterns() {
  const text = patternsText;
  return text.split("\n\n").map((pattern) => pattern.split("\n"));
}

export async function initGameOfLife() {
  try {
    const container = document.querySelector(".container");
    const canvas = document.getElementById("game-of-life");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const patterns = await loadPatterns();
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

    const game = new GameOfLife(canvas);
    game.setPattern(randomPattern);
    game.loop();

    canvas.addEventListener("click", (event) => game.toggleCell(event));

    window.addEventListener("resize", () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      game.draw();
    });
  } catch (error) {
    console.error("Error initializing the Game of Life:", error);
  }
}

class GameOfLife {
  constructor(canvas, cellSize = 6, fps = 10, margin = 1, borderWidth = 1) {
    Object.assign(this, {
      canvas,
      cellSize,
      fps,
      margin,
      borderWidth,
    });
    this.ctx = canvas.getContext("2d");
    this.contentSize = this.cellSize + 2 * this.margin;
    this.grid = new Map();
    this.maxCanvasX = Math.floor(canvas.width / this.contentSize) + 1;
    this.maxCanvasY = Math.floor(canvas.height / this.contentSize) + 1;

    this.neighbors = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
  }

  getCellKey(y, x) {
    return `${y},${x}`;
  }

  setCell(y, x, value) {
    const key = this.getCellKey(y, x);
    value ? this.grid.set(key, true) : this.grid.delete(key);
  }

  draw() {
    const { ctx, canvas, contentSize, grid, margin, cellSize, borderWidth } =
      this;
    ctx.fillStyle = "rgba(249, 249, 249, 0.20)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const [key] of grid) {
      const [y, x] = key.split(",").map(Number);
      ctx.fillStyle = "#0a50c6";
      ctx.fillRect(
        x * contentSize + margin + 0.5,
        y * contentSize + margin + 0.5,
        cellSize,
        cellSize
      );

      ctx.strokeStyle = "#202a44";
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(
        x * contentSize + margin + 0.5,
        y * contentSize + margin + 0.5,
        cellSize,
        cellSize
      );
    }
  }

  step() {
    const { grid, canvas, contentSize } = this;
    const newGrid = new Map();
    const cellsToCheck = new Set([...grid.keys()]);
    const checkedCells = new Set();

    for (const key of cellsToCheck) {
      const [y, x] = key.split(",").map(Number);
      const aliveNeighbors = this.getAliveNeighbors(y, x);
      checkedCells.add(key);

      if (grid.has(key) && aliveNeighbors >= 2 && aliveNeighbors <= 3) {
        newGrid.set(key, true);
      }

      this.neighbors.forEach(([dy, dx]) => {
        const neighborY = (y + dy + this.maxCanvasY) % this.maxCanvasY;
        const neighborX = (x + dx + this.maxCanvasX) % this.maxCanvasX;
        const neighborKey = this.getCellKey(neighborY, neighborX);

        if (!checkedCells.has(neighborKey)) {
          const neighborAliveNeighbors = this.getAliveNeighbors(
            neighborY,
            neighborX
          );
          checkedCells.add(neighborKey);

          if (!grid.has(neighborKey) && neighborAliveNeighbors === 3) {
            newGrid.set(neighborKey, true);
          }
        }
      });
    }

    this.grid = newGrid;
  }

  getAliveNeighbors(y, x) {
    return this.neighbors.reduce((count, [dy, dx]) => {
      const neighborY = (y + dy + this.maxCanvasY) % this.maxCanvasY;
      const neighborX = (x + dx + this.maxCanvasX) % this.maxCanvasX;
      return (
        count + (this.grid.has(this.getCellKey(neighborY, neighborX)) ? 1 : 0)
      );
    }, 0);
  }

  setPattern(pattern) {
    this.grid.clear();
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x] === "#") {
          this.setCell(y, x, true);
        }
      }
    }
  }

  toggleCell(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.contentSize);
    const y = Math.floor((event.clientY - rect.top) / this.contentSize);
    this.setCell(y, x, !this.grid.has(this.getCellKey(y, x)));
    this.draw();
  }

  loop() {
    this.step();
    this.draw();
    setTimeout(() => requestAnimationFrame(() => this.loop()), 1000 / this.fps);
  }
}
