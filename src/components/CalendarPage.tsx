import { useState } from "react";
import { Link } from "react-router";
import "./../CalendarPage.css";
import type { Food } from "./../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Calendar() {
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
    </div>
  );
}
