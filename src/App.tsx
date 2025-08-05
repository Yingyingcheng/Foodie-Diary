import { DiaryFormPage } from "./components/DiaryFormPage";
import { CalendarPage } from "./components/CalendarPage";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DiaryFormPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
