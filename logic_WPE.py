import json
import random
from collections import defaultdict

class WPEManager:
    def __init__(self, json_file_path='WPE.json'):
        """Initialize the Work, Power, Energy manager with the JSON data file."""
        self.json_file_path = json_file_path
        self.data = self.load_data()
        self.questions_by_difficulty = defaultdict(list)
        self.topic_mapping = {}
        self.organize_questions()
        
    def load_data(self):
        """Load the JSON data from file."""
        try:
            with open(self.json_file_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Error: File '{self.json_file_path}' not found.")
            return None
        except json.JSONDecodeError:
            print("Error: Invalid JSON format.")
            return None
            
    def organize_questions(self):
        """Organize questions by difficulty level and track their topics."""
        if not self.data:
            return
            
        # Navigate through the nested structure
        physics = self.data.get('Physics', {})
        wpe = physics.get('Work, Energy and Power', {})
        
        for difficulty, topics in wpe.items():
            if difficulty in ['Easy', 'Medium', 'Hard']:
                for topic, questions in topics.items():
                    for question in questions:
                        # Store question with its topic
                        question_copy = question.copy()
                        question_copy['topic'] = topic
                        question_copy['difficulty'] = difficulty
                        
                        # Generate a unique ID if not present
                        if 'qid' not in question_copy and 'qNo' not in question_copy:
                            question_copy['qid'] = f"{topic}_{len(self.questions_by_difficulty[difficulty]) + 1}"
                        
                        self.questions_by_difficulty[difficulty].append(question_copy)
                        
                        # Store topic mapping for analysis
                        qid = question_copy.get('qid') or question_copy.get('qNo') or question_copy.get('questionNumber')
                        if qid:
                            self.topic_mapping[qid] = topic
        
        # Print summary
        print("\n=== Questions Loaded Successfully ===")
        for difficulty in ['Easy', 'Medium', 'Hard']:
            total = len(self.questions_by_difficulty.get(difficulty, []))
            print(f"{difficulty}: {total} questions")
        print("===================================\n")
    
    def select_questions(self, num_easy=13, num_medium=13, num_hard=13, subtopics=None):
        """
        Select random questions from each difficulty level.
        
        Args:
            num_easy: Number of easy questions to select
            num_medium: Number of medium questions to select
            num_hard: Number of hard questions to select
            subtopics: Optional list of specific subtopics to focus on
            
        Returns:
            Dictionary with selected questions organized by difficulty
        """
        if not self.data:
            return None
            
        selected = {
            'Easy': [],
            'Medium': [],
            'Hard': []
        }
        
        # Select questions for each difficulty
        for difficulty, count in [('Easy', num_easy), ('Medium', num_medium), ('Hard', num_hard)]:
            if difficulty not in self.questions_by_difficulty:
                print(f"Warning: No questions found for {difficulty} level.")
                continue
                
            # Get all available questions for this difficulty
            all_questions = self.questions_by_difficulty[difficulty]
            
            # Filter by subtopics if specified
            if subtopics:
                all_questions = [q for q in all_questions if q.get('topic') in subtopics]
            
            # Shuffle and select
            if all_questions:
                if len(all_questions) < count:
                    print(f"Warning: Only {len(all_questions)} questions available for {difficulty}. Selecting all.")
                    selected[difficulty] = all_questions.copy()
                else:
                    selected[difficulty] = random.sample(all_questions, count)
            else:
                print(f"Warning: No questions available for {difficulty}.")
                
        return selected
    
    def analyze_strengths_and_weaknesses(self, selected_questions, user_answers):
        """
        Analyze user's performance to determine strong and weak topics.
        
        Args:
            selected_questions: Dictionary with selected questions
            user_answers: Dictionary mapping question indices to user answers
            
        Returns:
            Dictionary with topic analysis
        """
        if not selected_questions or not user_answers:
            return None
            
        topic_performance = defaultdict(lambda: {'correct': 0, 'total': 0})
        
        question_index = 0
        for difficulty in ['Easy', 'Medium', 'Hard']:
            for question in selected_questions.get(difficulty, []):
                # Get the question ID for tracking
                qid = question.get('qid') or question.get('qNo') or question.get('questionNumber')
                
                if qid and question_index in user_answers:
                    user_ans = user_answers[question_index]
                    
                    # Get the correct answer (handle different field names)
                    correct_ans = question.get('answer') or question.get('correct')
                    
                    # Get the topic
                    topic = question.get('topic', 'Unknown')
                    
                    topic_performance[topic]['total'] += 1
                    
                    # Check if answer is correct (handle string/int comparisons)
                    if str(user_ans).strip().upper() == str(correct_ans).strip().upper():
                        topic_performance[topic]['correct'] += 1
                
                question_index += 1
        
        # Determine strengths and weaknesses
        analysis = {}
        for topic, performance in topic_performance.items():
            if performance['total'] > 0:
                score_percentage = (performance['correct'] / performance['total']) * 100
                analysis[topic] = {
                    'score_percentage': score_percentage,
                    'correct': performance['correct'],
                    'total': performance['total'],
                    'status': 'Strong' if score_percentage >= 70 else 'Medium' if score_percentage >= 50 else 'Weak'
                }
        
        return analysis
    
    def generate_test_paper(self, num_easy=13, num_medium=13, num_hard=13, subtopics=None):
        """
        Generate a complete test paper with selected questions.
        
        Args:
            num_easy: Number of easy questions
            num_medium: Number of medium questions
            num_hard: Number of hard questions
            subtopics: Optional specific subtopics
            
        Returns:
            Dictionary containing test paper structure
        """
        selected = self.select_questions(num_easy, num_medium, num_hard, subtopics)
        if not selected:
            return None
            
        test_paper = {
            'total_questions': sum(len(qs) for qs in selected.values()),
            'difficulty_breakdown': {
                'Easy': len(selected['Easy']),
                'Medium': len(selected['Medium']),
                'Hard': len(selected['Hard'])
            },
            'questions': []
        }
        
        # Create question bank with numbering
        question_number = 1
        for difficulty in ['Easy', 'Medium', 'Hard']:
            for question in selected[difficulty]:
                q_data = question.copy()
                q_data['difficulty'] = difficulty
                q_data['question_number'] = question_number
                test_paper['questions'].append(q_data)
                question_number += 1
                
        return test_paper
    
    def display_test_paper(self, test_paper):
        """Display the test paper in a readable format."""
        if not test_paper:
            print("No test paper generated.")
            return
            
        print("\n" + "="*80)
        print(f"WORK, POWER, AND ENERGY - TEST PAPER")
        print("="*80)
        print(f"Total Questions: {test_paper['total_questions']}")
        print(f"Difficulty Breakdown: {test_paper['difficulty_breakdown']}")
        print("="*80)
        
        current_difficulty = None
        for q in test_paper['questions']:
            if q['difficulty'] != current_difficulty:
                current_difficulty = q['difficulty']
                print(f"\n--- {current_difficulty.upper()} LEVEL QUESTIONS ---\n")
            
            # Extract question text
            q_text = q.get('question', 'Question text not available')
            options = q.get('options', [])
            
            print(f"{q['question_number']}. {q_text}")
            for i, option in enumerate(options):
                print(f"   {chr(65+i)}) {option}")
            print()
    
    def simulate_test(self, num_easy=13, num_medium=13, num_hard=13, subtopics=None):
        """
        Simulate a complete test with user interaction.
        """
        print("\n" + "="*80)
        print("WORK, POWER, AND ENERGY - INTERACTIVE TEST")
        print("="*80)
        
        # Generate test paper
        test_paper = self.generate_test_paper(num_easy, num_medium, num_hard, subtopics)
        if not test_paper:
            print("Error: Could not generate test paper.")
            return
            
        # Display test paper
        self.display_test_paper(test_paper)
        
        # Collect user answers
        user_answers = {}
        print("\n" + "-"*80)
        print("PLEASE ENTER YOUR ANSWERS (A, B, C, or D)")
        print("-"*80)
        
        for q in test_paper['questions']:
            q_num = q['question_number']
            while True:
                answer = input(f"Question {q_num}: ").strip().upper()
                if answer in ['A', 'B', 'C', 'D']:
                    user_answers[q_num - 1] = answer
                    break
                else:
                    print("Invalid input. Please enter A, B, C, or D.")
        
        # Analyze results
        print("\n" + "="*80)
        print("RESULTS")
        print("="*80)
        
        correct = 0
        results_by_difficulty = {'Easy': {'correct': 0, 'total': 0}, 
                                 'Medium': {'correct': 0, 'total': 0}, 
                                 'Hard': {'correct': 0, 'total': 0}}
        
        # Map selected questions back to their difficulty
        selected_map = {}
        for difficulty in ['Easy', 'Medium', 'Hard']:
            if difficulty in self.questions_by_difficulty:
                selected_map[difficulty] = test_paper['questions'][:results_by_difficulty[difficulty]['total']]
        
        # Rebuild the selected questions structure
        selected_questions = {'Easy': [], 'Medium': [], 'Hard': []}
        current_idx = 0
        for difficulty in ['Easy', 'Medium', 'Hard']:
            count = test_paper['difficulty_breakdown'][difficulty]
            selected_questions[difficulty] = test_paper['questions'][current_idx:current_idx + count]
            current_idx += count
        
        # Grade the answers
        for q in test_paper['questions']:
            q_num = q['question_number']
            correct_ans = q.get('answer') or q.get('correct')
            user_ans = user_answers.get(q_num - 1, 'No Answer')
            is_correct = str(user_ans).strip().upper() == str(correct_ans).strip().upper()
            
            if is_correct:
                correct += 1
                results_by_difficulty[q['difficulty']]['correct'] += 1
            
            results_by_difficulty[q['difficulty']]['total'] += 1
        
        # Display results
        print(f"\nTotal Score: {correct}/{len(test_paper['questions'])}")
        print(f"Percentage: {(correct/len(test_paper['questions']))*100:.2f}%\n")
        
        print("Difficulty-wise Performance:")
        for diff in ['Easy', 'Medium', 'Hard']:
            stats = results_by_difficulty[diff]
            if stats['total'] > 0:
                score = stats['correct']
                total = stats['total']
                percentage = (score/total)*100
                status = "✅ Strong" if percentage >= 70 else "⚠️ Medium" if percentage >= 50 else "❌ Weak"
                print(f"  {diff}: {score}/{total} ({percentage:.1f}%) - {status}")
        
        # Analyze strengths and weaknesses
        print("\n" + "-"*80)
        print("DETAILED TOPIC ANALYSIS")
        print("-"*80)
        
        analysis = self.analyze_strengths_and_weaknesses(selected_questions, user_answers)
        
        if analysis:
            print("\nStrong Topics (≥70%):")
            strong_topics = [t for t, a in analysis.items() if a['status'] == 'Strong']
            if strong_topics:
                for topic in strong_topics:
                    print(f"  ✅ {topic}: {analysis[topic]['correct']}/{analysis[topic]['total']} ({analysis[topic]['score_percentage']:.1f}%)")
            else:
                print("  None")
            
            print("\nWeak Topics (<50%):")
            weak_topics = [t for t, a in analysis.items() if a['status'] == 'Weak']
            if weak_topics:
                for topic in weak_topics:
                    print(f"  ❌ {topic}: {analysis[topic]['correct']}/{analysis[topic]['total']} ({analysis[topic]['score_percentage']:.1f}%)")
            else:
                print("  None")
            
            print("\nMedium Topics (50-69%):")
            medium_topics = [t for t, a in analysis.items() if a['status'] == 'Medium']
            if medium_topics:
                for topic in medium_topics:
                    print(f"  ⚠️ {topic}: {analysis[topic]['correct']}/{analysis[topic]['total']} ({analysis[topic]['score_percentage']:.1f}%)")
            else:
                print("  None")
        
        return test_paper, user_answers, analysis

# Example usage
if __name__ == "__main__":
    # Initialize manager with the JSON file
    wpe_manager = WPEManager('WPE.json')
    
    # Option 1: Generate a test paper without interaction
    print("\n" + "="*80)
    print("OPTION 1: Generate Test Paper")
    print("="*80)
    
    test_paper = wpe_manager.generate_test_paper(
        num_easy=13, 
        num_medium=13, 
        num_hard=13
    )
    wpe_manager.display_test_paper(test_paper)
    
    # Option 2: Interactive test simulation
    print("\n" + "="*80)
    print("OPTION 2: Interactive Test")
    print("="*80)
    print("Would you like to take the interactive test? (y/n): ", end="")
    
    choice = input().strip().lower()
    if choice == 'y':
        # Option to focus on specific subtopics
        print("\nWould you like to focus on specific topics? (y/n): ", end="")
        focus_choice = input().strip().lower()
        
        subtopics = None
        if focus_choice == 'y':
            # List available topics
            available_topics = set()
            for difficulty in ['Easy', 'Medium', 'Hard']:
                for q in wpe_manager.questions_by_difficulty.get(difficulty, []):
                    if 'topic' in q:
                        available_topics.add(q['topic'])
            
            print("\nAvailable topics:")
            for i, topic in enumerate(sorted(available_topics), 1):
                print(f"  {i}. {topic}")
            
            print("\nEnter topic numbers separated by commas (e.g., 1,3,5): ", end="")
            topic_input = input().strip()
            try:
                topic_indices = [int(x.strip()) - 1 for x in topic_input.split(',')]
                subtopics = [sorted(available_topics)[i] for i in topic_indices if 0 <= i < len(available_topics)]
                if subtopics:
                    print(f"Focusing on topics: {', '.join(subtopics)}")
            except:
                print("Invalid input. Using all topics.")
                subtopics = None
        
        # Run the interactive test
        wpe_manager.simulate_test(
            num_easy=13,
            num_medium=13,
            num_hard=13,
            subtopics=subtopics
        )
    else:
        print("Test cancelled. Goodbye!")