import { useState } from "react";
import "./../App.css";
import type { Food } from "../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LayoutPage } from "./LayoutPage";
import { v4 as uuidv4 } from "uuid";
import Typewriter from "typewriter-effect";

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

    const originalFile = e.target.files[0];
    setFile(URL.createObjectURL(originalFile));
    setIsLoading(true); // Starts analyze

    const img = new Image();
    img.src = URL.createObjectURL(originalFile);
    // const reader = new FileReader();

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const max_width = 800;
      let width = img.width;
      let height = img.height;

      if (width > max_width) {
        height *= max_width / width;
        width = max_width;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      // 3. Quality: 0.7 's JPEG Base64 : Vercel's 4.5MB limit
      const compressedBase64 = canvas
        .toDataURL("image/jpeg", 0.9)
        .split(",")[1];

      try {
        const res = await fetch("/api/server", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: compressedBase64 }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          // Handle specific API Quota errors
          if (res.status === 429) throw new Error("QUOTA_EXCEEDED");
          if (res.status === 503) throw new Error("SERVER_OVERLOADED");
          throw new Error(errorText || "Server error");
        }

        const textResult = await res.text();

        const output = JSON.parse(textResult);

        setSelectedProtein(output.protein || 0);
        setSelectedCarbs(output.carb || 0);
        setSelectedFat(output.fat || 0);

        if (output.composition) {
          setInputValue((prev) =>
            prev === ""
              ? output.composition
              : `${prev}\n(AI Analysis: ${output.composition})`,
          );

          console.log(`Detected: ${output.composition}`);
        }
      } catch (error: any) {
        console.error("AI analysis failure:", error);
        if (error.message === "QUOTA_EXCEEDED") {
          alert(
            "The AI is taking a break! (Free Tier limit reached). Please try again in 1 minute. ☕",
          );
        } else if (error.message === "SERVER_OVERLOADED") {
          alert(
            "The AI server is too busy right now. Please try uploading again.",
          );
        } else {
          alert("Could not recognize this meal. Please try a clearer photo!");
        }
      } finally {
        setIsLoading(false);
        URL.revokeObjectURL(img.src); // Clean up memory
      }
    };
  }

  return (
    <>
      <LayoutPage
        title="FOODIE DIARY"
        subtitle={
          <Typewriter
            options={{
              strings: [
                "What you eat today...",
                "Your foodie journey, captured...📸",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 35,
              cursor: "🍋",
            }}
          />
        }
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
          <textarea //改成textarea components
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
