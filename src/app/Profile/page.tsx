"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Dumbbell, Utensils, Edit, Save, X, ShoppingCart } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileHeader from "@/Components/ProfileHeader";
import CornerElements from "@/Components/CornerElements";
import NoFitnessPlan from "@/Components/NoFitnessPlan";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/Components/ui/accordion";
import { db } from "@/firebase-config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadRandomPlan } from "@/utils/uploadRandomPlan";

// Types
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  progress: number;
}

interface Meal {
  meal: string;
  foods: string[];
}

interface Day {
  day: string;
  exercises: Exercise[];
  diet: Meal[];
}

interface FitnessPlan {
  name: string;
  days: Day[];
}

interface UserDetails {
  dob: string;
  email: string;
  height: string;
  weight: string;
  nickname: string;
  exerciseLevel: string;
}

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

// --------------------- FITNESS PLAN HOOK ---------------------
const useFitnessPlan = () => {
  const [currentPlan, setCurrentPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Expanded with 12 more realistic plans (total 13 plans now, including the original)
      // Expanded with 10 more realistic plans (total 13 plans now, including the original 3)
const plans: FitnessPlan[] = [
  // --- Original Plans (1-3) ---
  {
      name: "Full Body Beginner",
      days: [
          // ... (Your original 7 days) ...
          {
              day: "Day 1: Chest & Triceps",
              exercises: [
                  { name: "Pushups", sets: 3, reps: 12, progress: 0 },
                  { name: "Squats", sets: 3, reps: 15, progress: 0 },
                  { name: "Plank", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Banana", "Greek Yogurt"] },
                  { meal: "Lunch", foods: ["Grilled Chicken Salad", "Brown Rice", "Broccoli"] },
                  { meal: "Dinner", foods: ["Baked Salmon", "Quinoa", "Mixed Greens"] },
                  { meal: "Snack", foods: ["Apple", "Almonds"] },
              ],
          },
          {
              day: "Day 2: Back & Biceps",
              exercises: [
                  { name: "Lunges", sets: 3, reps: 12, progress: 0 },
                  { name: "Pullups (Assisted)", sets: 3, reps: 8, progress: 0 },
                  { name: "Burpees", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie (Spinach, Banana, Protein)", "Whole Grain Toast"] },
                  { meal: "Lunch", foods: ["Quinoa Bowl", "Veggies", "Chickpeas"] },
                  { meal: "Dinner", foods: ["Vegetable Soup", "Grilled Tofu"] },
                  { meal: "Snack", foods: ["Carrot Sticks", "Hummus"] },
              ],
          },
          {
              day: "Day 3: Legs & Core",
              exercises: [
                  { name: "Dumbbell Rows", sets: 3, reps: 12, progress: 0 },
                  { name: "Deadlifts", sets: 3, reps: 10, progress: 0 },
                  { name: "Mountain Climbers", sets: 3, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs", "Avocado Toast"] },
                  { meal: "Lunch", foods: ["Chicken Salad"] },
                  { meal: "Dinner", foods: ["Grilled Fish", "Veggies"] },
                  { meal: "Snack", foods: ["Banana", "Peanut Butter"] },
              ],
          },
          {
              day: "Day 4: Shoulders & Arms",
              exercises: [
                  { name: "Shoulder Press", sets: 3, reps: 12, progress: 0 },
                  { name: "Bicep Curls", sets: 3, reps: 12, progress: 0 },
                  { name: "Tricep Dips", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Yogurt", "Granola"] },
                  { meal: "Lunch", foods: ["Turkey Sandwich", "Salad"] },
                  { meal: "Dinner", foods: ["Steamed Veggies", "Chicken"] },
                  { meal: "Snack", foods: ["Orange", "Nuts"] },
              ],
          },
          {
              day: "Day 5: Full Body",
              exercises: [
                  { name: "Leg Press", sets: 3, reps: 15, progress: 0 },
                  { name: "Calf Raises", sets: 3, reps: 20, progress: 0 },
                  { name: "Jump Squats", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Pancakes", "Fruits"] },
                  { meal: "Lunch", foods: ["Salmon", "Brown Rice"] },
                  { meal: "Dinner", foods: ["Vegetable Soup", "Bread"] },
                  { meal: "Snack", foods: ["Grapes", "Cheese"] },
              ],
          },
          {
              day: "Day 6: Core & Cardio",
              exercises: [
                  { name: "Crunches", sets: 3, reps: 20, progress: 0 },
                  { name: "Leg Raises", sets: 3, reps: 15, progress: 0 },
                  { name: "Russian Twists", sets: 3, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie Bowl"] },
                  { meal: "Lunch", foods: ["Chicken Wrap"] },
                  { meal: "Dinner", foods: ["Grilled Veggies", "Tofu"] },
                  { meal: "Snack", foods: ["Pear", "Yogurt"] },
              ],
          },
          {
              day: "Day 7: Rest & Recovery",
              exercises: [
                  { name: "Yoga / Stretching", sets: 1, reps: 30, progress: 0 },
                  { name: "Walking / Cardio", sets: 1, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Fruit Salad"] },
                  { meal: "Lunch", foods: ["Vegetable Stir Fry"] },
                  { meal: "Dinner", foods: ["Light Soup"] },
                  { meal: "Snack", foods: ["Berries", "Seeds"] },
              ],
          },
      ],
  },
  {
      name: "Strength Builder Intermediate",
      days: [
          // ... (Your original 6 days) ...
          {
              day: "Day 1: Chest & Triceps",
              exercises: [
                  { name: "Bench Press", sets: 4, reps: 10, progress: 0 },
                  { name: "Incline Dumbbell Press", sets: 3, reps: 12, progress: 0 },
                  { name: "Tricep Extensions", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oats", "Protein Shake"] },
                  { meal: "Lunch", foods: ["Grilled Chicken", "Sweet Potato"] },
                  { meal: "Dinner", foods: ["Salad", "Steak"] },
                  { meal: "Snack", foods: ["Protein Bar", "Milk"] },
              ],
          },
          {
              day: "Day 2: Back & Biceps",
              exercises: [
                  { name: "Deadlifts", sets: 4, reps: 8, progress: 0 },
                  { name: "Pullups", sets: 3, reps: 10, progress: 0 },
                  { name: "Barbell Rows", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Egg Whites", "Whole Grain Bread"] },
                  { meal: "Lunch", foods: ["Tuna Salad", "Quinoa"] },
                  { meal: "Dinner", foods: ["Baked Turkey", "Veggies"] },
                  { meal: "Snack", foods: ["Greek Yogurt", "Honey"] },
              ],
          },
          {
              day: "Day 3: Legs",
              exercises: [
                  { name: "Squats", sets: 4, reps: 10, progress: 0 },
                  { name: "Leg Press", sets: 3, reps: 12, progress: 0 },
                  { name: "Lunges", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie", "Avocado"] },
                  { meal: "Lunch", foods: ["Chicken Breast", "Rice"] },
                  { meal: "Dinner", foods: ["Fish", "Broccoli"] },
                  { meal: "Snack", foods: ["Apple", "Almonds"] },
              ],
          },
          {
              day: "Day 4: Shoulders & Arms",
              exercises: [
                  { name: "Overhead Press", sets: 4, reps: 10, progress: 0 },
                  { name: "Lateral Raises", sets: 3, reps: 12, progress: 0 },
                  { name: "Bicep Curls", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Pancakes", "Berries"] },
                  { meal: "Lunch", foods: ["Salad", "Grilled Veggies"] },
                  { meal: "Dinner", foods: ["Steak", "Sweet Potato"] },
                  { meal: "Snack", foods: ["Orange", "Nuts"] },
              ],
          },
          {
              day: "Day 5: Full Body",
              exercises: [
                  { name: "Clean and Press", sets: 3, reps: 8, progress: 0 },
                  { name: "Burpees", sets: 3, reps: 15, progress: 0 },
                  { name: "Plank", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal", "Banana"] },
                  { meal: "Lunch", foods: ["Quinoa", "Chicken"] },
                  { meal: "Dinner", foods: ["Salmon", "Greens"] },
                  { meal: "Snack", foods: ["Yogurt", "Granola"] },
              ],
          },
          {
              day: "Day 6: Core & Cardio",
              exercises: [
                  { name: "Hanging Leg Raises", sets: 3, reps: 12, progress: 0 },
                  { name: "Russian Twists", sets: 3, reps: 20, progress: 0 },
                  { name: "Jumping Jacks", sets: 3, reps: 50, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie Bowl"] },
                  { meal: "Lunch", foods: ["Tofu Stir Fry"] },
                  { meal: "Dinner", foods: ["Soup", "Bread"] },
                  { meal: "Snack", foods: ["Pear", "Cheese"] },
              ],
          },
      ],
  },
  {
      name: "Weight Loss Focused",
      days: [
          // ... (Your original 5 days) ...
          {
              day: "Day 1: Cardio & Core",
              exercises: [
                  { name: "Running", sets: 1, reps: 30, progress: 0 },
                  { name: "Crunches", sets: 3, reps: 20, progress: 0 },
                  { name: "Bicycle Crunches", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Green Smoothie", "Toast"] },
                  { meal: "Lunch", foods: ["Salad", "Grilled Chicken"] },
                  { meal: "Dinner", foods: ["Steamed Veggies", "Fish"] },
                  { meal: "Snack", foods: ["Apple", "Almonds"] },
              ],
          },
          {
              day: "Day 2: Strength & HIIT",
              exercises: [
                  { name: "Pushups", sets: 3, reps: 15, progress: 0 },
                  { name: "Squats", sets: 3, reps: 20, progress: 0 },
                  { name: "Burpees", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal", "Banana"] },
                  { meal: "Lunch", foods: ["Quinoa", "Veggies"] },
                  { meal: "Dinner", foods: ["Tofu", "Broccoli"] },
                  { meal: "Snack", foods: ["Orange", "Yogurt"] },
              ],
          },
          {
              day: "Day 3: Yoga & Flexibility",
              exercises: [
                  { name: "Yoga Poses", sets: 1, reps: 45, progress: 0 },
                  { name: "Stretching", sets: 1, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Fruit Salad"] },
                  { meal: "Lunch", foods: ["Vegetable Soup"] },
                  { meal: "Dinner", foods: ["Light Salad"] },
                  { meal: "Snack", foods: ["Berries", "Seeds"] },
              ],
          },
          {
              day: "Day 4: Full Body Circuit",
              exercises: [
                  { name: "Jumping Jacks", sets: 3, reps: 50, progress: 0 },
                  { name: "Mountain Climbers", sets: 3, reps: 20, progress: 0 },
                  { name: "Plank", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie", "Granola"] },
                  { meal: "Lunch", foods: ["Chicken Wrap"] },
                  { meal: "Dinner", foods: ["Grilled Fish", "Greens"] },
                  { meal: "Snack", foods: ["Pear", "Nuts"] },
              ],
          },
          {
              day: "Day 5: Rest & Light Activity",
              exercises: [
                  { name: "Walking", sets: 1, reps: 45, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Yogurt", "Fruits"] },
                  { meal: "Lunch", foods: ["Salad"] },
                  { meal: "Dinner", foods: ["Soup"] },
                  { meal: "Snack", foods: ["Apple"] },
              ],
          },
      ],
  },

  // --- 10 New Plans Added Below ---

  // 4. Plan: 5-Day Powerbuilding (Advanced)
  {
      name: "5-Day Powerbuilding (Advanced)",
      days: [
          {
              day: "Day 1: Heavy Chest & Triceps",
              exercises: [
                  { name: "Barbell Bench Press", sets: 5, reps: 5, progress: 0 },
                  { name: "Dumbbell Press (Incline)", sets: 3, reps: 8, progress: 0 },
                  { name: "Skull Crushers", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Shake", "Whole Eggs (4)"] },
                  { meal: "Lunch", foods: ["Chicken & Rice (Large Portion)", "Spinach"] },
                  { meal: "Dinner", foods: ["Lean Ground Beef", "Sweet Potato Mash"] },
                  { meal: "Snack", foods: ["Casein Shake", "Peanut Butter"] },
              ],
          },
          {
              day: "Day 2: Heavy Back & Biceps",
              exercises: [
                  { name: "Deadlift (Conventional)", sets: 3, reps: 5, progress: 0 },
                  { name: "Pendlay Rows", sets: 4, reps: 8, progress: 0 },
                  { name: "Hammer Curls", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal", "Berries", "Whey Protein"] },
                  { meal: "Lunch", foods: ["Tuna Sandwich (Whole Wheat)", "Fruit"] },
                  { meal: "Dinner", foods: ["Steak (Sirloin)", "Asparagus", "Quinoa"] },
                  { meal: "Snack", foods: ["Cottage Cheese", "Honey"] },
              ],
          },
          {
              day: "Day 3: Rest/Light Cardio",
              exercises: [
                  { name: "Incline Treadmill Walk", sets: 1, reps: 40, progress: 0 },
                  { name: "Foam Rolling", sets: 1, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Greek Yogurt", "Granola"] },
                  { meal: "Lunch", foods: ["Large Chicken Salad"] },
                  { meal: "Dinner", foods: ["Lentil Soup", "Whole Grain Bread"] },
                  { meal: "Snack", foods: ["Protein Bar"] },
              ],
          },
          {
              day: "Day 4: Heavy Legs",
              exercises: [
                  { name: "Barbell Squats", sets: 5, reps: 5, progress: 0 },
                  { name: "Leg Press", sets: 3, reps: 10, progress: 0 },
                  { name: "Calf Raises (Seated)", sets: 4, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs (Scrambled)", "Hash Browns"] },
                  { meal: "Lunch", foods: ["Pork Chops", "Brown Rice", "Peas"] },
                  { meal: "Dinner", foods: ["Chicken Tacos (Corn Tortillas)", "Black Beans"] },
                  { meal: "Snack", foods: ["Banana", "Protein Shake"] },
              ],
          },
          {
              day: "Day 5: Shoulders & Arms",
              exercises: [
                  { name: "Overhead Barbell Press", sets: 4, reps: 8, progress: 0 },
                  { name: "Lateral Raises (Superset)", sets: 3, reps: 15, progress: 0 },
                  { name: "Cable Tricep Pushdowns", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Whole Grain Cereal", "Milk", "Banana"] },
                  { meal: "Lunch", foods: ["Turkey Breast Wrap", "Baby Carrots"] },
                  { meal: "Dinner", foods: ["Baked Cod", "Sweet Potato Fries", "Coleslaw"] },
                  { meal: "Snack", foods: ["Grapes", "Walnuts"] },
              ],
          },
      ],
  },

  // 5. Plan: 6-Day PPL (Push, Pull, Legs) Split
  {
      name: "6-Day PPL (Push, Pull, Legs)",
      days: [
          {
              day: "Day 1: Push (Chest, Shoulders, Triceps)",
              exercises: [
                  { name: "Flat Dumbbell Press", sets: 3, reps: 10, progress: 0 },
                  { name: "Seated Overhead Press", sets: 3, reps: 10, progress: 0 },
                  { name: "Cable Crossovers", sets: 3, reps: 15, progress: 0 },
                  { name: "Tricep Rope Extension", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Pancake Stack", "Syrup"] },
                  { meal: "Lunch", foods: ["Tuna Salad Sandwich", "Apple"] },
                  { meal: "Dinner", foods: ["Chicken Curry", "Basmati Rice"] },
                  { meal: "Snack", foods: ["Pre-workout, Post-workout Shake"] },
              ],
          },
          {
              day: "Day 2: Pull (Back, Biceps)",
              exercises: [
                  { name: "Lat Pulldowns", sets: 3, reps: 12, progress: 0 },
                  { name: "Cable Seated Rows", sets: 3, reps: 10, progress: 0 },
                  { name: "Face Pulls", sets: 3, reps: 15, progress: 0 },
                  { name: "Barbell Curls", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Scrambled Eggs (3)", "Spinach"] },
                  { meal: "Lunch", foods: ["Turkey Meatballs", "Pasta"] },
                  { meal: "Dinner", foods: ["Baked Halibut", "Green Beans"] },
                  { meal: "Snack", foods: ["Rice Cakes", "Jam"] },
              ],
          },
          {
              day: "Day 3: Legs",
              exercises: [
                  { name: "Front Squats", sets: 3, reps: 10, progress: 0 },
                  { name: "Romanian Deadlifts", sets: 3, reps: 10, progress: 0 },
                  { name: "Leg Extensions", sets: 3, reps: 15, progress: 0 },
                  { name: "Hamstring Curls", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Large Bowl of Cereal", "Milk"] },
                  { meal: "Lunch", foods: ["Burrito Bowl (Rice, Beans, Chicken)"] },
                  { meal: "Dinner", foods: ["Pizza (High Protein Toppings)"] },
                  { meal: "Snack", foods: ["Sweet Potato Fries"] },
              ],
          },
          {
              day: "Day 4: Push (Repeat)",
              exercises: [
                  { name: "Incline Barbell Press", sets: 3, reps: 8, progress: 0 },
                  { name: "Lateral Raises", sets: 3, reps: 15, progress: 0 },
                  { name: "Overhead Tricep Extension", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Shake", "Almond Butter Sandwich"] },
                  { meal: "Lunch", foods: ["Leftover Chicken Curry"] },
                  { meal: "Dinner", foods: ["Pork Tenderloin", "Rice Pilaf"] },
                  { meal: "Snack", foods: ["Trail Mix"] },
              ],
          },
          {
              day: "Day 5: Pull (Repeat)",
              exercises: [
                  { name: "T-Bar Rows", sets: 3, reps: 10, progress: 0 },
                  { name: "Weighted Pullups", sets: 3, reps: 8, progress: 0 },
                  { name: "Preacher Curls", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Yogurt, Honey, Nuts"] },
                  { meal: "Lunch", foods: ["Chicken Noodle Soup", "Sandwich"] },
                  { meal: "Dinner", foods: ["Shrimp Scampi", "Whole Wheat Linguine"] },
                  { meal: "Snack", foods: ["Vegetable Sticks", "Hummus"] },
              ],
          },
          {
              day: "Day 6: Legs (Repeat)",
              exercises: [
                  { name: "Hack Squat", sets: 3, reps: 12, progress: 0 },
                  { name: "Glute Bridges (Weighted)", sets: 3, reps: 15, progress: 0 },
                  { name: "Standing Calf Raises", sets: 4, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Waffles", "Peanut Butter", "Banana"] },
                  { meal: "Lunch", foods: ["Big Mac Salad (Low-Carb)"] },
                  { meal: "Dinner", foods: ["Chicken Stir Fry", "Brown Rice"] },
                  { meal: "Snack", foods: ["Hard-Boiled Eggs"] },
              ],
          },
      ],
  },

  // 6. Plan: 7-Day Marathon Prep
  {
      name: "7-Day Marathon Prep (Maintenance)",
      days: [
          {
              day: "Day 1: Easy Run & Mobility",
              exercises: [
                  { name: "Easy 6km Run", sets: 1, reps: 35, progress: 0 },
                  { name: "Hip Mobility Drills", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Raisins", "Coffee"] },
                  { meal: "Lunch", foods: ["Chicken Breast", "Steamed Veggies"] },
                  { meal: "Dinner", foods: ["Pasta with Marinara Sauce"] },
                  { meal: "Snack", foods: ["Energy Gel (Post-Run)"] },
              ],
          },
          {
              day: "Day 2: Speed Work (Track)",
              exercises: [
                  { name: "400m Repeats (Intervals)", sets: 6, reps: 1, progress: 0 },
                  { name: "Light Core Work (Plank)", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Toast with Jam", "Protein Shake"] },
                  { meal: "Lunch", foods: ["Tuna Wrap", "Banana"] },
                  { meal: "Dinner", foods: ["Lean Steak", "Baked Potato", "Salad"] },
                  { meal: "Snack", foods: ["Electrolyte Drink"] },
              ],
          },
          {
              day: "Day 3: Cross-Training (Swim/Cycle)",
              exercises: [
                  { name: "Cycling (Indoor)", sets: 1, reps: 60, progress: 0 },
                  { name: "Resistance Bands (Legs)", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Pancakes", "Fruit"] },
                  { meal: "Lunch", foods: ["Lentil Soup", "Roll"] },
                  { meal: "Dinner", foods: ["Grilled Salmon", "Quinoa", "Broccoli"] },
                  { meal: "Snack", foods: ["Peanut Butter Sandwich"] },
              ],
          },
          {
              day: "Day 4: Rest/Recovery",
              exercises: [
                  { name: "Active Recovery Walk", sets: 1, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Yogurt Parfait"] },
                  { meal: "Lunch", foods: ["Leftover Salmon"] },
                  { meal: "Dinner", foods: ["Large Salad with Feta"] },
                  { meal: "Snack", foods: ["Handful of Walnuts"] },
              ],
          },
          {
              day: "Day 5: Tempo Run (Moderate)",
              exercises: [
                  { name: "Tempo Run 8km", sets: 1, reps: 45, progress: 0 },
                  { name: "Stretching Routine", sets: 1, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Bagel with Cream Cheese", "Orange Juice"] },
                  { meal: "Lunch", foods: ["Rice Bowl with Eggs and Veggies"] },
                  { meal: "Dinner", foods: ["Stir-Fry with Tofu and Noodles"] },
                  { meal: "Snack", foods: ["Dates"] },
              ],
          },
          {
              day: "Day 6: Long Slow Distance Run",
              exercises: [
                  { name: "Long Run 16-20km", sets: 1, reps: 120, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Toast, Banana, Honey (Pre-Run)"] },
                  { meal: "Lunch", foods: ["Post-Run Refuel: Chicken & Potatoes"] },
                  { meal: "Dinner", foods: ["Hearty Stew with Beef and Vegetables"] },
                  { meal: "Snack", foods: ["Chocolate Milk"] },
              ],
          },
          {
              day: "Day 7: Light Stretch & Walk",
              exercises: [
                  { name: "Gentle Yoga", sets: 1, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie Bowl with Protein Powder"] },
                  { meal: "Lunch", foods: ["Grilled Cheese and Tomato Soup"] },
                  { meal: "Dinner", foods: ["Sushi/Sashimi"] },
                  { meal: "Snack", foods: ["Grapes"] },
              ],
          },
      ],
  },

  // 7. Plan: 5-Day Functional Training
  {
      name: "5-Day Functional Training",
      days: [
          {
              day: "Day 1: Full Body Power",
              exercises: [
                  { name: "Kettlebell Swings", sets: 4, reps: 20, progress: 0 },
                  { name: "Goblet Squats", sets: 3, reps: 15, progress: 0 },
                  { name: "Medicine Ball Slams", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Flaxseed", "Berries"] },
                  { meal: "Lunch", foods: ["Chicken Salad (No Mayo)"] },
                  { meal: "Dinner", foods: ["Turkey Meatloaf", "Steamed Carrots"] },
                  { meal: "Snack", foods: ["Hard-Boiled Eggs"] },
              ],
          },
          {
              day: "Day 2: Core & Mobility",
              exercises: [
                  { name: "Turkish Get-Ups", sets: 3, reps: 5, progress: 0 },
                  { name: "Dead Bugs", sets: 3, reps: 15, progress: 0 },
                  { name: "Cat-Cow Stretch", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Green Smoothie (Kale, Protein, Water)"] },
                  { meal: "Lunch", foods: ["Quinoa and Vegetable Bowl"] },
                  { meal: "Dinner", foods: ["Tofu Scramble", "Bell Peppers"] },
                  { meal: "Snack", foods: ["Sliced Cucumber", "Dip"] },
              ],
          },
          {
              day: "Day 3: Rest/Active Recovery",
              exercises: [
                  { name: "Brisk Walk", sets: 1, reps: 45, progress: 0 },
                  { name: "Static Stretching", sets: 1, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Avocado Toast", "Small Fruit Salad"] },
                  { meal: "Lunch", foods: ["Vegetarian Wrap"] },
                  { meal: "Dinner", foods: ["Minestrone Soup"] },
                  { meal: "Snack", foods: ["Pistachios"] },
              ],
          },
          {
              day: "Day 4: Full Body Strength",
              exercises: [
                  { name: "Single-Arm Dumbbell Row", sets: 3, reps: 12, progress: 0 },
                  { name: "Dumbbell Step-Ups", sets: 3, reps: 10, progress: 0 },
                  { name: "Push Press", sets: 3, reps: 8, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs and Black Beans"] },
                  { meal: "Lunch", foods: ["Leftover Dinner (Turkey Meatloaf)"] },
                  { meal: "Dinner", foods: ["Ground Chicken Stir-Fry"] },
                  { meal: "Snack", foods: ["Apple Slices", "Peanut Butter"] },
              ],
          },
          {
              day: "Day 5: HIIT & Finisher",
              exercises: [
                  { name: "Box Jumps", sets: 4, reps: 10, progress: 0 },
                  { name: "Sled Push/Pull", sets: 3, reps: 50, progress: 0 },
                  { name: "Farmer's Walk (Heavy)", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Smoothie with Greens"] },
                  { meal: "Lunch", foods: ["Salmon Burger on Whole Wheat Bun"] },
                  { meal: "Dinner", foods: ["Lean Pork Chops", "Roasted Veggies"] },
                  { meal: "Snack", foods: ["Protein Shake (Post-Workout)"] },
              ],
          },
      ],
  },

  // 8. Plan: 6-Day Hybrid Calisthenics & Weights
  {
      name: "6-Day Hybrid Calisthenics & Weights",
      days: [
          {
              day: "Day 1: Calisthenics Push",
              exercises: [
                  { name: "Weighted Dips", sets: 4, reps: 8, progress: 0 },
                  { name: "Pike Pushups", sets: 3, reps: 10, progress: 0 },
                  { name: "Handstand Hold", sets: 3, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs (6 Whites, 1 Yolk)", "Toast"] },
                  { meal: "Lunch", foods: ["Large Chicken Breast Salad"] },
                  { meal: "Dinner", foods: ["Tuna Steak", "Asparagus"] },
                  { meal: "Snack", foods: ["Protein Bar"] },
              ],
          },
          {
              day: "Day 2: Weights Legs",
              exercises: [
                  { name: "Barbell Lunges", sets: 4, reps: 12, progress: 0 },
                  { name: "Box Squats", sets: 3, reps: 10, progress: 0 },
                  { name: "Hamstring Curls", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal", "Banana", "Honey"] },
                  { meal: "Lunch", foods: ["Pork Chops", "Mashed Potato"] },
                  { meal: "Dinner", foods: ["Baked Cod", "Sweet Potato"] },
                  { meal: "Snack", foods: ["Greek Yogurt"] },
              ],
          },
          {
              day: "Day 3: Calisthenics Pull",
              exercises: [
                  { name: "Weighted Pullups", sets: 4, reps: 8, progress: 0 },
                  { name: "Muscle-Up Progression", sets: 3, reps: 5, progress: 0 },
                  { name: "Australian Rows", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Shake", "Fruit"] },
                  { meal: "Lunch", foods: ["Quinoa Bowl with Beans"] },
                  { meal: "Dinner", foods: ["Steak", "Broccoli"] },
                  { meal: "Snack", foods: ["Almonds"] },
              ],
          },
          {
              day: "Day 4: Rest/Mobility",
              exercises: [
                  { name: "Joint Rotations", sets: 1, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Fruit Smoothie"] },
                  { meal: "Lunch", foods: ["Light Vegetable Soup"] },
                  { meal: "Dinner", foods: ["Chicken and Veggie Wrap"] },
                  { meal: "Snack", foods: ["Cottage Cheese"] },
              ],
          },
          {
              day: "Day 5: Weights Upper Body",
              exercises: [
                  { name: "Overhead Press", sets: 3, reps: 10, progress: 0 },
                  { name: "Dumbbell Bench Press", sets: 3, reps: 12, progress: 0 },
                  { name: "Barbell Curls", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Avocado Toast", "Eggs"] },
                  { meal: "Lunch", foods: ["Ground Beef and Rice"] },
                  { meal: "Dinner", foods: ["Shrimp Stir-Fry"] },
                  { meal: "Snack", foods: ["Gatorade", "Pretzels"] },
              ],
          },
          {
              day: "Day 6: Full Body Cardio & Core",
              exercises: [
                  { name: "Burpees (Timed)", sets: 3, reps: 60, progress: 0 },
                  { name: "Hanging Leg Raises", sets: 3, reps: 15, progress: 0 },
                  { name: "Sprints (Treadmill)", sets: 5, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Yogurt Parfait", "Granola"] },
                  { meal: "Lunch", foods: ["Large Whole Wheat Pasta Salad"] },
                  { meal: "Dinner", foods: ["Chicken Chili"] },
                  { meal: "Snack", foods: ["Apple", "Cheese"] },
              ],
          },
      ],
  },

  // 9. Plan: 7-Day Minimal Equipment (Home)
  {
      name: "7-Day Minimal Equipment (Home)",
      days: [
          {
              day: "Day 1: Upper Body Strength",
              exercises: [
                  { name: "Pushups (Varied Grip)", sets: 4, reps: 15, progress: 0 },
                  { name: "Door Frame Rows", sets: 4, reps: 15, progress: 0 },
                  { name: "Tricep Dips (Chair)", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Protein Powder"] },
                  { meal: "Lunch", foods: ["Chicken Wrap with Lettuce"] },
                  { meal: "Dinner", foods: ["Baked Tofu", "Roasted Root Veggies"] },
                  { meal: "Snack", foods: ["Carrots and Hummus"] },
              ],
          },
          {
              day: "Day 2: Lower Body Strength",
              exercises: [
                  { name: "Pistol Squat Progression", sets: 3, reps: 8, progress: 0 },
                  { name: "Glute Bridges (Weighted Backpack)", sets: 3, reps: 15, progress: 0 },
                  { name: "Calf Raises (Single Leg)", sets: 3, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Smoothie with Banana, Milk, Oats"] },
                  { meal: "Lunch", foods: ["Leftover Tofu and Veggies"] },
                  { meal: "Dinner", foods: ["Lentil Dal", "Brown Rice"] },
                  { meal: "Snack", foods: ["Apple Slices"] },
              ],
          },
          {
              day: "Day 3: Core & Cardio HIIT",
              exercises: [
                  { name: "Mountain Climbers (HIIT)", sets: 5, reps: 60, progress: 0 },
                  { name: "Russian Twists (Weighted)", sets: 3, reps: 20, progress: 0 },
                  { name: "Plank to Pushup", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs and Whole Wheat Toast"] },
                  { meal: "Lunch", foods: ["Tuna Sandwich"] },
                  { meal: "Dinner", foods: ["Quinoa Bowl with Chicken"] },
                  { meal: "Snack", foods: ["Energy Bar (Homemade)"] },
              ],
          },
          {
              day: "Day 4: Active Rest/Yoga",
              exercises: [
                  { name: "Sun Salutations (Yoga)", sets: 3, reps: 10, progress: 0 },
                  { name: "Walk/Jog Outdoors", sets: 1, reps: 45, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Fruit Salad with Yogurt"] },
                  { meal: "Lunch", foods: ["Large Greek Salad"] },
                  { meal: "Dinner", foods: ["Light Chicken Broth Soup"] },
                  { meal: "Snack", foods: ["Small handful of Nuts"] },
              ],
          },
          {
              day: "Day 5: Full Body Endurance",
              exercises: [
                  { name: "Burpee Challenge (Max Reps)", sets: 3, reps: 60, progress: 0 },
                  { name: "Air Squats", sets: 3, reps: 50, progress: 0 },
                  { name: "Lateral Bounds", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Cereal with Milk and Fruit"] },
                  { meal: "Lunch", foods: ["Turkey Sandwich", "Chips"] },
                  { meal: "Dinner", foods: ["Lean Ground Beef Chilli"] },
                  { meal: "Snack", foods: ["Protein Shake"] },
              ],
          },
          {
              day: "Day 6: Upper Body Endurance",
              exercises: [
                  { name: "Hindu Pushups", sets: 4, reps: 15, progress: 0 },
                  { name: "Table Rows", sets: 4, reps: 15, progress: 0 },
                  { name: "Diamond Pushups", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs Benedict (Homemade)"] },
                  { meal: "Lunch", foods: ["Tuna Salad with Crackers"] },
                  { meal: "Dinner", foods: ["Baked Chicken Thighs", "Sweet Potato"] },
                  { meal: "Snack", foods: ["Popcorn"] },
              ],
          },
          {
              day: "Day 7: Full Rest & Refuel",
              exercises: [
                  { name: "Deep Breathing Exercises", sets: 1, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Pancakes with Syrup"] },
                  { meal: "Lunch", foods: ["Cheeseburger (Treat Meal)"] },
                  { meal: "Dinner", foods: ["Large Bowl of Chicken Pasta"] },
                  { meal: "Snack", foods: ["Ice Cream (Small Treat)"] },
              ],
          },
      ],
  },

  // 10. Plan: 6-Day Bro Split (Classic Bodybuilding)
  {
      name: "6-Day Bro Split (Classic BB)",
      days: [
          {
              day: "Day 1: Chest",
              exercises: [
                  { name: "Barbell Bench Press", sets: 4, reps: 10, progress: 0 },
                  { name: "Incline Dumbbell Flyes", sets: 3, reps: 12, progress: 0 },
                  { name: "Cable Crossovers (Low)", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal, Banana, Cinnamon"] },
                  { meal: "Lunch", foods: ["Ground Turkey, Rice, Hot Sauce"] },
                  { meal: "Dinner", foods: ["Chicken Breast, Quinoa, Peas"] },
                  { meal: "Snack", foods: ["Protein Shake, Apple"] },
              ],
          },
          {
              day: "Day 2: Back",
              exercises: [
                  { name: "Barbell Rows", sets: 4, reps: 10, progress: 0 },
                  { name: "Lat Pulldowns (Wide Grip)", sets: 3, reps: 12, progress: 0 },
                  { name: "Deadlifts (Light)", sets: 3, reps: 8, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Egg Whites and Whole Wheat Bagel"] },
                  { meal: "Lunch", foods: ["Baked Cod, Broccoli"] },
                  { meal: "Dinner", foods: ["Lean Steak, Sweet Potato"] },
                  { meal: "Snack", foods: ["Cottage Cheese, Pineapple"] },
              ],
          },
          {
              day: "Day 3: Shoulders",
              exercises: [
                  { name: "Seated Dumbbell Press", sets: 4, reps: 10, progress: 0 },
                  { name: "Side Lateral Raises", sets: 3, reps: 15, progress: 0 },
                  { name: "Rear Delt Flyes (Machine)", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Powder, Milk, Banana"] },
                  { meal: "Lunch", foods: ["Tuna Salad, Whole Grain Crackers"] },
                  { meal: "Dinner", foods: ["Chicken Fajitas (No Cheese)"] },
                  { meal: "Snack", foods: ["Rice Cakes, Peanut Butter"] },
              ],
          },
          {
              day: "Day 4: Arms (Biceps & Triceps)",
              exercises: [
                  { name: "Preacher Curls", sets: 3, reps: 12, progress: 0 },
                  { name: "Overhead Tricep Extension", sets: 3, reps: 12, progress: 0 },
                  { name: "Hammer Curls", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Waffles with Yogurt and Berries"] },
                  { meal: "Lunch", foods: ["Leftover Chicken Fajitas"] },
                  { meal: "Dinner", foods: ["Pork Tenderloin, Green Beans"] },
                  { meal: "Snack", foods: ["Grapes, Cheese Stick"] },
              ],
          },
          {
              day: "Day 5: Legs (Quads Focus)",
              exercises: [
                  { name: "Leg Press (Heavy)", sets: 4, reps: 10, progress: 0 },
                  { name: "Leg Extensions", sets: 3, reps: 15, progress: 0 },
                  { name: "Walking Lunges (Dumbbells)", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs and Avocado Toast"] },
                  { meal: "Lunch", foods: ["Large Pasta with Chicken"] },
                  { meal: "Dinner", foods: ["Fish and Chips (Baked)"] },
                  { meal: "Snack", foods: ["Protein Bar, Water"] },
              ],
          },
          {
              day: "Day 6: Legs (Hamstring/Calf Focus)",
              exercises: [
                  { name: "Romanian Deadlifts", sets: 4, reps: 10, progress: 0 },
                  { name: "Lying Leg Curls", sets: 3, reps: 15, progress: 0 },
                  { name: "Seated Calf Raises", sets: 4, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal, Protein Powder, Berries"] },
                  { meal: "Lunch", foods: ["Chicken Salad on Pita Bread"] },
                  { meal: "Dinner", foods: ["Steak, Quinoa, Salad"] },
                  { meal: "Snack", foods: ["Peanut Butter Pretzels"] },
              ],
          },
      ],
  },

  // 11. Plan: 5-Day Kettlebell-Only HIIT
  {
      name: "5-Day Kettlebell-Only HIIT",
      days: [
          {
              day: "Day 1: Full Body Blast",
              exercises: [
                  { name: "Kettlebell Swings", sets: 5, reps: 20, progress: 0 },
                  { name: "Kettlebell Goblet Squat", sets: 3, reps: 15, progress: 0 },
                  { name: "Pushups (KB Handles)", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Smoothie (Milk, Protein, Banana)"] },
                  { meal: "Lunch", foods: ["Chicken and Veggie Stir-fry"] },
                  { meal: "Dinner", foods: ["Black Bean Burgers", "Salad"] },
                  { meal: "Snack", foods: ["Handful of Walnuts"] },
              ],
          },
          {
              day: "Day 2: Core & Conditioning",
              exercises: [
                  { name: "KB Russian Twists", sets: 3, reps: 20, progress: 0 },
                  { name: "KB Halos", sets: 3, reps: 10, progress: 0 },
                  { name: "KB Suitcase Carry", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Scrambled Eggs (2)", "Avocado Slices"] },
                  { meal: "Lunch", foods: ["Large Salad with Tuna"] },
                  { meal: "Dinner", foods: ["Chicken Soup with Brown Rice"] },
                  { meal: "Snack", foods: ["Apple Slices with Cottage Cheese"] },
              ],
          },
          {
              day: "Day 3: Rest/Yoga",
              exercises: [
                  { name: "Gentle Stretching", sets: 1, reps: 30, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Greek Yogurt, Berries, Honey"] },
                  { meal: "Lunch", foods: ["Vegetable Pizza (Whole Wheat Crust)"] },
                  { meal: "Dinner", foods: ["Shrimp and Quinoa"] },
                  { meal: "Snack", foods: ["Trail Mix"] },
              ],
          },
          {
              day: "Day 4: Upper Body",
              exercises: [
                  { name: "KB Clean and Press", sets: 4, reps: 8, progress: 0 },
                  { name: "KB Renegade Rows", sets: 3, reps: 10, progress: 0 },
                  { name: "KB Floor Press", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Peanut Butter"] },
                  { meal: "Lunch", foods: ["Leftover Shrimp and Quinoa"] },
                  { meal: "Dinner", foods: ["Lean Ground Beef Tacos"] },
                  { meal: "Snack", foods: ["Banana and Protein Bar"] },
              ],
          },
          {
              day: "Day 5: Lower Body & Cardio",
              exercises: [
                  { name: "KB Single-Leg Deadlift", sets: 3, reps: 10, progress: 0 },
                  { name: "KB Front Rack Reverse Lunges", sets: 3, reps: 12, progress: 0 },
                  { name: "KB High Pulls (Metcon)", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Toast with Eggs and Cheese"] },
                  { meal: "Lunch", foods: ["Large Chicken Wrap"] },
                  { meal: "Dinner", foods: ["Baked Salmon, Brown Rice, Spinach"] },
                  { meal: "Snack", foods: ["Protein Shake (Post-Workout)"] },
              ],
          },
      ],
  },

  // 12. Plan: 6-Day Powerlifting Focus
  {
      name: "6-Day Powerlifting Focus",
      days: [
          {
              day: "Day 1: Heavy Squat & Light Bench",
              exercises: [
                  { name: "Barbell Squat (Heavy)", sets: 5, reps: 3, progress: 0 },
                  { name: "Leg Press (Accessory)", sets: 3, reps: 10, progress: 0 },
                  { name: "Incline Dumbbell Press (Light)", sets: 3, reps: 10, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Large Bowl of Cereal with Milk"] },
                  { meal: "Lunch", foods: ["Chicken and Sweet Potato Mash"] },
                  { meal: "Dinner", foods: ["Steak (Ribeye), White Rice"] },
                  { meal: "Snack", foods: ["Intra-Workout Carbs (Gatorade)"] },
              ],
          },
          {
              day: "Day 2: Heavy Bench & Light Deadlift",
              exercises: [
                  { name: "Barbell Bench Press (Heavy)", sets: 5, reps: 3, progress: 0 },
                  { name: "Dumbbell Row (Heavy)", sets: 3, reps: 8, progress: 0 },
                  { name: "Sumo Deadlift (Speed Work)", sets: 5, reps: 1, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Bacon, Eggs, Pancakes"] },
                  { meal: "Lunch", foods: ["Turkey Meatballs with Pasta"] },
                  { meal: "Dinner", foods: ["Baked Fish, Quinoa, Asparagus"] },
                  { meal: "Snack", foods: ["Pre-Workout Snack (Banana)"] },
              ],
          },
          {
              day: "Day 3: Rest/Active Recovery",
              exercises: [
                  { name: "Walking", sets: 1, reps: 60, progress: 0 },
                  { name: "Deep Tissue Massage/Foam Roll", sets: 1, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Shake, Berries, Oats"] },
                  { meal: "Lunch", foods: ["Leftover Pasta"] },
                  { meal: "Dinner", foods: ["Lentil Soup, Rolls"] },
                  { meal: "Snack", foods: ["Fruit and Yogurt"] },
              ],
          },
          {
              day: "Day 4: Moderate Squat & Back Volume",
              exercises: [
                  { name: "Pause Squats (Moderate)", sets: 4, reps: 5, progress: 0 },
                  { name: "Hamstring Curls (Heavy)", sets: 3, reps: 10, progress: 0 },
                  { name: "Lat Pulldowns (Volume)", sets: 4, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Cream of Wheat, Protein Powder"] },
                  { meal: "Lunch", foods: ["Chicken and Rice (Large Meal)"] },
                  { meal: "Dinner", foods: ["Lean Ground Beef, Pasta, Sauce"] },
                  { meal: "Snack", foods: ["Grapes and Cheese"] },
              ],
          },
          {
              day: "Day 5: Moderate Bench & Shoulders",
              exercises: [
                  { name: "Spoto Press (Moderate)", sets: 4, reps: 6, progress: 0 },
                  { name: "Overhead Press (Dumbbell)", sets: 3, reps: 10, progress: 0 },
                  { name: "Triceps Pushdowns (Volume)", sets: 4, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Eggs and Whole Grain Cereal"] },
                  { meal: "Lunch", foods: ["Tuna and Mayo Sandwich"] },
                  { meal: "Dinner", foods: ["Pork Chops, Mashed Potato, Green Beans"] },
                  { meal: "Snack", foods: ["Protein Bar, Water"] },
              ],
          },
          {
              day: "Day 6: Heavy Deadlift & Deload",
              exercises: [
                  { name: "Deadlift (Heavy)", sets: 1, reps: 5, progress: 0 },
                  { name: "Leg Extensions (Light)", sets: 2, reps: 15, progress: 0 },
                  { name: "Abdominal Crunches", sets: 3, reps: 20, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Protein Pancake, Bacon"] },
                  { meal: "Lunch", foods: ["Leftover Pork Chops"] },
                  { meal: "Dinner", foods: ["Chicken Wings, Salad"] },
                  { meal: "Snack", foods: ["Smoothie"] },
              ],
          },
      ],
  },

  // 13. Plan: 5-Day Vegan Full Body
  {
      name: "5-Day Vegan Full Body",
      days: [
          {
              day: "Day 1: Full Body Strength",
              exercises: [
                  { name: "Barbell Squats", sets: 4, reps: 10, progress: 0 },
                  { name: "Dumbbell Bench Press", sets: 3, reps: 12, progress: 0 },
                  { name: "Lat Pulldown (Cable)", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Tofu Scramble, Whole Grain Toast"] },
                  { meal: "Lunch", foods: ["Large Lentil Soup, Bread"] },
                  { meal: "Dinner", foods: ["Black Bean Tacos, Salsa"] },
                  { meal: "Snack", foods: ["Vegan Protein Shake, Banana"] },
              ],
          },
          {
              day: "Day 2: Core & Cardio",
              exercises: [
                  { name: "Running (Steady State)", sets: 1, reps: 40, progress: 0 },
                  { name: "Leg Raises", sets: 3, reps: 15, progress: 0 },
                  { name: "Plank", sets: 3, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Oatmeal with Almond Milk and Berries"] },
                  { meal: "Lunch", foods: ["Chickpea Salad Sandwich"] },
                  { meal: "Dinner", foods: ["Vegetable Curry, Brown Rice"] },
                  { meal: "Snack", foods: ["Apple, Almond Butter"] },
              ],
          },
          {
              day: "Day 3: Rest/Flexibility",
              exercises: [
                  { name: "Vinyasa Yoga Class", sets: 1, reps: 60, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Fruit and Nut Smoothie"] },
                  { meal: "Lunch", foods: ["Large Vegan Ceasar Salad"] },
                  { meal: "Dinner", foods: ["Roasted Root Vegetables, Tofu"] },
                  { meal: "Snack", foods: ["Edamame"] },
              ],
          },
          {
              day: "Day 4: Full Body Strength II",
              exercises: [
                  { name: "Romanian Deadlifts (Dumbbell)", sets: 4, reps: 10, progress: 0 },
                  { name: "Overhead Press (Dumbbell)", sets: 3, reps: 12, progress: 0 },
                  { name: "Cable Rows", sets: 3, reps: 12, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Vegan Waffles, Syrup, Fruit"] },
                  { meal: "Lunch", foods: ["Leftover Curry"] },
                  { meal: "Dinner", foods: ["Pasta with Vegan Meat Sauce"] },
                  { meal: "Snack", foods: ["Protein Bar (Vegan)"] },
              ],
          },
          {
              day: "Day 5: HIIT & Accessories",
              exercises: [
                  { name: "Jump Squats (HIIT)", sets: 5, reps: 15, progress: 0 },
                  { name: "Burpees (Timed)", sets: 3, reps: 60, progress: 0 },
                  { name: "Bicep Curls (Dumbbell)", sets: 3, reps: 15, progress: 0 },
              ],
              diet: [
                  { meal: "Breakfast", foods: ["Avocado Toast (Whole Grain)"] },
                  { meal: "Lunch", foods: ["Vegan Stir-Fry with Noodles"] },
                  { meal: "Dinner", foods: ["Vegan Chili"] },
                  { meal: "Snack", foods: ["Nuts and Dried Fruit"] },
              ],
          },
      ],
  },
];

// ... (Your existing logic continues below this array)
        
        
      

      const randomIndex = Math.floor(Math.random() * plans.length);
      setCurrentPlan(plans[randomIndex]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { currentPlan, setCurrentPlan, isLoading };

};

// --------------------- SHOP COMPONENT ---------------------

// --------------------- MAIN PROFILE PAGE ---------------------
export default function ProfilePage() {
  const { user } = useUser();
  const { currentPlan, setCurrentPlan, isLoading } = useFitnessPlan();
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState<UserDetails | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab] = useState<'profile' | 'shop'>('profile');
  

  useEffect(() => {
    if (user?.id) {
      uploadRandomPlan(user.id);
    }
  }, [user]);
  // Load or create user data in Firestore
  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", user.id);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          setEditableDetails(snapshot.data() as UserDetails);
        } else {
          const newDetails: UserDetails = {
            dob: "2006-12-30",
            email: user.emailAddresses[0]?.emailAddress || "N/A",
            height: "170 cm",
            weight: "60 kg",
            nickname: user.firstName || "User",
            exerciseLevel: "Beginner",
          };
          await setDoc(userRef, newDetails);
          setEditableDetails(newDetails);
        }
      } catch (error) {
        toast.error("Failed to load user data.");
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [user]);

  const handleSaveDetails = useCallback(async () => {
    if (!user || !editableDetails) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.id), editableDetails);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save changes.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [user, editableDetails]);

  const updateExerciseProgress = useCallback(async (dayIndex: number, exerciseIndex: number, newProgress: number) => {
    if (!currentPlan || !user) return;
    const updatedPlan = { ...currentPlan };
    updatedPlan.days[dayIndex].exercises[exerciseIndex].progress = Math.min(100, Math.max(0, newProgress));
    setCurrentPlan(updatedPlan);
    // Optionally save to Firestore
    try {
      await updateDoc(doc(db, "users", user.id), { fitnessPlan: updatedPlan });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }, [setCurrentPlan, user]);

  const age = useMemo(() => {
    if (!editableDetails?.dob) return 0;
    const birthDate = new Date(editableDetails.dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [editableDetails?.dob]);

  const overallProgress = useMemo(() => {
    if (!currentPlan) return 0;
    const totalExercises = currentPlan.days.flatMap(d => d.exercises).length;
    const totalProgress = currentPlan.days.flatMap(d => d.exercises).reduce((sum, ex) => sum + ex.progress, 0);
    return totalExercises > 0 ? Math.round(totalProgress / totalExercises) : 0;
  }, [currentPlan]);

  if (!user) return <p className="text-center mt-10">Please log in to view your profile.</p>;
  if (loadingUser || !editableDetails) return <div className="flex justify-center mt-10"><ClipLoader size={40} color="#3b82f6" /></div>;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4 max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <ProfileHeader user={user} />

      {/* Tabs for Profile and Shop */}
      
      {activeTab === 'profile' && (
        <>
          {/* User Details */}
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 mt-6 transition-all duration-300 hover:shadow-lg">
            <CornerElements />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">User Details</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="text-blue-500 hover:text-blue-700 transition-colors">
                <Edit size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Full Name:</strong> {user.firstName} {user.lastName || ""}</div>
              <div>
                <strong>Nickname:</strong>{" "}
                {isEditing ? (
                  <input
                    value={editableDetails.nickname}
                    onChange={e => setEditableDetails({ ...editableDetails, nickname: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Enter nickname"
                  />
                ) : editableDetails.nickname}
              </div>
              <div><strong>Email:</strong> {editableDetails.email}</div>
              <div>
                <strong>Date of Birth:</strong>{" "}
                {isEditing ? (
                  <input
                    type="date"
                    value={editableDetails.dob}
                    onChange={e => setEditableDetails({ ...editableDetails, dob: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : editableDetails.dob}
              </div>
              <div><strong>Age:</strong> {age}</div>
              <div>
                <strong>Height:</strong>{" "}
                {isEditing ? (
                  <input
                    value={editableDetails.height}
                    onChange={e => setEditableDetails({ ...editableDetails, height: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="e.g., 170 cm"
                  />
                ) : editableDetails.height}
              </div>
              <div>
                <strong>Weight:</strong>{" "}
                {isEditing ? (
                  <input
                    value={editableDetails.weight}
                    onChange={e => setEditableDetails({ ...editableDetails, weight: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="e.g., 60 kg"
                  />
                ) : editableDetails.weight}
              </div>
              <div>
                <strong>Exercise Level:</strong>{" "}
                {isEditing ? (
                  <select
                    value={editableDetails.exerciseLevel}
                    onChange={e => setEditableDetails({ ...editableDetails, exerciseLevel: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                ) : editableDetails.exerciseLevel}
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {saving ? <ClipLoader size={16} color="#fff" /> : <Save size={16} />} Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Fitness Plan */}
          {isLoading ? (
            <div className="flex justify-center mt-8"><ClipLoader size={50} color="#3b82f6" /></div>
          ) : currentPlan ? (
            <div className="relative backdrop-blur-sm border border-border rounded-lg p-6 mt-8 transition-all duration-300 hover:shadow-lg">
              <CornerElements />
              <h3 className="text-lg font-bold mb-4">{currentPlan.name}</h3>
              <div className="flex justify-center mb-6 relative">
                <PieChart width={128} height={208}>
                  <Pie data={[
                    { name: "Completed", value: overallProgress, color: "#3b82f6" },
                    { name: "Remaining", value: 100 - overallProgress, color: "#e5e7eb" },
                  ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                    <Cell fill="#3b82f6" /><Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
                <div className="absolute text-sm font-semibold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{overallProgress}%</div>
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {currentPlan.days.map((day, i) => (
                  <AccordionItem key={i} value={`day-${i}`}>
                    <AccordionTrigger className="flex items-center gap-2"><Dumbbell size={16} /> {day.day}</AccordionTrigger>
                    <AccordionContent>
                      {day.exercises.map((ex, ei) => (
                        <div key={ei} className="mb-3">
                          <strong>{ex.name}</strong> - {ex.sets}x{ex.reps}
                          <div className="h-2 bg-gray-200 rounded-full mt-1 cursor-pointer" onClick={() => updateExerciseProgress(i, ei, ex.progress + 10)}>
                            <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${ex.progress}%` }} />
                          </div>
                          <small className="text-gray-500">Click to update progress</small>
                        </div>
                      ))}
                      {day.diet.map((d, di) => (
                        <div key={di} className="mt-3">
                          <strong><Utensils className="inline-block mr-2" size={14} />{d.meal}:</strong> {d.foods.join(", ")}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : <NoFitnessPlan />}
        </>
      )}

     
    </section>
  );
}
