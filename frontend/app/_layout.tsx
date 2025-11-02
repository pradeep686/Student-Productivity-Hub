import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4CAF50" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="attendance" options={{ title: "Attendance" }} />
      <Stack.Screen name="assignment" options={{ title: "Assignments" }} />
      <Stack.Screen name="notes" options={{ title: "Study Notes" }} />
      <Stack.Screen name="reports" options={{ title: "Reports" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="todo" options={{ title: "To-Do" }} />
      <Stack.Screen name="pomodoro" options={{ title: "Pomodoro Timer" }} />
    </Stack>
  );
}
