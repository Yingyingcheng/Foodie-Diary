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

  {
    /* 01/18/2026 */
  }
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
      setFoods((prev) => prev.filter((food) => food.id !== id));
      alert(`You succesfully delete this foodie record!`);
    }
  }

  function toggleDate(dateKey: string) {
    // setExpandedDates((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
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
        <div className="modal-wrapper">
          <div className="modal-content">
            <button
              className="modal-close-btn"
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-dateheader">📅 {selectedDateKey}</div>
            {/* 01/18/2026 */}
            <div
              className={clsx(
                "modal-summary-card",
                selectedDateKcal.remaining < 0 ? "over" : "under",
              )}
            >
              <div className="summary-stat">
                <span>Daily Total: </span>
                <strong>{selectedDateKcal.total} kcal</strong>
              </div>
              <div className="summary-stat">
                <span>Target: </span>
                <span>{dailyGoal} kcal</span>
              </div>
              <hr />
              <div className="summary-result">
                {isNaN(selectedDateKcal.remaining)
                  ? "Calculating..."
                  : selectedDateKcal.remaining < 0
                    ? `You are ${Math.abs(selectedDateKcal.remaining)} kcal over goal 🫠`
                    : `You have ${selectedDateKcal.remaining} kcal remaining 🙂‍↔️`}
              </div>
            </div>
            <div className="meals-list">
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
                return (
                  <div key={food.id} className="food-item">
                    <div className="modal-list">
                      <ul>
                        <li>
                          {emoji}
                          {food.meal}
                          <br />
                          <br />
                          {food.name} in {food.place}
                          <br />
                          <br />
                          Fat(g) : {food.fat} <br />
                          Carbs(g) : {food.carbs} <br />
                          Protein(g) : {food.protein} <br />
                          Total Calories : {food.calories}
                        </li>
                      </ul>
                      <div className="modal-action-buttons">
                        {
                          // When CalendarPage runs:  navigate("/diary", { state: { editFood: food } })
                          // React Router builds a location object like:
                          // pathname: "/diary",
                          // search: "",
                          // hash: "",
                          // { state: { editFood: food } }
                          //         ^^^^^^^^     ^^^^
                          //         key     :     value (the actual food variable)
                          // colon(:) means key: value (making an object)
                        }
                        <button
                          className="modal-editbutton"
                          onClick={() => {
                            navigate("/diary", { state: { editFood: food } });
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          className="modal-deletebutton"
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
      <div className="calendar-container">
        {/* Month navigation */}
        <h2 className="calendar-title">
          <button
            className="calendar-nav-btn"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ◀
          </button>
          {format(currentMonth, "MMMM yyyy")}
          <button
            className="calendar-nav-btn"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            ▶
          </button>
        </h2>

        {/* Weekday headers */}
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {/* Empty cells before the first day of the month */}
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-cell empty" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const todaysFoods = foodsByDate[dateKey] || [];

            return (
              <div
                key={index}
                className={clsx(
                  "calendar-cell",
                  isToday(day) && "today",
                  todaysFoods.length > 0 && "hasfoods",
                )}
              >
                {/* Date number */}
                <div
                  className="date-number"
                  onClick={() => toggleDate(dateKey)}
                >
                  {format(day, "d")}
                </div>

                {/* Summary view when collapsed */}
                {/* {!expandedDates[dateKey] && todaysFoods.length > 0 && ( */}
                <div className="meals-summary">
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
                    return `${emoji} ${food.meal}`;
                  })}
                </div>

                {/* Expanded meals list
                {expandedDates[dateKey] && (
                  <div className="meals-list">
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
                        case "SNACKS":
                          emoji = "🍩";
                          break;
                        case "LATE NIGHT FOOD":
                          emoji = "🍔";
                          break;
                        default:
                          emoji = "";
                      }
                      return (
                        <div key={food.id} className="food-item">
                          <span>
                            {emoji}
                            {food.name}
                          </span>
                          <br />
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="delete-btn"
                          >
                            ❌
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutPage>
  );
}
