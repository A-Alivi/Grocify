import CompletedItems from "@/components/list/CompletedItems";
import PendingItemCard from "@/components/list/PendingItemCard";
import { useGroceryStore } from "@/store/grocery-store";
import { useClerk, useUser } from "@clerk/expo";
import React, { useEffect } from "react";
import { FlatList, View } from "react-native";

const ListScreen = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { items, loadItems } = useGroceryStore();

  useEffect(() => {
    items;
    loadItems();
  }, []);
  const pendingItems = items?.filter((item) => !item.isPurchased);
  return (
    <FlatList
      data={pendingItems}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PendingItemCard item={item} />}
      contentContainerStyle={{ padding: 20, gap: 14 }}
      ListHeaderComponent={<View style={{ padding: 20, gap: 14 }}></View>}
      ListFooterComponent={<CompletedItems />}
    />
  );
};

export default ListScreen;
