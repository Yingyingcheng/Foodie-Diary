import "./../HomePage.css";
import "./../App.css";
import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";
import { useMemo, useState } from "react";
import { format, startOfDay, subDays } from "date-fns";
import Typewriter from "typewriter-effect";

type MacroGoals = { protein: number; fat: number; carbs: number };

type HomeProps = {
  foods: Food[];
  dailyGoal: number;
  macroGoals: MacroGoals;
};

type DayData = {
  label: string;
  dateKey: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  isToday: boolean;
};

function CalorieRing({ consumed, goal }: { consumed: number; goal: number }) {
  const radius = 90;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const remaining = Math.max(goal - consumed, 0);
  const remainPct = goal > 0 ? Math.max(remaining / goal, 0) : 1;
  const offset = circumference - remainPct * circumference;

  let ringColor = "#c1e066";
  let icon = "😺";
  if (consumed > goal) {
    ringColor = "#e53935";
    icon = "🐕";
  } else if (consumed / goal > 0.85) {
    ringColor = "#fb8c00";
    icon = "🙀";
  }

  return (
    <div className="plan-ring-wrapper">
      <svg width={radius * 2} height={radius * 2} className="plan-ring-svg">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(221, 221, 221, 0.57)"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div className="plan-ring-center">
        <span className="plan-ring-icon">{icon}</span>
        <span className="plan-ring-consumed">
          {consumed > goal ? 0 : remaining}
        </span>
        <span className="plan-ring-label">kcal left</span>
      </div>
      <p className="plan-ring-remaining">
        {consumed > goal
          ? `${consumed - goal} kcal over budget!`
          : `${consumed} of ${goal} kcal eaten`}
      </p>
    </div>
  );
}

function MacroBar({
  label,
  current,
  goal,
  color,
  unit,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit: string;
}) {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="plan-macro-row">
      <div className="plan-macro-header">
        <span className="plan-macro-label" style={{ color }}>
          {label}
        </span>
        <span className="plan-macro-values">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div className="plan-macro-track">
        <div
          className="plan-macro-fill"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function WeeklyChart({
  weekData,
  goal,
  selectedIndex,
  onSelect,
}: {
  weekData: DayData[];
  goal: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const maxVal = Math.max(goal, ...weekData.map((d) => d.calories), 1);

  return (
    <div className="plan-weekly-chart">
      <div className="plan-weekly-bars">
        {weekData.map((day, index) => {
          const heightPct = (day.calories / maxVal) * 100;
          const over = day.calories > goal;
          const isSelected = index === selectedIndex;
          return (
            <div
              className="plan-weekly-col"
              key={day.label}
              onClick={() => onSelect(index)}
              style={{
                backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                cursor: "pointer",
              }}
            >
              <span className="plan-weekly-val">
                {day.calories > 0 ? day.calories : ""}
              </span>
              <div className="plan-weekly-bar-bg">
                <div
                  className={`plan-weekly-bar-fill ${over ? "over" : ""} ${isSelected ? "selected" : ""}`}
                  style={{
                    height: `${heightPct}%`,
                    transition: "height 0.5s ease",
                  }}
                />
              </div>
              <span
                className={`plan-weekly-label ${isSelected ? "selected" : ""}`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="plan-weekly-goal-line"
        style={{ bottom: `${(goal / maxVal) * 100}%` }}
      >
        <span className="plan-weekly-goal-tag">Goal</span>
      </div>
    </div>
  );
}

function Dashboard({
  foods,
  dailyGoal,
  macroGoals,
}: {
  foods: Food[];
  dailyGoal: number;
  macroGoals: MacroGoals;
}) {
  const weekData = useMemo(() => {
    const today = startOfDay(new Date());
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: DayData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const key = format(d, "yyyy-MM-dd");
      let cal = 0,
        prot = 0,
        fat = 0,
        carb = 0;
      foods.forEach((f) => {
        if (!f.date) return;
        if (format(new Date(f.date), "yyyy-MM-dd") === key) {
          cal += f.calories || 0;
          prot += f.protein || 0;
          fat += f.fat || 0;
          carb += f.carbs || 0;
        }
      });
      result.push({
        label: dayNames[d.getDay()],
        dateKey: key,
        calories: Math.round(cal),
        protein: Math.round(prot),
        fat: Math.round(fat),
        carbs: Math.round(carb),
        isToday: i === 0,
      });
    }
    return result;
  }, [foods]);
  const [selectedIndex, setSelectedIndex] = useState(6);
  const selected = weekData[selectedIndex];

  return (
    <div className="plan-container">
      <section className="plan-section plan-hero">
        <h2 className="plan-section-title">
          {selected.isToday ? "Today" : selected.label}
        </h2>
        <CalorieRing consumed={selected.calories} goal={dailyGoal} />
      </section>

      <section className="plan-section plan-macros-card">
        <h2 className="plan-section-title">
          {selected.isToday ? "Today's Macros" : `${selected.label}'s Macros`}
        </h2>
        <MacroBar
          label="Protein"
          current={selected.protein}
          goal={macroGoals.protein}
          color="#26a69a"
          unit="g"
        />
        <MacroBar
          label="Fat"
          current={selected.fat}
          goal={macroGoals.fat}
          color="#ef6c00"
          unit="g"
        />
        <MacroBar
          label="Carbs"
          current={selected.carbs}
          goal={macroGoals.carbs}
          color="#f9a825"
          unit="g"
        />
      </section>

      <section className="plan-section plan-weekly-card">
        <h2 className="plan-section-title">This Week</h2>
        <WeeklyChart
          weekData={weekData}
          goal={dailyGoal}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      </section>
    </div>
  );
}

export function Home({ foods, dailyGoal, macroGoals }: HomeProps) {
  return (
    <LayoutPage
      title="JOURNAL WITH ME"
      subtitle="Live your healthiest life...🥑"
      backgroundImage="url(avocado1.png)"
    >
      <h3 style={{ marginBottom: "6px", marginTop: "10px" }}>
        <Typewriter
          options={{
            strings: [
              "Journal your foodie story.",
              "Track nutrients with AI.",
              "Savor every healthy bite.",
            ],
            autoStart: true,
            loop: true,
            delay: 70,
            deleteSpeed: 40,
          }}
        />
      </h3>
      <Dashboard foods={foods} dailyGoal={dailyGoal} macroGoals={macroGoals} />
    </LayoutPage>
  );
}
