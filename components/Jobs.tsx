import { StyleSheet, View, Text, Modal, Pressable, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { useState } from "react";

const datajobs = [
  {
    id: 1,
    title: "Desarrollador Front-End",
    description:
      "Buscamos talento que contribuya con el desarrollo de interfaces de usuario atractivas y funcionales.",
    job_type: "Presencial",
    salary: "25,000 - 30,000 MXN",
    languages: ["HTML, ", "CSS, ", "JavaScript, ", "Vue.js"],
  },
  {
    id: 2,
    title: "Ingeniero de Software Back-End",
    description:
      "Responsable de diseñar, construir y mantener servicios del lado del servidor escalables.",
    job_type: "Híbrido",
    salary: "30,000 - 40,000 MXN",
    languages: ["Node.js, ", "Python, ", "SQL"],
  },
  {
    id: 3,
    title: "Especialista DevOps",
    description:
      "Colabora con equipos de desarrollo para automatizar procesos de implementación y supervisar infraestructuras en la nube.",
    job_type: "Remoto",
    salary: "35,000 - 45,000 MXN",
    languages: ["Bash, ", "Docker, ", "Kubernetes, ", "AWS"],
  },
  {
    id: 4,
    title: "Diseñador UI/UX",
    description:
      "Crea experiencias de usuario intuitivas mediante la investigación de usuarios y diseño de interfaces atractivas.",
    job_type: "Presencial",
    salary: "20,000 - 25,000 MXN",
    languages: ["Adobe, ", "Figma, ", "Sketch"],
  },
  {
    id: 5,
    title: "Desarrollador Full-Stack",
    description:
      "Construye aplicaciones completas trabajando tanto en el front-end como en el back-end.",
    job_type: "Híbrido",
    salary: "35,000 - 50,000 MXN",
    languages: ["React, ", "Node.js, ", "TypeScript, ", "MongoDB"],
  },
  {
    id: 6,
    title: "Administrador de Base de Datos",
    description:
      "Responsable de la gestión, seguridad y optimización de bases de datos críticas para la empresa.",
    job_type: "Remoto",
    salary: "28,000 - 38,000 MXN",
    languages: ["SQL, ", "MySQL, ", "PostgreSQL, ", "NoSQL"],
  },
  {
    id: 7,
    title: "Analista de Datos",
    description:
      "Analiza y transforma datos para generar reportes y modelos predictivos que impulsen decisiones estratégicas.",
    job_type: "Híbrido",
    salary: "30,000 - 42,000 MXN",
    languages: ["Python, ", "R, ", "Excel, ", "Power BI, "],
  },
  {
    id: 8,
    title: "Ingeniero de Pruebas de Software",
    description:
      "Diseña e implementa pruebas automatizadas para garantizar la calidad del software antes de su lanzamiento.",
    job_type: "Presencial",
    salary: "25,000 - 35,000 MXN",
    languages: ["Selenium, ", "Cypress, ", "Java, ", "Python"],
  },
  {
    id: 9,
    title: "Especialista en Ciberseguridad",
    description:
      "Protege los sistemas y redes de la empresa mediante auditorías, análisis de vulnerabilidades y respuesta a incidentes.",
    job_type: "Remoto",
    salary: "40,000 - 55,000 MXN",
    languages: ["Python, ", "PowerShell, ", "C, ", "Linux"],
  },
  {
    id: 10,
    title: "Gerente de Producto Tecnológico",
    description:
      "Define la visión y estrategia de productos tecnológicos, asegurando su alineación con las necesidades del mercado.",
    job_type: "Híbrido",
    salary: "50,000 - 70,000 MXN",
    languages: ["Jira, ", "Trello, ", "Agile, ", "Scrum"],
  },
];

interface job {
  id: number;
  title: string;
  description: string;
  job_type: string;
  salary: string;
  languages: string[];
}

export default function Jobs() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectjob, setjob] = useState<job | null>(null);

  const openModal = (id: number) => {
    const job = datajobs.find((item, key) => key === id) || null;
    setjob(job);
    setModalVisible(true);
  };

  function closeModal() {
    setModalVisible(false);
  }

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
              <Text style={[styles.fontsize20, styles.mb20]}>Descripcíon</Text>
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
                // onPress={() => openModal(key)}
              />
              <Pressable style={{ backgroundColor: '#ff0000', padding: 10, borderRadius: 3 }} onPress={() => closeModal()}>
                <Text style={{ textAlign: "center", color: '#ffffff' }}>Cerrar</Text>
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
