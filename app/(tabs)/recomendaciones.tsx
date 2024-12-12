import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "@react-navigation/native";

type Job = {
  id: number;
  title: string;
  description: string;
  job_type: string;
  salary: string;
  languages: string[];
};

const fetchRecommendations = async (appliedJobs: Job[], allJobs: Job[]) => {
  if (appliedJobs.length < 1) return [];

  const getChatGptRecommendations = await fetch(
    "http://localhost:3000/api/jobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appliedJobs: appliedJobs,
        allJobs: allJobs,
      }),
    }
  );

  const recommendations = await getChatGptRecommendations.json();
  return recommendations.recommendations as Job[];
};

export default function Recommendations() {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [nonAppliedJobs, setNonAppliedJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const backgroundColor = useState(new Animated.Value(0))[0];

  const fetchData = async () => {
    const session = await supabase.auth.getSession();

    if (!session) {
      alert("Por favor, inicia sesión para ver los trabajos.");
      return;
    }

    const { data: jobsData } = await supabase.from("jobs").select("*");

    const { data: applications } = await supabase
      .from("aplications")
      .select("job_id")
      .eq("user_id", session.data.session?.user.id);

    if (applications) {
      setAppliedJobs(applications.map((app) => app.job_id));
    }

    if (!jobsData) return;

    const nonAppliedJobs = jobsData.filter(
      (job) => !appliedJobs.includes(job.id)
    );
    setNonAppliedJobs(nonAppliedJobs);

    if (nonAppliedJobs.length === 0) return;

    if (appliedJobs.length === 0) return;

    fetchRecommendations(appliedJobs, nonAppliedJobs).then(
      (recommendations) => {
        setRecommendations(recommendations);
      }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const interpolatedColor = backgroundColor.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [
      "rgba(255, 0, 0, 0.3)",
      "rgba(245, 245, 245, 1)",
      "rgba(0, 255, 0, 0.3)",
    ],
    extrapolate: "clamp",
  });

  const handleSwiping = (x: number) => {
    backgroundColor.setValue(x);
  };

  const handleSwipeEnd = () => {
    Animated.timing(backgroundColor, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePostular = async (job: Job) => {
    if (appliedJobs.includes(job)) {
      Alert.alert("Ya te has postulado a este trabajo.");
      return;
    }

    const session = await supabase.auth.getSession();

    if (!session) {
      Alert.alert("Por favor, inicia sesión para postularte.");
      return;
    }

    const { error } = await supabase.from("aplications").insert({
      job_id: job.id,
      user_id: session.data.session?.user.id,
      status: "pendiente",
    });

    if (error) return Alert.alert("Hubo un error al postularte.");

    setAppliedJobs((prev) => [...prev, job]);

    handleSwipeEnd();
    Alert.alert("¡Postulado!", `Te has postulado a ${job.title}.`);
  };

  const handleRechazar = (job: Job) => {
    handleSwipeEnd();
  };

  const renderCard = (job: Job) => (
    <View style={styles.card}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.salary}>Salario: $ {job.salary}</Text>
      <Text style={styles.languages}>Idiomas: {job.languages.join(", ")}</Text>
      <Text style={styles.jobType}>Tipo: {job.job_type}</Text>
      <Text style={styles.description}>{job.description}</Text>
    </View>
  );

  if (!appliedJobs.length)
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.innerContainer}>
          <Text style={styles.noJobs}>
            Postula a trabajos de manera normal para obtener recomendaciones
            personalizadas
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );

  if (recommendations.length === 0)
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.innerContainer}>
          <Text style={styles.noJobs}>
            Generando recomendaciones, espera un momento...
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );

  return (
    <SafeAreaProvider>
      <Animated.View
        style={[styles.container, { backgroundColor: interpolatedColor }]}
      >
        <SafeAreaView style={styles.innerContainer}>
          <Swiper
            cards={recommendations}
            renderCard={renderCard}
            onSwipedRight={(cardIndex) =>
              handlePostular(recommendations[cardIndex])
            }
            onSwipedLeft={(cardIndex) =>
              handleRechazar(recommendations[cardIndex])
            }
            onSwiping={(x) => handleSwiping(x)}
            verticalSwipe={false}
            stackScale={10}
            stackSeparation={15}
            cardIndex={0}
            secondCardZoom={0.9}
            backgroundColor="transparent"
            stackSize={3}
          />
        </SafeAreaView>
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  card: {
    height: "80%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  salary: {
    fontSize: 16,
    marginBottom: 5,
  },
  languages: {
    fontSize: 14,
    marginBottom: 5,
  },
  jobType: {
    fontSize: 14,
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    textAlign: "center",
  },
  noJobs: {
    fontSize: 18,
    color: "#999",
  },
});
