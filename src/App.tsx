import { useState } from "react";
import "./App.css";

let nextId = 0;

type Food = {
  id: number;
  name: string;
  meal: string;
  place: string;
};

function App() {
  const [foods, setFoods] = useState<Food[]>([]); //Food array
  const [inputValue, setInputValue] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("Breakfast"); // Declare a state variable...
  const [selectedPlace, setSelectedPlace] = useState("Cafe"); // Declare a state variable...

  // function handleChangeFood(newfood: Food) {
  //   setFoods(
  //     foods.map((food) => {
  //       if (food.id === newfood.id) {
  //         return newfood;
  //       } else {
  //         return food;
  //       }
  //     })
  //   );
  // }

  return (
    <>
      <h1>My FOODIE DIARY</h1>
      <p>What you eat today...🥑</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          setFoods([
            ...foods,
            {
              id: nextId++,
              name: inputValue,
              meal: selectedMeal,
              place: selectedPlace,
            },
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

      <div className="scroll">
        {foods.map((food) => (
          <h3 className="h3">
            Your {food.meal} diary : {food.name} in {food.place} today!
          </h3>
        ))}
      </div>
    </>
  );
}

export default App;
