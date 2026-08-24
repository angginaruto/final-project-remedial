import { useState } from "react";
import type { CartItem, Product } from "../types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Quantity melebihi stock");
        return;
      }

      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );

      return;
    }

    setCart([...cart, { product, quantity: 1 }]);
  };

  const increaseQuantity = (productId: number) => {
    setCart(
      cart.map((item) => {
        if (item.product.id !== productId) return item;

        if (item.quantity >= item.product.stock) {
          alert("Quantity melebihi stock");
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);

  const clearCart = () => setCart([]);

  return { cart, addToCart, increaseQuantity, decreaseQuantity, getTotal, clearCart };
}