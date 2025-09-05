import "./App.css";
import { Routes, Route } from "react-router";
import { Diary } from "./components/DiaryPage";
import { Calendar } from "./components/CalendarPage";
import { Home } from "./components/HomePage";
import { Plan } from "./components/PlanPage";
import { useState } from "react";
import type { Food } from "./type";

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
      : []
  );

  //Food array
  return (
    <Routes>
      <Route
        path="/diary"
        element={<Diary foods={foods} setFoods={setFoods} />}
      />
      <Route
        path="/calendar"
        element={<Calendar foods={foods} setFoods={setFoods} />}
      />

      <Route path="/" element={<Home />} />

      <Route
        path="/plan"
        element={<Plan foods={foods} setFoods={setFoods} />}
      />
    </Routes>
  );
}

export default App;
