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
    mcqId,
    subtopicName,
    nextSubtopicId,
    nextSubtopicName,
  } = useLocalSearchParams<{
    subtopicId: string;
    topicId: string;
    mcqId?: string;
    subtopicName?: string;
    nextSubtopicId?: string;
    nextSubtopicName?: string;
  }>();

  console.log("MCQ SCREEN");
  console.log("SUBTOPIC ID:", subtopicId);
  console.log("TOPIC ID:", topicId);
  console.log("SUBTOPIC NAME:", subtopicName);
  console.log("NEXT SUBTOPIC ID:", nextSubtopicId);
  console.log("NEXT SUBTOPIC NAME:", nextSubtopicName);

  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] =
    useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!subtopicId) {
      console.log("MISSING SUBTOPIC ID");
      return;
    }

    const mcqUrl =
      `${API_URL}/subtopics/${subtopicId}/mcqs/`;

    console.log("FETCHING MCQS:", mcqUrl);

    fetch(mcqUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `MCQ HTTP error: ${response.status}`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("MCQS RECEIVED:", data);

        if (Array.isArray(data)) {
          setMcqs(data);

          if (mcqId) {
            const index = data.findIndex(
              (item: MCQ) =>
                item.id === Number(mcqId)
            );

            if (index !== -1) {
              setCurrentIndex(index);
            }
          }
        } else {
          setMcqs([]);
        }
      })
      .catch((error) => {
        console.log("MCQ FETCH ERROR:", error);
        setMcqs([]);
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
  }, [subtopicId, mcqId]);

  if (mcqs.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          No MCQs available.
        </Text>

        <TouchableOpacity
          style={styles.loadingButton}
          onPress={() => router.back()}
        >
          <Text style={styles.loadingButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * FINAL SCREEN
   */
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
              if (!nextSubtopicId) {
                console.log(
                  "NO NEXT SUBTOPIC ID"
                );
                return;
              }

              console.log(
                "MOVING TO NEXT SUBTOPIC:",
                nextSubtopicId,
                nextSubtopicName
              );

              router.push({
                pathname:
                  "/study/[itemId]" as any,

                params: {
                  itemId:
                    String(nextSubtopicId),

                  topicId:
                    String(topicId),

                  subtopicName:
                    String(
                      nextSubtopicName || ""
                    ),
                },
              });
            }}
          >
            <Text style={styles.secondaryButtonText}>
              Continue to Next Bone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Back
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
        await fetch(`${API_URL}/bookmarks/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mcq_id: mcq.id,
          }),
        });

        setBookmarkedIds((previous) => [
          ...previous,
          mcq.id,
        ]);
      } else {
        await fetch(
          `${API_URL}/bookmarks/${mcq.id}`,
          {
            method: "DELETE",
          }
        );

        setBookmarkedIds((previous) =>
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

    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(
        currentIndex + 1
      );
    } else {
      setCompleted(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Practice MCQs
        </Text>

        <Text style={styles.progressText}>
          Question {currentIndex + 1}/
          {mcqs.length}
        </Text>

        <View
          style={
            styles.progressBarBackground
          }
        >
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
          ].map((option: any) => {
            const selected =
              selectedAnswer === option[0];

            const correct =
              mcq.correct_answer ===
              option[0];

            return (
              <TouchableOpacity
                key={option[0]}
                style={[
                  styles.option,

                  selected && correct
                    ? styles.correct
                    : null,

                  selected && !correct
                    ? styles.wrong
                    : null,
                ]}
                onPress={() =>
                  selectAnswer(option[0])
                }
              >
                <Text
                  style={styles.optionText}
                >
                  {option[0]}. {option[1]}
                </Text>
              </TouchableOpacity>
            );
          })}

          {selectedAnswer && (
            <View>
              <Text style={styles.result}>
                {selectedAnswer ===
                mcq.correct_answer
                  ? "Correct Answer"
                  : `Wrong Answer. Correct answer: ${mcq.correct_answer}`}
              </Text>

              <Text
                style={styles.explanation}
              >
                {mcq.explanation}
              </Text>
            </View>
          )}

          <View style={styles.navigationRow}>

            {currentIndex > 0 && (
              <TouchableOpacity
                style={
                  styles.previousButton
                }
                onPress={() => {
                  setSelectedAnswer(null);

                  setCurrentIndex(
                    currentIndex - 1
                  );
                }}
              >
                <Text
                  style={
                    styles.previousText
                  }
                >
                  Previous
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={nextQuestion}
            >
              <Text
                style={styles.nextText}
              >
                {currentIndex ===
                mcqs.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Text>
            </TouchableOpacity>

          </View>

        </View>
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
    paddingTop: 70,
    paddingBottom: 50,
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

  loadingButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },

  loadingButtonText: {
    color: "#000",
    fontWeight: "600",
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 10,
  },

  progressText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 12,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 25,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    padding: 22,
  },

  question: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 25,
    lineHeight: 29,
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

  result: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
  },

  explanation: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 15,
    lineHeight: 23,
  },

  navigationRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },

  previousButton: {
    flex: 1,
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  previousText: {
    color: "#fff",
    fontWeight: "700",
  },

  nextButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  nextText: {
    color: "#000",
    fontWeight: "700",
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

  /*
   * FINAL SCREEN
   */

  finalScreen: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  finalBox: {
    backgroundColor: "#111",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#333",
    padding: 30,
    alignItems: "center",
  },

  finalTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  scoreSection: {
    alignItems: "center",
    marginTop: 40,
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
    fontSize: 15,
    fontWeight: "600",
  },

  backButton: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
  },

  backButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});