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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Food } from "./../type";
import { LayoutPage } from "./LayoutPage";
import { ConfirmDialog } from "./ConfirmDialog";
import { Toast } from "./Toast";
import { CatBadge } from "./CatBadge";
import { supabase } from "../lib/supabase";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  dailyGoal: number;
};

const calendarNavBtn =
  "appearance-none w-[150px] h-10 inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.7rem] px-2 py-0 text-inherit font-medium transition-all duration-[250ms] hover:text-[#ff9a9a] hover:font-bold hover:bg-[rgb(96,45,20)] hover:transition-none";

const panelActionBtn =
  "appearance-none inline-flex items-center justify-center h-9 w-[70px] px-3.5 py-2.5 rounded-lg border border-transparent cursor-pointer text-[13px] font-medium text-brown-btn transition-all duration-[250ms] hover:bg-brown-darkest hover:text-cream hover:font-bold hover:transition-none";

function mealEmoji(meal: string) {
  switch (meal.toUpperCase()) {
    case "BREAKFAST":
      return "🍳";
    case "LUNCH":
      return "🥗";
    case "BRUNCH":
      return "🥞";
    case "DINNER":
      return "🍛";
    case "SNACK":
      return "🍩";
    case "LATE NIGHT FOOD":
      return "🍔";
    default:
      return "";
  }
}

