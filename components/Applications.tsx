import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button"; // Cambia la ruta si el botón está en otra carpeta
import { supabase } from "@/utils/supabase";

interface Job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  salary: string;
  languages: string[];
  appliedDate: string;
  status: string;
}

type Applied = {
  id: number;
  job_id: number;
  user_id: number;
  created_at: string;
  status: string;
};

export default function Applications() {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const { data } = await supabase
        .from("aplications")
        .select("*")
        .eq("user_id", session.data.session?.user.id);

      if (!data) {
        return;
      }

      let jobs: Job[] = [];

      for (const apply of data as Applied[]) {
        const { data } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", apply.job_id);

        if (!data) {
          return;
        }

        const appliedDateFormatted = new Date(
          apply.created_at
        ).toLocaleDateString("es-ES");

        jobs.push({
          ...data[0],
          status: apply.status,
          appliedDate: appliedDateFormatted,
        });
      }
      setAppliedJobs(jobs as Job[]);
    };
    fetchData();
  }, []);

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Postulaciones</Text>
        {appliedJobs.length > 0 &&
          appliedJobs.map((job) => (
            <View key={job.id} style={styles.card}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.salary}>{job.salary}</Text>
              <Text style={styles.type}>{job.job_type}</Text>
              <Text style={styles.appliedDate}>
                Fecha de postulación: {job.appliedDate}
              </Text>
              <Button
                theme="primary"
                label="Ver Detalles"
                onPress={() => openModal(job)}
                disabled={false}
              />
            </View>
          ))}

        {selectedJob && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedJob.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedJob.description}
                </Text>
                <Text style={styles.modalLabel}>
                  Tipo: {selectedJob.job_type}
                </Text>
                <Text style={styles.modalLabel}>
                  Salario: {selectedJob.salary}
                </Text>
                <Text style={styles.modalLabel}>
                  Lenguajes: {selectedJob.languages.join(", ")}
                </Text>
                <Text style={styles.modalLabel}>
                  Fecha de postulación: {selectedJob.appliedDate}
                </Text>
                <Text style={styles.modalLabel}>
                  Estado: {selectedJob.status}
                </Text>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  salary: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 5,
  },
  type: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 5,
  },
  appliedDate: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ff5c5c",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#ffffff",
    textAlign: "center",
  },
});
