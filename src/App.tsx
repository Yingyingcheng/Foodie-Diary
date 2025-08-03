import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [foodNames, setFoodNames] = useState<string[]>([]);
  const [selectedMeal, setSelectedMeal] = useState("Breakfast"); // Declare a state variable...
  const [selectedPlace, setSelectedPlace] = useState("Cafe"); // Declare a state variable...
  return (
    <>
      <h1>My FOODIE DIARY</h1>
      <p>What you eat today...🥑🥑</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          setFoodNames((prev) => [
            ...prev,
            ` ${selectedMeal} : ${inputValue} in ${selectedPlace}`,
          ]);
          setInputValue("");
        }}
      >
        <select
          className="dropdownmenu"
          value={selectedMeal}
          onChange={(e) => {
            setSelectedMeal(e.target.value);
          }}
        >
          <option value="BREAKFAST">BREAKFAST</option>
          <option value="LUNCH">LUNCH</option>
          <option value="BRUNCH">BRUNCH</option>
          <option value="DINNER">DINNER</option>
          <option value="SNACK">SNACK</option>
        </select>
        <br></br>
        <br></br>
        <select
          className="dropdownmenu"
          value={selectedPlace}
          onChange={(e) => {
            setSelectedPlace(e.target.value);
          }}
        >
          <option value="CAFE">CAFE</option>
          <option value="RESTAURANT">RESTAURANT</option>
          <option value="HOME SWEET HOME">HOME SWEET HOME</option>
        </select>

        <br></br>
        <br></br>
        <input
          className="input"
          value={inputValue}
          placeholder="Write it down...🥨"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br></br>
        <br></br>

        <button className="button">Submit</button>
      </form>

      <div style={{ maxHeight: 160, overflowY: "scroll" }}>
        {foodNames.map((food) => (
          <h3 className="h3">You ate {food} today!</h3>
        ))}
      </div>
    </>
  );
}

export default App;
