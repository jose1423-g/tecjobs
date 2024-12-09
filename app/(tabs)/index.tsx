import { StyleSheet, SafeAreaView } from "react-native";
import Jobs from "@/components/Jobs";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Jobs />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
});
