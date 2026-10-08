
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
mobileNav.inert = true;

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    const isOpen = mobileNav.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.inert = !isOpen;
}

function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.inert = true;
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileMenu();
        mobileMenuToggle.focus();
    }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) closeMobileMenu();
});
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
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
const scrollToTopBtn = document.getElementById('scrollToTop');
const chatbotFab = document.getElementById('chatbotFab');
const hero = document.getElementById('home');
function updateChatbotVisibility() {
    chatbotFab.classList.toggle('visible', window.scrollY > hero.offsetHeight - nav.offsetHeight);
}
window.addEventListener('scroll', updateChatbotVisibility, { passive: true });
window.addEventListener('resize', updateChatbotVisibility);
updateChatbotVisibility();
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
        behavior: reduceMotion ? 'instant' : 'smooth'
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
                behavior: reduceMotion ? 'instant' : 'smooth'
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
            "chromadb", "hugging face", "mistral", "next.js", "typescript", "react", "tailwind",
            "groq apis", "whisper", "gpt-oss"
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

// Numbered section markers keep the motorsport detail focused on navigation.
window.addEventListener("DOMContentLoaded", () => {
    const sections = [
        { id: "education", number: "01", label: "Background" },
        { id: "journey", number: "02", label: "Experience" },
        { id: "leadership", number: "03", label: "Leadership" },
        { id: "projects", number: "04", label: "Selected Work" },
        { id: "skills", number: "05", label: "Technical Skills" },
        { id: "awards", number: "06", label: "Recognition" },
        { id: "certifications", number: "07", label: "Credentials" },
        { id: "contact", number: "08", label: "Get In Touch" },
    ];

    sections.forEach(({ id, number, label }) => {
        const container = document.querySelector(`#${id} > .container`);
        if (!container) return;
        const marker = document.createElement("div");
        marker.className = "pit-dashboard";
        marker.setAttribute("aria-hidden", "true");
        const text = document.createElement("div");
        text.className = "pit-stop-label";
        text.append(document.createTextNode(number));
        const name = document.createElement("span");
        name.textContent = label;
        text.append(name);
        marker.append(text);
        container.prepend(marker);
    });

    highlightNavLink();
});
