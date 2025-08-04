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
  const [selectedMeal, setSelectedMeal] = useState("BREAKFAST"); // Declare a state variable...
  const [selectedPlace, setSelectedPlace] = useState("CAFE"); // Declare a state variable...
  const [edittingId, setEdittingId] = useState<number | null>(null);

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

  function handleEditClick(food: Food) {
    setInputValue(food.name);
    setSelectedMeal(food.meal);
    setSelectedPlace(food.place);
    setEdittingId(food.id);
  }

  function handleEdittingSubmit() {
    setFoods(
      foods.map((food) => {
        if (food.id === edittingId) {
          return {
            id: edittingId,
            name: inputValue,
            meal: selectedMeal,
            place: selectedPlace,
          };
        } else {
          return food;
        }
      })
    );
  }

  function handleNewRecordSubmit() {
    setFoods([
      ...foods,
      {
        id: nextId++,
        name: inputValue,
        meal: selectedMeal,
        place: selectedPlace,
      },
    ]);
  }

  function resetForm() {
    setInputValue("");
    setSelectedMeal("BREAKFAST");
    setSelectedPlace("CAFE");
    setEdittingId(null);
  }

  return (
    <>
      <h1>My FOODIE DIARY</h1>
      <p>What you eat today...🥑</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (edittingId !== null) {
            handleEdittingSubmit();
          } else {
            handleNewRecordSubmit();
          }
          resetForm();
        }}
      >
        <h2>
          {edittingId !== null
            ? `Currently editting ${edittingId}`
            : "Let's create a new record"}
        </h2>
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
          <div style={{ display: "flex", gap: 4 }}>
            <h3 className="h3">
              Your {food.meal} diary : {food.name} in {food.place} today!
            </h3>
            <button onClick={() => handleEditClick(food)}>edit</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
