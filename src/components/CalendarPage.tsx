import { PageLayout } from "./PageLayout";
import "./../CalendarPage.css";
import type { Food } from "./../type";
import "react-datepicker/dist/react-datepicker.css";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Calendar({ foods, setFoods }: CalendarInputProps) {
  return (
    <PageLayout
      title="Calendar Memory"
      subtitle="Share your diary with friends...🍒"
      backgroundImage="url(cherry1.png)"
    >
      <div className="scroll">
        {foods.map((food) => (
          <div className="edit">
            <br />
            <h3>
              Your {food.meal} diary
              <br />
              {food.name} in {food.place} today!
            </h3>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
