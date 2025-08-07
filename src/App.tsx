import "./App.css";
import { Routes, Route } from "react-router";
import { Diary } from "./components/DairyPage";
import { Calendar } from "./components/CalendarPage";
import { Home } from "./components/HomePage";
import { useState } from "react";
import type { Food } from "./type";

function App() {
  const [foods, setFoods] = useState<Food[]>([]); //Food array

  return (
    <Routes>
      <Route
        path="/diary"
        element={<Diary foods={foods} setFoods={setFoods} />}
      />
      <Route path="/calendar" element={<Calendar foods={foods} />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
