// Accessible detail dialogs backed by js/data.json.
class ModalManager {
    constructor() {
        this.data = window.PORTFOLIO_DATA || null;
        this.returnFocus = null;
        this.handleKeydown = this.handleKeydown.bind(this);

        document.addEventListener('click', event => {
            if (event.target.classList.contains('detail-modal')) {
                this.closeModal(event.target.id);
            }
        });
        document.addEventListener('keydown', this.handleKeydown);
    }

    setData(data) {
        this.data = data;
    }

    openExperienceModal(id) {
        const job = this.data?.work?.find(item => item.id === id);
        if (!job) return;

        this.showModal({
            id: 'experienceModal',
            className: 'experience-modal',
            title: `${job.position} at ${job.name}`,
            body: `
                <section class="modal-section">
                    <h3><i class="fa fa-briefcase" aria-hidden="true"></i> Role</h3>
                    <p><strong>Company:</strong> ${this.escape(job.name)}</p>
                    <p><strong>Location:</strong> ${this.escape(job.location)}</p>
                    <p><strong>Duration:</strong> ${this.formatPeriod(job.startDate, job.endDate)}</p>
                    ${job.project ? `<p><strong>Featured project:</strong> ${this.escape(job.project)}</p>` : ''}
                    <p>${this.escape(job.summary)}</p>
                </section>
                ${this.listSection('Key contributions', 'fa-tasks', job.highlights)}
                ${this.tagsSection('Technologies', 'fa-cogs', job.technologies)}
            `
        });
    }

    openEducationModal(id) {
        const education = this.data?.education?.find(item => item.id === id);
        if (!education) return;

        this.showModal({
            id: 'educationModal',
            className: 'education-modal',
            title: education.institution,
            body: `
                <section class="modal-section">
                    <h3><i class="fa fa-graduation-cap" aria-hidden="true"></i> Degree</h3>
                    <p><strong>${this.escape(education.studyType)}</strong> in ${this.escape(education.area)}</p>
                    <p><strong>Duration:</strong> ${this.formatPeriod(education.startDate, education.endDate)}</p>
                    ${education.score ? `<p><strong>Score:</strong> ${this.escape(education.score)}</p>` : ''}
                    ${education.url ? `<p><a class="btn-text" href="${this.escape(education.url)}" target="_blank" rel="noopener noreferrer"><i class="fa fa-external-link" aria-hidden="true"></i> Institution website</a></p>` : ''}
                </section>
            `
        });
    }

    openProjectModal(id) {
        const project = this.data?.projects?.find(item => item.id === id);
        if (!project) return;

        const links = [
            project.github ? `<a class="btn-text" href="${this.escape(project.github)}" target="_blank" rel="noopener noreferrer"><i class="fa fa-github" aria-hidden="true"></i> Code</a>` : '',
            project.url ? `<a class="btn-text" href="${this.escape(project.url)}" target="_blank" rel="noopener noreferrer"><i class="fa fa-external-link" aria-hidden="true"></i> Live project</a>` : ''
        ].filter(Boolean).join('');

        this.showModal({
            id: 'projectModal',
            className: 'project-modal',
            title: project.name.replace(/\[WIP\]/gi, '').trim(),
            body: `
                <section class="modal-section">
                    <h3><i class="fa fa-info-circle" aria-hidden="true"></i> Overview</h3>
                    ${project.organization ? `<p><strong>Organization:</strong> ${this.escape(project.organization)}</p>` : ''}
                    ${project.role ? `<p><strong>Role:</strong> ${this.escape(project.role)}</p>` : ''}
                    <p><strong>Duration:</strong> ${this.formatPeriod(project.startDate, project.endDate)}</p>
                    <p>${this.escape(project.description)}</p>
                </section>
                ${project.problem ? this.textSection('Problem', 'fa-exclamation-circle', project.problem) : ''}
                ${project.approach ? this.textSection('Approach', 'fa-code', project.approach) : ''}
                ${project.impact ? this.textSection('Impact', 'fa-line-chart', project.impact) : ''}
                ${this.listSection('Six-phase workflow', 'fa-random', project.workflow)}
                ${this.listSection('Architecture', 'fa-sitemap', project.architecture)}
                ${this.listSection('Delivered artifacts', 'fa-file-text-o', project.deliverables)}
                ${this.listSection('Evidence', 'fa-check-circle', project.highlights)}
                ${this.tagsSection('Technologies', 'fa-cogs', project.keywords)}
                ${links ? `<div class="modal-actions">${links}</div>` : ''}
            `
        });
    }

    showModal({ id, className, title, body }) {
        this.closeAllModals();
        this.returnFocus = document.activeElement;

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `detail-modal ${className}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `${id}-title`);
        modal.innerHTML = `
            <div class="detail-modal-content">
                <div class="detail-modal-header">
                    <h2 id="${id}-title">${this.escape(title)}</h2>
                    <button type="button" class="detail-close-btn" aria-label="Close details">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="detail-modal-body">${body}</div>
            </div>`;

        modal.querySelector('.detail-close-btn').addEventListener('click', () => this.closeModal(id));
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        modal.querySelector('.detail-close-btn').focus();
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.remove();
        document.body.style.overflow = '';
        if (this.returnFocus instanceof HTMLElement) this.returnFocus.focus();
        this.returnFocus = null;
    }

    closeAllModals() {
        document.querySelectorAll('.detail-modal').forEach(modal => modal.remove());
        document.body.style.overflow = '';
    }

    handleKeydown(event) {
        const modal = document.querySelector('.detail-modal');
        if (!modal) return;

        if (event.key === 'Escape') {
            this.closeModal(modal.id);
            return;
        }

        if (event.key !== 'Tab') return;
        const focusable = [...modal.querySelectorAll('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    textSection(title, icon, text) {
        return `<section class="modal-section"><h3><i class="fa ${icon}" aria-hidden="true"></i> ${title}</h3><p>${this.escape(text)}</p></section>`;
    }

    listSection(title, icon, items = []) {
        if (!items.length) return '';
        return `<section class="modal-section"><h3><i class="fa ${icon}" aria-hidden="true"></i> ${title}</h3><ul>${items.map(item => `<li>${this.escape(item)}</li>`).join('')}</ul></section>`;
    }

    tagsSection(title, icon, items = []) {
        if (!items.length) return '';
        return `<section class="modal-section"><h3><i class="fa ${icon}" aria-hidden="true"></i> ${title}</h3><div class="modal-tech-tags">${items.map(item => `<span class="modal-tech-tag">${this.escape(item)}</span>`).join('')}</div></section>`;
    }

    formatPeriod(startDate, endDate) {
        const format = value => {
            if (!value || value === 'Present') return value || '';
            const [year, month] = value.split('-').map(Number);
            return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
                .format(new Date(year, (month || 1) - 1, 1));
        };
        return `${format(startDate)} - ${format(endDate)}`;
    }

    escape(value = '') {
        const element = document.createElement('div');
        element.textContent = String(value);
        return element.innerHTML;
    }
}

function openExperienceModal(id) {
    window.modalManager?.openExperienceModal(id);
}

function openProjectModal(id) {
    window.modalManager?.openProjectModal(id);
}

function openEducationModal(id) {
    window.modalManager?.openEducationModal(id);
}

document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});