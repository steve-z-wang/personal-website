import "./scss/main.scss";
import "@fortawesome/fontawesome-free/js/fontawesome.js";
import "@fortawesome/fontawesome-free/js/brands.js";

import { GameOfLife, loadPatterns } from "./js/game-of-life.js";

(async () => {
  const container = document.querySelector(".header-upper");
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
  });
})();
