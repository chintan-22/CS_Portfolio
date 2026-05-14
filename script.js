const floatingElements = document.getElementById('floatingElements');
for (let i = 0; i < 15; i++) {
    const element = document.createElement('div');
    element.classList.add('floating-element');
    const size = Math.random() * 200 + 50;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 20;

    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${x}%`;
    element.style.top = `${y}%`;
    element.style.animation = `float ${duration}s infinite ease-in-out`;

    floatingElements.appendChild(element);
}

const style = document.createElement('style');
style.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -20px) rotate(5deg); }
            50% { transform: translate(-15px, 10px) rotate(-5deg); }
            75% { transform: translate(10px, 15px) rotate(3deg); }
        }
    `;
document.head.appendChild(style);

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const scrollDownArrow = document.querySelector('.scroll-down');

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
fadeElements.forEach(element => {
    observer.observe(element);
});
const nav = document.getElementById('mainNav');
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    if (scrollTop > 100) {
        scrollDownArrow.style.opacity = '0';
        scrollDownArrow.style.visibility = 'hidden';
        scrollDownArrow.style.transform = 'translateX(-50%) translateY(20px)';
    } else {
        scrollDownArrow.style.opacity = '1';
        scrollDownArrow.style.visibility = 'visible';
        scrollDownArrow.style.transform = 'translateX(-50%) translateY(0)';
    }

    lastScrollTop = scrollTop;
});
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            closeMobileMenu();
            const headerHeight = nav.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

