import type { Food } from "./../type";
import "react-datepicker/dist/react-datepicker.css";
import { LayoutPage } from "./LayoutPage";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Calendar({ foods, setFoods }: CalendarInputProps) {
  function handleDelete(isDeletingId: number) {
    setFoods(foods.filter((food) => food.id !== isDeletingId));
  }

  return (
    <>
      <LayoutPage
        title="Calendar Memory"
        subtitle="Share your diary with friends...🍒"
        backgroundImage="url(cherry1.png)"
      >
        <div className="scroll">
          {foods.map((food) => (
            <div className="list">
              <ul>
                <li>
                  {food.date ? `📅 ${food.date.toDateString()}` : ""} ☕{" "}
                  {food.meal}
                  <br />
                  ENJOY {food.name} in {food.place} today
                </li>
              </ul>
              <button
                className="deletebutton"
                onClick={() => {
                  alert(`Do you wanna delete this foodie record?`);
                  handleDelete(food.id);
                  alert(`You succesfully delete this foodie record!`);
                }}
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      </LayoutPage>
    </>
  );
}
