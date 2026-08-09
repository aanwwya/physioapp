import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";

import { API_URL } from "../../lib/api";

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

export default function MCQScreen() {
  const {
    subtopicId,
    topicId,
    subtopicName,
  } = useLocalSearchParams<{
    subtopicId: string;
    topicId: string;
    subtopicName?: string;
  }>();

  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] =
    useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("MCQ SCREEN");
  console.log("SUBTOPIC ID:", subtopicId);
  console.log("TOPIC ID:", topicId);
  console.log("SUBTOPIC NAME:", subtopicName);

  useEffect(() => {
    if (!subtopicId) {
      console.log("NO SUBTOPIC ID");
      return;
    }

    const mcqUrl =
      `${API_URL}/subtopics/${subtopicId}/mcqs/`;

    console.log("FETCHING MCQS:", mcqUrl);

    setLoading(true);

    fetch(mcqUrl)
      .then((response) => {
        console.log(
          "MCQ RESPONSE STATUS:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("MCQS RECEIVED:", data);

        if (Array.isArray(data)) {
          setMcqs(data);
        } else {
          setMcqs([]);
        }
      })
      .catch((error) => {
        console.log("MCQ FETCH ERROR:", error);
        setMcqs([]);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch(`${API_URL}/bookmarks/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const ids = data.map(
            (bookmark: any) => bookmark.mcq_id
          );

          setBookmarkedIds(ids);
        }
      })
      .catch((error) => {
        console.log(
          "BOOKMARK FETCH ERROR:",
          error
        );
      });
  }, [subtopicId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Loading MCQs...
        </Text>
      </View>
    );
  }

  if (mcqs.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          No MCQs available for this subtopic.
        </Text>

        <Text style={styles.debugText}>
          Subtopic ID: {subtopicId}
        </Text>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.finalScreen}>
        <View style={styles.finalBox}>

          <Text style={styles.finalTitle}>
            Quiz Completed
          </Text>

          <View style={styles.scoreSection}>
            <Text style={styles.scoreNumber}>
              {score}/{mcqs.length}
            </Text>

            <Text style={styles.scoreLabel}>
              correct
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setScore(0);
              setCompleted(false);
            }}
          >
            <Text style={styles.primaryButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Bones of Upper Limb
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextTopicButton}
            activeOpacity={0.8}
            onPress={() => {
              router.push("/study/" as any);
            }}
          >
            <Text style={styles.nextTopicText}>
              Continue to Next Topic →
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  const mcq = mcqs[currentIndex];

  const progress =
    ((currentIndex + 1) / mcqs.length) * 100;

  const selectAnswer = (answer: string) => {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === mcq.correct_answer) {
      setScore(
        (previousScore) =>
          previousScore + 1
      );
    }
  };

  const toggleBookmark = async () => {
    try {
      if (!bookmarkedIds.includes(mcq.id)) {
        await fetch(
          `${API_URL}/bookmarks/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mcq_id: mcq.id,
            }),
          }
        );

        setBookmarkedIds(
          (previous) => [
            ...previous,
            mcq.id,
          ]
        );
      } else {
        await fetch(
          `${API_URL}/bookmarks/${mcq.id}`,
          {
            method: "DELETE",
          }
        );

        setBookmarkedIds(
          (previous) =>
            previous.filter(
              (id) => id !== mcq.id
            )
        );
      }
    } catch (error) {
      console.log(
        "BOOKMARK ERROR:",
        error
      );
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);

    if (
      currentIndex <
      mcqs.length - 1
    ) {
      setCurrentIndex(
        (previousIndex) =>
          previousIndex + 1
      );
    } else {
      setCompleted(true);
    }
  };

  const previousQuestion = () => {
    setSelectedAnswer(null);

    if (currentIndex > 0) {
      setCurrentIndex(
        (previousIndex) =>
          previousIndex - 1
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Practice MCQs
      </Text>

      <Text style={styles.subtopic}>
        {subtopicName}
      </Text>

      <Text style={styles.progressText}>
        Question {currentIndex + 1}/{mcqs.length}
      </Text>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      <View style={styles.card}>

        <Text style={styles.question}>
          {mcq.question}
        </Text>

        <TouchableOpacity
          style={styles.bookmarkButton}
          activeOpacity={0.8}
          onPress={toggleBookmark}
        >
          <Text style={styles.bookmarkText}>
            {bookmarkedIds.includes(mcq.id)
              ? "Bookmarked"
              : "Bookmark"}
          </Text>
        </TouchableOpacity>

        {[
          ["A", mcq.option_a],
          ["B", mcq.option_b],
          ["C", mcq.option_c],
          ["D", mcq.option_d],
        ].map(([letter, text]) => {

          const selected =
            selectedAnswer === letter;

          const correct =
            mcq.correct_answer === letter;

          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.option,

                selected &&
                correct &&
                styles.correct,

                selected &&
                !correct &&
                styles.wrong,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                selectAnswer(letter)
              }
            >
              <Text style={styles.optionText}>
                {letter}. {text}
              </Text>
            </TouchableOpacity>
          );
        })}

        {selectedAnswer && (
          <View style={styles.answerBox}>

            <Text style={styles.result}>
              {selectedAnswer ===
              mcq.correct_answer
                ? "Correct Answer"
                : `Wrong Answer · Correct: ${mcq.correct_answer}`}
            </Text>

            <Text style={styles.explanation}>
              {mcq.explanation}
            </Text>

          </View>
        )}

        <View style={styles.navigationRow}>

          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              activeOpacity={0.8}
              onPress={previousQuestion}
            >
              <Text style={styles.previousText}>
                Previous
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={nextQuestion}
          >
            <Text style={styles.nextText}>
              {currentIndex ===
              mcqs.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Text>
          </TouchableOpacity>

        </View>

      </View>

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
    paddingTop: 75,
    paddingBottom: 50,
  },

  loading: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },

  debugText: {
    color: "#555",
    marginTop: 15,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtopic: {
    color: "#666",
    fontSize: 16,
    marginBottom: 30,
  },

  progressText: {
    color: "#888",
    fontSize: 15,
    marginBottom: 12,
  },

  progressBarBackground: {
    height: 7,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 25,
  },

  progressBar: {
    height: 7,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
    padding: 22,
  },

  question: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 29,
    marginBottom: 18,
  },

  bookmarkButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 18,
  },

  bookmarkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  option: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  optionText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 23,
  },

  correct: {
    backgroundColor: "#176b3a",
  },

  wrong: {
    backgroundColor: "#7a1f1f",
  },

  answerBox: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  result: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  explanation: {
    color: "#999",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },

  navigationRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },

  previousButton: {
    flex: 1,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
  },

  previousText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  nextButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
  },

  nextText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },

  finalScreen: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 25,
  },

  finalBox: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
  },

  finalTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },

  scoreSection: {
    alignItems: "center",
    marginTop: 45,
    marginBottom: 40,
  },

  scoreNumber: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "800",
  },

  scoreLabel: {
    color: "#777",
    fontSize: 15,
    marginTop: 4,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  nextTopicButton: {
    marginTop: 25,
    paddingVertical: 10,
  },

  nextTopicText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});