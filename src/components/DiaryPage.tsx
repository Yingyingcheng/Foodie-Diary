import { useState } from "react";
import "./../App.css";
import type { Food } from "../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LayoutPage } from "./LayoutPage";
import { v4 as uuidv4 } from "uuid";

type DiaryInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Diary({ foods, setFoods }: DiaryInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("BREAKFAST"); // Declare a state variable...
  const [selectedPlace, setSelectedPlace] = useState("HOME SWEET HOME"); // Declare a state variable...
  const [selectedDate, setSelectedDate] = useState<Food["date"]>(new Date());
  const [selectedProtein, setSelectedProtein] = useState(0);
  const [selectedFat, setSelectedFat] = useState(0);
  const [selectedCarbs, setSelectedCarbs] = useState(0);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const totalCalorie =
    selectedProtein * 4 + selectedCarbs * 4 + selectedFat * 9;
  const [file, setFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 01.21.2026 新增 Loading 狀態

  function handleEditClick(food: Food) {
    setInputValue(food.name);
    setSelectedMeal(food.meal);
    setSelectedPlace(food.place);
    setSelectedDate(food.date);
    setIsEditingId(food.id);
    setSelectedProtein(food.protein);
    setSelectedFat(food.fat);
    setSelectedCarbs(food.carbs);
  }

  function handleEditSubmit() {
    const editFoods = foods.map((food) => {
      if (food.id === isEditingId) {
        return {
          id: isEditingId,
          name: inputValue,
          meal: selectedMeal,
          place: selectedPlace,
          date: selectedDate,
          protein: selectedProtein,
          fat: selectedFat,
          carbs: selectedCarbs,
          calories: totalCalorie,
        };
      } else {
        return food;
      }
    });
    setFoods(editFoods);
  }

  function handleDelete(isDeletingId: string) {
    const deleteFoods = foods.filter((food) => food.id !== isDeletingId);
    setFoods(deleteFoods);
  }

  function handleNewSubmit() {
    const newFood = {
      id: uuidv4(),
      name: inputValue,
      meal: selectedMeal,
      place: selectedPlace,
      date: selectedDate,
      protein: selectedProtein,
      fat: selectedFat,
      carbs: selectedCarbs,
      calories: totalCalorie,
    };
    const updatedFoods = [...foods, newFood];
    setFoods(updatedFoods);
  }

  function handleResetForm() {
    setInputValue("");
    setSelectedMeal("BREAKFAST");
    setSelectedPlace("CAFE");
    setSelectedDate(new Date());
    setIsEditingId(null);
    setSelectedProtein(0);
    setSelectedFat(0);
    setSelectedCarbs(0);
  }

  function handleSelectDate(d: Date | null) {
    if (d) setSelectedDate(d);
  }

  // 01.21.2026 Revise image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFile(URL.createObjectURL(file));
    setIsLoading(true); // Starts analyze

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(",")[1];

        const res = await fetch("/api/server", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });

        if (!res.ok) throw new Error("Server responded with error");

        const textResult = await res.text();

        const output = JSON.parse(textResult);

        setSelectedProtein(output.protein);
        setSelectedCarbs(output.carb);
        setSelectedFat(output.fat);

        if (output.composition) {
          setInputValue((prev) =>
            prev === ""
              ? output.composition
              : `${prev}\n(Analysis: ${output.composition})`,
          );

          console.log(`Detected: ${output.composition}`);
        }
      } catch (error) {
        console.error("AI analysis failure:", error);
        alert("Sorry, I cannot recoginize this image! Please try again!");
      } finally {
        setIsLoading(false); // **
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <LayoutPage
        title="FOODIE DIARY"
        subtitle="What you eat today...🍋"
        backgroundImage="url(lemon.png)"
      >
        <form
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
              ? `You are now editting your diary!`
              : `Write your foodie diary now!`}
          </h2>
          <label>
            NOW is ...
            {/* <input
              
              type="datetime-local"
              id="Test_DatetimeLocal"
            /> */}
            <DatePicker
              className="calendar"
              showIcon
              selected={selectedDate}
              onChange={handleSelectDate}
            />
          </label>
          <select
            className="dropdownmenu"
            value={selectedMeal}
            onChange={(e) => {
              setSelectedMeal(e.target.value);
            }}
          >
            <option value="BREAKFAST"> BREAKFAST</option>
            <option value="BRUNCH"> BRUNCH</option>
            <option value="LUNCH"> LUNCH</option>
            <option value="DINNER"> DINNER</option>
            <option value="SNACK"> SNACK</option>
            <option value="LATE NIGHT FOOD"> LATE NIGHT FOOD</option>
          </select>
          <select
            className="dropdownmenu"
            value={selectedPlace}
            onChange={(e) => {
              setSelectedPlace(e.target.value);
            }}
          >
            <option value="HOME SWEET HOME">HOME SWEET HOME</option>
            <option value="SCHOOL">SCHOOL</option>
            <option value="OFFICE">OFFICE</option>
            <option value="CAFE">CAFE</option>
            <option value="RESTAURANT">RESTAURANT</option>
            <option value="OTHERS">OTHERS</option>
          </select>
          <input
            className="textarea"
            value={inputValue}
            placeholder="Write it down...🥨"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="UploadSection">
            {/* */}
            <input
              id="ImageUpload"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            {/* */}
            <label htmlFor="ImageUpload" className="ContainerButton">
              <div className="ImageContainer">
                {file ? (
                  <img className="resizeImage" src={file} alt="Image preview" />
                ) : (
                  <div className="ImagePlaceholder">
                    <span style={{ fontSize: "1.5rem" }}>📸</span>
                    <p>Upload a Photo to Calculate</p>
                  </div>
                )}
                {/*  */}
                {isLoading && (
                  <div className="LoadingOverlay">
                    <div className="Spinner"></div>
                    <p>Analyzing your calories...</p>
                  </div>
                )}
              </div>
            </label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <label className="proteinlabel">
              Protein(g):
              <input
                className="proteinarea"
                value={selectedProtein}
                placeholder="Protein(g)"
                onChange={(e) =>
                  setSelectedProtein(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              Fat(g):
              <input
                className="fatarea"
                value={selectedFat}
                placeholder="Fat(g)"
                onChange={(e) =>
                  setSelectedFat(parseFloat(e.target.value) || 0)
                }
              />
            </label>
            <label>
              Carbs(g):
              <input
                className="carbsarea"
                value={selectedCarbs}
                placeholder="Carbs(g)"
                onChange={(e) =>
                  setSelectedCarbs(parseFloat(e.target.value) || 0)
                }
              />
            </label>
          </div>
          {/* <button onClick={handleCalorieCalculator}>Calculate Calories</button> */}
          <h4>Your Total Calorie: {totalCalorie}</h4>
          <button className="submit">Submit</button>
        </form>
        <div className="scroll">
          {foods.map((food) => (
            <div className="list">
              <ul>
                <li>
                  {food.date ? `📅 ${food.date.toDateString()}` : ""} ☕{" "}
                  {food.meal}
                  <br />
                  ENJOY {food.name} in {food.place} today
                  <br />
                  Calories: {food.calories}
                </li>
              </ul>
              <button
                className="editbutton"
                onClick={() => {
                  handleEditClick(food);
                }}
              >
                EDIT
              </button>
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
