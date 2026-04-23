import { clearPurchasedItems } from "../../../lib/server/db-actions";

export async function POST() {
  try {
    await clearPurchasedItems();
    return new Response("Purchased items cleared", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to clear purchased items";
    return new Response(message, { status: 500 });
  }
}
