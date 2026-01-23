import "./../HomePage.css";
import "./../App.css";
import { LayoutPage } from "./LayoutPage";
import Typewriter from "typewriter-effect"; // Import the effect

export function Home() {
  return (
    <>
      <LayoutPage
        title="JOURNAL WITH ME"
        subtitle="Live your healthiest life...🥑"
        backgroundImage="url(avocado1.png)"
      >
        <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
          {/* Main Animated Heading */}
          <h2 style={{ minHeight: "1.5em" }}>
            <Typewriter
              options={{
                strings: [
                  "Your foodie story, one day at a time.",
                  "Track your nutrients with AI.",
                  "Your journey to health starts here.",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </h2>

          {/* Static or secondary typing effect for the description */}
          <h3>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000) // Wait for the heading to start
                  .typeString(
                    "Snap it, log it, and savor your meals while keeping your healthiest life on track.🤍",
                  )
                  .start();
              }}
              options={{
                delay: 40,
                cursor: "💫✨", // You can even change the cursor!
              }}
            />
          </h3>
        </div>
      </LayoutPage>
    </>
  );
}
