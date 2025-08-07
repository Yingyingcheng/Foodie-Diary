import { Link } from "react-router";
import "./../HomePage.css";

export function Home() {
  return (
    <div className="home">
      <></>
      <h1>JOURNAL WITH ME</h1>
      <p>Live your healthiest life...🥑</p>
      <Link to="/diary">
        <button>Foodie Diary</button>
      </Link>{" "}
      <Link to="/calendar">
        <button>Calendar Memory</button>
      </Link>{" "}
      <Link to="/plan">
        <button> Set Your Goals</button>
      </Link>
    </div>
  );
}
