import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/* Stack componente para recrear una pila de navegacion para agregar nuevas rutas */
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00008b",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerShadowVisible: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Empleos",
          tabBarIcon: ({ color, focused }) => (
            <Entypo name="briefcase" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="postulaciones"
        options={{
          title: "postulaciones",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="paper-plane-sharp" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recomendaciones"
        options={{
          title: "Recomendaciones",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="star-sharp" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="user-tie" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="+not-found" />
    </Tabs>
  );
}
