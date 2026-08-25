"""Validate portfolio content, assets, scripts, metadata, and generated resumes."""

import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
errors = []
warnings = []
external_urls = set()


class PortfolioHTMLParser(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.references = []
        self.canonical_count = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "img" and not values.get("alt"):
            errors.append(f"{self.path.name}: image missing alt text: {values.get('src', '')}")
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical_count += 1
        for attribute in ("href", "src"):
            value = values.get(attribute)
            is_preconnect = tag == "link" and values.get("rel") == "preconnect"
            if value and not is_preconnect:
                self.references.append(value)


def validate_reference(source, reference):
    if reference.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return
    if reference.startswith(("http://", "https://")):
        external_urls.add(reference)
        return

    clean = unquote(reference.split("?", 1)[0].split("#", 1)[0])
    if not clean:
        return
    target = ROOT / clean.lstrip("/") if clean.startswith("/") else source.parent / clean
    if not target.exists():
        errors.append(f"{source.name}: missing local reference: {reference}")


def validate_html():
    for path in HTML_FILES:
        text = path.read_text(encoding="utf-8")
        parser = PortfolioHTMLParser(path)
        parser.feed(text)
        for reference in parser.references:
            validate_reference(path, reference)

        if path.name != "404.html" and parser.canonical_count != 1:
            errors.append(f"{path.name}: expected exactly one canonical link")
        if path.name != "404.html" and "data-current-year" not in text:
            errors.append(f"{path.name}: missing dynamic copyright year")
        if "Master's Student" in text or "simulating build consistency" in text:
            errors.append(f"{path.name}: contains stale recruiter-facing copy")


def validate_data():
    data = json.loads((ROOT / "js" / "data.json").read_text(encoding="utf-8"))
    for collection in ("work", "education", "projects"):
        ids = [item.get("id") for item in data[collection] if item.get("id")]
        if len(ids) != len(set(ids)):
            errors.append(f"js/data.json: duplicate IDs in {collection}")

    microsoft = next((job for job in data["work"] if job.get("id") == "microsoft"), None)
    if not microsoft or microsoft.get("startDate") != "2025-10":
        errors.append("js/data.json: Microsoft start date must be 2025-10")

    for project in data["projects"]:
        if project.get("image") and not project.get("imageAlt"):
            errors.append(f"js/data.json: project image missing imageAlt: {project.get('id')}")

    def collect_urls(value):
        if isinstance(value, dict):
            for child in value.values():
                collect_urls(child)
        elif isinstance(value, list):
            for child in value:
                collect_urls(child)
        elif isinstance(value, str) and value.startswith(("http://", "https://")):
            external_urls.add(value)

    collect_urls(data)


def validate_javascript():
    for path in sorted((ROOT / "js").glob("*.js")):
        result = subprocess.run(
            ["node", "--check", str(path)], capture_output=True, text=True, timeout=60, check=False
        )
        if result.returncode:
            errors.append(f"{path.relative_to(ROOT)}: {result.stderr.strip()}")


def validate_resumes():
    expected_pages = {
        "resume-1page.pdf": 1,
        "resume-2page.pdf": 2,
        "resume-3page.pdf": 3,
        "resume.pdf": 2,
    }
    extracted = {}
    for name, expected in expected_pages.items():
        path = ROOT / name
        if not path.exists() or path.stat().st_size == 0:
            errors.append(f"{name}: missing or empty")
            continue
        reader = PdfReader(path)
        if len(reader.pages) != expected:
            errors.append(f"{name}: expected {expected} pages, found {len(reader.pages)}")
        extracted[name] = "\n".join(page.extract_text() or "" for page in reader.pages)

    default = extracted.get("resume.pdf", "")
    for required in ("AI Software Engineer", "Oct 2025", "70+ Microsoft Identity services"):
        if required not in default:
            errors.append(f"resume.pdf: missing verified text: {required}")
    for stale in ("Mar 2026 – Present", "PeopleLink Unified Communications"):
        if stale in default:
            errors.append(f"resume.pdf: contains stale employment text: {stale}")
    if (ROOT / "resume.pdf").read_bytes() != (ROOT / "resume-2page.pdf").read_bytes():
        errors.append("resume.pdf: must match resume-2page.pdf")


def check_external_url(url):
    request = Request(url, method="HEAD", headers={"User-Agent": "portfolio-validator/1.0"})
    try:
        with urlopen(request, timeout=8) as response:
            return url, response.status, None
    except HTTPError as error:
        if error.code in (400, 404, 405):
            try:
                fallback = Request(url, headers={"User-Agent": "portfolio-validator/1.0"})
                with urlopen(fallback, timeout=8) as response:
                    return url, response.status, None
            except HTTPError as fallback_error:
                return url, fallback_error.code, None
            except URLError as fallback_error:
                return url, None, str(fallback_error.reason)
        return url, error.code, None
    except URLError as error:
        return url, None, str(error.reason)


def validate_external_links():
    if os.getenv("CHECK_EXTERNAL_LINKS") != "1":
        return
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(check_external_url, url) for url in sorted(external_urls)]
        for future in as_completed(futures):
            url, status, problem = future.result()
            if status in (404, 410):
                errors.append(f"External link returned {status}: {url}")
            elif problem:
                warnings.append(f"External link could not be reached: {url} ({problem})")


def main():
    validate_html()
    validate_data()
    validate_javascript()
    validate_resumes()
    validate_external_links()

    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
    print(f"Portfolio validation passed ({len(HTML_FILES)} HTML files, {len(external_urls)} external URLs).")


if __name__ == "__main__":
    main()