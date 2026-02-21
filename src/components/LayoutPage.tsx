import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { UserButton } from "@clerk/clerk-react"; //

type LayoutPageProps = {
  title: string;
  subtitle: ReactNode;
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
    <div className="pagehead " style={{ backgroundImage: backgroundImage }}>
      {/* Not correctly showingggg whyyyyy 02/21*/}
      <div className="user-profile-nav">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "border-2 border-[#8bc34a]", // Avocado Green border
              width: "60px", // Default is usually around 32px
              height: "60px",
            },
          }}
        />
      </div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <nav className="nav-menu">
        <NavLink to="/" className={"navlink"}>
          <button>HOME</button>
        </NavLink>{" "}
        <NavLink to="/diary" className={"navlink"}>
          <button>Foodie Diary</button>
        </NavLink>{" "}
        <NavLink to="/calendar" className={"navlink"}>
          <button>Calendar Memory</button>
        </NavLink>{" "}
        <NavLink to="/plan" className={"navlink"}>
          <button>Set Your Goals</button>
        </NavLink>
      </nav>
      {children}
    </div>
  );
}
