import { createContext, useEffect, useMemo, useState } from "react";

import { clearStoredCart, getStoredCart, setStoredCart } from "../utils/storage";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getStoredCart());

  const buildCartItem = (product, quantity) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
    category: product.category,
    size: product.size,
    color: product.color,
    quantity: Math.min(quantity, product.stock)
  });

  useEffect(() => {
    setStoredCart(cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock === 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock)
              }
            : item
        );
      }

      return [
        ...currentItems,
        buildCartItem(product, quantity)
      ];
    });
  };

  const buyNow = (product, quantity = 1) => {
    if (!product || product.stock === 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
                price: product.price,
                image: product.image,
                category: product.category,
                size: product.size,
                color: product.color
              }
            : item
        );
      }

      return [...currentItems, buildCartItem(product, quantity)];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(quantity, item.stock)
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    clearStoredCart();
    setCartItems([]);
  };

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      buyNow,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

