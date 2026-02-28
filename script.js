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

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navHeight = nav.offsetHeight;
        if (window.scrollY >= (sectionTop - navHeight - 100)) {
            current = section.getAttribute('id');
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
            color: var(--primary) !important;
        }
        
        .nav-links a.active::after {
            width: 100% !important;
        }
        
        .mobile-nav a.active {
            background: rgba(99, 102, 241, 0.15) !important;
        }
    `;
document.head.appendChild(styleActive);

function showSecurityPopup(message) {
    const existingPopup = document.getElementById('securityPopup');
    const existingOverlay = document.getElementById('securityPopupOverlay');
    if (existingPopup) existingPopup.remove();
    if (existingOverlay) existingOverlay.remove();
    const overlay = document.createElement('div');
    overlay.id = 'securityPopupOverlay';
    document.body.appendChild(overlay);
    const popup = document.createElement('div');
    popup.id = 'securityPopup';
    popup.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background: var(--gradient-1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="fas fa-shield-alt" style="font-size: 24px; color: white;"></i>
                    </div>
                    <h3 style="color: white; margin-bottom: 10px;">Security Notice</h3>
                    <p style="color: var(--gray); line-height: 1.5;">${message}</p>
                </div>
                <button id="closePopup" style="
                    background: var(--gradient-1);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                ">Understood</button>
            `;
    document.body.appendChild(popup);
    document.getElementById('closePopup').addEventListener('click', function() {
        popup.remove();
        overlay.remove();
    });
    overlay.addEventListener('click', function() {
        popup.remove();
        overlay.remove();
    });
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.remove();
            overlay.remove();
        }
    }, 5000);
}
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showSecurityPopup('Right-click is disabled on this page.');
    return false;
});

document.addEventListener('keydown', function(e) {

    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showSecurityPopup('Developer tools are disabled.');
        return false;
    }

    if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault();
        showSecurityPopup('Developer tools are disabled.');
        return false;
    }

    if ((e.ctrlKey && e.shiftKey && e.key === 'J') || (e.metaKey && e.altKey && e.key === 'j')) {
        e.preventDefault();
        showSecurityPopup('Developer tools are disabled.');
        return false;
    }

    if ((e.ctrlKey && e.key === 'u') || (e.metaKey && e.key === 'u')) {
        e.preventDefault();
        showSecurityPopup('Viewing page source is disabled.');
        return false;
    }

    if ((e.ctrlKey && e.shiftKey && e.key === 'C') || (e.metaKey && e.altKey && e.key === 'c')) {
        e.preventDefault();
        showSecurityPopup('Inspect element is disabled.');
        return false;
    }
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});


let devtoolsOpen = false;
setInterval(() => {
    const start = performance.now();
    console.debug('DevTools Check');
    const end = performance.now();

    if (end - start > 100) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            showSecurityPopup('Developer tools detected. Please close them.');
        }
    } else {
        devtoolsOpen = false;
    }
    // Clear console to prevent spam
    console.clear();

}, 1000); // ===============================
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
        overall: ["home", "education", "experience", "leadership", "projects", "skills", "awards", "certifications"],

        home: ["home"],
        education: ["education"],
        experience: ["experience"], // <-- change to ["journey"] if your experience section is id="journey"
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
            "analytics", "genai", "pipeline", "automation", "schema", "data quality", "role-based"
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