// import scss
import "./scss/main.scss";
import resume from "./assets/steve-wang-resume.pdf";

// import custom js
import { initGameOfLife } from "./js/game-of-life.js";
// import "./js/underline.js";

// import html module
import home from "./pages/home.html";
import arts from "./pages/arts.html";
import projects from "./pages/projects.html";

function attachEventListener(selector, content) {
  document.querySelector(selector).addEventListener("click", (e) => {
    e.preventDefault();
    loadContent(content);
  });
}

function loadContent(content) {
  const mainContent = document.querySelector("#main-content");
  mainContent.innerHTML = content;
}

attachEventListener("#nav-arts", arts);
attachEventListener("#nav-home", home);
attachEventListener("#nav-proj", projects);

loadContent(home);
initGameOfLife();
