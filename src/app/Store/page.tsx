// src/app/Store/page.tsx

"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import Image from "next/image"; // <--- NEW: Import Image

// Note: The w-50 class you used is non-standard Tailwind. 
// Assuming w-50 is roughly a fixed width (e.g., 200px or 256px) 
// and h-80 is 320px. We'll use fixed dimensions here.

const products = [
  // ... (products array remains the same)
  {
    id: "p1",
    name: "Optimum Nutrition 100% Whey (2.29kg)",
    price: 4999,
    image: "2.jpg"
  },
  {
    id: "p2",
    name: "Hybrid Essential Whey Protein (2kg)",
    price: 2999,
    image: "1.jpg",
  },
  {
    id: "p3",
    name: "Mega Grow Whey Isolate (1kg + Shaker)",
    price: 2499,
    image: "3.jpg",
  },
  {
    id: "p4",
    name: "MuscleTech Nitro-Tech Whey Gold (1.81kg)",
    price: 3999,
    image: "4.jpg",
  },
  {
    id: "p5",
    name: "BigMuscles Gold Whey Protein (1kg)",
    price: 1999,
    image: "5.webp",
  },
  {
    id: "p6",
    name: "Nutri-Tech Gym Juice Electrolyte Fuel",
    price: 149,
    image: "5.jpg",
  },
  {
    id: "p7",
    name: "Cosmic Rainbow",
    price: 229,
    image: "6.jpg",
  },
  {
    id: "p8",
    name: "Millions Bubblegum",
    price: 359,
    image: "7.webp",
  },
  {
    id: "p9",
    name: "Orange Cream",
    price: 395,
    image: "8.webp",
  },
  {
    id: "p10",
    name: "Arctic Snow Cone",
    price: 239,
    image: "9.webp",
  },
  {
    id: "p11",
    name: "Abdominal Wheel Roller",
    price: 799,
    image: "10.jpg",
  },
  {
    id: "p12",
    name: "Standard Weight Plate Set (50kg)",
    price: 4999,
    image: "11.webp",
  },
  {
    id: "p13",
    name: "Gym set",
    price: 2899,
    image: "12.webp",
  },
  {
    id: "p14",
    name: "Adjustable Home Dumbbell Set (50kg)",
    price: 3999,
    image: "13.webp",
  },
  
  {
    id: "p15",
    name: "Premium Yoga & Exercise Mat",
    price: 899,
    image: "14.webp",
  },
  {
    id: "p16",
    name: "Resistance Band Set (5-Piece)",
    price: 699,
    image: "15.jpg",
  },
  {
    id: "p17",
    name: "Hand Grip Strengthener (Adjustable)",
    price: 499,
    image: "16.webp",
  },
  {
    id: "p18",
    name: "Fitness Ball (65cm) & Pump",
    price: 1299,
    image: "17.jpg",
  },
  {
    id: "p19",
    name: "Penco Ultra Energy Bar (50g)",
    price: 129,
    image: "18.jpg",
  },
  {
    id: "p20",
    name: "MX3 Endurance Energy Bar",
    price: 149,
    image: "19.webp",
  },
  {
    id: "p21",
    name: "Neapharma Pro-Energy Bar (Box of 12",
    price: 1299,
    image: "20.jpg",
  },
  {
    id: "p22",
    name: "Fitspire Red Berry Meal Replacement Bar",
    price: 129,
    image: "21.jpg",
  },
];

export default function StorePage() {
  // Define a simple Product interface for better typing (Optional but recommended)
  interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
  }
  
  const { addItem } = useCartStore();

  // Assuming w-50 in your Tailwind config is equivalent to 200px or 256px (e.g., w-64)
  const IMAGE_WIDTH = 256; 
  const IMAGE_HEIGHT = 320; // Tailwind h-80 is 320px

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🏋️‍♂️ Fitness Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          >
            {/* FIX START: Replace <img> with <Image /> */}
            <div 
              // Set the div size to match the desired image size
              className={`relative w-[${IMAGE_WIDTH}px] h-[${IMAGE_HEIGHT}px] mb-4`}
              // Using h-80 and a close width (w-64) might be better if available
            >
              <Image
                src={`/${product.image}`} // Assuming images are in the /public folder
                alt={product.name}
                width={IMAGE_WIDTH} // Required prop
                height={IMAGE_HEIGHT} // Required prop
                style={{ objectFit: 'cover' }} // Tailwind object-cover equivalent
                className="rounded-md" // Keep the border radius
              />
            </div>
            {/* FIX END */}
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="mb-2 text-gray-300">₹{product.price}</p>
            <button
              // Note: addItem expects a Product type. You might need to cast or define the type in useCartStore.
              onClick={() => addItem(product as Product)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold flex justify-between items-center mb-6 gap-6">
        <Link href="/cart">Cart</Link>
      </button>
    </div>
  );
}

