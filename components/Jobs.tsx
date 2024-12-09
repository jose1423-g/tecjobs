import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
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
  const [filteredJobs, setFilteredJobs] = useState<job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectjob, setJob] = useState<job | null>(null);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const session = await supabase.auth.getSession();

    if (!session) {
      alert("Por favor, inicia sesión para ver los trabajos.");
      return;
    }

    const { data: jobs } = await supabase.from("jobs").select("*");
    setDataJobs(jobs as job[]);
    setFilteredJobs(jobs as job[]);

    const { data: applications } = await supabase
      .from("aplications")
      .select("job_id")
      .eq("user_id", session.data.session?.user.id);

    if (applications) {
      setAppliedJobs(applications.map((app) => app.job_id));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const openModal = (id: number) => {
    const job = filteredJobs.find((item) => item.id === id) || null;
    setJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const applyToJob = async (selectedJobId: number) => {
    const session = await supabase.auth.getSession();

    if (!session) {
      alert("Por favor, inicia sesión para postularte.");
      return;
    }

    if (appliedJobs.includes(selectedJobId)) {
      alert("Ya te has postulado a este trabajo.");
      return;
    }

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
      setAppliedJobs((prev) => [...prev, selectedJobId]);
      setModalVisible(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = datajobs.filter((job) =>
      job.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const jobs = filteredJobs.map((item) => (
    <View style={[styles.card, styles.mb20]} key={item.id}>
      <Text style={[styles.title, styles.mb20]}>{item.title}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>$ {item.salary}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>
        {item.languages.join(", ")}
      </Text>
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
    <>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por título..."
        value={searchText}
        onChangeText={handleSearch}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {jobs}
      </ScrollView>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.borderPadding}>
              <Text style={styles.titleModal}>{selectjob?.title}</Text>
            </View>
            <View style={styles.borderPadding}>
              <Text style={[styles.fontsize20, styles.mb20]}>Descripción</Text>
              <Text style={[styles.fontsize16, styles.mb20]}>
                {selectjob?.description}
              </Text>
            </View>
            <View style={styles.borderPadding}>
              <Text style={[styles.fontsize20, styles.mb20]}>Requisitos</Text>
              <Text style={[styles.fontsize16, styles.mb20]}>
                {selectjob?.languages.join(", ")}
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
                label="Postularse"
                disabled={appliedJobs.includes(selectjob?.id as number)}
                onPress={() => applyToJob(selectjob?.id as number)}
              />
              <Pressable
                style={{
                  backgroundColor: "#ff0000",
                  padding: 10,
                  borderRadius: 3,
                }}
                onPress={closeModal}
              >
                <Text style={{ textAlign: "center", color: "#ffffff" }}>
                  Cerrar
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    paddingTop: 50,
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
