import "./../HomePage.css";
import "./../App.css";
import { LayoutPage } from "./LayoutPage";
import Typewriter from "typewriter-effect";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Link } from "react-router";

export function Home() {
  const { user } = useUser();

  return (
    <>
      <LayoutPage
        title="JOURNAL WITH ME"
        subtitle="Live your healthiest life...🥑"
        backgroundImage="url(avocado1.png)"
      >
        <div style={{ marginTop: "40px", lineHeight: "1.6" }}>
          {/* Main Focal Point: Dynamic Greeting */}
          <h3
            style={{
              marginBottom: "10px",
            }}
          >
            <Typewriter
              options={{
                strings: [
                  user
                    ? `Hi, ${user.firstName}! 🍎`
                    : "Journal your foodie story.",
                  "Track nutrients with AI.",
                  "Savor every healthy bite.",
                ],
                autoStart: true,
                loop: true,
                delay: 70, // Slightly slower for better readability
                deleteSpeed: 40,
              }}
            />
          </h3>

          {/* Static Description: Easy to read immediately */}
          <h4 style={{ opacity: 0.9, fontWeight: "400" }}>
            Snap it, log it, and keep your healthiest life on track.
          </h4>

          {/* Single Action Area */}
          <div style={{ marginTop: "30px" }}>
            <SignedOut>
              <SignUpButton
                appearance={{
                  variables: {
                    colorPrimary: "#8bc34a",
                    colorBackground: "#ffffff",
                    colorText: "#5d4037",
                    borderRadius: "20px",
                  },
                  elements: {
                    card: "shadow-none border-none",
                    formButtonPrimary: "submitbutton",
                  },
                }}
              >
                <button className="submitbutton" style={{ width: "220px" }}>
                  Start Journey 🍒
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <SignInButton>
                <Link to="/diary">
                  <button className="submitbutton" style={{ width: "220px" }}>
                    Open My Diary 🥑
                  </button>{" "}
                </Link>
              </SignInButton>
            </SignedIn>
          </div>
        </div>
      </LayoutPage>
    </>
  );
}
