import { useState } from "react";
import { Link } from "react-router";
import "./../CalendarPage.css";
import type { Food } from "./../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CalendarInputProps = {
  foods: Food[];
};

export function Calendar({ foods }: CalendarInputProps) {
  return (
    <div className="calendarhead">
      <h1>Calendar Memory</h1>
      <p>Share your dairy with friends...🍒</p>
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
      {/* <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
      /> */}
      <div
        className="scroll"
        style={{ backgroundColor: "white", opacity: 0.8, borderRadius: 10 }}
      >
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
