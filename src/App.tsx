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
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  // const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

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
    setIsEditingId(food.id);
  }

  // function handleDeleteClick(food: Food) {
  //   setInputValue(food.name);
  //   setSelectedMeal(food.meal);
  //   setSelectedPlace(food.place);
  //   setIsDeletingId(food.id);
  // }

  function handleEditSubmit() {
    setFoods(
      foods.map((food) => {
        if (food.id === isEditingId) {
          return {
            id: isEditingId,
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

  function handleDelete(isDeletingId: number) {
    setFoods(foods.filter((food) => food.id !== isDeletingId));
  }

  function handleNewSubmit() {
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

  function handleResetForm() {
    setInputValue("");
    setSelectedMeal("BREAKFAST");
    setSelectedPlace("CAFE");
    setIsEditingId(null);
  }

  return (
    <>
      <h1>FOODIE DIARY</h1>
      <p>What you eat today...🥑</p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditingId !== null) {
            handleEditSubmit();
            alert(`You succesfully edit your foodie diary!`);
          } else {
            handleNewSubmit();
          }
          handleResetForm();
        }}
      >
        <h2>
          {isEditingId !== null
            ? `You are now editting your dairy!`
            : `Write your new foodie dairy now!`}
        </h2>

        <label>NOW is ...</label>

        <input
          className="calendar"
          type="datetime-local"
          id="Test_DatetimeLocal"
        />

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
          <div className="edit">
            <br />
            <h3>
              🦁 Your {food.meal} diary 🍣
              <br />
              {food.name} in {food.place} today!
            </h3>
            <button
              className="editbutton"
              onClick={() => {
                handleEditClick(food);
              }}
            >
              🍒 EDIT
            </button>
            <button
              className="deletebutton"
              onClick={() => {
                alert(`Do you wanna delete this foodie record?`);
                handleDelete(food.id);
                alert(`You succesfully delete this foodie record!`);
              }}
            >
              🍋 DELETE
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
