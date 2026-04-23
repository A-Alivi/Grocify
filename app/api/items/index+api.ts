import {
    createGroceryItem,
    listGroceryItems,
} from "../../../lib/server/db-actions";

export async function GET() {
  try {
    const items = await listGroceryItems();
    return Response.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, quantity, priority } = body;
    if (!title || !category || !priority) {
      return new Response("Missing required fields", { status: 400 });
    }
    await createGroceryItem({ title, category, quantity, priority });
    return new Response("Item created", { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create item";
    return new Response(message, { status: 500 });
  }
}
