import type { ReactNode } from "react";
import { NavLink } from "react-router";

type LayoutPageProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  backgroundImage: string;
};

const navBtnBase =
  "appearance-none w-[150px] h-10 p-0 inline-flex items-center justify-center rounded-lg border border-transparent text-[1em] font-medium cursor-pointer transition-all duration-[250ms] hover:font-bold hover:text-white hover:bg-[rgb(96,45,20)] hover:transition-none";

function NavButton({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} className="no-underline max-md:w-[80%]">
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
  return (
    <div
      className="p-8 max-md:p-4 font-bold opacity-90 bg-center bg-cover bg-no-repeat max-w-full min-h-screen h-auto text-center"
      style={{ backgroundImage: backgroundImage }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <nav className="flex flex-row max-md:flex-col max-md:items-center justify-center gap-[5px] mb-5 w-full">
        <NavButton to="/" label="HOME" />
        <NavButton to="/diary" label="Foodie Diary" />
        <NavButton to="/calendar" label="Calendar Memory" />
        <NavButton to="/plan" label="Set Your Goals" />
      </nav>
      {children}
    </div>
  );
}
