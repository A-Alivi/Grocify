import { create } from "zustand";

export type GroceryCategory =
  | "Produce"
  | "Dairy"
  | "Bakery"
  | "Snacks"
  | "Pantry";
export type GroceryPriority = "Low" | "Medium" | "High";
export type GroceryItem = {
  id: number;
  title: string;
  category: GroceryCategory;
  quantity: number;
  isPurchased: boolean;
  priority: GroceryPriority;
};

export type CreateItemInput = {
  title: string;
  category: GroceryCategory;
  quantity: number;
  priority?: GroceryPriority;
};

type ItemsResponse = { items: GroceryItem[] };
type ItemResponse = { items: GroceryItem };

type GroceryStore = {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  togglePurchased: (id: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearPurchased: () => Promise<void>;
};

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  loadItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/items");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load items");
      }
      set({ items: payload.items, isLoading: false });
    } catch (error) {
      console.error("Error loading items:", error);
      set({ error: "Failed to load items", isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  addItem: async (input) => {
    set({ error: null });
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.title,
          category: input.category,
          quantity: Math.max(1, input.quantity),
          priority: input.priority,
        }),
      });

      const payload = (await response.json()) as ItemResponse;
      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.statusText || "Failed to add item"}`,
        );
      }
      set((state) => ({ items: [payload.items, ...state.items] }));
    } catch (error) {
      console.error("Error adding item:", error);
      set({ error: "Failed to add item" });
    }
  },

  updateQuantity: async (id, quantity) => {
    const nextQuantity = Math.max(1, quantity);
    set({ error: null });
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      });
      const payload = (await response.json()) as ItemResponse;
      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.statusText || "Failed to update quantity"}`,
        );
      }
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: payload.items.quantity } : item,
        ),
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ error: "Failed to update quantity" });
    }
  },

  togglePurchased: async (id) => {
    const currentItem = get().items.find((item) => item.id === id);
    if (!currentItem) return;

    const nextPurchased = !currentItem.isPurchased;
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPurchased: nextPurchased }),
      });

      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.items : item,
        ),
      }));
    } catch (error) {
      console.error("Error toggling purchased:", error);
      set({ error: "Something went wrong" });
    }
  },
  removeItem: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (error) {
      console.error("Error removing item:", error);
      set({ error: "Something went wrong" });
    }
  },
  clearPurchased: async () => {
    set({ error: null });
    try {
      const res = await fetch("/api/items/clear-purchased", { method: "POST" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const items = get().items.filter((item) => !item.isPurchased);
      set({ items });
    } catch (error) {
      console.error("Error clearing purchased:", error);
      set({ error: "Something went wrong" });
    }
  },
}));
