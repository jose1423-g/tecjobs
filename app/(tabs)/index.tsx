import { StyleSheet ,View, Text, SafeAreaView, ScrollView } from "react-native";
import Jobs from "@/components/Jobs";


export default function Home() {

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>        
          <Jobs />        
      </SafeAreaView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({  
  container: {
    flex: 1,    
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    paddingVertical: 50,
  },

});