function highlightNavLink() {
    let current = '';
    const sectionMap = {
        leadership: 'journey',
        awards: 'projects',
        certifications: 'projects',
    };

    document.querySelectorAll('section, footer#contact').forEach(section => {
        const sectionTop = section.offsetTop;
        const navHeight = nav.offsetHeight;
        if (window.scrollY >= (sectionTop - navHeight - 100)) {
            const id = section.getAttribute('id');
            current = sectionMap[id] || id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);
const styleActive = document.createElement('style');
styleActive.textContent = `
        .nav-links a.active,
        .mobile-nav a.active {
            color: var(--secondary) !important;
        }

        .nav-links a.active::after {
            width: 100% !important;
        }

        .mobile-nav a.active {
            background: rgba(204, 0, 0, 0.16) !important;
        }
    `;
document.head.appendChild(styleActive);

// ===============================
// SUMMARY BOT (Portfolio Only) - INTERACTIVE + ALL SECTIONS
// Paste at the VERY BOTTOM of script.js
// (and DELETE your older chatbot block)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const fab = document.getElementById("chatbotFab");
    const panel = document.getElementById("chatbotPanel");
    const closeBtn = document.getElementById("chatbotClose");
    const body = document.getElementById("chatbotBody");
    const input = document.getElementById("chatbotInput");
    const send = document.getElementById("chatbotSend");

    if (!fab || !panel || !closeBtn || !body || !input || !send) return;

    // Start closed
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");

    // ✅ UPDATE THESE IDs if your HTML uses different ones.
    // Example: if Experience section is still <section id="journey"> then set experience: ["journey"]
    const sectionMap = {
        overall: ["home", "education", "journey", "leadership", "projects", "skills", "awards", "certifications"],

        home: ["home"],
        education: ["education"],
        experience: ["journey"],
        leadership: ["leadership"],
        projects: ["projects"],
        skills: ["skills"],
        awards: ["awards"],
        certifications: ["certifications"],
    };

    // -----------------------
    // Helpers
    // -----------------------
    function addMsg(text, who) {
        const div = document.createElement("div");
        div.className = `chatbot-msg ${who}`;
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function normalizeText(t) {
        return (t || "").replace(/\s+/g, " ").trim();
    }

    function getSectionText(id) {
        const el = document.getElementById(id);
        return el ? normalizeText(el.innerText) : "";
    }

    // -----------------------
    // Small talk / interactive replies
    // -----------------------
    function smallTalkReply(raw) {
        const q = raw.toLowerCase().trim();

        const greetings = ["hi", "hello", "hey", "hii", "hiya", "yo"];
        const thanks = ["thanks", "thank you", "thx", "ty"];
        const howAreYou = ["how are you", "how r u", "how are u", "how you doing", "how’s it going", "hows it going"];

        if (greetings.includes(q)) {
            return "Hi! How are you doing? 😊 I can summarize: home, education, experience, leadership, projects, skills, awards, certifications, or overall.";
        }
        if (howAreYou.some(p => q.includes(p))) {
            return "Doing great! 😊 What would you like summarized: overall, experience, projects, leadership, awards, certifications, etc?";
        }
        if (thanks.some(p => q.includes(p))) {
            return "You’re welcome! Want me to summarize another section?";
        }
        return null;
    }

    // -----------------------
    // Better summary logic (extract strong lines + format)
    // -----------------------
    function extractKeywords(text) {
        const found = new Set();
        const keywords = [
            "python", "sql", "mariadb", "mongodb", "streamlit", "groq", "n8n", "aws", "power apps",
            "etl", "dashboard", "dashboards", "nlp", "transformers", "opencv", "twilio", "ml", "data",
            "analytics", "genai", "pipeline", "automation", "schema", "data quality", "role-based",
            "clip", "gemma", "multimodal", "mlflow", "github actions", "slack", "rag", "langchain",
            "chromadb", "hugging face", "mistral"
        ];
        const lower = text.toLowerCase();
        keywords.forEach(k => {
            if (lower.includes(k)) found.add(k);
        });
        return Array.from(found).slice(0, 10);
    }

    function pickStrongSentences(text, max = 6) {
        if (!text) return [];
        const sentences = text
            .split(/(?<=[.!?])\s+/)
            .map(s => s.trim())
            .filter(Boolean);

        const verbs = /(built|developed|led|migrating|improving|refactoring|automated|created|designed|implemented|optimized|reduced|improved|integrat|secured|managed|deployed|upgraded|proposed)/i;
        const hasNumber = /\d|%|\$/;
        const hasTech = /(python|sql|mariadb|mongodb|streamlit|groq|n8n|aws|opencv|twilio|transformers|dashboard|etl|pipeline)/i;

        const scored = sentences.map(s => {
            let score = 0;
            if (verbs.test(s)) score += 3;
            if (hasNumber.test(s)) score += 3;
            if (hasTech.test(s)) score += 2;
            if (s.length > 35 && s.length < 240) score += 1;
            return { s, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, max).map(x => x.s);
    }

    function buildSummary(sectionKey, combinedText) {
        if (!combinedText) return "I couldn’t find that section on this page yet. (Check the section id in HTML.)";

        const lines = pickStrongSentences(combinedText, sectionKey === "overall" ? 7 : 5);
        const tech = extractKeywords(combinedText);

        const bullets = (lines.length ? lines : combinedText.split(/(?<=[.!?])\s+/).filter(Boolean))
            .slice(0, sectionKey === "overall" ? 5 : 3)
            .map(h => `• ${h}`)
            .join("\n");

        const techLine = tech.length ? `\nTech mentioned: ${tech.join(", ")}` : "";

        const headers = {
            overall: "Here’s a quick summary of the full portfolio:",
            home: "Here’s a summary of Home:",
            education: "Here’s a summary of Education:",
            experience: "Here’s a summary of Experience:",
            leadership: "Here’s a summary of Leadership:",
            projects: "Here’s a summary of Projects & Publications:",
            skills: "Here’s a summary of Skills:",
            awards: "Here’s a summary of Awards & Honors:",
            certifications: "Here’s a summary of Certifications:",
        };

        return `${headers[sectionKey] || "Summary:"}\n${bullets}${techLine}`;
    }

    // -----------------------
    // Intent detection for ALL sections
    // -----------------------
    function detectIntent(raw) {
        const q = raw.toLowerCase().trim();

        // overall
        if (q.includes("overall") || q.includes("everything") || q.includes("summary") || q === "all") return "overall";

        // specific sections
        if (q.includes("home")) return "home";
        if (q.includes("education") || q.includes("school") || q.includes("degree")) return "education";
        if (q.includes("experience") || q.includes("work") || q.includes("intern") || q.includes("job")) return "experience";
        if (q.includes("leadership") || q.includes("leader")) return "leadership";
        if (q.includes("projects") || q.includes("project") || q.includes("publications") || q.includes("publication")) return "projects";
        if (q.includes("skills") || q.includes("skill") || q.includes("stack") || q.includes("tech")) return "skills";
        if (q.includes("awards") || q.includes("honors") || q.includes("achievement")) return "awards";
        if (q.includes("certification") || q.includes("certifications") || q.includes("aws")) return "certifications";

        return null;
    }

    function handleQuery(raw) {
        // small talk first
        const talk = smallTalkReply(raw);
        if (talk) return talk;

        const key = detectIntent(raw);
        if (!key) {
            return "I can summarize this portfolio only. Try: overall / home / education / experience / leadership / projects / skills / awards / certifications.";
        }

        const ids = sectionMap[key] || [];
        const combined = ids.map(getSectionText).filter(Boolean).join(" ");
        return buildSummary(key, combined);
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        addMsg(text, "user");
        addMsg(handleQuery(text), "bot");
        input.value = "";
    }

    // -----------------------
    // UI events
    // -----------------------
    fab.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        panel.classList.toggle("open");
        panel.setAttribute("aria-hidden", panel.classList.contains("open") ? "false" : "true");
        if (panel.classList.contains("open")) input.focus();
    });

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    });

    send.addEventListener("click", (e) => {
        e.preventDefault();
        sendMessage();
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // chips
    document.querySelectorAll(".chatbot-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-section");
            addMsg(`Summarize ${key}`, "user");

            const ids = sectionMap[key] || [];
            const combined = ids.map(getSectionText).filter(Boolean).join(" ");
            addMsg(buildSummary(key, combined), "bot");
        });
    });

    // close if clicked outside
    document.addEventListener("click", (e) => {
        if (!panel.classList.contains("open")) return;
        if (panel.contains(e.target) || fab.contains(e.target)) return;
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    });
});

