import json
import random
import os

class GravitationQuiz:
    def __init__(self, json_file="gravitation.json"):
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
        """Extract questions by difficulty level"""
        questions = []
        try:
            physics_data = self.questions_data.get("Physics", {})
            gravitation_data = physics_data.get("Gravitation MCQs", {})
            difficulty_data = gravitation_data.get(difficulty, [])
            
            for topic_data in difficulty_data:
                topic = topic_data.get("topic", "Unknown Topic")
                for q in topic_data.get("questions", []):
                    questions.append({
                        "topic": topic,
                        "difficulty": difficulty,
                        "question": q.get("question", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "explanation": q.get("explanation", "No explanation available")
                    })
        except (KeyError, AttributeError):
            print(f"Error extracting questions for difficulty: {difficulty}")
        return questions
    
    def get_questions_by_topic(self, selected_topics, difficulty):
        """Get questions filtered by topic"""
        all_questions = self.extract_questions_by_difficulty(difficulty)
        filtered = [q for q in all_questions if q["topic"] in selected_topics]
        
        # If not enough questions, get all from difficulty
        if len(filtered) < 1:
            return random.sample(all_questions, min(13, len(all_questions)))
        return filtered
    
    def select_questions(self):
        """Select 13 questions from each difficulty level ensuring topic coverage"""
        selected = []
        all_topics = [
            "Kepler's Laws of Planetary Motion",
            "Universal Law of Gravitation",
            "Acceleration Due to Gravity (g)",
            "Variation of g with Altitude",
            "Variation of g with Depth",
            "Gravitational Potential Energy",
            "Gravitational Potential",
            "Escape Velocity",
            "Orbital Velocity of a Satellite",
            "Energy of a Satellite",
            "Geostationary Satellites"
        ]
        
        for difficulty in ["Easy", "Medium", "Hard"]:
            difficulty_questions = []
            available_topics = all_topics.copy()
            
            # First, ensure at least 1 question from each topic
            questions_by_difficulty = self.extract_questions_by_difficulty(difficulty)
            
            # Group questions by topic
            topic_groups = {}
            for q in questions_by_difficulty:
                topic = q["topic"]
                if topic not in topic_groups:
                    topic_groups[topic] = []
                topic_groups[topic].append(q)
            
            # Select 1 question from each available topic
            for topic in available_topics:
                if topic in topic_groups and topic_groups[topic]:
                    difficulty_questions.append(random.choice(topic_groups[topic]))
            
            # Fill remaining with random questions from any topic
            remaining_needed = 13 - len(difficulty_questions)
            all_remaining = []
            for topic, questions in topic_groups.items():
                # Get questions not already selected
                selected_topics = [q["topic"] for q in difficulty_questions]
                remaining = [q for q in questions if q["topic"] not in selected_topics]
                all_remaining.extend(remaining)
            
            if all_remaining and remaining_needed > 0:
                extra = random.sample(all_remaining, min(remaining_needed, len(all_remaining)))
                difficulty_questions.extend(extra)
            
            # If still not enough, add more from any topic
            if len(difficulty_questions) < 13:
                all_available = []
                for questions in topic_groups.values():
                    all_available.extend(questions)
                extra_needed = 13 - len(difficulty_questions)
                remaining_questions = [q for q in all_available if q not in difficulty_questions]
                if remaining_questions:
                    extra = random.sample(remaining_questions, min(extra_needed, len(remaining_questions)))
                    difficulty_questions.extend(extra)
            
            # Shuffle and add to selected
            random.shuffle(difficulty_questions)
            selected.extend(difficulty_questions[:13])
        
        self.total_questions = len(selected)
        return selected
    
    def display_question(self, q, q_num):
        """Display a single question"""
        print("\n" + "="*60)
        print(f"Q{q_num}. {q['question']}")
        print("="*60)
        for option in q['options']:
            print(f"  {option}")
        print("-"*60)
    
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
        print("\n" + "="*60)
        print("   GRAVITATION QUIZ - Physics")
        print("="*60)
        print("You will be given 39 questions (13 Easy, 13 Medium, 13 Hard)")
        print("At least 1 question from each topic will be included")
        print("="*60)
        
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
                "question": q['question'],
                "correct": is_correct
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
            
            print("-"*60)
        
        self.display_results()
        self.analyze_topics()
    
    def display_results(self):
        """Display quiz results"""
        print("\n" + "="*60)
        print("   QUIZ RESULTS")
        print("="*60)
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
        print("="*60)
    
    def analyze_topics(self):
        """Analyze topic performance"""
        print("\n" + "="*60)
        print("   TOPIC-WISE PERFORMANCE")
        print("="*60)
        
        weak = []
        strong = []
        
        for topic, data in self.topic_scores.items():
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
            print("\n" + "-"*60)
            print("⚠️ WEAK TOPICS (Score < 50%):")
            weak.sort(key=lambda x: x[1])
            for topic, score in weak:
                print(f"  • {topic}: {score:.1f}%")
                # Show questions answered incorrectly
                for q_data in self.topic_scores[topic]["questions"]:
                    if not q_data["correct"]:
                        print(f"    - Review: {q_data['question'][:80]}...")
        else:
            print("\n✅ No weak topics! Great job!")
        
        # Display strong topics
        if strong:
            print("\n" + "-"*60)
            print("💪 STRONG TOPICS (Score >= 70%):")
            strong.sort(key=lambda x: x[1], reverse=True)
            for topic, score in strong:
                print(f"  • {topic}: {score:.1f}%")
        else:
            print("\n📚 Keep practicing to build stronger topics!")
        
        print("="*60)
        
        # Suggestions for improvement
        if weak:
            print("\n📝 SUGGESTIONS FOR IMPROVEMENT:")
            print("Focus on reviewing these weak topics:")
            for topic, _ in weak:
                print(f"  • {topic}")
            print("\nRecommended study materials:")
            print("  • Review NCERT Physics textbook")
            print("  • Practice more MCQs from these topics")
            print("  • Watch video explanations for conceptual clarity")
    
    def run_interactive(self):
        """Run interactive quiz with user choices"""
        while True:
            print("\n" + "="*60)
            print("   GRAVITATION QUIZ MENU")
            print("="*60)
            print("1. Full Quiz (39 questions - All topics & difficulties)")
            print("2. Practice by Difficulty Level")
            print("3. Practice by Topic")
            print("4. View My Performance")
            print("5. Exit")
            print("-"*60)
            
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
                print("\nThank you for using Gravitation Quiz! 👋")
                break
            else:
                print("\nInvalid option. Please try again.")
    
    def practice_by_difficulty(self):
        """Practice questions by difficulty level"""
        print("\n" + "="*60)
        print("   PRACTICE BY DIFFICULTY")
        print("="*60)
        print("1. Easy (Basic concepts)")
        print("2. Medium (Conceptual understanding)")
        print("3. Hard (Advanced problems)")
        print("4. All Difficulties")
        print("-"*60)
        
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
                "question": q['question'],
                "correct": is_correct
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
        
        self.display_results()
        self.analyze_topics()
    
    def practice_by_topic(self):
        """Practice questions by specific topic"""
        topics = [
            "Kepler's Laws of Planetary Motion",
            "Universal Law of Gravitation",
            "Acceleration Due to Gravity (g)",
            "Variation of g with Altitude",
            "Variation of g with Depth",
            "Gravitational Potential Energy",
            "Gravitational Potential",
            "Escape Velocity",
            "Orbital Velocity of a Satellite",
            "Energy of a Satellite",
            "Geostationary Satellites"
        ]
        
        print("\n" + "="*60)
        print("   PRACTICE BY TOPIC")
        print("="*60)
        for i, topic in enumerate(topics, 1):
            print(f"{i}. {topic}")
        print("0. All Topics")
        print("-"*60)
        
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
                "question": q['question'],
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
    if not os.path.exists("gravitation.json"):
        print("❌ gravitation.json file not found!")
        print("Please ensure the file is in the same directory.")
        return
    
    # Initialize quiz
    quiz = GravitationQuiz("gravitation.json")
    if quiz.questions_data is None:
        return
    
    # Run interactive quiz
    quiz.run_interactive()

if __name__ == "__main__":
    main()