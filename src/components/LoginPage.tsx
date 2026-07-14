import { useState } from "react";
import { supabase } from "../lib/supabase";

type CatMood = "meow" | "floof" | "grumpy" | "windy";

const catMoods: Record<
  CatMood,
  { image: string; pageBg: string; accent: string; caption: string }
> = {
  // Colors are sampled from each painting's backdrop
  meow: {
    image: "ginger-cat-v2-meow.webp",
    pageBg: "#bfe0dc",
    accent: "#177e72",
    caption: "MEOW! Welcome back, foodie friend!",
  },
  floof: {
    image: "ginger-cat-v2-floof.webp",
    pageBg: "#c3d0f0",
    accent: "#1e3f9e",
    caption: "A new foodie?! *floofs with excitement*",
  },
  grumpy: {
    image: "ginger-cat-v2-grumpy.webp",
    pageBg: "#c5e6f2",
    accent: "#4886a3",
    caption: "Hmph. That's not the right password...",
  },
  windy: {
    image: "ginger-cat-v2-windy.webp",
    pageBg: "#f2c4b3",
    accent: "#d8431f",
    caption: "Hold on... checking the pantry records...",
  },
};

export function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = mode === "signup";

  const mood: CatMood = isLoading
    ? "windy"
    : errorMsg
      ? "grumpy"
      : isSignUp
        ? "floof"
        : "meow";
  const cat = catMoods[mood];

  function switchMode() {
    setMode(isSignUp ? "signin" : "signup");
    setErrorMsg(null);
    setInfoMsg(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else if (!data.session) {
        // Email confirmation is enabled: no session until the link is clicked
        setInfoMsg(
          "Almost there! Check your email inbox and click the confirmation link to start your diary.",
        );
      }
      // If confirmation is disabled, data.session exists and App.tsx
      // logs the user in automatically via onAuthStateChange
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(
          error.message === "Invalid login credentials"
            ? "Wrong email or password. Please try again! 🐾"
            : error.message,
        );
      }
    }
    setIsLoading(false);
  }

  return (
    <div
      className="p-8 max-md:p-4 font-bold max-w-full min-h-screen h-auto text-center flex flex-col items-center justify-center transition-colors duration-700"
      style={{ backgroundColor: cat.pageBg }}
    >
      <h1 style={{ color: "#4a2c17" }}>FOODIE DIARY</h1>
      {/* <p style={{ color: "#4a2c17" }}>
        {isSignUp
          ? "Create an account to start your foodie journey..."
          : "Please sign in to open your diary..."}
      </p> */}
      <form
        className="w-[400px] max-w-[90%] mx-auto mt-[15px] p-8 text-center rounded-[3em] bg-[#fdf3d1] text-olive-dark flex flex-col gap-[12px] items-center shadow-[0_10px_35px_rgba(74,44,23,0.35)] max-md:rounded-[2em]"
        onSubmit={handleSubmit}
      >
        <img
          src={cat.image}
          alt="Ginger cat greeting you"
          width={200}
          height={200}
          decoding="async"
          className="w-[200px] max-w-[80%] aspect-square object-cover object-top rounded-full border-4 shadow-md transition-all duration-500"
          style={{ borderColor: cat.accent }}
        />
        <p
          className="font-elite text-[0.95rem] m-0 transition-colors duration-500"
          style={{ color: cat.accent }}
        >
          {cat.caption}
        </p>
        <input
          className="font-elite w-[20em] max-w-[95%] h-10 rounded-[1em] text-center border-none bg-white-glass text-brown-input font-bold text-base"
          type="email"
          value={email}
          placeholder="Email"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="font-elite w-[20em] max-w-[95%] h-10 rounded-[1em] text-center border-none bg-white-glass text-brown-input font-bold text-base"
          type="password"
          value={password}
          placeholder={isSignUp ? "Password (min. 6 characters)" : "Password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg && (
          <p className="text-[#a03d2e] text-[0.9rem] m-0">{errorMsg}</p>
        )}
        {infoMsg && (
          <p className="text-[#4a6b3a] text-[0.9rem] m-0">{infoMsg}</p>
        )}
        <button
          className="appearance-none inline-flex items-center justify-center min-w-[180px] h-10 min-h-[30px] p-0 rounded-lg border border-transparent text-[1em] font-medium text-white cursor-pointer transition-all duration-250 hover:font-bold hover:brightness-110 disabled:opacity-60 disabled:cursor-wait"
          style={{ backgroundColor: cat.accent }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? isSignUp
              ? "Creating account..."
              : "Signing in..."
            : isSignUp
              ? "Sign Up"
              : "Sign In"}
        </button>
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer underline text-[0.9rem] text-olive-dark hover:text-[rgb(96,45,20)]"
          onClick={switchMode}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}
