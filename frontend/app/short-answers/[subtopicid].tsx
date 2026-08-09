import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { API_URL } from "../../lib/api";

type ShortQuestion = {
  id: number;
  subtopic_id: number;
  question: string;
  answer: string;
};

export default function ShortAnswersScreen() {
  const params = useLocalSearchParams();

console.log("SHORT ANSWERS PARAMS:", params);

const subtopicid = String(params.subtopicid);

console.log("SHORT ANSWERS SUBTOPIC ID:", subtopicid);

  const [questions, setQuestions] = useState<ShortQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/subtopics/${subtopicid}/short-questions/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("SHORT QUESTIONS:", data);

        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.log(
            "SHORT QUESTIONS IS NOT AN ARRAY:",
            data
          );

          setQuestions([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("SHORT QUESTIONS ERROR:", error);
        setQuestions([]);
        setLoading(false);
      });
  }, [subtopicid]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Loading short answers...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Short Answers
        </Text>

        {questions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No short answers yet
            </Text>

            <Text style={styles.emptyText}>
              Short answer questions will appear here.
            </Text>
          </View>
        ) : (
          questions.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                setOpenQuestion(
                  openQuestion === item.id
                    ? null
                    : item.id
                )
              }
            >
              <Text style={styles.number}>
                {index + 1}
              </Text>

              <Text style={styles.question}>
                {item.question}
              </Text>

              {openQuestion === item.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerLabel}>
                    Answer
                  </Text>

                  <Text style={styles.answer}>
                    {item.answer}
                  </Text>
                </View>
              )}
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
    padding: 24,
    paddingTop: 70,
  },

  loading: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    fontSize: 18,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  number: {
    color: "#777",
    fontSize: 13,
    marginBottom: 8,
  },

  question: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },

  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 18,
    paddingTop: 16,
  },

  answerLabel: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
    textTransform: "uppercase",
  },

  answer: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
});