import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";
import { useState } from "react";
import { CatBadge } from "./CatBadge";
import { planContainer, planSection, planSectionTitle } from "../ui";

type MacroGoals = { protein: number; fat: number; carbs: number };

type PlanInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  dailyGoal: number;
  setDailyGoal: React.Dispatch<React.SetStateAction<number>>;
  macroGoals: MacroGoals;
  setMacroGoals: React.Dispatch<React.SetStateAction<MacroGoals>>;
};

const goalLabel =
  "flex flex-col items-center gap-1.5 text-[#7a5035] font-bold";

const goalInput =
  "font-elite text-center rounded-xl border-2 border-[rgba(180,120,70,0.25)] bg-[#ffffffcc] text-brown-dark font-bold outline-none transition-[border-color] duration-200 focus:border-accent";

export function Plan({
  dailyGoal,
  setDailyGoal,
  macroGoals,
  setMacroGoals,
}: PlanInputProps) {
  const [calGoal, setCalGoal] = useState<number | "">(dailyGoal);
  const [proteinGoal, setProteinGoal] = useState<number | "">(
    macroGoals.protein,
  );
  const [fatGoal, setFatGoal] = useState<number | "">(macroGoals.fat);
  const [carbsGoal, setCarbsGoal] = useState<number | "">(macroGoals.carbs);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDailyGoal(Number(calGoal) || 2000);
    setMacroGoals({
      protein: Number(proteinGoal) || 150,
      fat: Number(fatGoal) || 65,
      carbs: Number(carbsGoal) || 250,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <LayoutPage
      title="SET YOUR GOALS"
      backgroundImage="url(peach5.png)"
    >
      <div className={planContainer}>
        <section className={`${planSection} bg-[rgb(255,243,224)]`}>
          <CatBadge src="ginger-cat-fruit-peach.png" ringColor="#e08a4e" />
          <h2 className={`${planSectionTitle} mt-3`}>Daily Calorie Target</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="text-center">
              <label className={`${goalLabel} text-[0.85rem]`}>
                Calories
                <input
                  className={`${goalInput} w-[9em] h-[2.4em] text-[1.3rem]`}
                  value={calGoal === 0 ? "" : calGoal}
                  placeholder="2000"
                  type="number"
                  onChange={(e) =>
                    setCalGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="text-xs text-[#a08060]">kcal</span>
              </label>
            </div>

            <h2 className={planSectionTitle} style={{ marginTop: "8px" }}>
              Macro Targets
            </h2>

            <div className="flex justify-center gap-4 max-md:gap-2">
              <label className={`${goalLabel} text-[0.8rem]`}>
                Protein
                <input
                  className={`${goalInput} w-[5em] max-md:w-[4.5em] h-[2.2em] text-base`}
                  value={proteinGoal === 0 ? "" : proteinGoal}
                  placeholder="150"
                  type="number"
                  onChange={(e) =>
                    setProteinGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="text-xs text-[#a08060]">g</span>
              </label>
              <label className={`${goalLabel} text-[0.8rem]`}>
                Fat
                <input
                  className={`${goalInput} w-[5em] max-md:w-[4.5em] h-[2.2em] text-base`}
                  value={fatGoal === 0 ? "" : fatGoal}
                  placeholder="65"
                  type="number"
                  onChange={(e) =>
                    setFatGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="text-xs text-[#a08060]">g</span>
              </label>
              <label className={`${goalLabel} text-[0.8rem]`}>
                Carbs
                <input
                  className={`${goalInput} w-[5em] max-md:w-[4.5em] h-[2.2em] text-base`}
                  value={carbsGoal === 0 ? "" : carbsGoal}
                  placeholder="250"
                  type="number"
                  onChange={(e) =>
                    setCarbsGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="text-xs text-[#a08060]">g</span>
              </label>
            </div>

            <button
              className="appearance-none inline-flex items-center justify-center w-[150px] h-10 self-center font-elite border-none rounded-[14px] bg-linear-135 from-accent to-accent-dark text-white text-base font-bold cursor-pointer shadow-[0_3px_10px_rgba(200,100,40,0.25)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(200,100,40,0.35)]"
              type="submit"
            >
              {saved ? "Saved!" : "Save Goals"}
            </button>
          </form>
        </section>
      </div>
    </LayoutPage>
  );
}