// ===============================
// F1 PIT-STOP EXPERIENCE LAYER
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pitStops = [
        { id: "home", number: "01", label: "GRID POSITION", dot: 0, lap: 8421 },
        { id: "education", number: "02", label: "DRIVER PROFILE", dot: 1, lap: 16312 },
        { id: "skills", number: "03", label: "TECHNICAL SPECS", dot: 2, lap: 24708 },
        { id: "journey", number: "04", label: "RACE LOG", dot: 3, lap: 33146 },
        { id: "leadership", number: "04", label: "RACE CONTROL", dot: 3, lap: 38804 },
        { id: "projects", number: "05", label: "CHAMPIONSHIP WINS", dot: 4, lap: 46328 },
        { id: "awards", number: "05", label: "PODIUM RESULTS", dot: 4, lap: 51701 },
        { id: "certifications", number: "05", label: "GARAGE VALIDATION", dot: 4, lap: 56543 },
        { id: "contact", number: "06", label: "PIT WALL", dot: 5, lap: 60204 },
    ];

    function formatLap(ms) {
        const minutes = Math.floor(ms / 60000).toString().padStart(2, "0");
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
        const millis = Math.floor(ms % 1000).toString().padStart(3, "0");
        return `${minutes}:${seconds}.${millis}`;
    }

    function animateLapCounter(el, target) {
        if (!el || el.dataset.complete === "true") return;
        el.dataset.complete = "true";
        if (reduceMotion) {
            el.textContent = formatLap(target);
            return;
        }
        const started = performance.now();
        const duration = 1200;
        function tick(now) {
            const progress = Math.min((now - started) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = formatLap(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function addPitDashboard(target, stop) {
        if (!target || target.querySelector(".pit-dashboard")) return;
        target.classList.add("pit-stop");
        target.dataset.pitNumber = stop.number;
        target.dataset.pitLabel = stop.label;
        target.dataset.pitDot = stop.dot;

        const container = target.querySelector(".container");
        if (!container) return;

        const dashboard = document.createElement("div");
        dashboard.className = "pit-dashboard";
        dashboard.innerHTML = `
            <div class="pit-stop-label">PIT STOP ${stop.number}<span>${stop.label}</span></div>
            <div class="lap-time" data-target-lap="${stop.lap}">00:00.000</div>
            <div class="drs-zone" aria-hidden="true"></div>
        `;
        container.insertBefore(dashboard, container.firstElementChild);
    }

    pitStops.forEach((stop) => addPitDashboard(document.getElementById(stop.id), stop));

    const skills = document.getElementById("skills");
    const journey = document.getElementById("journey");
    if (skills && journey && skills.compareDocumentPosition(journey) & Node.DOCUMENT_POSITION_PRECEDING) {
        journey.parentNode.insertBefore(skills, journey);
    }

    const educationIntro = document.querySelector("#education .section-title");
    if (educationIntro && !educationIntro.querySelector(".cricket-note")) {
        const note = document.createElement("p");
        note.className = "cricket-note";
        note.textContent = "🏏 Off the track: chasing leather on 22 yards";
        educationIntro.appendChild(note);
    }

    const heroParagraph = document.querySelector(".hero-text p");
    if (heroParagraph && !document.querySelector(".lights-out")) {
        const lightsOut = document.createElement("div");
        lightsOut.className = "lights-out";
        lightsOut.textContent = "LIGHTS OUT AND AWAY WE GO";
        heroParagraph.insertAdjacentElement("afterend", lightsOut);
    }

    const heroTitle = document.querySelector(".hero-text h1");
    if (heroTitle && !heroTitle.dataset.timingReady) {
        heroTitle.dataset.timingReady = "true";
        let index = 0;
        function wrapTextNodes(node) {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const fragment = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            fragment.appendChild(document.createTextNode(" "));
                            return;
                        }

                        const word = document.createElement("span");
                        word.className = "hero-word";
                        part.split("").forEach((char) => {
                            const span = document.createElement("span");
                            span.className = "hero-name-char";
                            span.style.setProperty("--char-index", index);
                            span.textContent = char;
                            index += 1;
                            word.appendChild(span);
                        });
                        fragment.appendChild(word);
                    });
                    child.replaceWith(fragment);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    wrapTextNodes(child);
                }
            });
        }
        wrapTextNodes(heroTitle);
    }

    const skillGroups = ["POWER UNIT", "AERO PACKAGE", "SETUP"];
    document.querySelectorAll("#skills .skill-category").forEach((category, categoryIndex) => {
        if (!category.querySelector(".telemetry-group")) {
            const group = document.createElement("div");
            group.className = "telemetry-group";
            group.textContent = skillGroups[categoryIndex] || "TELEMETRY";
            const items = category.querySelector(".skill-items");
            if (items) category.insertBefore(group, items);
        }
    });

    const skillLevels = {
        SQL: 88,
        NoSQL: 80,
        MariaDB: 86,
        Excel: 82,
        "Power BI": 84,
        Tableau: 78,
        "Data Cleaning": 90,
        ETL: 87,
        pandas: 86,
        NumPy: 82,
        "scikit-learn": 80,
        "NLP Pipelines": 83,
        OpenCV: 76,
        ReactJS: 82,
        JavaScript: 84,
        "HTML/CSS": 89,
        Java: 80,
        Git: 85,
        "VS Code": 90,
        Hadoop: 72,
        n8n: 78,
    };

    document.querySelectorAll("#skills .skill-item").forEach((item) => {
        if (item.dataset.telemetryReady === "true") return;
        const name = item.textContent.trim();
        const level = skillLevels[name] || 78;
        const filled = Math.round(level / 10);
        const meter = `${"█".repeat(filled)}${"░".repeat(10 - filled)} ${level}%`;
        item.dataset.telemetryReady = "true";
        item.style.setProperty("--skill-level", `${level}%`);
        item.innerHTML = `<span class="skill-name">${name}</span><span class="skill-meter">${meter}</span>`;
    });

    const timeline = document.querySelector(".journey-timeline");
    if (timeline && !timeline.querySelector(".race-track-svg")) {
        const track = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        track.setAttribute("class", "race-track-svg");
        track.setAttribute("viewBox", "0 0 1000 900");
        track.setAttribute("preserveAspectRatio", "none");
        track.innerHTML = `<path d="M505 0 C440 120 580 180 500 300 C420 420 575 488 500 610 C425 728 545 790 500 900"></path>`;
        timeline.prepend(track);
    }

    const pitObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            section.classList.add("pit-active");
            animateLapCounter(section.querySelector(".lap-time"), Number(section.querySelector(".lap-time")?.dataset.targetLap || 0));
            updateCircuitDots(Number(section.dataset.pitDot || 0));
            updateRaceNav(section.id);
        });
    }, { threshold: 0.28, rootMargin: "-12% 0px -42% 0px" });

    document.querySelectorAll(".pit-stop").forEach((section) => pitObserver.observe(section));

    function updateCircuitDots(index) {
        document.querySelectorAll("#circuitMap span").forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });
    }

    function updateRaceNav(id) {
        const sectionToNav = {
            home: "home",
            education: "education",
            skills: "skills",
            journey: "journey",
            leadership: "journey",
            projects: "projects",
            awards: "projects",
            certifications: "projects",
            contact: "contact",
        };
        const navTarget = sectionToNav[id] || id;
        document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${navTarget}`);
        });
    }
    updateCircuitDots(0);

    const car = document.getElementById("f1ScrollCar");
    const strip = document.querySelector(".f1-progress-strip");
    const speedOverlay = document.getElementById("speedLinesOverlay");
    const enableSpeedFlash = false;
    let ticking = false;
    let lastY = window.scrollY;
    let flashTimeout;

    function flashSpeedLines() {
        if (!speedOverlay || reduceMotion) return;
        speedOverlay.classList.remove("flash");
        void speedOverlay.offsetWidth;
        speedOverlay.classList.add("flash");
        clearTimeout(flashTimeout);
        flashTimeout = setTimeout(() => speedOverlay.classList.remove("flash"), 420);
    }

    function updateCar() {
        ticking = false;
        if (!car || !strip) return;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        const available = Math.max(strip.getBoundingClientRect().height - car.getBoundingClientRect().height - 12, 0);
        car.style.transform = `translateY(${available * progress}px)`;
    }

    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        if (enableSpeedFlash && Math.abs(currentY - lastY) > 180) flashSpeedLines();
        lastY = currentY;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateCar);
        }
    }, { passive: true });
    window.addEventListener("resize", updateCar);
    updateCar();

    const soundToggle = document.getElementById("soundToggle");
    let audioContext;
    let soundEnabled = false;

    function getAudioContext() {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        return audioContext;
    }

    function playTick() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(620, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.05);
    }

    function playEngineRev() {
        if (!soundEnabled) return;
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(90, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.75);
        oscillator.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 1.55);
    }

    if (soundToggle) {
        soundToggle.addEventListener("mouseenter", playTick);
        soundToggle.addEventListener("click", async () => {
            soundEnabled = !soundEnabled;
            soundToggle.setAttribute("aria-pressed", String(soundEnabled));
            soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-high"></i>' : '<i class="fas fa-volume-xmark"></i>';
            if (soundEnabled) {
                await getAudioContext().resume();
                playEngineRev();
            }
        });
    }

    let cricketBuffer = "";
    const easterEgg = document.getElementById("cricketEasterEgg");
    document.addEventListener("keydown", (event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.key.length !== 1) return;
        cricketBuffer = (cricketBuffer + event.key.toLowerCase()).slice(-7);
        if (cricketBuffer === "cricket" && easterEgg) {
            easterEgg.classList.add("show");
            easterEgg.setAttribute("aria-hidden", "false");
            setTimeout(() => {
                easterEgg.classList.remove("show");
                easterEgg.setAttribute("aria-hidden", "true");
            }, 2000);
        }
    });
});
