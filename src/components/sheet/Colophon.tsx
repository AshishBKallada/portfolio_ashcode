import { sheet } from "@/data/sheet";

// The footer: the name across the desk at full width, and the colophon row under it.
export function Colophon() {
  const year = new Date().getFullYear();
  return (
    <footer className="sh-footer">
      <p className="sh-footer__name" aria-label={sheet.full}>
        {sheet.wordmark}
      </p>
      <div className="sh-footer__row">
        <span>
          © {year} {sheet.full}
        </span>
        <nav aria-label="Footer">
          <a className="sh-link" href="#about">
            About
          </a>
          <a className="sh-link" href="#linkedin">
            LinkedIn
          </a>
          <a className="sh-link" href="#contact">
            Contact
          </a>
          <a className="sh-link" href={`mailto:${sheet.email}`}>
            Email
          </a>
        </nav>
        <a className="sh-link" href="#main">
          Back to the cover ↑
        </a>
      </div>
    </footer>
  );
}
