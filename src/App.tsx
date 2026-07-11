import { Routes, Route, Navigate, useLocation } from "react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

const Diary = lazy(() =>
  import("./components/DiaryPage").then((m) => ({ default: m.Diary })),
);
const Calendar = lazy(() =>
  import("./components/CalendarPage").then((m) => ({ default: m.Calendar })),
);
const Home = lazy(() =>
  import("./components/HomePage").then((m) => ({ default: m.Home })),
);
const Plan = lazy(() =>
  import("./components/PlanPage").then((m) => ({ default: m.Plan })),
);
import type { Food } from "./type";
import { supabase } from "./lib/supabase";
import { Login } from "./components/LoginPage";

function App() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  // Wait for getSession() before rendering, so a logged-in user
  // doesn't see the login screen flash on refresh
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    if (!session) {
      setFoods([]);
      return;
    }
    supabase
      .from("foods")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) =>
        // Postgres returns "date" as an ISO string; the app expects Date objects
        setFoods(
          (data ?? []).map((food) => ({
            ...food,
            date: food.date ? new Date(food.date) : null,
          })),
        ),
      );
  }, [session]);

  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem("daily_goal");
    return saved ? JSON.parse(saved) : 2000;
  });
  useEffect(() => {
    localStorage.setItem("daily_goal", JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  const [macroGoals, setMacroGoals] = useState<{
    protein: number;
    fat: number;
    carbs: number;
  }>(() => {
    const saved = localStorage.getItem("macro_goals");
    return saved ? JSON.parse(saved) : { protein: 150, fat: 65, carbs: 250 };
  });
  useEffect(() => {
    localStorage.setItem("macro_goals", JSON.stringify(macroGoals));
  }, [macroGoals]);

  const loadingFallback = (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6d4b3a",
        fontFamily: '"Special Elite", system-ui, serif',
      }}
    >
      Loading...
    </div>
  );

  if (!isAuthReady) {
    return loadingFallback;
  }

  if (!session) {
    // Reset any stale URL while logged out, so login always lands on Home
    if (location.pathname !== "/") {
      return <Navigate to="/" replace />;
    }
    return <Login />;
  }

  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
        <Route
          path="/diary"
          element={<Diary foods={foods} setFoods={setFoods} />}
        />
        <Route
          path="/calendar"
          element={
            <Calendar foods={foods} setFoods={setFoods} dailyGoal={dailyGoal} />
          }
        />
        <Route
          path="/"
          element={
            <Home foods={foods} dailyGoal={dailyGoal} macroGoals={macroGoals} />
          }
        />
        <Route
          path="/plan"
          element={
            <Plan
              foods={foods}
              setFoods={setFoods}
              dailyGoal={dailyGoal}
              setDailyGoal={setDailyGoal}
              macroGoals={macroGoals}
              setMacroGoals={setMacroGoals}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
