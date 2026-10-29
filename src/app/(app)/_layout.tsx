import { Stack } from "expo-router";
import {colores} from "@/constants/tema"

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colores.tinta
        },
      }}  
    />
  )
}
