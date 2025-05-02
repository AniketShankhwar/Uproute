"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Cards from "@/components/ui/cards";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Cards>
        <div className="p-6">
          <h3 className="text-2xl font-bold gradient-title mb-2">No Cover Letters Yet</h3>
          <p className="text-muted-foreground">
            Create your first cover letter to get started
          </p>
        </div>
      </Cards>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {coverLetters.map((letter) => (
        <Cards key={letter.id} className="group relative">
          <div className="flex items-start justify-between p-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold gradient-title">
                {letter.jobTitle} at {letter.companyName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Created {format(new Date(letter.createdAt), "PPP")}
              </p>
              <div className="text-sm line-clamp-2 text-muted-foreground">
                {letter.jobDescription}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold">
                      Delete Cover Letter?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will permanently delete your cover letter for{" "}
                      <span className="font-medium text-foreground">
                        {letter.jobTitle} at {letter.companyName}
                      </span>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(letter.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Cards>
      ))}
    </div>
  );
}