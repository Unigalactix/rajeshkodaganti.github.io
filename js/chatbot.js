/**
 * Portfolio Assistant Module
 * A keyword-based chatbot that uses data.json as its knowledge base.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPam();
});

let pamData = null;

async function initPam() {
    // 1. Create UI
    createChatUI();

    // 2. Load Knowledge Base
    try {
        const response = await fetch('js/data.json');
        pamData = await response.json();
        console.log('Portfolio assistant: knowledge loaded.');
    } catch (e) {
        console.error('Portfolio assistant: failed to load knowledge.', e);
        addMessage('system', 'Portfolio information is temporarily unavailable. Please use the page sections or contact form.');
    }

    // 3. Attach Listeners
    const sendBtn = document.getElementById('pam-send-btn');
    const input = document.getElementById('pam-input');
    const toggleBtn = document.getElementById('pam-toggle-btn');
    const closeBtn = document.getElementById('pam-close-btn');

    sendBtn.addEventListener('click', () => handleUserInput(input));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput(input);
    });

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // 4. Greeting
    setTimeout(() => {
        addMessage('bot', "Hi, I'm the portfolio assistant. Ask about Rajesh's experience, projects, skills, certifications, resume, or contact details.");
    }, 1000);
}

function createChatUI() {
    const html = `
    <!-- Floating Toggle Button -->
    <button id="pam-toggle-btn" class="pam-float-btn" aria-label="Open portfolio assistant" aria-expanded="false" aria-controls="pam-window">
        <i class="fa fa-comments" aria-hidden="true"></i>
    </button>

    <!-- Chat Window -->
    <div id="pam-window" class="pam-window" role="dialog" aria-label="Portfolio assistant" style="display: none;">
        <div class="pam-header">
            <div class="pam-avatar" aria-hidden="true">RK</div>
            <div class="pam-info">
                <h4>Portfolio Assistant</h4>
                <span>Experience and project search</span>
            </div>
            <button id="pam-close-btn" aria-label="Close portfolio assistant"><i class="fa fa-times" aria-hidden="true"></i></button>
        </div>
        <div id="pam-messages" class="pam-messages" aria-live="polite"></div>
        <div class="pam-input-area">
            <label class="sr-only" for="pam-input">Ask about Rajesh's portfolio</label>
            <input type="text" id="pam-input" placeholder="Ask about skills, projects, or experience">
            <button id="pam-send-btn" aria-label="Send message"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </div>
    </div>
    `;

    const container = document.createElement('div');
    container.id = 'pam-container';
    container.innerHTML = html;
    document.body.appendChild(container);
}

function toggleChat() {
    const window = document.getElementById('pam-window');
    const btn = document.getElementById('pam-toggle-btn');

    if (window.style.display === 'none') {
        window.style.display = 'flex';
        btn.style.display = 'none';
        btn.setAttribute('aria-expanded', 'true');

        // Focus input
        setTimeout(() => document.getElementById('pam-input').focus(), 100);
    } else {
        window.style.display = 'none';
        btn.style.display = 'flex';
        btn.setAttribute('aria-expanded', 'false');
    }
}

function handleUserInput(inputEl) {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage('user', text);
    inputEl.value = '';

    const typingId = showTyping();

    // Process logic
    setTimeout(() => {
        removeTyping(typingId);
        const response = generateResponse(text);
        addMessage('bot', response);
    }, 250);
}

function showTyping() {
    const id = Date.now();
    const msgs = document.getElementById('pam-messages');
    const bubble = document.createElement('div');
    bubble.className = 'pam-msg bot typing';
    bubble.id = `typing-${id}`;
    bubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(`typing-${id}`);
    if (el) el.remove();
}

function addMessage(sender, text) {
    const msgs = document.getElementById('pam-messages');
    const bubble = document.createElement('div');
    bubble.className = `pam-msg ${sender}`;
    // Convert newlines to breaks if needed, or simple text
    bubble.innerHTML = text.replace(/\n/g, '<br/>');
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
}

/**
 * CORE LOGIC: Searching data.json
 */
function generateResponse(query) {
    if (!pamData) return 'Portfolio data is still loading. Please try again in a moment.';

    const q = query.toLowerCase();
    if (q.match(/^(hi|hello|hey)/)) return "Hello. Ask me about Rajesh's AI engineering work, projects, technical skills, or credentials.";
    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("phone")) {
        return `You can contact Rajesh at <strong>${pamData.basics.email}</strong> or ${pamData.basics.phone}.`;
    }
    if (q.includes("resume") || q.includes("cv")) return '<a href="resume-2page.pdf" target="_blank" rel="noopener">Open the recommended two-page resume</a>.';
    if (q.includes("who are you")) return "I'm a local search assistant for Rajesh's portfolio data.";

    // 3. Search Skills
    const skillMatch = findSkill(q);
    if (skillMatch) return skillMatch;

    // 4. Search Projects
    const projectMatch = findProject(q);
    if (projectMatch) return projectMatch;

    // 5. Search Experience/Work
    const workMatch = findWork(q);
    if (workMatch) return workMatch;

    // 6. Search Certifications
    const certMatch = findCert(q);
    if (certMatch) return certMatch;

    // Default Fallback
    return "I couldn't find a direct match. Try asking about experience, projects, skills, certifications, resume, or contact details.";
}

function findSkill(query) {
    if (!pamData.skills) return null;

    for (const cat of pamData.skills) {
        const match = cat.keywords.find(k => query.includes(k.toLowerCase()));
        if (match) {
            return `<strong>${match}</strong> appears under ${cat.name}.`;
        }
    }
    return null;
}

function findProject(query) {
    if (!pamData.projects) return null;

    const p = pamData.projects.find(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.keywords.some(k => query.includes(k.toLowerCase()))
    );

    if (p) {
        return `<strong>${p.name}</strong><br>${p.description}<br><strong>Technologies:</strong> ${p.keywords.join(', ')}.`;
    }

    if (query.includes("projects") || query.includes("work")) {
        const names = pamData.projects.map(p => p.name).slice(0, 3).join(", ");
        return `Featured projects include <strong>${names}</strong>. See Selected Engineering Case Studies for details.`;
    }

    return null;
}

function findWork(query) {
    if (!pamData.work) return null;

    const w = pamData.work.find(job =>
        job.name.toLowerCase().includes(query) ||
        job.position.toLowerCase().includes(query) ||
        (job.summary || '').toLowerCase().includes(query)
    );
    if (w) {
        return `<strong>${w.position} at ${w.name}</strong><br>${w.startDate} - ${w.endDate}<br>${w.summary}`;
    }
    return null;
}

function findCert(query) {
    if (!pamData.certificates) return null;

    const c = pamData.certificates.find(cert => cert.name.toLowerCase().includes(query) || cert.issuer.toLowerCase().includes(query));
    if (c) {
        return `<strong>${c.name}</strong> from ${c.issuer}, earned ${c.date}.`;
    }
    return null;
}
