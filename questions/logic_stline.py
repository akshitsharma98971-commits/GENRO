"""
Physics Quiz Generator
----------------------
Reads a question bank JSON file (e.g. stline.json) shaped like:

    {
      "Physics": {
        "<Chapter Name>": {
          "Easy":   { "<Topic Name>": [ {question, options, answer}, ... ], ... },
          "Medium": { ... },
          "Hard":   { ... }
        },
        "<Another Chapter>": { ... }   # optional, script handles any number of chapters
      }
    }

It randomly picks:
    5  questions from Easy
    5  questions from Medium
    12 questions from Hard
(picked across ALL topics/chapters combined for that difficulty — not per topic,
since you asked for fixed totals, not per-topic splits)

Then runs an interactive quiz in the terminal, and at the end reports which
topic you're strongest and weakest in, based on your accuracy in THIS run.

Usage:
    python3 quiz.py stline.json
"""

import json
import random
import sys
from collections import defaultdict

EASY_COUNT = 5
MEDIUM_COUNT = 5
HARD_COUNT = 12


def load_bank(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def flatten_questions(node, path=None):
    """
    Walk the JSON tree and find every list of question-dicts.
    Returns a list of dicts:
        {
            "question": ..., "options": [...], "answer": ...,
            "difficulty": <str or None>, "topic": <str>, "chapter": <str or None>
        }
    Works regardless of exact nesting depth (Physics/Chapter/Difficulty/Topic),
    as long as Easy/Medium/Hard appears somewhere in the path and the leaf
    is a list of dicts with "question"/"options"/"answer" keys.
    """
    if path is None:
        path = []

    results = []

    if isinstance(node, list):
        # Is this a leaf list of question dicts?
        if node and isinstance(node[0], dict) and "question" in node[0] and "options" in node[0]:
            topic = path[-1] if path else "Unknown Topic"
            difficulty = None
            chapter = None
            for p in path:
                if p.lower() in ("easy", "medium", "hard"):
                    difficulty = p
            # chapter = whatever sits right below "Physics" (or below root) and
            # above the difficulty level, if we can find it
            if "Physics" in path:
                phys_idx = path.index("Physics")
                if phys_idx + 1 < len(path):
                    chapter = path[phys_idx + 1]

            for q in node:
                results.append({
                    "question": q.get("question", ""),
                    "options": q.get("options", []),
                    "answer": q.get("answer", ""),
                    "difficulty": difficulty,
                    "topic": topic,
                    "chapter": chapter,
                })
        return results

    if isinstance(node, dict):
        for key, value in node.items():
            results.extend(flatten_questions(value, path + [key]))
        return results

    return results


def build_pools(all_questions):
    pools = defaultdict(list)
    for q in all_questions:
        diff = (q["difficulty"] or "").strip().lower()
        if diff in ("easy", "medium", "hard"):
            pools[diff].append(q)
    return pools


def pick_quiz(pools):
    quiz = []
    plan = [("easy", EASY_COUNT), ("medium", MEDIUM_COUNT), ("hard", HARD_COUNT)]
    for diff, count in plan:
        available = pools.get(diff, [])
        if not available:
            print(f"⚠️  No '{diff}' questions found in the file — skipping that part.")
            continue
        n = min(count, len(available))
        if n < count:
            print(f"⚠️  Only {n} '{diff}' questions available (wanted {count}).")
        quiz.extend(random.sample(available, n))
    random.shuffle(quiz)
    return quiz


def ask_question(idx, q):
    print(f"\nQ{idx}. [{(q['difficulty'] or '?').title()} | {q['topic']}]")
    print(q["question"])
    for opt in q["options"]:
        print(" ", opt)
    while True:
        ans = input("Your answer (A/B/C/D, or 'skip'): ").strip().upper()
        if ans == "SKIP":
            return None
        if ans in ("A", "B", "C", "D"):
            return ans
        print("Please type A, B, C, D, or 'skip'.")


def run_quiz(quiz):
    topic_stats = defaultdict(lambda: {"correct": 0, "total": 0})
    score = 0
    attempted = 0

    for i, q in enumerate(quiz, start=1):
        user_ans = ask_question(i, q)
        topic_stats[q["topic"]]["total"] += 1
        if user_ans is None:
            continue
        attempted += 1
        if user_ans == q["answer"]:
            score += 1
            topic_stats[q["topic"]]["correct"] += 1
            print("✅ Correct!")
        else:
            print(f"❌ Wrong. Correct answer: {q['answer']}")

    return score, attempted, len(quiz), topic_stats


def report(score, attempted, total, topic_stats):
    print("\n" + "=" * 50)
    print(f"SCORE: {score} / {attempted} attempted ({total} total questions)")
    print("=" * 50)

    print("\nTopic-wise breakdown:")
    accuracy = {}
    for topic, stats in topic_stats.items():
        total_t = stats["total"]
        correct_t = stats["correct"]
        pct = (correct_t / total_t * 100) if total_t else 0.0
        accuracy[topic] = pct
        print(f"  {topic:45s} {correct_t}/{total_t}  ({pct:.0f}%)")

    if not accuracy:
        print("\nNo questions were answered — can't determine strong/weak topics.")
        return

    # Only consider topics with at least 1 question actually answered (not skipped)
    scored_topics = {t: p for t, p in accuracy.items() if topic_stats[t]["total"] > 0}

    best_pct = max(scored_topics.values())
    worst_pct = min(scored_topics.values())

    strong_topics = [t for t, p in scored_topics.items() if p == best_pct]
    weak_topics = [t for t, p in scored_topics.items() if p == worst_pct]

    print("\nSTRONG topic(s):", ", ".join(strong_topics), f"({best_pct:.0f}%)")
    print("WEAK topic(s):  ", ", ".join(weak_topics), f"({worst_pct:.0f}%)")


DEFAULT_FILE = "Stline.json"


def main():
    if len(sys.argv) >= 2:
        path = sys.argv[1]
    else:
        path = DEFAULT_FILE
        print(f"No file given — defaulting to '{DEFAULT_FILE}' "
              f"(pass a path as an argument to use a different file).")
    bank = load_bank(path)
    all_questions = flatten_questions(bank)

    if not all_questions:
        print("No questions found in the file. Check the JSON structure.")
        sys.exit(1)

    pools = build_pools(all_questions)
    quiz = pick_quiz(pools)

    if not quiz:
        print("No questions could be selected. Check that Easy/Medium/Hard keys exist.")
        sys.exit(1)

    print(f"Starting quiz: {len(quiz)} questions "
          f"(aiming for {EASY_COUNT} easy, {MEDIUM_COUNT} medium, {HARD_COUNT} hard).\n")

    score, attempted, total, topic_stats = run_quiz(quiz)
    report(score, attempted, total, topic_stats)


if __name__ == "__main__":
    main()
