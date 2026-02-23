import "./../App.css";
import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";
import { useState } from "react";
import Typewriter from "typewriter-effect";

type MacroGoals = { protein: number; fat: number; carbs: number };

type PlanInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  dailyGoal: number;
  setDailyGoal: React.Dispatch<React.SetStateAction<number>>;
  macroGoals: MacroGoals;
  setMacroGoals: React.Dispatch<React.SetStateAction<MacroGoals>>;
};

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
      subtitle={
        <Typewriter
          options={{
            strings: ["Define your targets, then crush them."],
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
      <div className="plan-container">
        <section className="plan-section plan-goals-card">
          <h2 className="plan-section-title">Daily Calorie Target</h2>
          <form onSubmit={handleSave} className="plan-goals-form">
            <div className="plan-goal-input-group">
              <label className="plan-goal-label">
                Calories
                <input
                  className="plan-goal-input plan-goal-input--cal"
                  value={calGoal === 0 ? "" : calGoal}
                  placeholder="2000"
                  type="number"
                  onChange={(e) =>
                    setCalGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="plan-goal-unit">kcal</span>
              </label>
            </div>

            <h2 className="plan-section-title" style={{ marginTop: "8px" }}>
              Macro Targets
            </h2>

            <div className="plan-macro-inputs">
              <label className="plan-goal-label plan-goal-label--macro">
                Protein
                <input
                  className="plan-goal-input plan-goal-input--macro"
                  value={proteinGoal === 0 ? "" : proteinGoal}
                  placeholder="150"
                  type="number"
                  onChange={(e) =>
                    setProteinGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="plan-goal-unit">g</span>
              </label>
              <label className="plan-goal-label plan-goal-label--macro">
                Fat
                <input
                  className="plan-goal-input plan-goal-input--macro"
                  value={fatGoal === 0 ? "" : fatGoal}
                  placeholder="65"
                  type="number"
                  onChange={(e) =>
                    setFatGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="plan-goal-unit">g</span>
              </label>
              <label className="plan-goal-label plan-goal-label--macro">
                Carbs
                <input
                  className="plan-goal-input plan-goal-input--macro"
                  value={carbsGoal === 0 ? "" : carbsGoal}
                  placeholder="250"
                  type="number"
                  onChange={(e) =>
                    setCarbsGoal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <span className="plan-goal-unit">g</span>
              </label>
            </div>

            <button className="plan-save-btn" type="submit">
              {saved ? "Saved!" : "Save Goals"}
            </button>
          </form>
        </section>

        <section className="plan-section plan-current-goals">
          <h2 className="plan-section-title">Current Goals</h2>
          <div className="plan-stats-grid">
            <div className="plan-stat-item">
              <span className="plan-stat-value">{dailyGoal}</span>
              <span className="plan-stat-desc">Calories (kcal)</span>
            </div>
            <div className="plan-stat-item">
              <span className="plan-stat-value">{macroGoals.protein}</span>
              <span className="plan-stat-desc">Protein (g)</span>
            </div>
            <div className="plan-stat-item">
              <span className="plan-stat-value">{macroGoals.fat}</span>
              <span className="plan-stat-desc">Fat (g)</span>
            </div>
            <div className="plan-stat-item">
              <span className="plan-stat-value">{macroGoals.carbs}</span>
              <span className="plan-stat-desc">Carbs (g)</span>
            </div>
          </div>
        </section>
      </div>
    </LayoutPage>
  );
}
