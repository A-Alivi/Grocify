import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItems } from "./db/schema";


export const getGroceryItems = async () => {

    const items = await db.select().from(groceryItems).orderBy(desc(groceryItems.updatedAt ));
    return items;

} 


export const createGroceryItem = async (input:{
    title: string;
    category: string;
    quantity: number;
    priority?: string;
}) => {

    const rows = await db.insert(groceryItems).values({
        title: input.title,
        category: input.category,
        quantity: Math.max(1, input.quantity),
        priority: input.priority || "default",
        isPurchased: false,
        updatedAt: Date.now(),
        createdAt: Date.now(),
    }).returning();

    return rows[0]

}


export const setGroceryItemPurchased = async (
  id: number, // ✅ serial → number
  isPurchased: boolean
) => {
  const rows = await db
    .update(groceryItems)
    .set({
      isPurchased, // ✅ correct field
      updatedAt: Date.now(), // ✅ correct field
    })
    .where(eq(groceryItems.id, id))
    .returning();

  if (!rows.length) return null;
  return rows[0];
};



export const updateGroceryItemQuantity = async (
  id: number, // ✅ serial → number
  quantity: number
) => {
  const rows = await db
    .update(groceryItems)
    .set({
      quantity: Math.max(1, Math.floor(quantity)),
      updatedAt: Date.now(), // ✅ correct field
    })
    .where(eq(groceryItems.id, id))
    .returning();

  return rows[0] ?? null; // ✅ cleaner
};

const deleteGroceryItem = async (id: number) => {
    await db.delete(groceryItems).where(eq(groceryItems.id, id));
}


const clearPurchasedItems = async () => {
    await db.delete(groceryItems).where(eq(groceryItems.isPurchased, true));
}