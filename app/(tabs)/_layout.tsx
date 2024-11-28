import { Stack } from "expo-router";

/* Stack componente para recrear una pila de navegacion para agregar nuevas rutas */
export default function RootLayout() {
  return (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
      );
}
