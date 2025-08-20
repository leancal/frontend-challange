import * as React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type CartItem = { id: number; name: string; price: number; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: { id: number; name: string; price: number }, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = React.createContext<CartCtx>(null!);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart", []);

  const add: CartCtx["add"] = (p, qty = 1) =>
    setItems((curr) => {
      const i = curr.findIndex((c) => c.id === p.id);
      if (i > -1) {
        const copy = [...curr];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...curr, { ...p, qty }];
    });

  const remove = (id: number) => setItems((curr) => curr.filter((c) => c.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, clear, count, subtotal }}>{children}</Ctx.Provider>;
};

export const useCart = () => React.useContext(Ctx);
