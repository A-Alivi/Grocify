const { neon } = require("@neondatabase/serverless");

const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is required.");
}

const sql = neon(databaseUrl);

const seedItems = [
  { title: "Bananas", category: "Produce", quantity: 6, priority: "medium", isPurchased: false },
  { title: "Avocado", category: "Produce", quantity: 3, priority: "high", isPurchased: false },
  { title: "Greek Yogurt", category: "Dairy", quantity: 2, priority: "medium", isPurchased: true },
  { title: "Cheddar Cheese", category: "Dairy", quantity: 1, priority: "low", isPurchased: false },
  { title: "Sourdough Bread", category: "Bakery", quantity: 1, priority: "high", isPurchased: false },
  { title: "Pasta", category: "Pantry", quantity: 2, priority: "low", isPurchased: false },
  { title: "Tomato Sauce", category: "Pantry", quantity: 2, priority: "medium", isPurchased: true },
  { title: "Granola Bars", category: "Snacks", quantity: 5, priority: "medium", isPurchased: false },
  { title: "Dark Chocolate", category: "Snacks", quantity: 2, priority: "low", isPurchased: false },
  { title: "Eggs", category: "Dairy", quantity: 12, priority: "high", isPurchased: false },
];

async function seed() {
  await sql`
    CREATE TABLE IF NOT EXISTS grocery_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
      priority TEXT NOT NULL DEFAULT 'default',
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    )
  `;

  const now = Date.now();

  for (const item of seedItems) {
    await sql`
      INSERT INTO grocery_items (
        title,
        category,
        quantity,
        is_purchased,
        priority,
        created_at,
        updated_at
      )
      VALUES (
        ${item.title},
        ${item.category},
        ${item.quantity},
        ${item.isPurchased},
        ${item.priority},
        ${now},
        ${now}
      )
    `;
  }

  console.log(`Seed complete: inserted ${seedItems.length} grocery items.`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});