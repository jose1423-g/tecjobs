import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Text,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import LinkButton from "@/components/LinkButton";

type Props = {
  theme?: "register";
};

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth({ theme }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/(tabs)");
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Por favor verifique su correo");
    setLoading(false);
  }

  if (theme === "register") {
    return (
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mb20]}>
          <Text style={styles.mb20}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Correo electronico"
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mb20]}>
          <Text style={styles.mb20}>Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Contraseña"
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button
            disabled={loading}
            label="Registrarse"
            onPress={signUpWithEmail}
          />
          <LinkButton
            width="auto"
            href="/login"
            label="¿Ya tienes una cuenta?"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mb20]}>
        <Text style={styles.mb20}>Email</Text>
        <TextInput
          // label="Email"
          // leftIcon={{ type: "font-awesome", name: "envelope" }}
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Correo electronico"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mb20]}>
        <Text style={styles.mb20}>Contraseña</Text>
        <TextInput
          // label="Password"
          // leftIcon={{ type: "font-awesome", name: "lock" }}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Contraseña"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          // title="Sign in"
          disabled={loading}
          label="Iniciar sesíon"
          onPress={signInWithEmail}
        />
        <LinkButton
          // title="Sign in"
          width="auto"
          href="/register"
          label="Crear una cuenta"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    borderTopEndRadius: 25,
    paddingVertical: 25,
    borderTopStartRadius: 25,
    backgroundColor: "#f5f5f5",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    height: 40,
    backgroundColor: "#ffffff",
    borderColor: "#faf0e6",
  },
});
