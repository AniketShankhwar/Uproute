"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

// Initialize the OpenAI client with OpenRouter's DeepSeek R1 model
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Function to generate a technical interview quiz
export async function generateQuiz() {
  const { userId } = await auth(); // Get the authenticated user's ID
  if (!userId) throw new Error("Unauthorized");

  // Fetch user's industry and skills from the database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });
  if (!user) throw new Error("User not found");

  // Prepare prompt for the LLM to generate quiz questions
  const prompt = `
Generate 10 technical interview questions for a ${user.industry} professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
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
    // Send prompt to DeepSeek R1 via OpenRouter
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Clean and parse the LLM's response to get questions
    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleaned);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
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

  // Prepare question result array with user answers and correct ones
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // If there are wrong answers, generate an improvement tip
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

Based on these mistakes, provide a concise improvement tip (under 2 sentences) focusing on what to learn or practice. Do not mention the mistakes explicitly.(Also don't start response with **Improvement Tip:** Writen).
    `;

    try {
      // Ask the LLM to generate a tip based on mistakes
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

  try {
    // Save the full assessment in the database
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
  } catch (err) {
    console.error("Error saving quiz result:", err);
    throw new Error("Failed to save quiz result");
  }
}

// Function to get all previous assessments for the user
export async function getAssessments() {
  const { userId } = await auth(); // Check if user is authenticated
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    // Fetch all assessments sorted by creation date
    return await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error("Error fetching assessments:", err);
    throw new Error("Failed to fetch assessments");
  }
}