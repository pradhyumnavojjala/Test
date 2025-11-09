// src/app/DietInfo/page.tsx

"use client";

import { useUser } from "@clerk/nextjs";
import ProfileHeader from "@/Components/ProfileHeader";
import CornerElements from "@/Components/CornerElements";
// Import all necessary icons
import { Zap, AppleIcon, DumbbellIcon, Calculator, BookOpen, Printer, Lightbulb, HelpCircle, ArrowUp, Scale, Heart, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Button } from "@/Components/ui/button";
import { useState, useEffect, useMemo } from "react";

// --- EXPANDED DEMO DATA CONSTANTS ---

// 1. NUTRITION GUIDE
const NutritionGuide = [
  {
    category: "Macronutrients",
    icon: AppleIcon,
    description: "Breakdown of carbs, proteins, and fats for balanced energy.",
    examples: ["Carbs: 45-65% (Primary fuel)", "Proteins: 10-35% (Muscle repair)", "Fats: 20-35% (Hormone support)"],
    key_tip: "Balance macros based on your goals—e.g., higher protein and lower carbs for cutting.",
  },
  {
    category: "Hydration & Water",
    icon: Scale,
    description: "Essential for metabolism, temperature regulation, and joint lubrication.",
    examples: ["Drink 2.5 - 3.7 liters daily", "Increase intake during exercise", "Water aids nutrient transport"],
    key_tip: "Carry a reusable bottle and sip continuously, don't wait until you're thirsty.",
  },
  {
    category: "Micronutrients",
    icon: Heart,
    description: "Vitamins and minerals crucial for cellular function and disease prevention.",
    examples: ["Vitamins (A, B, C, D, E, K)", "Minerals (Iron, Calcium, Zinc)", "Found in diverse fruits/veggies"],
    key_tip: "Aim for a 'rainbow' of colors in your diet to ensure broad nutrient coverage.",
  },
];

// 2. CALORIE BASICS
const CalorieBasics = [
  {
    term: "Basal Metabolic Rate (BMR)",
    definition: "The minimum calories your body needs to maintain vital functions while at complete rest (breathing, circulation).",
  },
  {
    term: "Total Daily Energy Expenditure (TDEE)",
    definition: "BMR multiplied by your activity level. This is the total calories you burn in a day.",
  },
  {
    term: "Calorie Deficit",
    definition: "Consuming fewer calories than your TDEE (required for weight loss). Typically 500 calories less per day.",
  },
  {
    term: "Calorie Surplus",
    definition: "Consuming more calories than your TDEE (required for muscle gain/bulking). Typically 250-500 calories more per day.",
  },
];

// 3. EQUIPMENT GUIDE
const EquipmentGuide = [
  {
    item: "Resistance Bands",
    purpose: "For strength training, mobility work, and adding progressive overload to bodyweight exercises.",
    notes: "Portable and versatile; start with light resistance and progress to heavier bands.",
  },
  {
    item: "Adjustable Dumbbells",
    purpose: "Provides a wide weight range in a small footprint, ideal for progressive strength training.",
    notes: "A great investment for home gyms. Crucial for upper and lower body accessory lifts.",
  },
  {
    item: "Yoga Mat",
    purpose: "Provides cushioning and grip for floor work, core exercises, and stretching/yoga.",
    notes: "Essential for comfort and protecting joints during planks and situps.",
  },
  {
    item: "Pull-Up Bar (Doorway)",
    purpose: "Allows for effective back and biceps training (pulling movements) at home.",
    notes: "Check doorframe compatibility and always secure it properly before use.",
  },
];

