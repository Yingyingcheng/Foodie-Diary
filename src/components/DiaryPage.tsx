import { useState, useEffect } from "react";
import type { Food } from "../type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LayoutPage } from "./LayoutPage";
import { useLocation } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "./Toast";
import { CatBadge } from "./CatBadge";
import { supabase } from "../lib/supabase";

type DiaryInputProps = {
  foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
};

export function Diary({ foods, setFoods }: DiaryInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("BREAKFAST"); // Declare a state variable...
  const [selectedPlace, setSelectedPlace] = useState("CAFE"); // Declare a state variable...
  const [selectedDate, setSelectedDate] = useState<Food["date"]>(new Date());
  const [selectedProtein, setSelectedProtein] = useState(0);
  const [selectedFat, setSelectedFat] = useState(0);
  const [selectedCarbs, setSelectedCarbs] = useState(0);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const totalCalorie =
    selectedProtein * 4 + selectedCarbs * 4 + selectedFat * 9;
  const [file, setFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 01.21.2026 新增 Loading 狀態
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();

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

  async function handleEditSubmit() {
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
    const updated = editFoods.find((f) => f.id === isEditingId);
    if (updated) {
      await supabase.from("foods").update(updated).eq("id", isEditingId);
    }
  }

  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      const editFood: Food = location.state.editFood;
      // colon means variable: Type (TypeScript annotation)
      // const editFood: Food = location.state.editFood;
      //       ^^^^^^^^  ^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^
      //      variable  : type    the assigning value
      if (editFood) {
        handleEditClick(editFood);
        window.history.replaceState({}, document.title);
      } else if (location.state.presetDate) {
        setSelectedDate(new Date(location.state.presetDate + "T12:00:00"));
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  async function handleNewSubmit() {
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
    const result = await supabase.from("foods").insert(newFood);
    const error = result.error;
    if (error) {
      setToast("Could not save to cloud: " + error.message);
    }
  }

  function handleResetForm() {
    setInputValue("");
    setSelectedMeal("BREAKFAST");
    setSelectedPlace("HOME SWEET HOME");
    setSelectedDate(new Date());
    setIsEditingId(null);
    setSelectedProtein(0);
    setSelectedFat(0);
    setSelectedCarbs(0);
    setFile(null);
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
      } catch (error) {
        console.error("AI analysis failure:", error);
        const message = error instanceof Error ? error.message : "";
        if (message === "QUOTA_EXCEEDED") {
          setToast(
            "The AI is taking a break! (Free Tier limit reached). Please try again in 1 minute. ☕",
          );
        } else if (message === "SERVER_OVERLOADED") {
          setToast(
            "The AI server is too busy right now. Please try uploading again.",
          );
        } else {
          setToast(
            "Could not recognize this meal. Please try a clearer photo!",
          );
        }
      } finally {
        setIsLoading(false);
        URL.revokeObjectURL(img.src); // Clean up memory
      }
    };
  }

  return (
    <>
      <LayoutPage title="FOODIE DIARY" backgroundImage="url(lemon.png)">
        <form
          className="max-w-[550px] mx-auto mt-[15px] p-8 pb-6 text-center rounded-[3em] bg-[#f2e6c9] text-olive-dark flex flex-col gap-[10px] items-center max-md:max-w-[92%] max-md:p-5 max-md:rounded-[2em]"
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditingId !== null) {
              handleEditSubmit();
              setToast("You successfully edited your foodie diary!");
            } else {
              handleNewSubmit();
              setToast("You successfully submitted your foodie diary!");
            }
            handleResetForm();
          }}
        >
          <CatBadge src="ginger-cat-v2-windy.png" ringColor="#d9a916" />

          {/* Date + meal + place, kept compact in two rows */}
          <label>
            <DatePicker
              className="bg-white-glass border border-white-glass rounded-[20px]"
              showIcon
              selected={selectedDate}
              onChange={handleSelectDate}
            />
          </label>
          <div className="grid grid-cols-2 gap-2 w-[24em] max-w-[95%]">
            <select
              className="font-elite w-full h-auto min-h-[2.6em] rounded-[1em] text-center border-none bg-[#ffffffc3] text-[#643927aa] text-[0.95rem]"
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
              className="font-elite w-full h-auto min-h-[2.6em] rounded-[1em] text-center border-none bg-[#ffffffc3] text-[#643927aa] text-[0.95rem]"
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
          </div>

          {/* Photo on the left, AI results land in the fields on the right */}
          <div className="flex items-stretch justify-center gap-3 w-[24em] max-w-[95%] max-md:flex-col max-md:items-center">
            <input
              id="ImageUpload"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="ImageUpload"
              className="cursor-pointer block shrink-0"
            >
              <div className="relative w-[200px] aspect-square flex flex-col items-center justify-center text-center border-2 border-dashed border-[#ccc] rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] overflow-hidden bg-[whitesmoke] transition-all duration-300 cursor-pointer hover:bg-[rgba(246,236,209,0.845)] hover:-translate-y-0.5">
                {file ? (
                  <img
                    className="w-full h-full object-cover"
                    src={file}
                    alt="Image preview"
                  />
                ) : (
                  <div className="text-[#999] text-[0.8rem] px-2">
                    <span style={{ fontSize: "1.4rem" }}>📸</span>
                    <p className="m-0">Snap a photo, AI fills the macros!</p>
                  </div>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[rgba(255,243,176,0.88)] rounded-[20px] z-10">
                    <img
                      src="ginger-cat-v2-windy.png"
                      alt=""
                      className="w-12 h-12 rounded-full object-cover object-top animate-pulse"
                    />
                    <p className="m-0 text-[0.75rem] text-brown font-bold px-1">
                      Analyzing...
                    </p>
                  </div>
                )}
              </div>
            </label>
            <div className="flex flex-col justify-center gap-1.5 max-md:w-full">
              {(
                [
                  ["Protein", selectedProtein, setSelectedProtein],
                  ["Fat", selectedFat, setSelectedFat],
                  ["Carbs", selectedCarbs, setSelectedCarbs],
                ] as const
              ).map(([name, value, setter]) => (
                <label
                  key={name}
                  className="flex items-center justify-between gap-2 text-[0.9rem]"
                >
                  {name}(g):
                  <input
                    className="font-elite w-[5em] h-8 rounded-[1em] text-center border-none bg-white-glass text-brown-input font-bold"
                    value={value}
                    inputMode="decimal"
                    onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                  />
                </label>
              ))}
              <p className="m-0 text-[0.9rem] font-bold">
                Total: {totalCalorie} kcal
              </p>
            </div>
          </div>

          <textarea
            className="font-elite shrink-0 w-[24em] max-w-[95%] h-auto min-h-[4.5em] rounded-[1em] text-center border-none bg-white-glass text-brown-input font-bold text-base"
            value={inputValue}
            placeholder="Write it down...🥨"
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            disabled={isLoading}
            className="appearance-none inline-flex items-center justify-center min-w-[180px] h-10 min-h-[30px] p-0 rounded-lg border border-transparent text-[1em] font-medium text-black bg-white-soft cursor-pointer transition-all duration-250 hover:font-bold hover:text-white hover:bg-[rgb(96,45,20)] hover:transition-none disabled:opacity-60 disabled:cursor-wait"
          >
            {isLoading ? "Analyzing..." : "Submit"}
          </button>
        </form>
        <Toast message={toast} onClose={() => setToast(null)} />
      </LayoutPage>
    </>
  );
}
