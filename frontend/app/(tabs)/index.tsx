import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { useEffect, useState } from "react";
import { router } from "expo-router";
import { API_URL } from "../../lib/api";

type Subject = {
  id: number;
  name: string;
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/subjects/`)
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        PhysioFlow
      </Text>

      <Text style={styles.heading}>
        Your Subjects
      </Text>

      {subjects.map((subject) => (
        <TouchableOpacity
          key={subject.id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/topics/[subjectId]",
              params: {
                subjectId: String(subject.id),
              },
            })
          }
        >
          <Text style={styles.subject}>
            {subject.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 30,
    paddingTop: 80,
  },

  logo: {
    color: "#fff",
    fontSize: 42,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 40,
  },

  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#333",
  },

  subject: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});