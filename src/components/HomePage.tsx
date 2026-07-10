import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";
import { useMemo, useState } from "react";
import { format, startOfDay, subDays } from "date-fns";
import Typewriter from "typewriter-effect";
import { planContainer, planSection, planSectionTitle } from "../ui";

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

  let ringColor = "#eae09f";
  let icon = "😺";
  if (consumed > goal) {
    ringColor = "#e53935";
    icon = "🐕";
  } else if (consumed / goal > 0.85) {
    ringColor = "#fb8c00";
    icon = "🙀";
  }

  return (
    <div className="group flex flex-col items-center relative">
      <svg width={radius * 2} height={radius * 2} className="block">
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
        <span className="block text-[1.6rem] leading-none mb-[2px] transition-transform duration-300 group-hover:scale-125">
          {icon}
        </span>
        <span className="block text-[2rem] font-bold text-brown-dark leading-none">
          {consumed > goal ? 0 : remaining}
        </span>
        <span className="text-[0.85rem] text-brown-muted">kcal left</span>
      </div>
      <p className="mt-1 text-[0.9rem] text-[#8a6040]">
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
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="font-bold text-[0.85rem]" style={{ color }}>
          {label}
        </span>
        <span className="text-[0.8rem] text-brown-medium">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div className="h-2.5 rounded-md bg-[rgba(0,0,0,0.06)] overflow-hidden">
        <div
          className="h-full rounded-md"
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
  const maxVal = goal;
  return (
    <div className="relative pt-2.5">
      <div className="flex justify-between items-end gap-1.5 h-[140px]">
        {weekData.map((day, index) => {
          const heightPct = Math.min((day.calories / maxVal) * 100, 100);
          const over = day.calories > goal;
          const isSelected = index === selectedIndex;
          return (
            <div
              className="flex-1 flex flex-col items-center gap-1 h-full"
              key={day.label}
              onClick={() => onSelect(index)}
              style={{
                backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                cursor: "pointer",
              }}
            >
              <span className="text-[0.6rem] text-brown-muted min-h-3.5">
                {day.calories > 0 ? day.calories : ""}
              </span>
              <div className="flex-1 w-full max-w-9 rounded-[6px_6px_2px_2px] bg-[rgba(0,0,0,0.04)] relative overflow-hidden flex items-end">
                <div
                  className={`w-full rounded-[6px_6px_2px_2px] min-h-[2px] ${
                    isSelected
                      ? "bg-[rgb(138,199,214)] brightness-110"
                      : over
                        ? "bg-[#e57a3a]"
                        : "bg-[#d3e9ae]"
                  }`}
                  style={{
                    height: `${heightPct}%`,
                    transition: "height 0.5s ease",
                  }}
                />
              </div>
              <span
                className={`text-[0.7rem] ${
                  isSelected
                    ? "font-bold text-[rgb(138,199,214)]"
                    : "text-brown-muted"
                }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="absolute left-0 right-0 border-t-2 border-dashed border-[rgba(180,100,50,0.35)] pointer-events-none"
        style={{ bottom: `${(goal / maxVal) * 100}%` }}
      >
        <span className="absolute right-0 -top-4 text-[0.6rem] text-[#b06830] font-bold">
          Goal
        </span>
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
    <div className={planContainer}>
      <section className={`${planSection} bg-[#f8f8f3] text-center`}>
        <h2 className={planSectionTitle}>
          {selected.isToday ? "Today" : selected.label}
        </h2>
        <CalorieRing consumed={selected.calories} goal={dailyGoal} />
      </section>

      <section className={`${planSection} bg-[#f8f8f3] flex flex-col gap-3.5`}>
        <h2 className={planSectionTitle}>
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

      <section className={`${planSection} bg-[#f8f8f3] overflow-visible`}>
        <h2 className={planSectionTitle}>This Week</h2>
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
      subtitle={
        <Typewriter
          options={{
            strings: [
              "Journal your foodie story...",
              "Track nutrients with AI...",
              "Savor every healthy bite...",
            ],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 35,
            cursor: "🥑",
          }}
        />
      }
      backgroundImage="url(avocado1.png)"
    >
      <h3 style={{ marginBottom: "6px", marginTop: "10px" }}></h3>
      <Dashboard foods={foods} dailyGoal={dailyGoal} macroGoals={macroGoals} />
    </LayoutPage>
  );
}