// 4. NEW: TRAINING PRINCIPLES GUIDE
const TrainingPrinciples = [
    {
        principle: "Progressive Overload",
        icon: ArrowUp,
        description: "Gradually increasing the stress placed on the musculoskeletal system to force adaptation and growth.",
        examples: ["Increase weight (most common)", "Increase reps/sets", "Reduce rest time", "Improve range of motion"],
    },
    {
        principle: "Specificity",
        icon: Shield,
        description: "Training must be relevant to the desired outcome. You get what you train for (SAID Principle).",
        examples: ["Want to run faster? Do speed work.", "Want to lift heavier? Train with heavy compound lifts."],
    },
    {
        principle: "Recovery & Deload",
        icon: Heart,
        description: "Adequate rest and planned periods of reduced training volume are essential to prevent injury and burnout.",
        examples: ["Aim for 7-9 hours of sleep", "Take a deload week every 6-8 weeks", "Prioritize active recovery"],
    },
];


const StaticInfoPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("nutrition");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State for the Calculator
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // --- FEATURE 1: BMR/TDEE CALCULATION LOGIC ---
  const calculateBMR = useMemo(() => {
    // Using the Revised Harris-Benedict Equation for a generic male estimate
    // BMR = 88.362 + (13.397 x W) + (4.799 x H) - (5.677 x A)
    if (weight > 0 && height > 0 && age > 0) {
        // Calculation is simple for demo, assume male for formula constants
        const calculatedBMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        const roundedBMR = Math.round(calculatedBMR);
        setBmr(roundedBMR);
        // Default TDEE multiplier (e.g., 1.55 for moderate exercise 3-5 times/week)
        setTdee(Math.round(roundedBMR * 1.55));
        return roundedBMR;
    }
    return 0;
  }, [age, weight, height]);


  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4 bg-gradient-to-br from-background via-muted/10 to-primary/5 min-h-screen">
      <ProfileHeader user={user} />
      
      <div className="relative backdrop-blur-sm border border-border rounded-xl p-8 space-y-10 shadow-2xl bg-card/95 animate-fadeIn">
        <CornerElements />

        {/* --- PAGE HEADER --- */}
        <div className="flex items-center justify-between border-b border-border/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full shadow-lg">
              <Zap className="size-8 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Fitness Reference Library
              </h2>
              <p className="text-muted-foreground mt-1">Comprehensive guides, tips, and tools for your fitness journey</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2 hover:bg-primary/10 transition-colors">
            <Printer className="size-4" /> Print Guide
          </Button>
        </div>

        {/* --- QUICK SIDEBAR --- */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-card/90 border border-border rounded-lg p-4 shadow-lg hidden lg:block animate-fadeIn delay-200">
          <h4 className="text-sm font-semibold mb-3 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#nutrition" className="hover:text-primary transition-colors">Nutrition</a></li>
            <li><a href="#calories" className="hover:text-primary transition-colors">Calories</a></li>
            <li><a href="#training" className="hover:text-primary transition-colors">Training</a></li> {/* Added link */}
            <li><a href="#equipment" className="hover:text-primary transition-colors">Equipment</a></li>
          </ul>
        </div>

        {/* --- TABS --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-fit mx-auto border border-border/50 rounded-lg p-1 bg-muted/50 shadow-sm overflow-x-auto">
            <TabsTrigger value="nutrition" className="flex items-center gap-2 px-4 py-3 transition-all hover:bg-primary/10 hover:scale-105 min-w-[150px]">
              <AppleIcon className="size-4" /> Nutrition Guide
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2 px-4 py-3 transition-all hover:bg-primary/10 hover:scale-105 min-w-[150px]">
              <Calculator className="size-4" /> Calorie Basics
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2 px-4 py-3 transition-all hover:bg-primary/10 hover:scale-105 min-w-[150px]">
              <DumbbellIcon className="size-4" /> Training Principles
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2 px-4 py-3 transition-all hover:bg-primary/10 hover:scale-105 min-w-[150px]">
              <Lightbulb className="size-4" /> Equipment Guide
            </TabsTrigger>
          </TabsList>

          {/* =======================
             NUTRITION TAB CONTENT 
             ======================= */}
          <TabsContent value="nutrition" className="space-y-8 pt-6 animate-fadeIn" id="nutrition">
            <div className="flex items-center gap-3">
              <BookOpen className="size-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary border-b border-primary/30 pb-1">
                Core Nutritional Pillars
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed to 3 columns */}
              {NutritionGuide.map((item, index) => (
                <div
                  key={index}
                  className="border border-border p-6 rounded-xl bg-background/50 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:glow-primary"
                  title={`Learn more about ${item.category}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <item.icon className="size-5 text-green-500" />
                    </div>
                    <h4 className="text-lg font-mono font-semibold text-foreground">{item.category}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed h-12 overflow-hidden">{item.description}</p>
                  <p className="text-xs font-mono text-primary/70 mb-2">Examples:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mb-4 space-y-1">
                    {item.examples.map((ex, exIndex) => (
                      <li key={exIndex}>{ex}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-bold text-yellow-500 border-t border-border/50 pt-3 flex items-center gap-2">
                    <Lightbulb className="size-3" /> Tip: {item.key_tip}
                  </div>
                </div>
              ))}
            </div>
            {/* Additional Section: Meal Planning */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="text-xl font-semibold mb-4 text-primary">Meal Planning Tips</h4>
              <p className="text-sm text-muted-foreground mb-4">Plan balanced meals to fuel your workouts. Aim for variety and portion control.</p>
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">Sample Meal Plan</summary>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Breakfast: **Oatmeal** with fruits and nuts</li>
                  <li>Lunch: Grilled **chicken salad** (protein/fiber combo)</li>
                  <li>Dinner: **Quinoa** with roasted veggies and chickpeas (vegan option)</li>
                  <li>Post-Workout: **Whey/Plant-based shake** and a simple carb.</li>
                </ul>
              </details>
              <p className="text-xs text-primary/70">Did You Know? Consistent meal timing can improve energy levels and digestion!</p>
            </div>
          </TabsContent>

          {/* =======================
             CALORIE BASICS TAB CONTENT 
             ======================= */}
          <TabsContent value="calories" className="space-y-8 pt-6 animate-fadeIn" id="calories">
            <div className="flex items-center gap-3">
              <Calculator className="size-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary border-b border-primary/30 pb-1">
                Calorie & Energy Fundamentals
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Changed to 4 columns */}
              {CalorieBasics.map((item, index) => (
                <div
                  key={index}
                  className="border border-border p-6 rounded-xl bg-background/50 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:glow-primary"
                  title={`Definition of ${item.term}`}
                >
                  <h4 className="text-lg font-mono font-semibold mb-3 text-foreground">{item.term}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
            {/* --- FEATURE 2: INTERACTIVE CALORIE CALCULATOR --- */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="text-xl font-semibold mb-4 text-primary">BMR/TDEE Calculator (Demo)</h4>
              <p className="text-sm text-muted-foreground mb-4">Estimate your daily needs. (Note: Consult a professional for accuracy. **BMR formula is simplified**.)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                    type="number" 
                    placeholder="Age" 
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="p-2 border rounded text-foreground bg-input" 
                />
                <input 
                    type="number" 
                    placeholder="Weight (kg)" 
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="p-2 border rounded text-foreground bg-input" 
                />
                <input 
                    type="number" 
                    placeholder="Height (cm)" 
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="p-2 border rounded text-foreground bg-input" 
                />
              </div>
              <div className="mt-4 p-4 border border-primary/30 rounded-lg bg-card/70">
                <p className="text-sm font-medium">Calculated BMR: <span className="font-bold text-lg text-primary">{bmr.toLocaleString()}</span> Calories</p>
                <p className="text-sm font-medium">Estimated TDEE: <span className="font-bold text-lg text-primary">{tdee.toLocaleString()}</span> Calories (Moderate Activity)</p>
                <p className="text-xs text-muted-foreground mt-1">Goal Examples (Based on TDEE): **Loss: {tdee > 500 ? tdee - 500 : 0} | Gain: {tdee + 300}**</p>
              </div>
            </div>
            {/* FAQs */}
            <details className="mt-6">
              <summary className="cursor-pointer text-lg font-medium hover:text-primary flex items-center gap-2">
                <HelpCircle className="size-4" /> FAQs
              </summary>
              <ul className="mt-4 space-y-2 text-sm">
                <li><strong>How to track calories?</strong> Use apps like MyFitnessPal or HealthifyMe to log food intake accurately.</li>
                <li><strong>Are all calories equal?</strong> No, while energy is the same, 500 calories of spinach provides more nutrients than 500 calories of candy.</li>
              </ul>
            </details>
          </TabsContent>
          
          {/* =======================
             NEW TAB: TRAINING PRINCIPLES CONTENT 
             ======================= */}
          <TabsContent value="training" className="space-y-8 pt-6 animate-fadeIn" id="training">
            <div className="flex items-center gap-3">
              <DumbbellIcon className="size-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary border-b border-primary/30 pb-1">
                Core Training & Adaptation Principles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TrainingPrinciples.map((item, index) => (
                <div
                  key={index}
                  className="border border-border p-6 rounded-xl bg-background/50 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:glow-primary"
                  title={`Principle: ${item.principle}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                      <item.icon className="size-5 text-purple-500" />
                    </div>
                    <h4 className="text-lg font-mono font-semibold text-foreground">{item.principle}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed h-12 overflow-hidden">{item.description}</p>
                  <p className="text-xs font-mono text-primary/70 mb-2">How to Apply:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mb-4 space-y-1">
                    {item.examples.map((ex, exIndex) => (
                      <li key={exIndex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Additional Section: Warmup/Cooldown */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="text-xl font-semibold mb-4 text-primary">Pre/Post Workout Routine</h4>
              <p className="text-sm text-muted-foreground mb-4">A proper routine maximizes performance and minimizes injury risk.</p>
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">Dynamic Warm-up (Pre-Workout)</summary>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Arm Circles & Swings</li>
                  <li>Leg Swings & High Knees</li>
                  <li>Bodyweight Squats (Light)</li>
                </ul>
              </details>
               <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">Static Cooldown (Post-Workout)</summary>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Hamstring Stretch</li>
                  <li>Triceps Stretch</li>
                  <li>Pectoral Stretch</li>
                </ul>
              </details>
            </div>
          </TabsContent>


          {/* =======================
             EQUIPMENT TAB CONTENT 
             ======================= */}
          <TabsContent value="equipment" className="space-y-8 pt-6 animate-fadeIn" id="equipment">
            <div className="flex items-center gap-3">
              <Lightbulb className="size-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary border-b border-primary/30 pb-1">
                Essential Home Workout Gear
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Changed to 4 columns */}
              {EquipmentGuide.map((item, index) => (
                <div
                  key={index}
                  className="border border-border p-6 rounded-xl bg-background/50 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:glow-primary"
                  title={`Details on ${item.item}`}
                >
                  <h4 className="text-lg font-mono font-semibold mb-3 text-foreground">{item.item}</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed h-12 overflow-hidden">
                    <strong>Purpose:</strong> {item.purpose}
                  </p>
                  <p className="text-xs font-mono text-primary/70 leading-relaxed">
                    <strong>Notes:</strong> {item.notes}
                  </p>
                </div>
              ))}
            </div>
            {/* Additional Section: Safety & Alternatives */}
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="text-xl font-semibold mb-4 text-primary">Safety Tips & Alternatives</h4>
              <p className="text-sm text-muted-foreground mb-4">Always warm up and use proper form to avoid injury.</p>
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">Bodyweight Alternatives</summary>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>**Dips (Chairs)** instead of tricep extensions</li>
                  <li>**Backpack Rows** instead of dumbbell rows</li>
                  <li>**Pistol Squat Progressions** for advanced leg work</li>
                </ul>
              </details>
              <p className="text-xs text-primary/70">Did You Know? Focusing on **perfect form** with lighter weight is always safer and more effective than lifting heavy with poor form!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 rounded-full p-3 shadow-lg animate-bounce z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="size-4" />
        </Button>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground space-y-2">
        <p>Powered by CodeFlex AI | © 2023 All Rights Reserved</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </footer>
    </section>
  );
};

export default StaticInfoPage;