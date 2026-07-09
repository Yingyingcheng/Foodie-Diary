import clsx from "clsx";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Food } from "./../type";
import { LayoutPage } from "./LayoutPage";
import Typewriter from "typewriter-effect";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  dailyGoal: number;
};

const calendarNavBtn =
  "appearance-none w-[150px] h-10 inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.7rem] px-2 py-0 text-inherit font-medium transition-all duration-[250ms] hover:text-[#ff9a9a] hover:font-bold hover:bg-[rgb(96,45,20)] hover:transition-none";

const modalActionBtn =
  "appearance-none inline-flex items-center justify-center h-9 w-[70px] px-3.5 py-2.5 rounded-lg border border-transparent cursor-pointer text-[13px] font-medium text-brown-btn transition-all duration-[250ms] hover:bg-brown-darkest hover:text-cream hover:font-bold hover:transition-none";

export function Calendar({ foods, setFoods, dailyGoal }: CalendarInputProps) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null); //for pop modal
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startingDayIndex = getDay(firstDayOfMonth);

  const foodsByDate = useMemo(() => {
    return foods.reduce((acc: Record<string, Food[]>, food) => {
      if (!food.date) return acc;
      const dateKey = format(food.date, "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(food);
      return acc;
    }, {});
  }, [foods]);

  const selectedDateKcal = useMemo(() => {
    if (!selectedDateKey) return { total: 0, remaining: 0 };
    const dayFoods = foodsByDate[selectedDateKey] || [];
    const total = dayFoods.reduce(
      (sum, food) => sum + (Number(food.calories) || 0),
      0,
    );
    // Ensure dailyGoal is a number
    const goal = Number(dailyGoal) || 2000;
    return {
      total,
      remaining: goal - total,
    };
  }, [selectedDateKey, foodsByDate, dailyGoal]);

  function handleDelete(id: string) {
    if (confirm("Do you wanna delete this foodie record?")) {
      const dayFoods = selectedDateKey
        ? (foodsByDate[selectedDateKey] ?? [])
        : [];
      setFoods((prev) => prev.filter((food) => food.id !== id));
      // Close the modal when the last meal of the day is removed
      if (dayFoods.length <= 1) setSelectedDateKey(null);
      alert(`You successfully deleted this foodie record!`);
    }
  }

  function toggleDate(dateKey: string) {
    setSelectedDateKey(dateKey);
  }

  return (
    <LayoutPage
      title="Calendar Memory"
      subtitle={
        <Typewriter
          options={{
            strings: [
              "Share your diary with friends...",
              "Relive your favorite meals...✨",
            ],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 30,
            cursor: "🍒",
          }}
        />
      }
      backgroundImage="url(cherry1.png)"
    >
      {selectedDateKey && (
        <div className="backdrop-blur-[1px] fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.4)] z-[100] flex items-center justify-center">
          <div className="w-[500px] bg-[rgb(239,228,215)] rounded-[10px] relative p-[30px] mt-20 max-h-[300px] overflow-y-auto">
            <button
              className="appearance-none absolute top-[15px] right-2.5 rounded-full p-[5px] w-[30px] h-[30px] text-white bg-[#957a4dc4] border border-transparent cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-[250ms] hover:font-bold hover:bg-[rgb(96,45,20)] hover:transition-none"
              aria-label="Close"
              type="button"
              onClick={() => {
                setSelectedDateKey(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="text-[brown] text-lg">📅 {selectedDateKey}</div>
            {/* 01/18/2026 */}
            <div
              className={clsx(
                "mt-[5px] text-[15px] text-olive-dark p-5 rounded-xl border border-[rgba(76,5,5,0.898)] border-l-[5px]",
                selectedDateKcal.remaining < 0
                  ? "bg-[#e6d4b7] border-l-[#7b2300]"
                  : "bg-[#fad2cf] border-l-[#a21212]",
              )}
            >
              <div className="flex justify-between mb-[5px]">
                <span>Daily Total: </span>
                <strong>{selectedDateKcal.total} kcal</strong>
              </div>
              <div className="flex justify-between mb-[5px]">
                <span>Target: </span>
                <span>{dailyGoal} kcal</span>
              </div>
              <hr className="opacity-20 my-2.5" />
              <div className="text-center font-bold mt-2.5">
                {isNaN(selectedDateKcal.remaining)
                  ? "Calculating..."
                  : selectedDateKcal.remaining < 0
                    ? `You are ${Math.abs(selectedDateKcal.remaining)} kcal over goal 🫠`
                    : `You have ${selectedDateKcal.remaining} kcal remaining 🙂‍↔️`}
              </div>
            </div>
            <div className="flex flex-col gap-[1px] text-[0.6rem] relative">
              {(foodsByDate[selectedDateKey] || []).map((food) => {
                let emoji = "";
                switch (food.meal.toUpperCase()) {
                  case "BREAKFAST":
                    emoji = "🍳";
                    break;
                  case "LUNCH":
                    emoji = "🥗";
                    break;
                  case "BRUNCH":
                    emoji = "🥞";
                    break;
                  case "DINNER":
                    emoji = "🍛";
                    break;
                  case "SNACK":
                    emoji = "🍩";
                    break;
                  case "LATE NIGHT FOOD":
                    emoji = "🍔";
                    break;
                  default:
                    emoji = "";
                }
                const mealLabel = food.meal
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div key={food.id}>
                    <div className="flex max-md:flex-col text-left text-[15px] bg-white text-modal-text border border-modal-text rounded-[10px] p-2.5 pr-[100px] max-md:pr-2.5 mt-2.5 shadow-[0_2px_10px_rgba(216,130,130,0.1)] relative">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-semibold text-base mb-1.5 text-modal-text">
                          <span className="text-[1.1rem]">{emoji}</span>
                          <span className="capitalize">{mealLabel}</span>
                          <span className="text-[#60181899] font-normal">
                            {" "}
                            at {food.place}
                          </span>
                        </div>
                        <div className="mb-2 text-[0.95rem]">
                          <span className="font-semibold text-modal-text">
                            {food.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-3 text-[0.85rem] text-nutrition-brown">
                          <span className="pr-1">Fat {food.fat}g</span>
                          <span className="pr-1">Carbs {food.carbs}g</span>
                          <span className="pr-1">Protein {food.protein}g</span>
                          <br></br>
                          <span className="font-semibold">
                            Total Calories: {food.calories} kcal
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 absolute right-2.5 top-2.5 z-[2] max-md:static max-md:mt-3 max-md:self-end">
                        <button
                          className={`${modalActionBtn} bg-btn-edit`}
                          onClick={() => {
                            navigate("/diary", { state: { editFood: food } });
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          className={`${modalActionBtn} bg-[rgb(255,215,217)]`}
                          onClick={() => {
                            handleDelete(food.id);
                          }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[550px] mx-auto p-4 rounded-[20px] bg-[#fbf5f3] mt-[15px]">
        {/* Month navigation */}
        <h2 className="text-calendar-red font-bold text-2xl flex items-center justify-center gap-2 flex-nowrap text-center min-w-0">
          <button
            className={calendarNavBtn}
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ◀
          </button>
          {format(currentMonth, "MMMM yyyy")}
          <button
            className={calendarNavBtn}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            ▶
          </button>
        </h2>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 font-bold text-calendar-red">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before the first day of the month */}
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border-2 border-white rounded-md p-2 min-h-[30px] max-h-[60px] overflow-y-auto text-sm relative text-calendar-red bg-transparent"
            />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const todaysFoods = foodsByDate[dateKey] || [];
            const hasFoods = todaysFoods.length > 0;
            const today = isToday(day);

            return (
              <div
                key={index}
                className={clsx(
                  "border-2 border-white rounded-md p-2 min-h-[30px] max-h-[60px] overflow-y-auto text-sm relative",
                  today
                    ? "bg-calendar-red text-cream-light"
                    : hasFoods
                      ? "bg-cream text-calendar-red"
                      : "bg-[#fcd4d4ec] text-calendar-red",
                )}
              >
                {/* Date number */}
                <div
                  className={clsx(
                    "date-number font-bold mb-1 cursor-pointer",
                    hasFoods && "bg-[rgba(255,207,167,0.7)] rounded-[30%] p-[2px]",
                    hasFoods &&
                      (today
                        ? "hover:bg-cream hover:text-calendar-red"
                        : "hover:bg-[rgba(255,175,255,0.566)]"),
                  )}
                  onClick={() => toggleDate(dateKey)}
                >
                  {format(day, "d")}
                </div>

                {/* Summary view when collapsed */}
                <div>
                  {todaysFoods.map((food) => {
                    let emoji = "";
                    switch (food.meal.toUpperCase()) {
                      case "BREAKFAST":
                        emoji = "🍳";
                        break;
                      case "LUNCH":
                        emoji = "🥗";
                        break;
                      case "BRUNCH":
                        emoji = "🥞";
                        break;
                      case "DINNER":
                        emoji = "🍛";
                        break;
                      case "SNACK":
                        emoji = "🍩";
                        break;
                      case "LATE NIGHT FOOD":
                        emoji = "🍔";
                        break;
                    }
                    return (
                      <span key={food.id}>
                        {emoji} {food.meal}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutPage>
  );
}
