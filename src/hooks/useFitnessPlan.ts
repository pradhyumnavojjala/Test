"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase-config";

export const useFitnessPlan = () => {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const snapshot = await getDocs(collection(db, "fitnessPlans"));
      const plans = snapshot.docs.map((doc) => doc.data());
      if (plans.length > 0) {
        const randomIndex = Math.floor(Math.random() * plans.length);
        setCurrentPlan(plans[randomIndex]);
      }
      setIsLoading(false);
    };
    fetchPlans();
  }, []);

  return { currentPlan, setCurrentPlan, isLoading };
};
