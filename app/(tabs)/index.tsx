import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import PendingItemCard from "@/components/list/PendingItemCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { useClerk, useUser } from "@clerk/expo";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

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
    <ScrollView
      className="flex-1 bg-background py-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
    >
      <TabScreenBackground />
      <ListHeroCard />
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
          Shopping items
        </Text>
        <Text className="text-sm text-muted-foreground">
          {pendingItems.length} active
        </Text>
      </View>
      {pendingItems.map((item) => (
        <PendingItemCard key={item.id} item={item} />
      ))}
      <CompletedItems />
    </ScrollView>
  );
};

export default ListScreen;
