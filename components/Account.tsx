import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  Text,
  SafeAreaView,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

export default function Account({ session }: { session: Session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSingOut = async () => {
    try {
      await supabase.auth.signOut();
      router.navigate("/login");
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mb20]}>
        <Text style={styles.mb20}>Email</Text>
        <TextInput
          style={styles.input}
          value={session?.user?.email}
          editable={false}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mb20]}>
        <Text style={styles.mb20}>Username</Text>
        <TextInput
          // label="Username"
          style={styles.input}
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mb20]}>
        <Text style={styles.mb20}>Website</Text>
        <TextInput
          // label="Website"
          style={styles.input}
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20, styles.mb20]}>
        <Button
          title={loading ? "Cargando ..." : "Guardar"}
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Cerrar sesión" onPress={handleSingOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",

    backgroundColor: "#f5f5f5",
  },
  verticallySpaced: {
    padding: 20,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 10,
  },
  mb20: {
    marginBottom: 10,
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
  btn: {
    backgroundColor: "#8b0000",
  },
});
