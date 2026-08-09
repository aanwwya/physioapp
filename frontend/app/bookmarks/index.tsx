import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";

import { API_URL } from "../../lib/api";

type Bookmark = {
  id: number;
  user_id: number;
  mcq_id: number;
  subtopic_id: number;
};


type MCQ = {
  id: number;
  subtopic_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
};

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${API_URL}/bookmarks/`)
    .then((response) => response.json())
    .then(async (bookmarkData) => {
      console.log("BOOKMARKS:", bookmarkData);

      setBookmarks(bookmarkData);

      const mcqResults = await Promise.all(
        bookmarkData.map((bookmark: Bookmark) =>
          fetch(
            `${API_URL}/subtopics/${bookmark.subtopic_id}/mcqs/`
          ).then((response) => response.json())
        )
      );

      const allMcqs = mcqResults.flat();

      setMcqs(allMcqs);
      setLoading(false);
    })
    .catch((error) => {
      console.log("BOOKMARK ERROR:", error);
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Loading bookmarks...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Bookmarks
      </Text>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No bookmarks yet
          </Text>

          <Text style={styles.emptyText}>
            MCQs you bookmark will appear here.
          </Text>
        </View>
      ) : (
        bookmarks.map((bookmark) => {
          const mcq = mcqs.find(
            (item) => item.id === bookmark.mcq_id
          );

          if (!mcq) {
            return null;
          }

          return (
            <TouchableOpacity
              key={bookmark.id}
              style={styles.card}
              onPress={() => {
                router.push({
                  pathname: "/mcqs/[subtopicId]" as any,
                  params: {
                    subtopicId: String(mcq.subtopic_id),
                    mcqId: String(mcq.id),
                  },
                });
              }}
            >
              <Text style={styles.question}>
                {mcq.question}
              </Text>

              <Text style={styles.mcqId}>
                Bookmarked MCQ
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 30,
    paddingTop: 80,
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
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },

  question: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  mcqId: {
    color: "#777",
    fontSize: 14,
    marginTop: 8,
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