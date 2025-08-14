import clsx from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { useMemo, useState } from "react";
import type { Food } from "./../type";
import { LayoutPage } from "./LayoutPage";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Calendar({ foods, setFoods }: CalendarInputProps) {
  const [currentDate] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

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

  return (
    <LayoutPage
      title="Calendar Memory"
      subtitle="Share your diary with friends...🍒"
      backgroundImage="url(cherry1.png)"
    >
      <div className="calendar-container">
        <h2 className="calendar-title">{format(currentDate, "MMMM yyyy")}</h2>

        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-cell empty" />
          ))}

          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const todaysFoods = foodsByDate[dateKey] || [];

            return (
              <div
                key={index}
                className={clsx("calendar-cell", isToday(day) && "today")}
              >
                <div className="date-number">{format(day, "d")}</div>
                {todaysFoods.map((food) => (
                  <div key={food.id} className="food-item">
                    <span>
                      {food.meal} {food.name}
                    </span>
                    <br></br>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="delete-btn"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </LayoutPage>
  );
}
