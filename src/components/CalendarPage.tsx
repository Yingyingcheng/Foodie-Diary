import { useState } from "react";
import { Link } from "react-router";
import "./../CalendarPage.css";
import type { Food } from "./../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CalendarInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Calendar({ foods, setFoods }: CalendarInputProps) {
  return (
    <div className="calendarhead">
      <h1>Calendar Memory</h1>
      <p>Share your diary with friends...🍒</p>
      <Link to="/diary">
        <button>Foodie Diary</button>
      </Link>{" "}
      <Link to="/calendar">
        <button
          disabled
          style={{
            backgroundColor: " rgb(205, 176, 129)",
            color: "white",
          }}
        >
          Calendar Memory
        </button>
      </Link>{" "}
      <Link to="/plan">
        <button>Set Your Goals</button>
      </Link>
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
    </div>
  );
}
