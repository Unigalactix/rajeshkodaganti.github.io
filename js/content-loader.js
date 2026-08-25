document.addEventListener('DOMContentLoaded', () => {
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => {
            window.PORTFOLIO_DATA = data;
            if (window.modalManager) window.modalManager.setData(data);
            renderAbout(data.basics, data.skills);
            renderSkills(data.skills);
            renderExperience(data.work);
            renderProjects(data.projects);
            renderCertifications(data.certificates);
            renderBuildLogs(data.projects, data.work);
            renderActivityDashboard(data);
        })
        .catch(error => console.error('Error loading data:', error));
});

function renderAbout(basics, skills) {
    const summaryEl = document.getElementById('about-summary');
    const focusEl = document.getElementById('about-focus');
    if (!summaryEl || !focusEl) return;

    const label = basics && basics.label ? basics.label : 'Software Engineer';
    const baseSummary = basics && basics.summary
        ? basics.summary
        : 'Software Engineer focused on building practical and reliable intelligent systems.';

    const highlightedSkills = Array.isArray(skills)
        ? skills.slice(0, 2).flatMap(cat => cat.keywords || []).slice(0, 4)
        : [];

    summaryEl.innerHTML = `I believe technology should not just function, it should <strong>delight</strong>. I am <strong>${label}</strong>, currently focused on turning complex systems into useful products.`;

    if (highlightedSkills.length) {
        const tags = highlightedSkills
            .map(skill => `<span class="text-highlight">${skill}</span>`)
            .join(', ');
        focusEl.innerHTML = `${baseSummary} Current focus includes ${tags}.`;
    } else {
        focusEl.textContent = baseSummary;
    }
}

function renderExperience(work) {
    const container = document.getElementById('experience-grid');
    const toggleBtn = document.getElementById('experience-toggle-btn');
    if (!container || !Array.isArray(work)) return;

    container.innerHTML = '';
    const visibleCount = 3;

    work.forEach((job, index) => {
        const card = document.createElement('article');
        card.className = 'browser-card accessible-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${job.position} experience at ${job.name}`);
        if (index >= visibleCount) {
            card.classList.add('collapsible-experience');
            card.hidden = true;
        }

        card.innerHTML = `
            <div class="browser-header" aria-hidden="true">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="browser-address-bar"></div>
            </div>
            <div class="browser-content">
                <span class="card-role">${job.position}</span>
                <h3>${job.name}</h3>
                <span class="card-date">${formatPeriod(job.startDate, job.endDate)}</span>
                ${job.project ? `<p class="experience-project"><strong>Project:</strong> ${job.project}</p>` : ''}
                <p>${job.summary}</p>
                <span class="card-open">Open details() -&gt;</span>
            </div>`;

        const open = () => openExperienceModal(job.id);
        card.addEventListener('click', open);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
        container.appendChild(card);
    });

    if (work.length > visibleCount && toggleBtn) {
        toggleBtn.hidden = false;
        let expanded = false;
        toggleBtn.addEventListener('click', () => {
            expanded = !expanded;
            document.querySelectorAll('.collapsible-experience').forEach(card => {
                card.hidden = !expanded;
            });
            toggleBtn.textContent = expanded ? 'Show Less' : 'Show More';
            toggleBtn.setAttribute('aria-expanded', String(expanded));
        });
    }
}

