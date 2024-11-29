import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

import LinkButton from "@/components/LinkButton";

const bgimg = require("@/assets/images/Graduados.jpg");

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (session) return;

    if (!supabase.auth) {
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [supabase]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={bgimg} style={styles.bgimage}>
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <View style={{ paddingBottom: 110, marginTop: 50 }}>
              <Entypo style={styles.Icon} name="book" size={75} color="black" />
              <Text style={styles.title}>TecJobs</Text>
              <Text style={styles.subtitle}>Impulsando tu carrera</Text>
            </View>

            {session && session.user ? (
              <LinkButton href="/(tabs)" label="Entrar" width={250} />
            ) : (
              <View>
                <LinkButton
                  href="/login"
                  label="Iniciar sesión"
                  width={250}
                  theme="login"
                />
                <LinkButton
                  href="/register"
                  label="crear una cuenta"
                  width={250}
                />
              </View>
              
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#589b56",
    padding: 2,
    textAlign: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "600",
    color: "#fefefe",
    marginBottom: 20,
    textShadowColor: "#585858", // Color de la sombra
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra
    textShadowRadius: 3, // Radio de desenfoque de la sombra
  },
  subtitle: {
    fontSize: 25,
    fontWeight: "500",
    color: "#ffffff",
  },
  bgimage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    overflow: "hidden",
  },
  Icon: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 20,
  },
});
