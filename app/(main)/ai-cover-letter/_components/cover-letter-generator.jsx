"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import Cards from "@/components/ui/cards"; // ✅ Your custom card wrapper
import { Badge } from "@/components/ui/badge";

export default function CoverLetterGenerator() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      reset();
      window.location.href = `/ai-cover-letter/${generatedLetter.id}`;
    }
  }, [generatedLetter]);

  return (
    <div className="space-y-6">
      <Cards>
        <div className="flex flex-col space-y-2 mb-4">
          <h2 className="text-2xl font-semibold">Job Details</h2>
          <p className="text-sm text-muted-foreground">
            Provide information about the position you're applying for
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="font-medium text-sm">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="font-medium text-sm">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="Enter job title"
                {...register("jobTitle")}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-500">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="font-medium text-sm">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here"
              className="h-36"
              {...register("jobDescription")}
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-500">
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
          </div>
        </form>
      </Cards>
    </div>
  );
}
