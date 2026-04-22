import { pgTable } from "drizzle-orm/pg-core";


export const groceryItems = pgTable('grocery_items', (t) => ({
  id: t.serial('id').primaryKey(),
  title: t.text('title').notNull(),
  category: t.text('category').notNull(),
  quantity: t.integer('quantity').notNull(),
  isPurchased: t.boolean('is_purchased').notNull().default(false),
  priority: t.text('priority').notNull().default("default"),
  createdAt: t.bigint('created_at', { mode: "number" }).notNull(),
  updatedAt: t.bigint('updated_at', { mode: "number" }).notNull(),
}));