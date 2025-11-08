"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

const products = [
  {
    id: "p1",
    name: "Whey Protein",
    price: 999,
    image: "2.jpg"
  },
  {
    id: "p2",
    name: "Whey Protein",
    price: 999,
    image: "1.jpg",
  },
  {
    id: "p3",
    name: "Whey Protein",
    price: 999,
    image: "3.jpg",
  },
  {
    id: "p4",
    name: "Whey Protein",
    price: 999,
    image: "4.jpg",
  },
  {
    id: "p5",
    name: "Whey Protein",
    price: 999,
    image: "5.webp",
  },
  {
    id: "p6",
    name: "Whey Protein",
    price: 999,
    image: "5.jpg",
  },
  {
    id: "p7",
    name: "Whey Protein",
    price: 999,
    image: "6.jpg",
  },
  {
    id: "p8",
    name: "Whey Protein",
    price: 999,
    image: "7.webp",
  },
  {
    id: "p9",
    name: "Whey Protein",
    price: 999,
    image: "8.webp",
  },
  {
    id: "p10",
    name: "Whey Protein",
    price: 999,
    image: "9.webp",
  },
  {
    id: "p11",
    name: "Whey Protein",
    price: 999,
    image: "10.jpg",
  },
  {
    id: "p12",
    name: "Whey Protein",
    price: 999,
    image: "11.webp",
  },
  {
    id: "p13",
    name: "Whey Protein",
    price: 999,
    image: "12.webp",
  },
  {
    id: "p14",
    name: "Whey Protein",
    price: 999,
    image: "13.webp",
  },

  {
    id: "p15",
    name: "Whey Protein",
    price: 999,
    image: "14.webp",
  },
  {
    id: "p16",
    name: "Whey Protein",
    price: 999,
    image: "15.jpg",
  },
  {
    id: "p17",
    name: "Dumbbell Set",
    price: 1499,
    image: "16.webp",
  },
  {
    id: "p18",
    name: "Yoga Mat",
    price: 499,
    image: "17.jpg",
  },
  {
    id: "p19",
    name: "Yoga Mat",
    price: 499,
    image: "18.jpg",
  },
  {
    id: "p20",
    name: "Yoga Mat",
    price: 499,
    image: "19.webp",
  },
  {
    id: "p21",
    name: "Yoga Mat",
    price: 499,
    image: "20.jpg",
  },
  {
    id: "p22",
    name: "Yoga Mat",
    price: 499,
    image: "21.jpg",
  },
];

export default function StorePage() {
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🏋️‍♂️ Fitness Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-50 h-80 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="mb-2 text-gray-300">₹{product.price}</p>
            <button
              onClick={() => addItem(product)}
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
