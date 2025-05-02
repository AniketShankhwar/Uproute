"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

// Initialize OpenAI client to point at OpenRouter (DeepSeek R1)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure the user exists
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    // Upsert the resume content
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });

    // Revalidate the /resume page so Next.js picks up the change
    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure the user exists
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Fetch and return the resume
  return await db.resume.findUnique({
    where: { userId: user.id },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Fetch the user (including their industry for context)
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });
  if (!user) throw new Error("User not found");

  // Build the prompt for DeepSeek
  const prompts = {
    summary: `
As an expert resume writer, improve this professional summary for a ${user.industry} professional.
Current summary: "${current}"

Requirements:
1. Highlight key achievements and career highlights
2. Showcase core competencies
3. Include industry-specific keywords
4. Keep it concise (3-5 lines)
5. Use powerful adjectives
6. Focus on value proposition
    `,

    skills: `
As a career expert, improve this skills section for a ${user.industry} professional.
Current skills: "${current}"

Requirements:
1. Categorize skills (Technical, Soft, Tools, etc.)
2. Add relevant ${user.industry} specific skills
3. Include certifications if applicable
4. Use industry-standard terminology
5. Format as bullet points or comma-separated
6. Prioritize most important skills first
    `,

    experience: `
As an expert resume writer, improve this work experience description.
Current content: "${current}"

Requirements:
1. Use action verbs (Led, Developed, Optimized)
2. Include metrics and results
3. Highlight technical skills used
4. Show career progression
5. Keep it concise but detailed
6. Focus on achievements
    `,

    education: `
Improve this education section for a ${user.industry} professional.
Current content: "${current}"

Include:
1. Relevant coursework
2. Honors/awards
3. GPA if notable
4. Leadership roles
5. Academic projects
6. Certification progress
    `,

    project: `
Enhance this project description for a technical resume.
Current content: "${current}"

Add:
1. Technologies used
2. Project impact
3. Team size/role
4. Technical challenges
5. Quantitative results
6. Demo links if applicable
    `,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: prompts[type] || prompts.experience, // fallback
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error improving resume content:", error);
    throw new Error("Failed to improve content");
  }
}