function formatPeriod(startDate, endDate) {
    const format = value => {
        if (!value || value === 'Present') return value || '';
        const [year, month] = value.split('-').map(Number);
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
            .format(new Date(year, (month || 1) - 1, 1));
    };
    return `${format(startDate)} - ${format(endDate)}`;
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    const toggleBtn = document.getElementById('skills-toggle-btn');
    if (!container) return;

    container.innerHTML = ''; // Clear loading text

    let isExpanded = false;

    skills.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        // Initially hide categories after the first one
        if (index > 0) {
            categoryDiv.style.display = 'none';
            categoryDiv.classList.add('collapsible-skill');
        }

        const title = document.createElement('h4');
        title.textContent = category.name;
        categoryDiv.appendChild(title);

        const chipsDiv = document.createElement('div');
        chipsDiv.className = 'skill-chips';

        category.keywords.forEach(keyword => {
            const chip = document.createElement('span');
            chip.className = 'skill-pill';
            chip.textContent = keyword;
            chipsDiv.appendChild(chip);
        });

        categoryDiv.appendChild(chipsDiv);
        container.appendChild(categoryDiv);
    });

    // Show toggle button if there are more than 1 category
    if (skills.length > 1 && toggleBtn) {
        toggleBtn.style.display = 'inline-block';

        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            const collapsibleSkills = document.querySelectorAll('.collapsible-skill');

            collapsibleSkills.forEach(skill => {
                skill.style.display = isExpanded ? 'block' : 'none';
            });

            toggleBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
            toggleBtn.style.background = isExpanded ? 'var(--accent-green)' : 'transparent';
            toggleBtn.style.color = isExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const caseStudy = getCaseStudyCopy(project);

        const card = document.createElement('article');
        card.className = 'browser-card project-card reveal';
        card.setAttribute('data-reveal', 'up');

        if (index >= 3) {
            card.style.display = 'none';
            card.classList.add('collapsible-project');
        }

        // Header
        const header = document.createElement('div');
        header.className = 'browser-header';
        const isRunning = String(project.endDate || '').toLowerCase() === 'present' || /\[wip\]/i.test(project.name || '');
        const statusClass = isRunning ? 'running' : (project.github ? 'stable' : 'experimental');
        const statusLabel = isRunning ? 'Running' : (project.github ? 'Stable' : 'Experimental');
        const fileLabel = (project.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'module';
        header.innerHTML = `
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <div class="browser-address-bar">${fileLabel}.ts</div>
            <span class="status-chip ${statusClass}">${statusLabel}</span>
        `;

        // Content
        const content = document.createElement('div');
        content.className = 'browser-content';

        const visual = createProjectVisual(project);

        const kicker = document.createElement('span');
        kicker.className = 'case-kicker';
        kicker.textContent = 'Case Study';

        const title = document.createElement('h3');
        title.textContent = project.name;

        const problem = document.createElement('div');
        problem.className = 'case-row';
        problem.innerHTML = `<strong>Problem</strong><p>${caseStudy.problem}</p>`;

        const approach = document.createElement('div');
        approach.className = 'case-row';
        approach.innerHTML = `<strong>Approach</strong><p>${caseStudy.approach}</p>`;

        const impact = document.createElement('div');
        impact.className = 'case-row';
        impact.innerHTML = `<strong>Impact</strong><p>${caseStudy.impact}</p>`;

        const keywordsDiv = document.createElement('div');
        keywordsDiv.style.marginBottom = '1rem';
        if (project.keywords) {
            project.keywords.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'tech-badge'; // We will define this class
                badge.textContent = tech;
                keywordsDiv.appendChild(badge);
            });
        }

        const linksDiv = document.createElement('div');
        linksDiv.className = 'project-links';

        if (project.github) {
            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'btn-text';
            githubLink.innerHTML = '<i class="fa fa-github"></i> Code';
            linksDiv.appendChild(githubLink);
        }

        if (project.url) {
            const demoLink = document.createElement('a');
            demoLink.href = project.url;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.className = 'btn-text';
            demoLink.innerHTML = '<i class="fa fa-external-link"></i> Live';
            linksDiv.appendChild(demoLink);
        }

        if (project.id) {
            const detailsButton = document.createElement('button');
            detailsButton.type = 'button';
            detailsButton.className = 'btn-text project-details-btn';
            detailsButton.innerHTML = '<i class="fa fa-info-circle" aria-hidden="true"></i> Details';
            detailsButton.addEventListener('click', () => openProjectModal(project.id));
            linksDiv.appendChild(detailsButton);
        }

        if (visual) content.appendChild(visual);
        content.appendChild(kicker);
        content.appendChild(title);
        content.appendChild(problem);
        content.appendChild(approach);
        content.appendChild(impact);
        content.appendChild(keywordsDiv);
        content.appendChild(linksDiv);

        card.appendChild(header);
        card.appendChild(content);

        container.appendChild(card);
    });

    if (typeof initRevealOnScroll === 'function') {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        initRevealOnScroll(reduced);
    }

    if (typeof initPointerReactiveGlow === 'function') {
        initPointerReactiveGlow();
    }

    const projToggleBtn = document.getElementById('projects-toggle-btn');
    if (projects.length > 3 && projToggleBtn) {
        projToggleBtn.style.display = 'inline-block';
        let projExpanded = false;
        projToggleBtn.addEventListener('click', () => {
            projExpanded = !projExpanded;
            const items = document.querySelectorAll('.collapsible-project');
            items.forEach(item => item.style.display = projExpanded ? '' : 'none');
            projToggleBtn.textContent = projExpanded ? 'Show Less' : 'Show More';
            projToggleBtn.style.background = projExpanded ? 'var(--accent-green)' : 'transparent';
            projToggleBtn.style.color = projExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}

function createProjectVisual(project) {
    if (project.image) {
        const figure = document.createElement('figure');
        figure.className = 'project-visual';
        const image = document.createElement('img');
        image.src = project.image;
        image.alt = project.imageAlt || `${project.name} interface`;
        image.loading = 'lazy';
        image.decoding = 'async';
        figure.appendChild(image);
        return figure;
    }

    if (project.visualType === 'architecture') {
        const figure = document.createElement('figure');
        figure.className = 'project-visual architecture-visual';
        figure.setAttribute('aria-label', `${project.name} architecture overview`);
        const labels = (project.keywords || []).slice(0, 4);
        figure.innerHTML = labels.map((label, index) =>
            `<span class="architecture-node">${label}</span>${index < labels.length - 1 ? '<i class="fa fa-long-arrow-right" aria-hidden="true"></i>' : ''}`
        ).join('');
        return figure;
    }

    return null;
}

function getCaseStudyCopy(project) {
    const highlights = Array.isArray(project.highlights) ? project.highlights : [];
    const first = highlights[0] || project.description;
    const second = highlights[1] || project.description;
    const third = highlights[2] || highlights[1] || 'Delivered a reliable and maintainable implementation.';

    return {
        problem: project.description || 'Solved a production-facing engineering challenge.',
        approach: second,
        impact: third || first
    };
}

function renderBuildLogs(projects, work) {
    const marquee = document.getElementById('log-marquee');
    if (!marquee) return;

    const projectLogs = (projects || [])
        .flatMap(project => (project.highlights || []).slice(0, 1).map(item => `BUILD LOG: ${item}`))
        .slice(0, 5);

    const workLogs = (work || [])
        .flatMap(role => (role.highlights || []).slice(0, 1).map(item => `RUNTIME NOTE: ${item}`))
        .slice(0, 3);

    const logs = [...projectLogs, ...workLogs];
    if (!logs.length) return;

    marquee.innerHTML = '';
    const full = logs.concat(logs);
    full.forEach(log => {
        const span = document.createElement('span');
        span.textContent = log;
        marquee.appendChild(span);
    });
}

function renderActivityDashboard(data) {
    const projectCount = document.getElementById('metric-projects');
    const domainCount = document.getElementById('metric-domains');
    const certCount = document.getElementById('metric-certs');
    const timeline = document.getElementById('milestone-timeline');
    const recentList = document.getElementById('recent-focus-list');

    if (!projectCount || !domainCount || !certCount || !timeline || !recentList) return;

    const projects = Array.isArray(data.projects) ? data.projects : [];
    const certs = Array.isArray(data.certificates) ? data.certificates : [];
    const domains = new Set();

    projects.forEach(project => {
        (project.keywords || []).forEach(keyword => {
            const root = keyword.toLowerCase().split(' ')[0];
            domains.add(root);
        });
    });

    animateMetric(projectCount, projects.length);
    animateMetric(domainCount, domains.size || 0);
    animateMetric(certCount, certs.length);

    renderMilestones(timeline, projects);
    renderRecentFocus(recentList, projects);
}

function animateMetric(element, target) {
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function renderMilestones(container, projects) {
    container.innerHTML = '';
    projects.slice(0, 5).forEach(project => {
        const item = document.createElement('li');
        item.innerHTML = `<time datetime="${project.startDate}">${formatPeriod(project.startDate, project.endDate)}</time><strong>${project.name.replace(/\[WIP\]/gi, '').trim()}</strong>`;
        container.appendChild(item);
    });
}

function renderRecentFocus(list, projects) {
    list.innerHTML = '';
    projects.slice(0, 5).forEach(project => {
        const li = document.createElement('li');
        const focus = (project.keywords && project.keywords[0]) ? project.keywords[0] : 'Software Engineering';
        li.textContent = `${project.name.replace(/[🛡️🤖📊🔧📹🚀⚡]/g, '').trim()} - Focus: ${focus}`;
        list.appendChild(li);
    });
}

function renderCertifications(certs) {
    const container = document.getElementById('certifications-grid');
    if (!container) return;

    const ISSUER_ICONS = {
        'Microsoft': 'fa-windows',
        'GitHub': 'fa-github',
        'Docker': 'fa-cube',
        'Astronomer': 'fa-star',
        'Atlassian': 'fa-tasks',
        'Anthropic': 'fa-code'
    };

    const priorities = [
        'Microsoft Certified: SQL AI Developer Associate',
        'Microsoft Certified: Azure AI Engineer Associate',
        'Microsoft Certified: DevOps Engineer Expert',
        'Microsoft Certified: Fabric Data Engineer Associate',
        'Career Essentials in GitHub Copilot Professional Certificate',
        'Docker Foundations Professional Certificate',
        'DAG Authoring for Apache Airflow 3',
        'Model Context Protocol: Advanced Topics'
    ];
    const priority = new Map(priorities.map((name, index) => [name, index]));
    const ordered = [...certs].sort((a, b) => {
        const aRank = priority.has(a.name) ? priority.get(a.name) : 100;
        const bRank = priority.has(b.name) ? priority.get(b.name) : 100;
        return aRank - bRank || a.issuer.localeCompare(b.issuer) || b.date.localeCompare(a.date);
    });

    ordered.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        if (priority.has(cert.name)) card.classList.add('featured-cert');

        if (index >= priorities.length) {
            card.style.display = 'none';
            card.classList.add('collapsible-cert');
        }

        const icon = document.createElement('div');
        icon.className = 'cert-icon';

        const issuerIcon = ISSUER_ICONS[cert.issuer] || 'fa-certificate';
        icon.innerHTML = `<i class="fa ${issuerIcon}" aria-hidden="true"></i>`;

        const content = document.createElement('div');
        content.className = 'cert-content';

        const title = document.createElement('h4');
        title.textContent = cert.name;

        const issuer = document.createElement('p');
        issuer.className = 'cert-issuer';
        issuer.textContent = `${cert.issuer} • ${cert.date}`;

        content.appendChild(title);
        content.appendChild(issuer);

        if (cert.url && cert.url !== '#') {
            const link = document.createElement('a');
            link.href = cert.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'cert-link';
            link.innerHTML = '<i class="fa fa-external-link"></i> Verify';
            content.appendChild(link);
        }

        card.appendChild(icon);
        card.appendChild(content);
        container.appendChild(card);
    });

    const certToggleBtn = document.getElementById('certs-toggle-btn');
    if (ordered.length > priorities.length && certToggleBtn) {
        certToggleBtn.style.display = 'inline-block';
        let certExpanded = false;
        certToggleBtn.addEventListener('click', () => {
            certExpanded = !certExpanded;
            const items = document.querySelectorAll('.collapsible-cert');
            items.forEach(item => item.style.display = certExpanded ? '' : 'none');
            certToggleBtn.textContent = certExpanded ? 'Show Less' : 'Show More';
            certToggleBtn.style.background = certExpanded ? 'var(--accent-green)' : 'transparent';
            certToggleBtn.style.color = certExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}
