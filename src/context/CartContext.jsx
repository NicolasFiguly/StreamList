import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "streamlist_cart_v1";

function generatePrice(id) {
  const safeId = Number(id) || 0;
  const base = (safeId % 7) + 9; // 9–15
  const cents = (safeId % 99) / 100;
  return Number((base + cents).toFixed(2));
}

function normalizeItems(parsed) {
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((x) => x && x.id)
    .map((x) => {
      const qty = Number(x.qty) > 0 ? Number(x.qty) : 1;

      let priceNum = Number(x.price);
      if (!Number.isFinite(priceNum)) {
        priceNum = generatePrice(x.id);
      }

      return {
        id: x.id,
        title: x.title || "Untitled",
        year: x.year || "",
        overview: x.overview || "",
        posterPath: x.posterPath || "",
        qty,
        price: priceNum
      };
    });
}

function safeParse(json) {
  try {
    const parsed = JSON.parse(json);
    return normalizeItems(parsed);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => safeParse(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(movie) {
    if (!movie || !movie.id) return;

    const normalized = {
      id: movie.id,
      title: movie.title || movie.name || "Untitled",
      year: movie.release_date ? movie.release_date.slice(0, 4) : "",
      overview: movie.overview || "",
      posterPath: movie.poster_path || "",
      price: generatePrice(movie.id),
      qty: 1
    };

    setItems((prev) => {
      const existing = prev.find((x) => x.id === normalized.id);
      if (existing) {
        return prev.map((x) =>
          x.id === normalized.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [normalized, ...prev];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function increment(id) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  }

  function decrement(id) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
    );
  }

  function clearCart() {
    setItems([]);
  }

  function isInCart(id) {
    return items.some((x) => x.id === id);
  }

  const totals = useMemo(() => {
    const totalQty = items.reduce((sum, x) => sum + (Number(x.qty) || 1), 0);
    const totalPriceNum = items.reduce((sum, x) => {
      const price = Number(x.price);
      const qty = Number(x.qty) || 1;
      return sum + (Number.isFinite(price) ? price * qty : 0);
    }, 0);

    return {
      totalQty,
      totalPrice: totalPriceNum.toFixed(2)
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      increment,
      decrement,
      clearCart,
      isInCart,
      totals
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}