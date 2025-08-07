import "./App.css";
import { Routes, Route } from "react-router";
import { Diary } from "./components/DairyPage";
import { Calendar } from "./components/CalendarPage";
import { Home } from "./components/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/diary" element={<Diary />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
