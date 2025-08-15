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
  // const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  // useMemo(computeFn, dependencies)
  // array.reduce(reducerFn, initialValue)

  const foodsByDate = useMemo(() => {
    // Record<string, Food[]> : Accumulator type
    // key = string, value = Food[]

    return foods.reduce((acc: Record<string, Food[]>, food) => {
      // Skip if no date (date is null or undefined)
      if (!food.date) return acc;

      //Convert Date to "yyyy-MM-dd" string
      //Object keys must be strings

      const dateKey = format(food.date, "yyyy-MM-dd");

      //If this date's value doesn't exist yet, create an empty array for this date
      if (!acc[dateKey]) acc[dateKey] = [];

      //Add the current food to the correct date's array
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
        <h2 className="calendar-title">
          {" "}
          <button
            className="calendar-nav-btn"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            {" "}
            ◀
          </button>
          {format(currentMonth, "MMMM yyyy")}
          <button
            className="calendar-nav-btn"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            {" "}
            ▶
          </button>
        </h2>
        <div className="calendar-nav"></div>
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
                className={clsx(
                  "calendar-cell",
                  isToday(day) && "today",
                  foodsByDate[dateKey]?.length ? "hasfoods" : undefined
                )}
              >
                <div className="date-number">{format(day, "d")}</div>

                {/* //Listing foods for that day */}

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
