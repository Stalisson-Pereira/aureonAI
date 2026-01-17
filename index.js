document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = navMenu ? Array.from(navMenu.querySelectorAll('a[href^="#"]')) : [];

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    const setMenuOpen = (isOpen) => {
        if (!hamburger || !navMenu) return;
        hamburger.setAttribute("aria-expanded", String(isOpen));
        hamburger.classList.toggle("active", isOpen);
        navMenu.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    };

    const getMenuOpen = () => {
        if (!hamburger) return false;
        return hamburger.getAttribute("aria-expanded") === "true";
    };

    const toggleMenu = () => setMenuOpen(!getMenuOpen());

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (getMenuOpen() && !navMenu.contains(target) && !hamburger.contains(target)) {
                setMenuOpen(false);
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && getMenuOpen()) {
                setMenuOpen(false);
                hamburger.focus();
            }
        });
    }

    const scrollToId = (id) => {
        const section = document.getElementById(id);
        if (!section) return;
        section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;
            e.preventDefault();
            const id = href.slice(1);
            setMenuOpen(false);
            scrollToId(id);
        });
    });

    const allSections = Array.from(document.querySelectorAll("section[id], header[id]"));
    const sectionById = new Map(allSections.map((s) => [s.id, s]));
    const linkById = new Map(navLinks.map((a) => [a.getAttribute("href")?.slice(1) ?? "", a]));

    const setActiveLink = (id) => {
        navLinks.forEach((a) => a.classList.remove("is-active"));
        const a = linkById.get(id);
        if (a) a.classList.add("is-active");
    };

    if ("IntersectionObserver" in window && allSections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting && e.target instanceof HTMLElement)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
                if (!visible || !(visible.target instanceof HTMLElement) || !visible.target.id) return;
                setActiveLink(visible.target.id);
            },
            { root: null, rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.2, 0.35] }
        );

        allSections.forEach((section) => observer.observe(section));
    }

    const nav = document.querySelector("nav");
    if (nav) {
        let ticking = false;
        const updateNav = () => {
            const scrolled = window.scrollY > 8;
            nav.classList.toggle("is-scrolled", scrolled);
            ticking = false;
        };
        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(updateNav);
            },
            { passive: true }
        );
        updateNav();
    }

    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    if (!(entry.target instanceof HTMLElement)) return;
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.15 }
        );
        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add("is-visible"));
    }

    const toggle = document.querySelector(".pricing-toggle .toggle");
    const prices = Array.from(document.querySelectorAll(".price[data-monthly][data-yearly]"));
    const setBilling = (period) => {
        const yearly = period === "yearly";
        if (toggle) toggle.setAttribute("aria-pressed", String(yearly));
        document.documentElement.dataset.billing = yearly ? "yearly" : "monthly";
        prices.forEach((el) => {
            const value = yearly ? el.getAttribute("data-yearly") : el.getAttribute("data-monthly");
            if (value) el.textContent = value;
        });
    };

    if (toggle) {
        toggle.addEventListener("click", () => {
            const current = toggle.getAttribute("aria-pressed") === "true" ? "yearly" : "monthly";
            setBilling(current === "yearly" ? "monthly" : "yearly");
        });
        setBilling("monthly");
    }

    const faqButtons = Array.from(document.querySelectorAll(".faq-question"));
    const setFaqOpen = (button, isOpen) => {
        const answerId = button.getAttribute("aria-controls");
        if (!answerId) return;
        const answer = document.getElementById(answerId);
        if (!answer) return;
        button.setAttribute("aria-expanded", String(isOpen));
        answer.classList.toggle("open", isOpen);
    };

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const isOpen = button.getAttribute("aria-expanded") === "true";
            setFaqOpen(button, !isOpen);
        });
    });

    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    if (form instanceof HTMLFormElement && note) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const name = String(data.get("name") ?? "").trim();
            const email = String(data.get("email") ?? "").trim();
            const message = String(data.get("message") ?? "").trim();

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const ok = name.length > 1 && emailOk && message.length > 5;

            note.textContent = ok
                ? "Mensagem pronta para envio. Conecte este formulário a um endpoint para receber no email."
                : "Preencha nome, email válido e uma mensagem um pouco maior.";
            note.classList.toggle("ok", ok);

            if (ok) form.reset();
        });
    }

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && sectionById.has(initialHash)) {
        setTimeout(() => scrollToId(initialHash), 0);
        setActiveLink(initialHash);
    } else if (sectionById.has("home")) {
        setActiveLink("home");
    }
});

