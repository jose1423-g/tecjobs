import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  salary: string;
  languages: string[];
}

export default function Jobs() {
  const [datajobs, setDataJobs] = useState<job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]); // IDs de trabajos ya postulados
  const [modalVisible, setModalVisible] = useState(false);
  const [selectjob, setJob] = useState<job | null>(null);

  // Cargar trabajos y postulaciones del usuario
  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();

      if (!session) {
        alert("Por favor, inicia sesión para ver los trabajos.");
        return;
      }

      // Obtener los trabajos disponibles
      const { data: jobs } = await supabase.from("jobs").select("*");
      setDataJobs(jobs as job[]);

      // Obtener IDs de trabajos ya postulados por el usuario
      const { data: applications } = await supabase
        .from("aplications")
        .select("job_id")
        .eq("user_id", session.data.session?.user.id);

      if (applications) {
        setAppliedJobs(applications.map((app) => app.job_id));
      }
    };

    fetchData();
  }, []);

  // Abrir modal con detalles del trabajo
  const openModal = (id: number) => {
    const job = datajobs.find((item) => item.id === id) || null;
    setJob(job);
    setModalVisible(true);
  };

  // Cerrar modal
  function closeModal() {
    setModalVisible(false);
  }

  // Aplicar a un trabajo
  const applyToJob = async (selectedJobId: number) => {
    const session = await supabase.auth.getSession();

    if (!session) {
      alert("Por favor, inicia sesión para postularte.");
      return;
    }

    // Verificar si el usuario ya se postuló
    if (appliedJobs.includes(selectedJobId)) {
      alert("Ya te has postulado a este trabajo.");
      return;
    }

    // Insertar nueva postulación
    const { error } = await supabase.from("aplications").insert({
      job_id: selectedJobId,
      user_id: session.data.session?.user.id,
      status: "pendiente",
    });

    if (error) {
      console.error(error);
      alert("Hubo un error al postularte. Intenta nuevamente.");
    } else {
      alert("Aplicación enviada con éxito.");
      setAppliedJobs((prev) => [...prev, selectedJobId]); // Agregar ID a la lista de postulados
      setModalVisible(false);
    }
  };

  // Renderizar la lista de trabajos
  const jobs = datajobs.map((item) => (
    <View style={[styles.card, styles.mb20]} key={item.id}>
      <Text style={[styles.title, styles.mb20]}>{item.title}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>$ {item.salary}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>{item.languages.join(", ")}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>{item.job_type}</Text>
      <Button
        theme="primary"
        label={appliedJobs.includes(item.id) ? "Ya Postulado" : "Ver Más"}
        disabled={appliedJobs.includes(item.id)}
        onPress={() => openModal(item.id)}
      />
    </View>
  ));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          style={{ backgroundColor: "#7cfc00" }}
        >
          <ScrollView>
            <View>
              <View style={styles.borderPadding}>
                <Text style={styles.titleModal}>{selectjob?.title}</Text>
              </View>

              <View style={styles.borderPadding}>
                <Text style={[styles.fontsize20, styles.mb20]}>
                  Descripcíon
                </Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.description}
                </Text>
              </View>

              <View style={styles.borderPadding}>
                <Text style={[styles.fontsize20, styles.mb20]}>Requisitos</Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.languages}
                </Text>
              </View>

              <View style={styles.borderPadding}>
                <Text style={[styles.fontsize20, styles.mb20]}>Sueldo</Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.salary}
                </Text>
              </View>

              <View style={styles.borderPadding}>
                <Text style={[styles.fontsize20, styles.mb20]}>
                  Lugar de trabajo
                </Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.job_type}
                </Text>
              </View>

                <View style={{ padding: 20 }}>
                  <Button
                    theme="primary"
                    label="Postulase"
                    disabled={false}
                    onPress={() => applyToJob(selectjob?.id as number)}
                  />
                  <Pressable
                    style={{
                      backgroundColor: "#ff0000",
                      padding: 10,
                      borderRadius: 3,
                    }}
                    onPress={() => closeModal()}
                  >
                    <Text style={{ textAlign: "center", color: "#ffffff" }}>
                      Cerrar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    width: "100%",
    height: "auto",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  fontsize16: {
    fontSize: 16,
  },
  fontsize20: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mb20: {
    marginBottom: 20,
  },
  titleModal: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  borderPadding: {
    padding: 20,
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 1,
  },
});
