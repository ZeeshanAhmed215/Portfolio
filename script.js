const portfolio = {
    username: "ZeeshanAhmed215"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initializeNavigation() {
    const nav = document.querySelector(".nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = [...document.querySelectorAll(".nav-links a")];

    const updateNav = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    menuToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) => {
                    link.classList.toggle("active", link.hash === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-35% 0px -60% 0px" });

        document.querySelectorAll("main section").forEach((section) => sectionObserver.observe(section));
    }
}

function initializeTyping() {
    if (prefersReducedMotion) {
        document.querySelector("#typingText").textContent = "AI & Machine Learning Developer";
        return;
    }

    const roles = [
        "AI & Machine Learning Developer",
        "BS Artificial Intelligence Student",
        "Python & Data Science Developer",
        "Algorithms & Problem Solver"
    ];
    const element = document.querySelector("#typingText");
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const tick = () => {
        const role = roles[roleIndex];
        characterIndex += deleting ? -1 : 1;
        element.textContent = role.slice(0, characterIndex);

        if (!deleting && characterIndex === role.length) {
            deleting = true;
            window.setTimeout(tick, 1500);
            return;
        }
        if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        window.setTimeout(tick, deleting ? 35 : 72);
    };
    tick();
}

function initializeReveal() {
    const elements = [...document.querySelectorAll(".reveal")];
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
}

function initializeCanvas() {
    const canvas = document.querySelector("#neuralCanvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame = 0;
    const pointer = { x: -1000, y: -1000 };

    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const count = width < 700 ? 38 : 70;
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.34,
            vy: (Math.random() - 0.5) * 0.34,
            radius: Math.random() * 1.4 + 0.6
        }));
    };

    const draw = () => {
        context.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            const dxPointer = particle.x - pointer.x;
            const dyPointer = particle.y - pointer.y;
            const pointerDistance = Math.hypot(dxPointer, dyPointer);
            if (pointerDistance < 130 && pointerDistance > 0) {
                particle.x += (dxPointer / pointerDistance) * 0.28;
                particle.y += (dyPointer / pointerDistance) * 0.28;
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = "rgba(125, 211, 252, 0.72)";
            context.fill();
        });

        for (let i = 0; i < particles.length; i += 1) {
            for (let j = i + 1; j < particles.length; j += 1) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);
                if (distance < 118) {
                    context.beginPath();
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(particles[j].x, particles[j].y);
                    context.strokeStyle = `rgba(139, 92, 246, ${0.14 * (1 - distance / 118)})`;
                    context.lineWidth = 0.8;
                    context.stroke();
                }
            }
        }
        animationFrame = window.requestAnimationFrame(draw);
    };

    const rectResize = () => resize();
    rectResize();
    window.addEventListener("resize", rectResize);

    canvas.parentElement.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
    });
    canvas.parentElement.addEventListener("pointerleave", () => {
        pointer.x = -1000;
        pointer.y = -1000;
    });

    if (prefersReducedMotion) {
        draw();
        window.cancelAnimationFrame(animationFrame);
    } else {
        draw();
    }
}

let allRepositories = [];

function classifyRepository(repo) {
    const text = `${repo.name} ${repo.description || ""} ${repo.language || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    if (/(machine.learning|deep.learning|neural|tensorflow|pytorch|ai|artificial intelligence|data science|computer.vision|nlp)/.test(text)) {
        return "ai";
    }
    if (/(python|jupyter|pandas|numpy|scikit|django|flask|automation|sql)/.test(text) || repo.language === "Python") {
        return "python";
    }
    return "web";
}

function escapeHTML(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
}

function createProjectCard(repo) {
    const category = classifyRepository(repo);
    const language = repo.language || "Repository";
    const description = repo.description || "A public GitHub project with code and project documentation.";
    const visualLabels = {
        ai: '<i class="fas fa-brain" aria-hidden="true"></i>',
        python: '<i class="devicon-python-plain colored" aria-hidden="true"></i>',
        web: '<i class="fas fa-code" aria-hidden="true"></i>'
    };

    return `
        <article class="project-card" data-category="${category}">
            <div class="project-visual ${category}" role="img" aria-label="${escapeHTML(category === "ai" ? "AI and machine learning themed illustration" : category === "python" ? "Python project visual" : "Web or software project visual")}">
                <span class="visual-icon">${visualLabels[category]}</span>
            </div>
            <div class="project-body">
                <div class="project-meta">
                    <span>${escapeHTML(language)}</span>
                    <span>★ ${repo.stargazers_count || 0}</span>
                </div>
                <h3>${escapeHTML(repo.name)}</h3>
                <p>${escapeHTML(description)}</p>
                <div class="project-stats">
                    <span>★ ${repo.stargazers_count || 0}</span>
                    <span>⑂ ${repo.forks_count || 0}</span>
                </div>
                <div class="project-actions">
                    <a href="${repo.html_url}" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true"></i> GitHub Code</a>
                </div>
            </div>
        </article>
    `;
}

function renderRepositories(filter = "all") {
    const grid = document.querySelector("#projectsGrid");
    const repositories = allRepositories.filter((repo) => {
        if (filter === "all") return true;
        if (filter === "ai") return classifyRepository(repo) === "ai";
        if (filter === "python") return classifyRepository(repo) === "python";
        return classifyRepository(repo) === "web";
    });

    if (repositories.length === 0) {
        grid.innerHTML = `<div class="error-state">No repositories match this category yet.</div>`;
        return;
    }
    grid.innerHTML = repositories
        .slice(0, 9)
        .map(createProjectCard)
        .join("");
}

async function initializeRepositories() {
    const grid = document.querySelector("#projectsGrid");
    try {
        const response = await fetch(
            `https://api.github.com/users/${portfolio.username}/repos?sort=updated&per_page=100`,
            { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        allRepositories = (await response.json())
            .filter((repo) => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        renderRepositories();

        document.querySelectorAll(".filter-btn").forEach((button) => {
            button.addEventListener("click", () => {
                document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                renderRepositories(button.dataset.filter);
            });
        });
    } catch (error) {
        grid.innerHTML = `
            <div class="error-state">
                GitHub projects could not be loaded. 
                <a href="https://github.com/${portfolio.username}" target="_blank" rel="noopener">Visit my GitHub profile ↗</a>
            </div>
        `;
        console.error("Unable to load GitHub repositories:", error);
    }
}

function initializeContactForm() {
    const form = document.querySelector("#contactForm");
    const status = document.querySelector("#formStatus");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = encodeURIComponent(data.get("subject"));
        const body = encodeURIComponent(
            `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
        );
        status.textContent = "Opening your email application…";
        window.location.href = `mailto:codewithzees@gmail.com?subject=${subject}&body=${body}`;
    });
}

document.querySelector("#year").textContent = new Date().getFullYear();
initializeNavigation();
initializeTyping();
initializeReveal();
initializeCanvas();
initializeRepositories();
initializeContactForm();
