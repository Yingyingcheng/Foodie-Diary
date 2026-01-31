import "./../App.css";
import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";
import { useState, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Typewriter from "typewriter-effect";

type PlanInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  dailyGoal: number;
  setDailyGoal: React.Dispatch<React.SetStateAction<number>>;
};
export function Plan({ foods, dailyGoal, setDailyGoal }: PlanInputProps) {
  const [Goal, setGoal] = useState<number | "">(dailyGoal);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    setDailyGoal(Number(Goal)); // Convert text into a real number before saving
    alert("Goal updated to " + Goal + " kcal!");
  };

  // 01.19.2026 Use useMemo..
  const stats = useMemo(() => {
    const totalsByDate: Record<string, number> = {}; // <"2026-01-20", total calories>

    // Group all calories by date
    // The Key: It takes the food's date and turns it into a standard string like "2026-01-20".
    // Look in the folder for this date. If there's already a number there, add the new calories to it.
    // If it's empty (|| 0), start at 0 and add the calories."
    foods.forEach((food) => {
      if (!food.date) return;
      const dateKey = format(new Date(food.date), "yyyy-MM-dd");
      totalsByDate[dateKey] =
        (totalsByDate[dateKey] || 0) + (food.calories || 0);
    });

    const dates = Object.keys(totalsByDate); // Get a list of all dates logged
    const totalDays = dates.length;

    // How many days did they stay under the goal?
    const successfulDays = dates.filter(
      (date) => totalsByDate[date] <= dailyGoal,
    ).length;
    const successRate =
      totalDays > 0 ? Math.round((successfulDays / totalDays) * 100) : 0;

    return { totalDays, successRate, successfulDays };
  }, [foods, dailyGoal]);

  return (
    <>
      <LayoutPage
        title="SET YOUR GOAL"
        subtitle={
          <Typewriter
            options={{
              strings: ["Achieve your nutrition goals...."],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 35,
              cursor: "🍑",
            }}
          />
        }
        backgroundImage="url(peach5.png)"
      >
        <form className="PlanForm">
          <h2>Daily Calorie Target</h2>
          <label>
            Set your Calorie Target 🍧
            <br></br>
            <input
              className="inputgoal"
              // If the goal is 0, we show an empty string so the placeholder appears
              value={Goal === 0 ? "" : Goal}
              placeholder="Enter your Calorie Target"
              type="number"
              onChange={(e) => {
                const val = e.target.value;
                setGoal(val === "" ? "" : Number(val));
              }}
            />
          </label>
          <button type="submit" onClick={handleSave}>
            Save My New Goal
          </button>

          {/* 01/19/2026 Added analytics */}
          <section className="plan-card">
            <h3>Your Journey Stats 🍩</h3>
            <p>Daily Goal: {dailyGoal} kcal</p>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-label">Success Rate </span>
                <span>🧌</span>
                <br></br>
                <br></br>
                <span className="stat-number">{stats.successRate}%</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Days Logged</span>
                <span>🦁</span>
                <br></br>
                <br></br>
                <span className="stat-number">{stats.totalDays} </span>
              </div>
            </div>
            <p className="stat-footer">
              You've hit your goal on ✨✨{" "}
              <strong> {stats.successfulDays} </strong> days✨✨
            </p>
          </section>
        </form>
      </LayoutPage>
    </>
  );
}
