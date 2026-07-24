"""
Interactive Quiz Generator for ch2.json (Structure of Atom)

Features:
- Generates 16 questions total: 1 question per topic (guaranteed coverage)
- Random difficulty selection per topic
- Interactive CLI with real-time feedback
- Tracks performance by topic
- Identifies weak and strong topics
- Displays total score and percentage
"""

import json
import random
import os
from collections import defaultdict


class StructureOfAtomQuiz:
    def __init__(self, json_file="ch2.json"):
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
    
    def get_all_topics(self):
        """Get all topics from the JSON structure"""
        try:
            structure_of_atom = self.questions_data.get("Chemistry", {}).get("Structure of Atom", {})
            return list(structure_of_atom.keys())
        except (KeyError, AttributeError):
            return []
    
    def extract_questions_by_topic(self, topic):
        """Extract all questions for a given topic across all difficulties"""
        questions = []
        try:
            structure_of_atom = self.questions_data.get("Chemistry", {}).get("Structure of Atom", {})
            difficulties = structure_of_atom.get(topic, {})
            
            for difficulty, questions_list in difficulties.items():
                for q in questions_list:
                    questions.append({
                        "topic": topic,
                        "difficulty": difficulty,
                        "question": q.get("question", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "explanation": q.get("explanation", "No explanation available")
                    })
        except (KeyError, AttributeError):
            pass
        return questions
    
    def select_questions(self):
        """Select 1 question per topic with random difficulty"""
        selected = []
        all_topics = self.get_all_topics()
        
        for topic in all_topics:
            topic_questions = self.extract_questions_by_topic(topic)
            
            if topic_questions:
                # Pick a random question from all available for this topic
                selected_question = random.choice(topic_questions)
                selected.append(selected_question)
        
        # Shuffle the final question order
        random.shuffle(selected)
        self.total_questions = len(selected)
        return selected
    
    def display_question(self, q, q_num):
        """Display a single question"""
        print("\n" + "="*80)
        print(f"Q{q_num}. [{q['topic']}] - Difficulty: {q['difficulty']}")
        print("="*80)
        print(f"{q['question']}")
        print("-"*80)
        for option in q['options']:
            print(f"  {option}")
        print("-"*80)
    
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
        print("\n" + "="*80)
        print("   STRUCTURE OF ATOM - COMPREHENSIVE QUIZ")
        print("="*80)
        print("You will be given 16 questions (1 from each topic)")
        print("Difficulty will be randomly selected for each topic")
        print("="*80)
        
        input("\nPress Enter to start the quiz...")
        
        questions = self.select_questions()
        
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
                "correct": is_correct,
                "difficulty": q['difficulty']
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
            
            # Show progress
            print(f"\nProgress: {idx}/{self.total_questions} | Score: {self.score}/{idx}")
            print("-"*80)
        
        self.display_results()
        self.analyze_topics()
    
    def display_results(self):
        """Display quiz results"""
        print("\n" + "="*80)
        print("   QUIZ RESULTS")
        print("="*80)
        print(f"Total Questions: {self.total_questions}")
        print(f"Correct Answers: {self.score}")
        percentage = (self.score / self.total_questions) * 100 if self.total_questions > 0 else 0
        print(f"Score: {self.score}/{self.total_questions} ({percentage:.1f}%)")
        
        # Grade
        if percentage >= 80:
            grade = "A - Excellent!"
            grade_color = "🌟"
        elif percentage >= 60:
            grade = "B - Good!"
            grade_color = "👍"
        elif percentage >= 40:
            grade = "C - Fair"
            grade_color = "📚"
        else:
            grade = "D - Needs Improvement"
            grade_color = "📝"
        print(f"Grade: {grade_color} {grade}")
        print("="*80)
    
    def analyze_topics(self):
        """Analyze topic performance"""
        print("\n" + "="*80)
        print("   TOPIC-WISE PERFORMANCE ANALYSIS")
        print("="*80)
        
        weak = []
        strong = []
        moderate = []
        
        # Sort topics by performance
        sorted_topics = sorted(self.topic_scores.items(), 
                              key=lambda x: (x[1]["correct"]/x[1]["total"]) if x[1]["total"] > 0 else 0,
                              reverse=True)
        
        print("\n📊 Topic Performance Summary:")
        print("-"*80)
        print(f"{'Topic':<40} {'Score':<10} {'Status':<15}")
        print("-"*80)
        
        for topic, data in sorted_topics:
            total = data["total"]
            correct = data["correct"]
            if total > 0:
                score_pct = (correct / total) * 100
                status = ""
                if score_pct == 100:
                    status = "✅ Excellent"
                elif score_pct >= 70:
                    status = "💪 Strong"
                    strong.append((topic, score_pct))
                elif score_pct >= 50:
                    status = "📚 Moderate"
                    moderate.append((topic, score_pct))
                else:
                    status = "⚠️ Weak"
                    weak.append((topic, score_pct))
                
                print(f"{topic:<40} {correct}/{total:<7} {status:<15}")
        
        # Display weak topics
        if weak:
            print("\n" + "⚠️"*40)
            print("⚠️ WEAK TOPICS (Score < 50%):")
            print("-"*80)
            weak.sort(key=lambda x: x[1])
            for topic, score in weak:
                print(f"  • {topic}: {score:.1f}%")
                # Show questions answered incorrectly
                print("    Questions to review:")
                for q_data in self.topic_scores[topic]["questions"]:
                    if not q_data["correct"]:
                        difficulty_icon = "🟢" if q_data["difficulty"] == "Easy" else "🟡" if q_data["difficulty"] == "Medium" else "🔴"
                        print(f"      {difficulty_icon} {q_data['question']}")
        else:
            print("\n✅ No weak topics! Great job!")
        
        # Display strong topics
        if strong:
            print("\n" + "💪"*40)
            print("💪 STRONG TOPICS (Score >= 70%):")
            print("-"*80)
            strong.sort(key=lambda x: x[1], reverse=True)
            for topic, score in strong:
                print(f"  • {topic}: {score:.1f}%")
        else:
            print("\n📚 Keep practicing to build stronger topics!")
        
        # Display moderate topics
        if moderate:
            print("\n" + "📚"*40)
            print("📚 MODERATE TOPICS (50% - 69%):")
            print("-"*80)
            moderate.sort(key=lambda x: x[1], reverse=True)
            for topic, score in moderate:
                print(f"  • {topic}: {score:.1f}%")
        
        print("="*80)
        
        # Suggestions for improvement
        if weak:
            print("\n📝 SUGGESTIONS FOR IMPROVEMENT:")
            print("-"*80)
            print("Focus on reviewing these weak topics:")
            for topic, _ in weak:
                print(f"  • {topic}")
            print("\nRecommended study strategies:")
            print("  • Review NCERT Chemistry textbook for these topics")
            print("  • Practice more MCQs from these specific areas")
            print("  • Watch video explanations for conceptual clarity")
            print("  • Create summary notes for quick revision")
        else:
            print("\n🎉 Excellent performance! You have no weak topics.")
            print("To maintain your strong understanding:")
            print("  • Continue practicing with varied difficulty questions")
            print("  • Try solving numerical problems related to these concepts")
            print("  • Help others to reinforce your own understanding")
        
        print("="*80)
    
    def run_interactive(self):
        """Run interactive quiz with user choices"""
        while True:
            print("\n" + "="*80)
            print("   STRUCTURE OF ATOM - QUIZ MENU")
            print("="*80)
            print("1. Start Full Quiz (16 questions - 1 from each topic)")
            print("2. Practice by Difficulty Level")
            print("3. Practice by Specific Topic")
            print("4. View My Performance History")
            print("5. Exit")
            print("-"*80)
            
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
                print("\nThank you for using Structure of Atom Quiz! 👋")
                print("Keep learning and exploring the fascinating world of atomic structure! ⚛️")
                break
            else:
                print("\nInvalid option. Please try again.")
    
    def practice_by_difficulty(self):
        """Practice questions by difficulty level"""
        print("\n" + "="*80)
        print("   PRACTICE BY DIFFICULTY")
        print("="*80)
        print("1. Easy (Basic concepts)")
        print("2. Medium (Conceptual understanding)")
        print("3. Hard (Advanced problems)")
        print("4. All Difficulties (Mixed)")
        print("-"*80)
        
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
        all_topics = self.get_all_topics()
        
        for topic in all_topics:
            topic_questions = self.extract_questions_by_topic(topic)
            for q in topic_questions:
                if q['difficulty'] in selected_difficulties:
                    questions.append(q)
        
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
                "correct": is_correct,
                "difficulty": q['difficulty']
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
            
            print(f"\nProgress: {idx}/{self.total_questions} | Score: {self.score}/{idx}")
            print("-"*80)
        
        self.display_results()
        self.analyze_topics()
    
    def practice_by_topic(self):
        """Practice questions by specific topic"""
        topics = self.get_all_topics()
        
        if not topics:
            print("No topics found!")
            return
        
        print("\n" + "="*80)
        print("   PRACTICE BY SPECIFIC TOPIC")
        print("="*80)
        for i, topic in enumerate(topics, 1):
            # Count questions available for this topic
            topic_questions = self.extract_questions_by_topic(topic)
            count = len(topic_questions)
            print(f"{i}. {topic} ({count} questions available)")
        print("0. All Topics (Mixed)")
        print("-"*80)
        
        choice = input("Select topic number (0-16): ").strip()
        
        if choice == '0':
            # Get questions from all topics
            all_questions = []
            for topic in topics:
                all_questions.extend(self.extract_questions_by_topic(topic))
            questions = random.sample(all_questions, min(15, len(all_questions)))
        else:
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(topics):
                    selected_topic = topics[idx]
                    questions = self.extract_questions_by_topic(selected_topic)
                    
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
                "correct": is_correct,
                "difficulty": q['difficulty']
            })
            if is_correct:
                self.topic_scores[topic]["correct"] += 1
            
            print(f"\nProgress: {idx}/{self.total_questions} | Score: {self.score}/{idx}")
            print("-"*80)
        
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
    if not os.path.exists("ch2.json"):
        print("❌ ch2.json file not found!")
        print("Please ensure the file is in the same directory.")
        return
    
    # Initialize quiz
    quiz = StructureOfAtomQuiz("ch2.json")
    if quiz.questions_data is None:
        return
    
    # Run interactive quiz
    quiz.run_interactive()


if __name__ == "__main__":
    main()