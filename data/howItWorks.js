import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your background to unlock personalized AI insights for your career.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Generate custom, ATS-friendly resumes and cover letters that set you apart.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with role specific mock interviews to refine your responses.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Track performance metrics and receive feedback to continuously improve.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
