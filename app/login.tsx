import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
// import { useState } from "react";
import React from "react";
import Button from "@/components/Button";
import LinkButton from "@/components/LinkButton";
const bgimg = require("@/assets/images/Graduados.jpg");

export default function LoginScreen() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  return (
    <ImageBackground source={bgimg} style={styles.bgimage}>
      <View style={styles.container}>
        <View style={{ paddingBottom: 20, marginTop: 50 }}>
          <Entypo style={styles.Icon} name="book" size={75} color="black" />
          <Text style={styles.title}>TecJobs</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.subtitle}>Login</Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              value={email}
              placeholder="Email"
              inputMode="email"
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={styles.text}>Contraseña</Text>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              value={password}
              placeholder="contraseña"
              secureTextEntry={true}
              inputMode="text"
            />
          </View>

          <Button label="Inicar Sesión" />

          <Text style={styles.link}>¿Olvidate tu contraseña?</Text>

          <LinkButton
            href="/register"
            label="Crear una cuenta"
            width={"100%"}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    flex: 1,
    flexDirection: "column",
    paddingInline: 35,
    paddingVertical: 65,
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    backgroundColor: "#fffafa",
    width: "100%",
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
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    color: "#808080",
  },
  Icon: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 20,
  },
  bgimage: {
    /* @info Make the image fill the containing view */
    flex: 1,
    /* @info Scale up the image to fill the container, preserving aspect ratio */
    resizeMode: "cover",
    justifyContent: "center",
    overflow: "hidden",
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
  text: {
    color: "#808080",
    paddingLeft: 4,
    marginBottom: 10,
  },
  link: {
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
});
