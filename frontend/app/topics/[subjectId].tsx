import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../lib/api";

type Topic = {
  id: number;
  name: string;
  subject_id: number;
};

export default function TopicsScreen() {
  const { subjectId } = useLocalSearchParams<{
    subjectId: string;
  }>();

  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (!subjectId) {
      console.log("NO SUBJECT ID");
      return;
    }

    const url = `${API_URL}/subjects/${subjectId}/topics/`;

    console.log("FETCHING TOPICS:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("TOPICS DATA:", data);

        if (Array.isArray(data)) {
          setTopics(data);
        } else {
          setTopics([]);
        }
      })
      .catch((error) => {
        console.log("TOPICS ERROR:", error);
        setTopics([]);
      });
  }, [subjectId]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.logo}>
        PhysioFlow
      </Text>

      <Text style={styles.title}>
        Volumes
      </Text>

      {topics.map((topic) => (
        <TouchableOpacity
          key={topic.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => {
            console.log("CLICKED TOPIC:", topic);

            router.push({
              pathname: "/subtopics/topic/[topicId]" as any,
              params: {
                topicId: String(topic.id),
              },
            });
          }}
        >
          <Text style={styles.topic}>
            {topic.name}
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  contentContainer: {
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },

  logo: {
    color: "#fff",
    fontSize: 42,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 35,
  },

  title: {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topic: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  arrow: {
    color: "#777",
    fontSize: 22,
  },
});