import { useAuth } from "@clerk/expo";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabTintColor = isDark ? "lightgreen" : "green";

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="./(auth)/sign-in" />;
  }

  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: "lightgreen" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            title: "Planner",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="info-circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
