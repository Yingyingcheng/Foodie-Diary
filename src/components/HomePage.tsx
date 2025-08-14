import "./../HomePage.css";
import "./../App.css";
import { LayoutPage } from "./LayoutPage";

export function Home() {
  return (
    <>
      <LayoutPage
        title="JOURNAL WITH ME"
        subtitle="Live your healthiest life...🥑"
        backgroundImage="url(avocado1.png)"
      >
        <>
          <br></br> <h3>Your foodie story, one day at a time. </h3>{" "}
          <p>
            Snap it, log it, and savor your meals while keeping your healthiest
            life on track.{" "}
          </p>
        </>
      </LayoutPage>
    </>
  );
}
