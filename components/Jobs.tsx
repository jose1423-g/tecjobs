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
  const [datajobs, setdatajobs] = useState<job[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectjob, setjob] = useState<job | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("jobs").select("*");
      setdatajobs(data as job[]);
    };
    fetchData();
  }, []);

  const openModal = (id: number) => {
    const job = datajobs.find((item, key) => key === id) || null;
    setjob(job);
    setModalVisible(true);
  };

  function closeModal() {
    setModalVisible(false);
  }

  const applyToJob = async (selectedJobId: number) => {
    const session = await supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { data, error } = await supabase.from("aplications").insert({
      job_id: selectedJobId,
      user_id: session.data.session?.user.id,
    });

    if (error) {
      console.log(error);
    } else {
      alert("Aplicación enviada con éxito");
      setModalVisible(false);
    }
  };

  const jobs = datajobs.map((item, key) => (
    <View style={[styles.card, styles.mb20]} key={key}>
      <Text style={[styles.title, styles.mb20]}>{item.title}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>$ {item.salary}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>{item.languages}</Text>
      <Text style={[styles.fontsize16, styles.mb20]}>{item.job_type}</Text>
      <Button
        theme="primary"
        label="ver mas"
        disabled={false}
        onPress={() => openModal(key)}
      />
    </View>
  ));

  return (
    <View>
      {jobs}
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          style={{ backgroundColor: "#7cfc00" }}
        >
          <ScrollView>
            <View>
              <View style={styles.borderPaddin}>
                <Text style={styles.titleModal}>{selectjob?.title}</Text>
              </View>

              <View style={styles.borderPaddin}>
                <Text style={[styles.fontsize20, styles.mb20]}>
                  Descripcíon
                </Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.description}
                </Text>
              </View>

              <View style={styles.borderPaddin}>
                <Text style={[styles.fontsize20, styles.mb20]}>Requisitos</Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.languages}
                </Text>
              </View>

              <View style={styles.borderPaddin}>
                <Text style={[styles.fontsize20, styles.mb20]}>Sueldo</Text>
                <Text style={[styles.fontsize16, styles.mb20]}>
                  {selectjob?.salary}
                </Text>
              </View>

              <View style={styles.borderPaddin}>
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
    </View>
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
  borderPaddin: {
    padding: 20,
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 1,
  },
  modalbody: {
    padding: 20,
  },
});
