import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

type Job = {
  id: number;
  title: string;
  description: string;
  job_type: string;
  salary: string;
  languages: string[];
};

export async function getChatGptRecommendations(
  appliedJobs: Job[],
  allJobs: Job[]
) {
  const unAppliedJobs = allJobs.filter(
    (job) => !appliedJobs.some((appliedJob) => appliedJob.id === job.id)
  );

  const jobIds = unAppliedJobs.map((job) => job.id).join(", ");
  const jobTitles = unAppliedJobs.map((job) => job.title).join(", ");

  const prompt = `
    I have a list of job openings. Please generate recommendations based on the following job details. Focus on offering new opportunities that align with the user's preferences.

    Here are the job ids that have not been applied for:
    ${jobIds}

    Here are the jobs that have not been applied for:
    ${jobTitles}

    And here are the jobs that have been applied for:
    ${appliedJobs.map((job) => `${job.title}`).join(", ")}

    Please generate a list of 50 job recommendations based on the user's current preferences and the applied jobs. Return the recommendations in the following format:

    [
      {
        id: 1,
        title: "Job title",
        description: "Job description",
        job_type: "Job type",
        salary: "Salary",
        languages: ["Language 1", "Language 2"]
      }
    ]

    Please return only the list of recommendations, and nothing else.
  `;

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      recommendations: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          job_type: z.string(),
          salary: z.string(),
          languages: z.array(z.string()),
        })
      ),
    }),
    prompt: prompt,
  });

  return object.recommendations;
}
