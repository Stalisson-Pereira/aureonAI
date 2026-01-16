document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.getElementById("nav-menu");

    function toggleMenu() {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("open");
    }

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            if (navLinks.classList.contains("open")) {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.classList.remove("active");
                navLinks.classList.remove("open");
            }
        }
    });

    // Fecha com Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("open")) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.classList.remove("active");
            navLinks.classList.remove("open");
            hamburger.focus();
        }
    });

    // Fecha ao clicar em um link (útil para single-page)
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("open")) {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.classList.remove("active");
                navLinks.classList.remove("open");
            }
        });
    });
});

