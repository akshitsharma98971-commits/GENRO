import json
import random
import os
from collections import defaultdict

class ChemistryQuiz:
    def __init__(self, json_file="ch1.json"):
        """Initialize the quiz with questions from JSON file"""
        self.questions_data = self.load_questions(json_file)
        self.score = 0
        self.total_questions = 0
        self.topic_scores = {}
        self.weak_topics = []
        self.strong_topics = []
        self.answered_questions = []
        
    def load_questions(self, json_file):
        """Load questions from JSON file"""
        try:
            with open(json_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
                return data
        except FileNotFoundError:
            print(f"Error: {json_file} not found!")
            return None
        except json.JSONDecodeError:
            print("Error: Invalid JSON format!")
            return None
    
    def extract_questions_by_difficulty(self, difficulty):
        """Extract questions by difficulty level from the JSON structure"""
        questions = []
        try:
            chemistry_data = self.questions_data.get("Chemistry", {})
            some_basic = chemistry_data.get("Some Basic Concepts of Chemistry", {})
            difficulty_data = some_basic.get(difficulty, {})
            
            for topic, questions_list in difficulty_data.items():
                for q in questions_list:
                    questions.append({
                        "topic": topic,
                        "difficulty": difficulty,
                        "question": q.get("question", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "explanation": q.get("explanation", "No explanation available")
                    })
        except (KeyError, AttributeError) as e:
            print(f"Error extracting questions for difficulty {difficulty}: {e}")
        return questions
    
    def get_all_topics(self):
        """Get all available topics from the JSON"""
        topics = []
        try:
            chemistry_data = self.questions_data.get("Chemistry", {})
            some_basic = chemistry_data.get("Some Basic Concepts of Chemistry", {})
            for difficulty in ["Easy", "Medium", "Hard"]:
                diff_data = some_basic.get(difficulty, {})
                for topic in diff_data.keys():
                    if topic not in topics:
                        topics.append(topic)
        except (KeyError, AttributeError):
            pass
        return topics
    
    def select_questions(self):
        """Select 12 questions from each difficulty level ensuring topic coverage"""
        selected = []
        all_topics = self.get_all_topics()
        
        for difficulty in ["Easy", "Medium", "Hard"]:
            difficulty_questions = []
            questions_by_difficulty = self.extract_questions_by_difficulty(difficulty)
            
            # Group questions by topic
            topic_groups = defaultdict(list)
            for q in questions_by_difficulty:
                topic_groups[q["topic"]].append(q)
            
            # Get available topics for this difficulty
            available_topics = list(topic_groups.keys())
            
            # Select 1 question from each available topic
            for topic in available_topics:
                if topic_groups[topic]:
                    difficulty_questions.append(random.choice(topic_groups[topic]))
            
            # Fill remaining with random questions from any topic
            remaining_needed = 12 - len(difficulty_questions)
            all_remaining = []
            for topic, questions in topic_groups.items():
                selected_topics = [q["topic"] for q in difficulty_questions]
                remaining = [q for q in questions if q["topic"] not in selected_topics]
                all_remaining.extend(remaining)
            
            if all_remaining and remaining_needed > 0:
                extra = random.sample(all_remaining, min(remaining_needed, len(all_remaining)))
                difficulty_questions.extend(extra)
            
            # If still not enough, add more from any topic
            if len(difficulty_questions) < 12:
                all_available = []
                for questions in topic_groups.values():
                    all_available.extend(questions)
                extra_needed = 12 - len(difficulty_questions)
                remaining_questions = [q for q in all_available if q not in difficulty_questions]
                if remaining_questions:
                    extra = random.sample(remaining_questions, min(extra_needed, len(remaining_questions)))
                    difficulty_questions.extend(extra)
            
            # Shuffle and add to selected
            random.shuffle(difficulty_questions)
            selected.extend(difficulty_questions[:12])
        
        self.total_questions = len(selected)
        return selected
    
    def display_question(self, q, q_num):
        """Display a single question"""
        print("\n" + "="*70)
        print(f"Q{q_num}. [{q['topic']}] - {q['difficulty']}")
        print("="*70)
        print(f"{q['question']}")
        print("-"*70)
        for option in q['options']:
            print(f"  {option}")
        print("-"*70)
    
    def get_user_answer(self):
        """Get user's answer with validation"""
        while True:
            answer = input("Your answer (A/B/C/D): ").strip().upper()
            if answer in ['A', 'B', 'C', 'D']:
                return answer
            else:
                print("Invalid input. Please enter A, B, C, or D.")
    
    def run_quiz(self):
        """Run the complete quiz"""
        print("\n" + "="*70)
        print("   SOME BASIC CONCEPTS OF CHEMISTRY - QUIZ")
        print("="*70)
        print("You will be given 36 questions (12 Easy, 12 Medium, 12 Hard)")
        print("At least 1 question from each topic will be included")
        print("="*70)
        
        input("\nPress Enter to start the quiz...")
        
        questions = self.select_questions()
        random.shuffle(questions)  # Mix all difficulties
        
        for idx, q in enumerate(questions, 1):
            self.display_question(q, idx)
            user_answer = self.get_user_answer()
            
            # Check answer
            correct_answer = q['answer']
            is_correct = user_answer == correct_answer
            
            if is_correct:
                print("✅ CORRECT!")
                self.score += 1
            else:
                print(f"❌ INCORRECT. The correct answer is: {correct_answer}")
                if q.get('explanation'):
                    print(f"Explanation: {q['explanation']}")
            
            # Track topic performance
            topic = q['topic']
            if topic not in self.topic_scores:
                self.topic_scores[topic] = {"correct": 0, "total": 0, "questions": []}
            self.topic_scores[topic]["total"] += 1
            self.topic_scores[topic]["questions"].append({
                "question": q['question'][:80] + "...",
                "correct": is_correct
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
            
            print("-"*70)
        
        self.display_results()
        self.analyze_topics()
    
    def display_results(self):
        """Display quiz results"""
        print("\n" + "="*70)
        print("   QUIZ RESULTS")
        print("="*70)
        print(f"Total Questions: {self.total_questions}")
        print(f"Correct Answers: {self.score}")
        percentage = (self.score / self.total_questions) * 100 if self.total_questions > 0 else 0
        print(f"Score: {self.score}/{self.total_questions} ({percentage:.1f}%)")
        
        # Grade
        if percentage >= 80:
            grade = "A - Excellent!"
        elif percentage >= 60:
            grade = "B - Good!"
        elif percentage >= 40:
            grade = "C - Fair"
        else:
            grade = "D - Needs Improvement"
        print(f"Grade: {grade}")
        print("="*70)
    
    def analyze_topics(self):
        """Analyze topic performance"""
        print("\n" + "="*70)
        print("   TOPIC-WISE PERFORMANCE")
        print("="*70)
        
        weak = []
        strong = []
        
        # Sort topics by performance
        sorted_topics = sorted(self.topic_scores.items(), 
                              key=lambda x: (x[1]["correct"]/x[1]["total"]) if x[1]["total"] > 0 else 0)
        
        for topic, data in sorted_topics:
            total = data["total"]
            correct = data["correct"]
            if total > 0:
                score_pct = (correct / total) * 100
                print(f"\n{topic}:")
                print(f"  Score: {correct}/{total} ({score_pct:.1f}%)")
                
                if score_pct < 50:
                    weak.append((topic, score_pct))
                elif score_pct >= 70:
                    strong.append((topic, score_pct))
        
        # Display weak topics
        if weak:
            print("\n" + "-"*70)
            print("⚠️ WEAK TOPICS (Score < 50%):")
            weak.sort(key=lambda x: x[1])
            for topic, score in weak:
                print(f"  • {topic}: {score:.1f}%")
                # Show questions answered incorrectly
                for q_data in self.topic_scores[topic]["questions"]:
                    if not q_data["correct"]:
                        print(f"    - Review: {q_data['question']}")
        else:
            print("\n✅ No weak topics! Great job!")
        
        # Display strong topics
        if strong:
            print("\n" + "-"*70)
            print("💪 STRONG TOPICS (Score >= 70%):")
            strong.sort(key=lambda x: x[1], reverse=True)
            for topic, score in strong:
                print(f"  • {topic}: {score:.1f}%")
        else:
            print("\n📚 Keep practicing to build stronger topics!")
        
        print("="*70)
        
        # Suggestions for improvement
        if weak:
            print("\n📝 SUGGESTIONS FOR IMPROVEMENT:")
            print("Focus on reviewing these weak topics:")
            for topic, _ in weak:
                print(f"  • {topic}")
            print("\nRecommended study materials:")
            print("  • Review NCERT Chemistry textbook")
            print("  • Practice more MCQs from these topics")
            print("  • Watch video explanations for conceptual clarity")
    
    def run_interactive(self):
        """Run interactive quiz with user choices"""
        while True:
            print("\n" + "="*70)
            print("   SOME BASIC CONCEPTS OF CHEMISTRY - MENU")
            print("="*70)
            print("1. Full Quiz (36 questions - All topics & difficulties)")
            print("2. Practice by Difficulty Level")
            print("3. Practice by Topic")
            print("4. View My Performance")
            print("5. Exit")
            print("-"*70)
            
            choice = input("Select an option (1-5): ").strip()
            
            if choice == '1':
                self.reset_score()
                self.run_quiz()
            elif choice == '2':
                self.practice_by_difficulty()
            elif choice == '3':
                self.practice_by_topic()
            elif choice == '4':
                if self.topic_scores:
                    self.analyze_topics()
                else:
                    print("\n📊 No data available. Complete a quiz first!")
            elif choice == '5':
                print("\nThank you for using Chemistry Quiz! 👋")
                break
            else:
                print("\nInvalid option. Please try again.")
    
    def practice_by_difficulty(self):
        """Practice questions by difficulty level"""
        print("\n" + "="*70)
        print("   PRACTICE BY DIFFICULTY")
        print("="*70)
        print("1. Easy (Basic concepts)")
        print("2. Medium (Conceptual understanding)")
        print("3. Hard (Advanced problems)")
        print("4. All Difficulties")
        print("-"*70)
        
        choice = input("Select difficulty (1-4): ").strip()
        
        difficulties = {
            '1': ["Easy"],
            '2': ["Medium"],
            '3': ["Hard"],
            '4': ["Easy", "Medium", "Hard"]
        }
        
        if choice not in difficulties:
            print("Invalid choice!")
            return
        
        selected_difficulties = difficulties[choice]
        questions = []
        
        for diff in selected_difficulties:
            questions.extend(self.extract_questions_by_difficulty(diff))
        
        if not questions:
            print("No questions found for this difficulty!")
            return
        
        random.shuffle(questions)
        # Limit to 15 questions for practice
        questions = questions[:15]
        self.total_questions = len(questions)
        self.score = 0
        
        print(f"\n🎯 Practicing {len(questions)} questions from: {', '.join(selected_difficulties)}")
        input("\nPress Enter to start...")
        
        for idx, q in enumerate(questions, 1):
            self.display_question(q, idx)
            user_answer = self.get_user_answer()
            
            correct_answer = q['answer']
            is_correct = user_answer == correct_answer
            
            if is_correct:
                print("✅ CORRECT!")
                self.score += 1
            else:
                print(f"❌ INCORRECT. The correct answer is: {correct_answer}")
                if q.get('explanation'):
                    print(f"Explanation: {q['explanation']}")
            
            # Track topic performance
            topic = q['topic']
            if topic not in self.topic_scores:
                self.topic_scores[topic] = {"correct": 0, "total": 0, "questions": []}
            self.topic_scores[topic]["total"] += 1
            self.topic_scores[topic]["questions"].append({
                "question": q['question'][:80] + "...",
                "correct": is_correct
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
        
        self.display_results()
        self.analyze_topics()
    
    def practice_by_topic(self):
        """Practice questions by specific topic"""
        topics = self.get_all_topics()
        
        if not topics:
            print("No topics found!")
            return
        
        print("\n" + "="*70)
        print("   PRACTICE BY TOPIC")
        print("="*70)
        for i, topic in enumerate(topics, 1):
            print(f"{i}. {topic}")
        print("0. All Topics")
        print("-"*70)
        
        choice = input("Select topic number: ").strip()
        
        if choice == '0':
            # Get questions from all topics
            all_questions = []
            for diff in ["Easy", "Medium", "Hard"]:
                all_questions.extend(self.extract_questions_by_difficulty(diff))
            questions = random.sample(all_questions, min(15, len(all_questions)))
        else:
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(topics):
                    selected_topic = topics[idx]
                    questions = []
                    for diff in ["Easy", "Medium", "Hard"]:
                        qs = self.extract_questions_by_difficulty(diff)
                        topic_questions = [q for q in qs if q["topic"] == selected_topic]
                        questions.extend(topic_questions)
                    
                    if not questions:
                        print(f"No questions found for topic: {selected_topic}")
                        return
                    
                    random.shuffle(questions)
                    questions = questions[:15]  # Limit to 15 questions
                else:
                    print("Invalid topic number!")
                    return
            except ValueError:
                print("Invalid input!")
                return
        
        self.total_questions = len(questions)
        self.score = 0
        
        print(f"\n🎯 Practicing {len(questions)} questions")
        input("\nPress Enter to start...")
        
        for idx, q in enumerate(questions, 1):
            self.display_question(q, idx)
            user_answer = self.get_user_answer()
            
            correct_answer = q['answer']
            is_correct = user_answer == correct_answer
            
            if is_correct:
                print("✅ CORRECT!")
                self.score += 1
            else:
                print(f"❌ INCORRECT. The correct answer is: {correct_answer}")
                if q.get('explanation'):
                    print(f"Explanation: {q['explanation']}")
            
            # Track topic performance
            topic = q['topic']
            if topic not in self.topic_scores:
                self.topic_scores[topic] = {"correct": 0, "total": 0, "questions": []}
            self.topic_scores[topic]["total"] += 1
            self.topic_scores[topic]["questions"].append({
                "question": q['question'][:80] + "...",
                "correct": is_correct
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
        
        self.display_results()
        self.analyze_topics()
    
    def reset_score(self):
        """Reset scores for a new quiz"""
        self.score = 0
        self.total_questions = 0
        self.topic_scores = {}

def main():
    """Main function to run the quiz application"""
    # Check if JSON file exists
    if not os.path.exists("ch1.json"):
        print("❌ ch1.json file not found!")
        print("Please ensure the file is in the same directory.")
        return
    
    # Initialize quiz
    quiz = ChemistryQuiz("ch1.json")
    if quiz.questions_data is None:
        return
    
    # Run interactive quiz
    quiz.run_interactive()

if __name__ == "__main__":
    main()