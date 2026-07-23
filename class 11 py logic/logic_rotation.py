#!/usr/bin/env python3
"""
Quiz Generator for rotation.json
---------------------------------
Picks 11 Easy + 17 Medium + 11 Hard questions at random, runs the quiz,
and tells you which topics you're strong in and which ones are dragging you down.

WHY THIS EXISTS (read this before you complain about the code):
Your rotation.json is inconsistent. "Easy" and "Medium" are properly nested
as {"Easy": {topic: [questions]}, "Medium": {topic: [questions]}}, but the
"Hard" questions have NO wrapper key at all — they sit as bare topic keys
directly under the chapter, alongside "Easy" and "Medium". This script
detects and handles that mess automatically. Fix your source file if you
want this hack to go away.
"""

import json
import random
import sys
from collections import defaultdict

# ---- CONFIG ----
JSON_PATH = "rot.json"
COUNTS = {"Easy": 11, "Medium": 17, "Hard": 11}
PASS_THRESHOLD_ATTEMPTS = 2  # min questions attempted in a topic before we judge it


def load_data(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Can't find '{path}'. Put it in the same folder as this script.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Your JSON is malformed: {e}")
        sys.exit(1)


def get_topics_for_difficulty(chapter_dict, difficulty):
    """
    Returns {topic_name: [questions]} for the requested difficulty,
    no matter whether the file nests it properly (Easy/Medium) or
    dumps it flat at chapter level (your Hard bug).
    """
    if difficulty in chapter_dict and isinstance(chapter_dict[difficulty], dict):
        # Properly nested - normal case
        return chapter_dict[difficulty]

    if difficulty == "Hard":
        # Fallback: gather every key at chapter level that ISN'T a known
        # difficulty label and whose value is a list of questions.
        known_labels = {"Easy", "Medium", "Hard"}
        flat_topics = {}
        for key, value in chapter_dict.items():
            if key in known_labels:
                continue
            if isinstance(value, list):
                flat_topics[key] = value
        return flat_topics

    # Nothing found for this difficulty
    return {}


def collect_all_chapters(data):
    """
    Walk Subject -> Chapter and yield (subject, chapter, chapter_dict)
    so this works even if you add more subjects/chapters later.
    """
    for subject, chapters in data.items():
        for chapter, chapter_dict in chapters.items():
            yield subject, chapter, chapter_dict


def select_questions(data, counts):
    """
    For each difficulty, spreads the required number of questions as
    evenly as possible across all available topics (across all
    chapters/subjects), using random.sample so nobody gets the same quiz twice.

    Returns a flat list of dicts:
    {subject, chapter, topic, difficulty, question_data}
    """
    selected = []

    for difficulty, need_count in counts.items():
        # pool: list of (subject, chapter, topic, question_dict)
        pool_by_topic = defaultdict(list)

        for subject, chapter, chapter_dict in collect_all_chapters(data):
            topics = get_topics_for_difficulty(chapter_dict, difficulty)
            for topic, questions in topics.items():
                for q in questions:
                    pool_by_topic[(subject, chapter, topic)].append(q)

        if not pool_by_topic:
            print(f"No questions found for difficulty '{difficulty}'. Skipping.")
            continue

        topic_keys = list(pool_by_topic.keys())
        random.shuffle(topic_keys)

        total_available = sum(len(v) for v in pool_by_topic.values())
        if total_available < need_count:
            print(
                f"Warning: only {total_available} '{difficulty}' questions exist "
                f"total, but you asked for {need_count}. Taking all of them."
            )
            need_count = total_available

        # Round-robin allocation across topics so no single topic dominates
        allocation = {k: 0 for k in topic_keys}
        remaining = need_count
        idx = 0
        # Keep looping until we've allocated everything or every topic is exhausted
        while remaining > 0:
            made_progress = False
            for k in topic_keys:
                if remaining <= 0:
                    break
                if allocation[k] < len(pool_by_topic[k]):
                    allocation[k] += 1
                    remaining -= 1
                    made_progress = True
            if not made_progress:
                break  # every topic pool is exhausted

        # Now actually sample the questions per topic
        for (subject, chapter, topic), take_n in allocation.items():
            if take_n == 0:
                continue
            chosen = random.sample(pool_by_topic[(subject, chapter, topic)], take_n)
            for q in chosen:
                selected.append({
                    "subject": subject,
                    "chapter": chapter,
                    "topic": topic,
                    "difficulty": difficulty,
                    "q": q,
                })

    random.shuffle(selected)
    return selected


def run_quiz(selected):
    """
    Runs the quiz interactively in the terminal.
    Tracks per-topic correct/attempted counts.
    """
    topic_stats = defaultdict(lambda: {"correct": 0, "attempted": 0})
    score = 0

    total = len(selected)
    print(f"\n{'='*60}")
    print(f"QUIZ START — {total} questions ({', '.join(f'{k}:{v}' for k,v in COUNTS.items())})")
    print(f"{'='*60}\n")

    for i, item in enumerate(selected, 1):
        q = item["q"]
        topic = item["topic"]
        difficulty = item["difficulty"]

        print(f"Q{i}/{total} [{difficulty} | {topic}]")
        print(q["question"])
        for opt in q["options"]:
            print(f"  {opt}")

        answer = input("Your answer (A/B/C/D, or 's' to skip, 'q' to quit): ").strip().upper()

        if answer == "Q":
            print("Quiz ended early by user.")
            break
        if answer == "S":
            print("Skipped.\n")
            continue

        topic_stats[topic]["attempted"] += 1
        correct_letter = q["answer"].strip().upper()

        if answer == correct_letter:
            print("Correct.\n")
            score += 1
            topic_stats[topic]["correct"] += 1
        else:
            print(f"Wrong. Correct answer: {correct_letter}")
            print(f"Why: {q['solution']}\n")

    return score, topic_stats


def report(score, topic_stats, total):
    print(f"\n{'='*60}")
    print("RESULTS")
    print(f"{'='*60}")
    attempted_total = sum(v["attempted"] for v in topic_stats.values())
    print(f"Score: {score}/{attempted_total} attempted (out of {total} total questions)\n")

    if not topic_stats:
        print("You didn't answer enough questions to judge anything. No feedback possible.")
        return

    print("Topic-wise breakdown:")
    ranked = []
    for topic, stats in topic_stats.items():
        attempted = stats["attempted"]
        correct = stats["correct"]
        accuracy = correct / attempted if attempted else 0
        ranked.append((topic, correct, attempted, accuracy))
        print(f"  {topic}: {correct}/{attempted} ({accuracy*100:.0f}%)")

    # Only judge topics where you actually attempted enough questions.
    judgeable = [r for r in ranked if r[2] >= PASS_THRESHOLD_ATTEMPTS]

    print()
    if not judgeable:
        print(
            f"Nobody attempted at least {PASS_THRESHOLD_ATTEMPTS} questions in any single "
            "topic. Can't reliably call anything 'strong' or 'weak' off 1 data point. "
            "Answer more before you draw conclusions."
        )
        return

    judgeable.sort(key=lambda r: r[3])
    weakest = judgeable[0]
    strongest = judgeable[-1]

    if len(judgeable) < 2 or weakest[3] == strongest[3]:
        print(
            "Only one topic (or all tied) had enough attempts to judge — "
            "not enough spread to call anything strong vs weak yet. "
            f"Here's what you've got: {weakest[0]} — {weakest[1]}/{weakest[2]} "
            f"({weakest[3]*100:.0f}%). Answer more topics before drawing conclusions."
        )
        return

    print(f"WEAK TOPIC: {weakest[0]} — {weakest[1]}/{weakest[2]} ({weakest[3]*100:.0f}%)")
    print(f"STRONG TOPIC: {strongest[0]} — {strongest[1]}/{strongest[2]} ({strongest[3]*100:.0f}%)")

    if weakest[3] < 0.5:
        print(f"\nReality check: you're below 50% on '{weakest[0]}'. That's not bad luck, "
              "that's a gap in your prep. Go back to the concept, don't just grind more MCQs on it blind.")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else JSON_PATH
    data = load_data(path)
    selected = select_questions(data, COUNTS)

    if not selected:
        print("No questions selected. Check your JSON file / paths.")
        return

    score, topic_stats = run_quiz(selected)
    report(score, topic_stats, len(selected))


if __name__ == "__main__":
    main()