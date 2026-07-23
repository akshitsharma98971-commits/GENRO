import json
import random
from collections import defaultdict

# Load the JSON file
with open('plane.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract questions from Easy, Medium, Hard
easy_questions = []
medium_questions = []
hard_questions = []

# Navigate the structure
physics = data.get("Physics", {})
motion_plane = physics.get("Motion in Plane", {})

# Easy
if "Easy" in motion_plane:
    for subtopic_name, questions in motion_plane["Easy"].items():
        for q in questions:
            q['subtopic'] = subtopic_name
            q['difficulty'] = 'easy'
            easy_questions.append(q)

# Medium
if "Medium" in motion_plane:
    for subtopic in motion_plane["Medium"]:
        sub_name = subtopic.get("name", "Unknown")
        for q in subtopic.get("questions", []):
            q['subtopic'] = sub_name
            q['difficulty'] = 'medium'
            medium_questions.append(q)

# Hard
if "Hard" in motion_plane:
    for subtopic in motion_plane["Hard"]:
        sub_name = subtopic.get("name", "Unknown")
        for q in subtopic.get("questions", []):
            q['subtopic'] = sub_name
            q['difficulty'] = 'hard'
            hard_questions.append(q)

# Select questions
selected = []
selected.extend(random.sample(easy_questions, min(10, len(easy_questions))))
selected.extend(random.sample(medium_questions, min(12, len(medium_questions))))
selected.extend(random.sample(hard_questions, min(8, len(hard_questions))))

random.shuffle(selected)

def run_quiz(questions):
    score = 0
    total = len(questions)
    user_answers = {}
    
    print("\n=== MOTION IN PLANE - MIXED DIFFICULTY QUIZ ===\n")
    for i, q in enumerate(questions, 1):
        print(f"Q{i}. {q['question']}")
        for opt in q.get('options', []):
            print(opt)
        ans = input("Your answer (A/B/C/D): ").strip().upper()
        user_answers[q['qid']] = ans
        
        correct = q.get('answer', '')
        if ans == correct:
            score += 1
            print("✅ Correct!\n")
        else:
            print(f"❌ Wrong! Correct answer: {correct}\n")
        print("-" * 60)
    
    percentage = (score / total) * 100 if total > 0 else 0
    print(f"\n🎯 Your Final Score: {score}/{total} ({percentage:.2f}%)")
    
    # Weak topic analysis
    subtopic_perf = defaultdict(lambda: {'correct': 0, 'total': 0})
    
    for q in questions:
        sub = q.get('subtopic', 'Unknown')
        subtopic_perf[sub]['total'] += 1
        if user_answers.get(q['qid']) == q.get('answer'):
            subtopic_perf[sub]['correct'] += 1
    
    print("\n📊 Performance by Subtopic:")
    weak_topics = []
    for sub, perf in subtopic_perf.items():
        perc = (perf['correct'] / perf['total']) * 100 if perf['total'] > 0 else 0
        print(f"  {sub}: {perf['correct']}/{perf['total']} ({perc:.1f}%)")
        if perc < 60:
            weak_topics.append(sub)
    
    if weak_topics:
        print(f"\n⚠️ Weak Topics (below 60%): {', '.join(weak_topics)}")
        print("Recommendation: Revise these topics.")
    else:
        print("\n🎉 Excellent! No weak topics identified.")
    
    return percentage

# Run the quiz
if __name__ == "__main__":
    if not selected:
        print("No questions loaded. Check the JSON file.")
    else:
        run_quiz(selected)