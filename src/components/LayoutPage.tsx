import type { ReactNode } from "react";
import { NavLink } from "react-router";

type LayoutPageProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  backgroundImage: string;
};

export function LayoutPage({
  title,
  subtitle,
  children,
  backgroundImage,
}: LayoutPageProps) {
  return (
    <div className="pagehead" style={{ backgroundImage: backgroundImage }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <NavLink to="/diary" className={"navlink"}>
        <button>Foodie Diary</button>
      </NavLink>{" "}
      <NavLink to="/calendar" className={"navlink"}>
        <button>Calendar Memory</button>
      </NavLink>{" "}
      <NavLink to="/plan" className={"navlink"}>
        <button>Set Your Goals</button>
      </NavLink>
      {children}
    </div>
  );
}
