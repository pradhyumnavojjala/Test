"use client";

import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";


export default function CartPage() {
  const { user } = useUser();
  const { items, removeItem, clearCart, total } = useCartStore();

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const response = await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          email: user?.emailAddresses[0]?.emailAddress, // user’s actual email

        }),
      });

      if (response.ok) {
        alert("✅ Order confirmed! You will receive an email shortly. Pay when delivered.");
        clearCart();
      } else {
        alert("❌ Failed to confirm order. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Something went wrong. Try again later.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {items.length === 0 ? (
        <p>No items yet. Go add something!</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <h3 className="text-xl font-semibold">
              Total: ₹{total.toFixed(2)}
            </h3>
            <button
              onClick={clearCart}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 mt-3 rounded text-black font-bold"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
      <button
  onClick={handleConfirmOrder}
  className="bg-green-600 hover:bg-green-700 px-6 py-2 mt-3 rounded text-white font-bold"
>
  Confirm Order
</button>

      
    </div>
  );
}
