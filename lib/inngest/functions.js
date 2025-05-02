import { db } from "@/lib/prisma";
import { inngest } from "./client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // every Sunday at midnight
  async ({ step }) => {
    // 1) Fetch all industries
    const industries = await step.run("Fetch industries", () =>
      db.industryInsight.findMany({ select: { industry: true } })
    );

    for (const { industry } of industries) {
      // 2) Build the prompt
      const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
Include at least 5 common roles for salary ranges.
Growth rate should be a percentage.
Include at least 5 skills and trends.
      `;

      // 3) Call DeepSeek R1 (via OpenRouter) inside a step
      const raw = await step.run("DeepSeek AI analysis", async () => {
        const res = await openai.chat.completions.create({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        return res.choices[0].message.content;
      });

      // 4) Clean & parse the JSON
      const cleaned = raw.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(cleaned);

      // 5) Normalize to ALL-CAPS for Prisma enums
      if (insights.demandLevel) insights.demandLevel = insights.demandLevel.toUpperCase();
      if (insights.marketOutlook) insights.marketOutlook = insights.marketOutlook.toUpperCase();

      // 6) Write back into your database
      await step.run(`Update ${industry} insights`, () =>
        db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        })
      );
    }
  }
);
