document.querySelectorAll("#navbar a").forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        event.preventDefault();

        const targetSection = document.querySelector(this.getAttribute("href"));
        const headerOffset = document.querySelector("nav").offsetHeight;
        const elementPosition = targetSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    });
});