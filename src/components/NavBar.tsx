import { NavLink } from "react-router";

export const NavBar = () => {
  return (
    <>
      <NavLink to="/diary" className="navlink">
        <button>Foodie Diary</button>
      </NavLink>{" "}
      <NavLink to="/calendar" className="navlink">
        <button>Calendar Memory</button>
      </NavLink>{" "}
      <NavLink to="/plan" className="navlink">
        <button>Set Your Goals</button>
      </NavLink>
    </>
  );
};
