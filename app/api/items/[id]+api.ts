import {
    deleteGroceryItem,
    setGroceryItemPurchased,
    updateGroceryItemQuantity,
} from "../../../lib/server/db-actions";
export async function DELETE(_request: Request, { id }: { id: string }) {
  try {
    await deleteGroceryItem(Number(id));
    return Response.json("Item deleted", { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete item";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { id }: { id: string }) {
  try {
    const body = await request.json();
    const item = body.quantity
      ? await updateGroceryItemQuantity(Number(id), body.quantity)
      : await setGroceryItemPurchased(Number(id), body.isPurchased ?? true);
    if (!item) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }
    return Response.json(item, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update item";
    return Response.json({ error: message }, { status: 500 });
  }
}
