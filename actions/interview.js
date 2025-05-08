"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

// Initialize OpenAI client via OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Function to generate a technical interview quiz
export async function generateQuiz() {
  // 1. Authenticate user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Fetch user's industry & skills
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });
  if (!user) throw new Error("User not found");

  // 3. Build the prompt
  const prompt = `
Generate 10 technical interview questions for a ${user.industry} professional${
    user.skills?.length
      ? ` with expertise in ${user.skills.join(", ")}`
      : ""
  }.

Each question should be multiple choice with 4 options.

Return the response in this JSON format only, no additional text:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
`;

  try {
    // 4. Call the LLM
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // 5. Extract and log raw response
    const raw = completion.choices[0].message.content;
    console.error("Raw LLM response for quiz:", raw);

    // 6. Extract JSON block via regex
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON from LLM: no JSON object found");
    }

    // 7. Parse and validate
    const quiz = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(quiz.questions)) {
      throw new Error("Invalid JSON from LLM: missing 'questions' array");
    }

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    // In dev, re-throw real error to see full stack/message
    if (process.env.NODE_ENV !== "production") {
      throw error;
    }
    // In production, generic message to avoid leaking sensitive details
    throw new Error("Failed to generate quiz questions");
  }
}

// Function to save the quiz result after user attempts it
export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth(); // Get authenticated user
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Prepare question result array
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Generate improvement tip if needed
  const wrong = questionResults.filter((r) => !r.isCorrect);
  let improvementTip = null;
  if (wrong.length > 0) {
    const wrongText = wrong
      .map(
        (r) =>
          `Question: "${r.question}"\nCorrect Answer: "${r.answer}"\nYour Answer: "${r.userAnswer}"`
      )
      .join("\n\n");
    const tipPrompt = `
The user got the following ${user.industry} technical interview questions wrong:

${wrongText}

Based on these mistakes, provide a concise improvement tip (under 2 sentences) focusing on what to learn or practice. Do not mention the mistakes explicitly.
`;
    try {
      const tipCompletion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: tipPrompt }],
        temperature: 0.7,
      });
      improvementTip = tipCompletion.choices[0].message.content.trim();
    } catch (err) {
      console.error("Error generating improvement tip:", err);
    }
  }

  // Save full assessment
  const assessment = await db.assessment.create({
    data: {
      userId: user.id,
      quizScore: score,
      questions: questionResults,
      category: "Technical",
      improvementTip,
    },
  });
  return assessment;
}
