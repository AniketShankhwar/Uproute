// /actions/user.js
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1️⃣ Find the user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // 2️⃣ Check if an IndustryInsight exists
  let industryInsight = await db.industryInsight.findUnique({
    where: { industry: data.industry },
  });

  // 3️⃣ If not, generate the AI insights (slow) *before* starting the transaction
  let insights;
  if (!industryInsight) {
    insights = await generateAIInsights(data.industry);
    // normalize enums (we already upper‑cased inside generateAIInsights)
  }

  // 4️⃣ Now open a short-lived transaction just for the DB writes
  const result = await db.$transaction(
    async (tx) => {
      // 4a. Create the new IndustryInsight if needed
      if (!industryInsight) {
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      // 4b. Update the User
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    },
    {
      // you can even remove this or keep very small since work is minimal
      timeout: 5000,
    }
  );

  return { success: true, ...result };
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const status = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  return { isOnboarded: !!status?.industry };
}
