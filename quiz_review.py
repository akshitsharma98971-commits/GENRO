"""
Physics Quiz Generator
-----------------------
Reads Units.json, picks random questions per difficulty
(8 Easy, 12 Medium, 5 Hard = 25 total), runs the quiz in the
terminal, then scores it and tells you which topic you're weakest in.

Usage:
    python quiz.py Units.json
"""

import json
import random
import sys
from collections import defaultdict

EASY_COUNT = 8
MEDIUM_COUNT = 12
HARD_COUNT = 5


def load_questions(Path):
    """Load the JSON and flatten it into {difficulty: [(topic, question_dict), ...]}"""
    with open(Path , "r", encoding="utf-8") as f:
        data = json.load(f)

    unit_data = data["Physics"]["Units and Dimension"]

    pools = {}
    for difficulty, topics in unit_data.items():
        flat = []
        for topic_name, questions in topics.items():
            topic_key = normalize_topic(topic_name)
            for q in questions:
                flat.append((topic_key, q))
        pools[difficulty] = flat
    return pools


def normalize_topic(name):
    """'Dimensional Formulae & Dimensional Equations' and
    'Dimensional Formulae and Dimensional Equations' should count as the same topic."""
    return name.replace("&", "and").strip()


def pick_questions(pools):
    """Randomly select the fixed number of questions from each difficulty pool."""
    selection = []

    for difficulty, count in [("Easy", EASY_COUNT), ("Medium", MEDIUM_COUNT), ("Hard", HARD_COUNT)]:
        pool = pools.get(difficulty, [])
        if len(pool) < count:
            print(f"Warning: only {len(pool)} '{difficulty}' questions available, "
                  f"needed {count}. Using all of them.")
            chosen = pool[:]
        else:
            chosen = random.sample(pool, count)
        for topic, q in chosen:
            selection.append({"difficulty": difficulty, "topic": topic, "q": q})

    random.shuffle(selection)  # mix difficulties together for the actual quiz
    return selection


def run_quiz(selection):
    """Ask each question in the terminal, collect answers."""
    score = 0
    topic_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    total = len(selection)

    for i, item in enumerate(selection, start=1):
        q = item["q"]
        topic = item["topic"]
        difficulty = item["difficulty"]

        print(f"\nQ{i}/{total} [{difficulty} - {topic}]")
        print(q["question"])
        for opt in q["options"]:
            print(" ", opt)

        user_answer = input("Your answer (A/B/C/D): ").strip().upper()
        correct_answer = q["answer"].strip().upper()

        topic_stats[topic]["total"] += 1
        if user_answer == correct_answer:
            print("Correct!")
            score += 1
            topic_stats[topic]["correct"] += 1
        else:
            print(f"Wrong. Correct answer: {correct_answer}")

    return score, total, topic_stats


def report(score, total, topic_stats):
    print("\n" + "=" * 40)
    print(f"FINAL SCORE: {score}/{total} ({score/total*100:.1f}%)")
    print("=" * 40)

    print("\nTopic-wise performance:")
    accuracy_by_topic = {}
    for topic, stats in topic_stats.items():
        acc = stats["correct"] / stats["total"] * 100
        accuracy_by_topic[topic] = acc
        print(f"  {topic}: {stats['correct']}/{stats['total']} ({acc:.1f}%)")

    if accuracy_by_topic:
        weakest_topic = min(accuracy_by_topic, key=accuracy_by_topic.get)
        print(f"\nWeakest topic: {weakest_topic} "
              f"({accuracy_by_topic[weakest_topic]:.1f}% accuracy)")
        print("Focus your revision there before moving on.")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "Units.json"
    pools = load_questions(path)
    selection = pick_questions(pools)
    score, total, topic_stats = run_quiz(selection)
    report(score, total, topic_stats)


if __name__ == "__main__":
    main()
