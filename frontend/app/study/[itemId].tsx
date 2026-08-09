import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function StudyScreen() {
  const {
    itemId,
    topicId,
    subtopicName,
    parentId,
  } = useLocalSearchParams<{
    itemId: string;
    topicId: string;
    subtopicName?: string;
    parentId?: string;
  }>();

  console.log("STUDY SCREEN");
  console.log("ITEM ID:", itemId);
  console.log("TOPIC ID:", topicId);
  console.log("SUBTOPIC NAME:", subtopicName);
  console.log("PARENT ID:", parentId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Study Options
      </Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          console.log(
            "OPENING MCQS FOR SUBTOPIC:",
            itemId
          );

          router.push({
            pathname: "/mcqs/[subtopicId]" as any,
            params: {
              subtopicId: String(itemId),
              topicId: String(topicId),
              subtopicName: String(
                subtopicName || ""
              ),
            },
          });
        }}
      >
        <View>
          <Text style={styles.cardTitle}>
            MCQs
          </Text>

          <Text style={styles.cardDescription}>
            Test your knowledge
          </Text>
        </View>

        <Text style={styles.arrow}>
          →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          console.log(
            "OPENING ONE-LINERS FOR SUBTOPIC:",
            itemId
          );

          router.push({
            pathname:
              "/short-answers/[subtopicid]" as any,
            params: {
              subtopicid: String(itemId),
              topicId: String(topicId),
            },
          });
        }}
      >
        <View>
          <Text style={styles.cardTitle}>
            One-Liners
          </Text>

          <Text style={styles.cardDescription}>
            Quick revision
          </Text>
        </View>

        <Text style={styles.arrow}>
          →
        </Text>
      </TouchableOpacity>
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

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 35,
  },

  card: {
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 22,
    height: 190,
    padding: 25,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },

  cardDescription: {
    color: "#888",
    fontSize: 15,
    fontWeight: "500",
  },

  arrow: {
    color: "#777",
    fontSize: 28,
    marginBottom: 2,
  },
});