import patternsText from "../assets/patterns.txt";

export async function loadPatterns() {
  const text = patternsText;
  return text.split("\n\n").map((pattern) => pattern.split("\n"));
}

export class GameOfLife {
  constructor(
    canvas,
    cellSize = 6,
    fps = 10,
    margin = 1,
    borderWidth = 1,
    underpopulation = 2,
    overpopulation = 3,
    reproduction = 3
  ) {
    Object.assign(this, {
      canvas,
      cellSize,
      fps,
      margin,
      borderWidth,
      underpopulation,
      overpopulation,
      reproduction,
    });
    this.ctx = canvas.getContext("2d");
    this.contentSize = this.cellSize + 2 * this.margin;
    this.grid = new Map();
    this.offsetX = 0;
    this.offsetY = 0;
  }

  setCell(y, x, value) {
    const key = `${y},${x}`;
    value ? this.grid.set(key, true) : this.grid.delete(key);
  }

  draw() {
    const { ctx, canvas, contentSize, grid, margin, cellSize, borderWidth } =
      this;
    ctx.fillStyle = "rgba(245, 245, 245, 0.2)";
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

      ctx.strokeStyle = "202a44";
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
    const { grid, underpopulation, overpopulation, reproduction } = this;
    const newGrid = new Map();
    const cellsToCheck = new Set([...grid.keys()]);
    const neighbors = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [key] of grid) {
      const [y, x] = key.split(",").map(Number);
      const aliveNeighbors = this.getAliveNeighbors(y, x);

      if (
        aliveNeighbors >= underpopulation &&
        aliveNeighbors <= overpopulation
      ) {
        newGrid.set(key, true);
      }

      neighbors.forEach(([dy, dx]) => {
        cellsToCheck.add(`${y + dy},${x + dx}`);
      });
    }

    for (const key of cellsToCheck) {
      if (!grid.has(key)) {
        const [y, x] = key.split(",").map(Number);
        const aliveNeighbors = this.getAliveNeighbors(y, x);

        if (aliveNeighbors === reproduction) {
          newGrid.set(key, true);
        }
      }
    }

    this.grid = newGrid;
  }

  getAliveNeighbors(y, x) {
    const neighbors = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    return neighbors.reduce(
      (count, [dy, dx]) =>
        count + (this.grid.has(`${y + dy},${x + dx}`) ? 1 : 0),
      0
    );
  }

  setPattern(pattern) {
    this.grid.clear();
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x] === "#") {
          this.setCell(y + this.offsetY, x + this.offsetX, true);
        }
      }
    }
  }

  toggleCell(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.contentSize);
    const y = Math.floor((event.clientY - rect.top) / this.contentSize);
    this.setCell(y, x, !this.grid.has(`${y},${x}`));
    this.draw();
  }

  loop() {
    this.step();
    this.draw();
    setTimeout(() => requestAnimationFrame(() => this.loop()), 1000 / this.fps);
  }
}
