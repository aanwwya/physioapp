import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../../lib/api";

type Subtopic = {
  id: number;
  name: string;
  topic_id: number;
  parent_id: number | null;
};

export default function ChildSubtopicsScreen() {
  const {
    parentId,
    topicId,
    parentName,
  } = useLocalSearchParams<{
    parentId: string;
    topicId: string;
    parentName?: string;
  }>();

  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentId || !topicId) {
      console.log("MISSING PARAMS:", {
        parentId,
        topicId,
      });

      setLoading(false);
      return;
    }

    const url =
      `${API_URL}/topics/${topicId}/subtopics/parent/${parentId}`;

    console.log("FETCHING CHILD SUBTOPICS:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("CHILD SUBTOPICS DATA:", data);

        if (Array.isArray(data)) {
          setSubtopics(data);
        } else {
          setSubtopics([]);
        }
      })
      .catch((error) => {
        console.log(
          "CHILD SUBTOPICS ERROR:",
          error
        );

        setSubtopics([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [parentId, topicId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {parentName || "Bones"}
        </Text>

        {subtopics.length === 0 ? (
          <Text style={styles.emptyText}>
            No subtopics found.
          </Text>
        ) : (
          subtopics.map((subtopic) => (
            <TouchableOpacity
              key={subtopic.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => {
                console.log(
                  "OPENING BONE:",
                  subtopic.name
                );

                console.log(
                  "BONE ID:",
                  subtopic.id
                );

                console.log(
                  "TOPIC ID:",
                  topicId
                );

                /*
                 * IMPORTANT:
                 *
                 * subtopic.id is the ID of the
                 * actual bone.
                 *
                 * Example:
                 *
                 * Clavicle -> 14
                 * Scapula  -> 15
                 *
                 * We send THAT ID to StudyScreen.
                 */

                router.push({
                  pathname: "/study/[itemId]" as any,
                  params: {
                    itemId: String(subtopic.id),
                    topicId: String(topicId),
                    subtopicName: subtopic.name,
                    parentId: String(parentId),
                  },
                });
              }}
            >
              <Text style={styles.name}>
                {subtopic.name}
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    padding: 22,
    borderRadius: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },

  arrow: {
    color: "#777",
    fontSize: 22,
    marginLeft: 12,
  },

  emptyText: {
    color: "#666",
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888",
    fontSize: 16,
  },
});