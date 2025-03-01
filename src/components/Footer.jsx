import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[var(--color-border)] mt-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-sm font-semibold">
              <span className="text-[var(--color-accent)]">よ</span>るしか
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">Unofficial fan site for Japanese band Yorushika</p>
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">&copy; {currentYear} Yorushika Fan Site</div>
        </div>
      </div>
    </footer>
  );
}
