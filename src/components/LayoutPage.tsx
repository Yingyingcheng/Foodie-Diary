import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { useState } from "react";
type LayoutPageProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  backgroundImage: string;
};

const navBtnBase =
  "appearance-none w-[150px] h-10 p-0 inline-flex items-center justify-center rounded-lg border border-transparent text-[1em] font-medium cursor-pointer transition-all duration-[250ms] hover:font-bold hover:text-white hover:bg-[rgb(96,45,20)] hover:transition-none";

function NavButton({
  to,
  label,
  onNavigate,
}: {
  to: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <NavLink to={to} className="no-underline" onClick={onNavigate}>
      {({ isActive }) => (
        <button
          className={`${navBtnBase} ${
            isActive
              ? "bg-[rgb(205,176,129)] text-white"
              : "bg-white-soft text-black"
          }`}
        >
          {label}
        </button>
      )}
    </NavLink>
  );
}

export function LayoutPage({
  title,
  subtitle,
  children,
  backgroundImage,
}: LayoutPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/diary", label: "Foodie Diary" },
    { to: "/calendar", label: "Calendar Memory" },
    { to: "/plan", label: "Set Your Goals" },
  ];
  return (
    <div
      className="p-8 max-md:p-4 font-bold opacity-90 bg-center bg-cover bg-no-repeat max-w-full min-h-screen h-auto text-center"
      style={{ backgroundImage: backgroundImage }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <button
        className="md:hidden fixed top-7 right-2 z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg bg-white-soft/50"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {" "}
        <span
          className={`block h-[3px] w-5 rounded bg-[rgb(96,45,20)] transition-transform duration-300 ${
            isMenuOpen ? "translate-y-[8px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[3px] w-5 rounded bg-[rgb(96,45,20)] transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[3px] w-5 rounded bg-[rgb(96,45,20)] transition-transform duration-300 ${
            isMenuOpen ? "translate-y-[-8px] -rotate-45" : ""
          }`}
        />
      </button>

      <nav className="hidden md:flex flex-row justify-center gap-[5px] mb-5 w-full">
        {navLinks.map((link) => (
          <NavButton key={link.to} {...link} onNavigate={closeMenu} />
        ))}
      </nav>

      {/* Mobile overlay menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-white/10 backdrop-blur-sm"
          onClick={closeMenu}
        >
          <nav
            className="absolute top-16 right-[50%] translate-x-[50%] flex flex-col items-stretch gap-2 rounded-xl bg-[rgb(72,43,28)]  p-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <NavButton key={link.to} {...link} onNavigate={closeMenu} />
            ))}
          </nav>{" "}
        </div>
      )}

      {children}
    </div>
  );
}
