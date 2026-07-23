import json
import random
from collections import defaultdict

# ====================== LOAD JSON ======================
with open('LOM.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# ====================== COLLECT ALL QUESTIONS ======================
all_questions = []

# Easy
easy_data = data.get("difficulty_levels", {}).get("Easy", {})
for topic_name, questions in easy_data.items():
    for q in questions:
        q_copy = q.copy()
        q_copy["difficulty"] = "Easy"
        q_copy["topic"] = topic_name
        all_questions.append(q_copy)

# Medium (sometimes under "Mid")
medium_data = data.get("difficulty_levels", {}).get("Mid", []) or data.get("difficulty_levels", {}).get("Medium", [])
if isinstance(medium_data, dict):
    for topic_name, questions in medium_data.items():
        for q in questions:
            q_copy = q.copy()
            q_copy["difficulty"] = "Medium"
            q_copy["topic"] = topic_name
            all_questions.append(q_copy)
else:
    for item in medium_data:
        topic_name = item.get("name", "Unknown")
        for q in item.get("questions", []):
            q_copy = q.copy()
            q_copy["difficulty"] = "Medium"
            q_copy["topic"] = topic_name
            all_questions.append(q_copy)

# Hard
hard_data = data.get("Hard", [])
for item in hard_data:
    topic_name = item.get("name", "Unknown")
    for q in item.get("questions", []):
        q_copy = q.copy()
        q_copy["difficulty"] = "Hard"
        q_copy["topic"] = topic_name
        all_questions.append(q_copy)

print(f"Total questions loaded: {len(all_questions)}\n")

# ====================== SEPARATE BY DIFFICULTY ======================
easy_qs   = [q for q in all_questions if q.get("difficulty") == "Easy"]
medium_qs = [q for q in all_questions if q.get("difficulty") == "Medium"]
hard_qs   = [q for q in all_questions if q.get("difficulty") == "Hard"]

# ====================== RANDOM SELECTION (15 each) ======================
selected = []
selected.extend(random.sample(easy_qs,   min(15, len(easy_qs))))
selected.extend(random.sample(medium_qs, min(15, len(medium_qs))))
selected.extend(random.sample(hard_qs,   min(15, len(hard_qs))))

random.shuffle(selected)

print(f"Quiz ready with {len(selected)} questions (15 Easy + 15 Medium + 15 Hard)\n")

# ====================== RUN THE QUIZ ======================
score = 0
topic_stats = defaultdict(lambda: {"correct": 0, "total": 0})

print("=== LAWS OF MOTION QUIZ ===\n")

for i, q in enumerate(selected, 1):
    print(f"Q{i} [{q['difficulty']}] - {q['topic']}")
    print(q["question"])
    for opt in q.get("options", []):
        print(opt)
    
    ans = input("\nYour answer (A/B/C/D): ").strip().upper()
    correct = q.get("answer", "")
    
    if ans == correct:
        print("✅ Correct!\n")
        score += 1
        topic_stats[q["topic"]]["correct"] += 1
    else:
        print(f"❌ Wrong! Correct: {correct}\n")
    
    topic_stats[q["topic"]]["total"] += 1

# ====================== RESULTS ======================
total = len(selected)
percentage = (score / total * 100) if total > 0 else 0

print("="*60)
print(f"FINAL SCORE: {score}/{total} = {percentage:.2f}%")
print("="*60)

print("\n📊 TOPIC-WISE PERFORMANCE:")
weak_topics = []

for topic, stats in topic_stats.items():
    acc = (stats["correct"] / stats["total"] * 100) if stats["total"] > 0 else 0
    print(f"  {topic}: {stats['correct']}/{stats['total']} ({acc:.1f}%)")
    if acc < 60:
        weak_topics.append((topic, acc))

if weak_topics:
    weakest = min(weak_topics, key=lambda x: x[1])
    print(f"\n🔴 WEAKEST TOPIC: **{weakest[0]}** ({weakest[1]:.1f}%)")
    print("   → Focus more on this topic!")
else:
    print("\n🎉 Excellent! No weak topics.")

print("\nQuiz completed! Run again for a new set.")