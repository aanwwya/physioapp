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

export default function SubtopicsScreen() {
  const { topicId } = useLocalSearchParams<{
    topicId: string;
  }>();

  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicId) {
      console.log("NO TOPIC ID");
      setLoading(false);
      return;
    }

    const url = `${API_URL}/topics/${topicId}/subtopics/`;

    console.log("FETCHING SUBTOPICS:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("ALL SUBTOPICS:", data);

        if (Array.isArray(data)) {
          // Only show top-level subtopics.
          // Child subtopics such as Clavicle, Scapula, etc.
          // are handled by the parent screen.
          const topLevelSubtopics = data.filter(
            (subtopic: Subtopic) =>
              subtopic.parent_id === null
          );

          console.log(
            "TOP LEVEL SUBTOPICS:",
            topLevelSubtopics
          );

          setSubtopics(topLevelSubtopics);
        } else {
          setSubtopics([]);
        }
      })
      .catch((error) => {
        console.log("SUBTOPICS ERROR:", error);
        setSubtopics([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topicId]);

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
          Contents
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
                  "CLICKED SUBTOPIC:",
                  subtopic
                );

                /*
                 * PHYSIOLOGY
                 *
                 * Physiology topic IDs are currently:
                 * 8  General Physiology
                 * 9  Blood
                 * 10 Nerve Muscle Physiology
                 * 11 Cardiovascular System
                 * 12 Respiratory System
                 * 13 Gastrointestinal System
                 * 14 Excretory System
                 * 15 CNS
                 * 16 Special Senses
                 * 17 Endocrinology
                 * 18 Reproductive and Integrated Physiology
                 *
                 * These subtopics should directly open
                 * the Study Options screen.
                 */
                if (
                  Number(topicId) >= 8 &&
                  Number(topicId) <= 18
                ) {
                  console.log(
                    "PHYSIOLOGY SUBTOPIC → STUDY SCREEN"
                  );

                  router.push({
                    pathname:
                      "/study/[itemId]" as any,
                    params: {
                      itemId: String(
                        subtopic.id
                      ),
                      topicId: String(
                        topicId
                      ),
                      subtopicName:
                        subtopic.name,
                    },
                  });

                  return;
                }

                /*
                 * ANATOMY
                 *
                 * Introduction goes directly
                 * to the Study Options screen.
                 */
                if (
                  subtopic.name
                    .toLowerCase()
                    .trim() ===
                  "introduction"
                ) {
                  router.push({
                    pathname:
                      "/study/[itemId]" as any,
                    params: {
                      itemId: String(
                        subtopic.id
                      ),
                      topicId: String(
                        topicId
                      ),
                      subtopicName:
                        subtopic.name,
                    },
                  });

                  return;
                }

                /*
                 * ANATOMY PARENT SUBTOPICS
                 *
                 * Example:
                 * Bones of Upper Limb
                 *      ↓
                 * Clavicle
                 * Scapula
                 * Humerus
                 * etc.
                 */
                router.push({
                  pathname:
                    "/subtopics/parent/[parentId]" as any,
                  params: {
                    parentId: String(
                      subtopic.id
                    ),
                    topicId: String(
                      topicId
                    ),
                    parentName:
                      subtopic.name,
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
    fontSize: 34,
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