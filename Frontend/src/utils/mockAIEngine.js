/**
 * Evaluates a chapter test submission.
 * Groups questions by topic, calculates scores per topic,
 * and categorizes topics as "strong" or "weak".
 */
export function evaluateChapterTest(answers, questions) {
  // answers: { questionId: selectedIndex }
  const topicStats = {};

  questions.forEach(q => {
    const topicId = q.topicId;
    if (!topicStats[topicId]) {
      topicStats[topicId] = { total: 0, correct: 0 };
    }

    const selectedIndex = answers[q.id];
    const isCorrect = selectedIndex !== undefined && selectedIndex === q.answerIndex;

    topicStats[topicId].total += 1;
    if (isCorrect) {
      topicStats[topicId].correct += 1;
    }
  });

  const topicScores = {};
  const weakTopics = [];
  const strongTopics = [];

  Object.entries(topicStats).forEach(([topicId, stats]) => {
    const score = Math.round((stats.correct / stats.total) * 100);
    topicScores[topicId] = score;

    // Define "weak" as < 70% accuracy
    if (score < 70) {
      weakTopics.push(topicId);
    } else {
      strongTopics.push(topicId);
    }
  });

  // Calculate overall score
  const totalQuestions = questions.length;
  const correctQuestions = Object.values(topicStats).reduce((sum, s) => sum + s.correct, 0);
  const overallPercentage = Math.round((correctQuestions / totalQuestions) * 100);

  return {
    overallScore: overallPercentage,
    correctCount: correctQuestions,
    totalCount: totalQuestions,
    topicScores,
    weakTopics,
    strongTopics,
  };
}

/**
 * Fetches questions for a specific topic retest.
 */
export function getTopicQuestions(topicId) {
  return [
    {
      id: `fallback-${topicId}-1`,
      question: `Practice Question 1 for Topic: ${topicId}. Solve for x.`,
      options: ["Option A (Correct)", "Option B", "Option C", "Option D"],
      answerIndex: 0,
      explanation: "This is a fallback practice explanation."
    },
    {
      id: `fallback-${topicId}-2`,
      question: `Practice Question 2 for Topic: ${topicId}. Choose the correct option.`,
      options: ["Option A", "Option B (Correct)", "Option C", "Option D"],
      answerIndex: 1,
      explanation: "This is a fallback practice explanation."
    }
  ];
}

/**
 * Evaluates a topic-level quiz.
 */
export function evaluateTopicTest(answers, questions) {
  let correct = 0;
  questions.forEach(q => {
    if (answers[q.id] !== undefined && answers[q.id] === q.answerIndex) {
      correct++;
    }
  });

  return {
    score: Math.round((correct / questions.length) * 100),
    correct,
    total: questions.length
  };
}

/**
 * Generates an AI-themed context-aware chatbot response.
 * Responds intelligently based on the student's name, active class/board, and weak/strong topics.
 */
