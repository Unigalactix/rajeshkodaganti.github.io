# Rajesh Kodaganti - Portfolio

Live Portfolio: [https://rajeshkodaganti.com/](https://rajeshkodaganti.com/)

This repository contains Rajesh Kodaganti's AI Software Engineer and Developer portfolio, with production-focused case studies, accessible interactions, and data-driven content rendering.

## Highlights

- Terminal-style splash screen with a random welcome message on every fresh visit.
- Professional developer UI system with semantic design tokens.
- Sticky glass navigation with active section tracking and runtime breadcrumb.
- Command Palette (Cmd/Ctrl + K) for quick navigation.
- Dynamic About, Skills, Experience, Projects, Certifications, modals, and resume content sourced from `js/data.json`.
- Case-study project cards with file-tab chrome and project status chips.
- Animated architecture/system-map section and verified project milestone timeline.
- Build logs marquee generated from live project/work data.
- Interactive detail modals for Experience, Education, and Projects.
- Professional portfolio assistant and an on-demand Creative Lab.
- Responsive layout with mobile-first polish and reduced-motion support.

## Core UI Features

### 1. Terminal Splash Boot
- Full-screen boot terminal UI before main portfolio render.
- Randomized welcome line.
- Typewriter effect with motion-safe fallback.

### 2. Pro Coder Visual System
- Semantic tokens for surfaces, text, accents, borders, and statuses.
- Consistent card chrome, interactive states, and transition timings.
- Section separators and subtle grid/noise atmosphere.

### 3. Command Palette
- Shortcut: Cmd/Ctrl + K.
- Search commands.
- Keyboard navigation (Arrow Up/Down + Enter).
- Quick actions to jump to sections and open resume/books.

### 4. Data-Driven Rendering
- About section auto-generates summary/focus from profile + skills data.
- Projects and certifications render from JSON.
- Build logs and activity widgets derive values from the same data source.

## Sections

1. Hero + Terminal Intro
2. Build Logs
3. About
4. Coding Interests
5. System Map
6. Experience
7. Education
8. Selected Engineering Case Studies
9. Certifications
10. Creative Lab
11. Verified Project Activity
12. Contact
13. Footer + Socials

## Tech Stack

- HTML5
- CSS3 (custom design system + responsive layers)
- JavaScript (Vanilla JS)
- Bootstrap grid
- Font Awesome
- Canvas API
- Intersection Observer API
- Formspree (contact form)

## Local Development

1. Clone repository.
2. Start local server:

```bash
python3 -m http.server 8000
```

3. Open:

- `http://127.0.0.1:8000`

### Content and resume workflow

`js/data.json` is the source of truth for profile, experience, education, skills, projects, and certifications. After changing professional content, regenerate and validate the site:

```bash
python -m pip install -r requirements.txt
python build_resume.py
python scripts/validate_portfolio.py
```

Set `CHECK_EXTERNAL_LINKS=1` to include concurrent external-link checks. GitHub Actions runs the full workflow before deployment.

## Main Files

- `index.html`: Page structure and global UI shell.
- `css/styles.css`: Full visual system, responsive styling, states, motion.
- `js/scripts.js`: Navigation telemetry, command palette, splash logic, interactive effects.
- `js/content-loader.js`: Data-driven section rendering.
- `js/data.json`: Content source for profile, projects, and certifications.
- `build_resume.py`: Generates the one-, two-, and three-page PDF resumes from `js/data.json`.
- `scripts/validate_portfolio.py`: Validates content consistency, assets, metadata, JavaScript, accessibility basics, links, and generated PDFs.

## Accessibility and Performance Notes

- Honors `prefers-reduced-motion`.
- Coarse pointer and small-screen interaction optimizations.
- Deferred non-critical desktop effects.
- Content visibility optimization for faster perceived rendering.

## Contact

- Email: rajeshkodaganti.work@gmail.com
- LinkedIn: [rajesh-kodaganti-323118215](https://www.linkedin.com/in/rajesh-kodaganti-323118215)

## License

Based on Dev Portfolio Template. Use according to the original template license terms.
