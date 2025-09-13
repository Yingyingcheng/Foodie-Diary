import "./../App.css";
import type { Food } from "../type";
import { LayoutPage } from "./LayoutPage";

type PlanInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};
export function Plan({ foods, setFoods }: PlanInputProps) {
  console.log(foods, setFoods);
  return (
    <>
      <LayoutPage
        title="SET YOUR GOAL"
        subtitle="Achieve your nutrition goals....🍑"
        backgroundImage="url(peach5.png)"
      >
        <></>
      </LayoutPage>
    </>
  );
}
