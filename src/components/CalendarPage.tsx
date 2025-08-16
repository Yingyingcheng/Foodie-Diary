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
import type { Food } from "./../type";
import { LayoutPage } from "./LayoutPage";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Calendar({ foods, setFoods }: CalendarInputProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );

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

  function handleDelete(id: number) {
    if (confirm("Do you wanna delete this foodie record?")) {
      setFoods((prev) => prev.filter((food) => food.id !== id));
      alert("You successfully deleted this foodie record!");
    }
  }

  function toggleDate(dateKey: string) {
    setExpandedDates((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
  }

  return (
    <LayoutPage
      title="Calendar Memory"
      subtitle="Share your diary with friends...🍒"
      backgroundImage="url(cherry1.png)"
    >
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
                  todaysFoods.length > 0 && "hasfoods"
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
                {!expandedDates[dateKey] && todaysFoods.length > 0 && (
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
                        case "SNACKS":
                          emoji = "🍩";
                          break;
                        case "LATE NIGHT FOOD":
                          emoji = "🍔";
                          break;
                        default:
                          emoji = "";
                      }
                      return `${emoji} ${food.meal}`;
                    })}
                  </div>
                )}

                {/* Expanded meals list */}
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutPage>
  );
}