export function getAIChatbotResponse(userMessage, chatHistory, profile, testHistory, curriculum) {
  const query = userMessage.toLowerCase();
  let responseText = "";

  // 1. Identify weak and strong topics
  const weakTopicNames = [];
  const strongTopicNames = [];

  // Parse test history for weak topics
  Object.entries(testHistory).forEach(([chapterId, result]) => {
    if (result && result.topicScores) {
      // Find chapter details
      let foundTopicList = [];
      // Search in curriculum
      const boardData = curriculum[profile.class]?.[profile.board];
      if (boardData) {
        Object.values(boardData).forEach(subjectChapters => {
          const ch = subjectChapters.find(c => c.id === chapterId);
          if (ch) foundTopicList = ch.topics;
        });
      }

      Object.entries(result.topicScores).forEach(([tId, score]) => {
        const topicObj = foundTopicList.find(t => t.id === tId);
        const name = topicObj ? topicObj.name : tId;
        if (score < 70) {
          if (!weakTopicNames.includes(name)) weakTopicNames.push(name);
        } else {
          if (!strongTopicNames.includes(name)) strongTopicNames.push(name);
        }
      });
    }
  });

  const hasTested = Object.keys(testHistory).length > 0;

  // 2. Formulate response based on user keywords
  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    responseText = `Hello **${profile.name || "Student"}**! 🛡️ I am your **NST Genro AI Coach**. I'm tracking your profile in **${profile.class} (${profile.board})**. \n\n`;
    if (!hasTested) {
      responseText += `It looks like you haven't taken any tests yet! Head over to **Subjects** to take a test, and I will analyze your weak and strong areas to suggest targeted videos. Let's conquer your syllabus!`;
    } else if (weakTopicNames.length > 0) {
      responseText += `I see that you've completed some tests. We are working on mastering: **${weakTopicNames.join(", ")}**. \n\nWhat would you like to learn about today? I can explain concepts or give you a quick practice question.`;
    } else {
      responseText += `Excellent job on your tests! You are trending strong in **${strongTopicNames.join(", ")}**. What shall we study next?`;
    }
  } 
  else if (query.includes("weak") || query.includes("struggle") || query.includes("help") || query.includes("problem")) {
    if (weakTopicNames.length > 0) {
      responseText = `I've analyzed your performance data. Your main areas for improvement are:\n\n` + 
        weakTopicNames.map(name => `- **${name}** (retake tests & watch the customized video recommendation)`).join("\n") +
        `\n\nWould you like me to explain one of these topics right now? Just type the name of the topic!`;
    } else if (!hasTested) {
      responseText = `I don't have any test data for you yet! Try taking a Chapter Test in **Subjects** so I can diagnose your weak areas.`;
    } else {
      responseText = `You're doing fantastic! You have no weak topics on my radar. All tested areas are above 70% accuracy! Keep it up.`;
    }
  }
  else if (query.includes("ohm") || query.includes("current") || query.includes("resistance") || query.includes("voltage")) {
    responseText = `Ah, **Ohm's Law**! A foundational topic. 💡\n\nOhm's Law states that the current (I) through a conductor is directly proportional to the potential difference (V) across it, given constant physical conditions. Mathematically:\n\n$$\\text{V} = \\text{I} \\times \\text{R}$$\n\n- **Voltage (V)** is the electrical pressure forcing charge to flow.\n- **Current (I)** is the flow rate of charge.\n- **Resistance (R)** is the opposition to this flow.\n\n*Tip:* If you double the resistance, the current drops to half, provided voltage remains constant. Want me to generate a practice question on this?`;
  }
  else if (query.includes("series") || query.includes("parallel") || query.includes("resistor")) {
    responseText = `Let's break down **Resistor Circuits**! ⚡\n\n1. **Series Circuits**:\n   - Current remains the same through all components.\n   - Total resistance increases: $$R_s = R_1 + R_2 + R_3...$$\n\n2. **Parallel Circuits**:\n   - Voltage remains the same across all branches.\n   - Total resistance decreases: $$\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}...$$\n\n*Study Suggestion:* Notice that home wiring is done in parallel so that if one room's light turns off, the others don't lose power!`;
  }
  else if (query.includes("mirror") || query.includes("lens") || query.includes("focal") || query.includes("magnification")) {
    responseText = `Let's review **Spherical Mirrors & Lenses**! 🔍\n\n- **Mirror Formula**:\n  $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$\n  *Magnification:* $$m = -\\frac{v}{u}$$\n\n- **Lens Formula**:\n  $$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$\n  *Magnification:* $$m = +\\frac{v}{u}$$\n\n- **Sign Conventions**:\n  - Object distance ($$u$$) is *always negative*.\n  - Real images have negative magnification for mirrors, positive for lenses.\n  - Convex focal lengths are positive; concave are negative.`;
  }
  else if (query.includes("quadratic") || query.includes("roots") || query.includes("discriminant")) {
    responseText = `Let's talk **Quadratic Equations**! 🧮\n\nFor any quadratic equation $$ax^2 + bx + c = 0$$, the roots can be found using the **Quadratic Formula**:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n- The term $$D = b^2 - 4ac$$ is the **Discriminant**.\n- If $$D > 0$$, roots are real and distinct.\n- If $$D = 0$$, roots are real and equal.\n- If $$D < 0$$, roots are imaginary (non-real).`;
    if (weakTopicNames.includes("Nature of Roots")) {
      responseText += `\n\nI noticed you had some difficulty with **Nature of Roots** in your test. Remember: if the discriminant is negative, you cannot take the real square root, hence the roots are imaginary!`;
    }
  }
  else if (query.includes("question") || query.includes("practice") || query.includes("quiz")) {
    responseText = `Sure! Let's do a quick check-in. Answer this:\n\n**A circuit has a voltage of 12 V and resistance of 4 Ohms. What is the current flowing?**\n\n- A) 48 A\n- B) 3 A\n- C) 8 A\n- D) 0.33 A\n\n*(Type your answer like 'The answer is B'!)*`;
  }
  else if (query.includes("answer is b") || query.includes("option b") || query.includes("is 3")) {
    responseText = `**Spot on!** 🎉\n\n$$I = V / R = 12 / 4 = 3\\text{ A}$$. Excellent execution. Your understanding of Ohm's Law is solid!`;
  }
  else {
    // Default reply that uses user profile data
    responseText = `I appreciate your query! As your NST Genro Coach, I want to make sure you succeed in **${profile.board} ${profile.class}**. \n\n`;
    if (weakTopicNames.length > 0) {
      responseText += `To help you with your weaknesses in **${weakTopicNames.join(", ")}**, I suggest we practice those specific areas. You can also ask me specific questions like: *'Explain Ohm's Law'* or *'How does parallel resistance work?'*. What concept can I make easier for you?`;
    } else {
      responseText += `I'm ready to explain any topics from your subjects (Physics, Chemistry, Math, Biology). Try asking me a conceptual question, or ask for a practice problem!`;
    }
  }

  return responseText;
}
