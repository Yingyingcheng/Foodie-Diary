import "./App.css";
import { Routes, Route } from "react-router";
import { Diary } from "./components/DiaryPage";
import { Calendar } from "./components/CalendarPage";
import { Home } from "./components/HomePage";
import { Plan } from "./components/PlanPage";
import { useState } from "react";
import type { Food } from "./type";
import { useEffect } from "react";

function App() {
  const storedFood = localStorage.getItem("foods");
  const [foods, setFoods] = useState<Food[]>(
    storedFood
      ? JSON.parse(storedFood, (key, value) => {
          // Check if the key is 'date' and the value is a string
          if (key === "date" && typeof value === "string") {
            // Attempt to create a new Date object from the string
            const date = new Date(value);
            // Check if the date is valid before returning it
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
          return value; // Return other values as they are
        })
      : [],
  );

  //store data while foods changed!!!! perform side effect for pesistency with localStorage
  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  // 01.17.2026 The PlanPage State
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem("daily_goal");
    return saved ? JSON.parse(saved) : 2000;
  });
  useEffect(() => {
    localStorage.setItem("daily_goal", JSON.stringify(dailyGoal));
  }, [dailyGoal]);
  //Food array
  return (
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

      <Route path="/" element={<Home />} />

      <Route
        path="/plan"
        element={
          <Plan
            foods={foods}
            setFoods={setFoods}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
          />
        }
      />
    </Routes>
  );
}

export default App;
