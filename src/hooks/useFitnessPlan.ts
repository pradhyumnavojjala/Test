// ./src/hooks/useFitnessPlan.ts

"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore"; // Import DocumentData for clarity
import { db } from "@/firebase-config";

// --- Type Definitions (Based on previous context) ---

// Define the shape of an exercise item
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  progress: number;
}

// Define the shape of a meal item
interface Meal {
  meal: string;
  foods: string[];
}

// Define the shape of a day within the plan
interface Day {
  day: string;
  exercises: Exercise[];
  diet: Meal[];
}

// Define the shape of the main FitnessPlan object
export interface FitnessPlan {
  name: string;
  days: Day[];
  // Include other top-level fields found in your Firestore document here
  [key: string]: any; // Allows for flexible DocumentData fields like Firestore IDs if needed
}

// Define the explicit return type for the hook
interface UseFitnessPlanResult {
  currentPlan: FitnessPlan | null;
  isLoading: boolean;
  setCurrentPlan: React.Dispatch<React.SetStateAction<FitnessPlan | null>>;
}

// ----------------------------------------------------

export const useFitnessPlan = (): UseFitnessPlanResult => { // <-- FIX: Explicitly defined return type
  // FIX: Replaced <any> with <FitnessPlan | null>
  const [currentPlan, setCurrentPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await getDocs(collection(db, "fitnessPlans"));
        
        // Map Firestore DocumentData to the FitnessPlan interface
        const plans: FitnessPlan[] = snapshot.docs.map((doc) => {
          // You must explicitly cast the Firestore data to your type
          return doc.data() as FitnessPlan; 
        });
        
        if (plans.length > 0) {
          const randomIndex = Math.floor(Math.random() * plans.length);
          setCurrentPlan(plans[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching fitness plans:", error);
        // Handle error state if necessary
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return { currentPlan, setCurrentPlan, isLoading };
};