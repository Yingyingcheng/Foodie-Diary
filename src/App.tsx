import "./App.css";
import { Routes, Route } from "react-router";
import { lazy, Suspense, useState, useEffect } from "react";

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

function App() {
  const storedFood = localStorage.getItem("foods");
  const [foods, setFoods] = useState<Food[]>(
    storedFood
      ? JSON.parse(storedFood, (key, value) => {
          if (key === "date" && typeof value === "string") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
          return value;
        })
      : [],
  );

  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

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

  return (
    <Suspense>
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
      </Routes>
    </Suspense>
  );
}

export default App;