export function Calendar({ foods, setFoods, dailyGoal }: CalendarInputProps) {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
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

  const kcalByDate = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const [dateKey, dayFoods] of Object.entries(foodsByDate)) {
      totals[dateKey] = dayFoods.reduce(
        (sum, food) => sum + (Number(food.calories) || 0),
        0,
      );
    }
    return totals;
  }, [foodsByDate]);

  const goal = Number(dailyGoal) || 2000;
  const selectedTotal = selectedDateKey
    ? (kcalByDate[selectedDateKey] ?? 0)
    : 0;
  const selectedRemaining = goal - selectedTotal;
  const progressPercent = Math.min(
    100,
    Math.round((selectedTotal / goal) * 100),
  );

  // Escape closes the confirm dialog first, then the day panel
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (pendingDeleteId !== null) {
        setPendingDeleteId(null);
      } else {
        setSelectedDateKey(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingDeleteId]);

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    const dayFoods = selectedDateKey
      ? (foodsByDate[selectedDateKey] ?? [])
      : [];
    setFoods((prev) => prev.filter((food) => food.id !== pendingDeleteId));
    await supabase.from("foods").delete().eq("id", pendingDeleteId);
    // Close the panel when the last meal of the day is removed
    if (dayFoods.length <= 1) setSelectedDateKey(null);
    setPendingDeleteId(null);
    setToast("You successfully deleted this foodie record!");
  }

  return (
    <LayoutPage
      title="Calendar Memory"
      backgroundImage="url(cherry1.png)"
    >
      {/* Mobile-only backdrop */}
      {selectedDateKey && (
        <div
          className="md:hidden fixed inset-0 z-90 bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px]"
          onClick={() => setSelectedDateKey(null)}
        />
      )}

      <div className="flex justify-center items-start gap-5 mt-[15px] max-md:flex-col max-md:items-center">
        {/* Calendar card */}
        <div className="w-full max-w-[550px] p-4 rounded-[20px] bg-[#fbf5f3]">
          <CatBadge src="ginger-cat-fruit-cherry.png" ringColor="#c94f5e" />
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
            {Array.from({ length: startingDayIndex }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="border-2 border-white rounded-md p-2 min-h-[30px] max-h-[72px] text-sm bg-transparent"
              />
            ))}

            {daysInMonth.map((day, index) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const todaysFoods = foodsByDate[dateKey] || [];
              const hasFoods = todaysFoods.length > 0;
              const today = isToday(day);
              const isSelected = selectedDateKey === dateKey;

              return (
                <div
                  key={index}
                  className={clsx(
                    "border-2 rounded-md p-2 min-h-[30px] max-h-[72px] overflow-y-auto text-sm relative cursor-pointer",
                    isSelected ? "border-[rgb(96,45,20)]" : "border-white",
                    today
                      ? "bg-calendar-red text-cream-light"
                      : hasFoods
                        ? "bg-cream text-calendar-red"
                        : "bg-[#fcd4d4ec] text-calendar-red",
                  )}
                  onClick={() => hasFoods && setSelectedDateKey(dateKey)}
                >
                  {/* Date number */}
                  <div
                    className={clsx(
                      "date-number font-bold mb-1",
                      hasFoods &&
                        "bg-[rgba(255,207,167,0.7)] rounded-[30%] p-[2px]",
                      hasFoods &&
                        (today
                          ? "hover:bg-cream hover:text-calendar-red"
                          : "hover:bg-[rgba(255,175,255,0.566)]"),
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Emojis + daily kcal total */}
                  {hasFoods && (
                    <>
                      <div className="leading-tight">
                        {todaysFoods.map((food) => (
                          <span key={food.id}>{mealEmoji(food.meal)}</span>
                        ))}
                      </div>
                      <div className="text-[0.6rem] font-semibold opacity-80">
                        {kcalByDate[dateKey]} kcal
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day details panel: right side on desktop, overlay on mobile */}
        {selectedDateKey && (
          <div className="w-[330px] shrink-0 bg-[rgb(239,228,215)] rounded-[20px] relative p-5 text-left shadow-[0_4px_18px_rgba(120,60,30,0.15)] max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:z-100 max-md:w-[90vw] max-md:max-w-[400px] max-md:max-h-[75vh] max-md:overflow-y-auto">
            <button
              className="appearance-none absolute top-[15px] right-2.5 rounded-full p-[5px] w-[30px] h-[30px] text-white bg-[#957a4dc4] border border-transparent cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-250 hover:font-bold hover:bg-[rgb(96,45,20)] hover:transition-none"
              aria-label="Close"
              type="button"
              onClick={() => setSelectedDateKey(null)}
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

            <div className="text-[brown] text-lg font-bold">
              📅 {format(new Date(selectedDateKey), "EEE, MMMM d")}
            </div>

            {/* Summary + progress bar */}
            <div
              className={clsx(
                "mt-2 text-[15px] text-olive-dark p-4 rounded-xl border border-[rgba(76,5,5,0.898)] border-l-[5px]",
                selectedRemaining < 0
                  ? "bg-[#e6d4b7] border-l-[#7b2300]"
                  : "bg-[#fad2cf] border-l-[#a21212]",
              )}
            >
              <div className="flex justify-between mb-1">
                <span>
                  {selectedTotal} / {goal} kcal
                </span>
                <strong>{progressPercent}%</strong>
              </div>
              <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all",
                    selectedRemaining < 0 ? "bg-[#7b2300]" : "bg-[#a21212]",
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-center font-bold mt-2 text-[13px]">
                {selectedRemaining < 0
                  ? `You are ${Math.abs(selectedRemaining)} kcal over goal 🫠`
                  : `You have ${selectedRemaining} kcal remaining 🙂‍↔️`}
              </div>
            </div>

            {/* Meal cards */}
            <div className="flex flex-col mt-1">
              {(foodsByDate[selectedDateKey] || []).map((food) => {
                const mealLabel = food.meal
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div
                    key={food.id}
                    className="text-left text-[15px] bg-white text-modal-text border border-modal-text rounded-[10px] p-2.5 mt-2.5 shadow-[0_2px_10px_rgba(216,130,130,0.1)]"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-base mb-1.5 text-modal-text">
                      <span className="text-[1.1rem]">
                        {mealEmoji(food.meal)}
                      </span>
                      <span className="capitalize">{mealLabel}</span>
                      <span className="text-[#60181899] font-normal">
                        at {food.place}
                      </span>
                    </div>
                    <div className="mb-2 text-[0.95rem]">
                      <span className="font-semibold text-modal-text whitespace-pre-line">
                        {food.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-y-1 gap-x-3 text-[0.85rem] text-nutrition-brown">
                      <span>
                        Protein: {food.protein}g · Fat: {food.fat}g · Carbs:{" "}
                        {food.carbs}g
                      </span>
                      <span className="font-semibold">
                        {food.calories} kcal
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        className={`${panelActionBtn} bg-btn-edit`}
                        onClick={() =>
                          navigate("/diary", { state: { editFood: food } })
                        }
                      >
                        EDIT
                      </button>
                      <button
                        className={`${panelActionBtn} bg-[rgb(255,215,217)]`}
                        onClick={() => setPendingDeleteId(food.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add meal shortcut */}
            <button
              className="mt-4 w-full appearance-none inline-flex items-center justify-center h-10 rounded-lg border border-dashed border-[rgb(96,45,20)] bg-transparent cursor-pointer text-[13px] font-medium text-brown-btn transition-all duration-[250ms] hover:bg-brown-darkest hover:text-cream hover:font-bold hover:transition-none"
              onClick={() =>
                navigate("/diary", {
                  state: { presetDate: selectedDateKey },
                })
              }
            >
              <span className="text-[1.1rem]">+</span> Add meal for this day
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={pendingDeleteId !== null}
        message="Do you wanna delete this foodie record?"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </LayoutPage>
  );
}
