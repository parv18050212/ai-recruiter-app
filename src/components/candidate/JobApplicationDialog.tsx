import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface JobApplicationDialogProps {
  job: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobApplicationDialog = ({ job, open, onOpenChange }: JobApplicationDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resume, setResume] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!job || !user) throw new Error("Missing job or user");

      let resumeUrl = null;

      // Upload resume if provided
      if (resume) {
        const fileExt = resume.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resume);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resumeUrl = publicUrl;
      }

      // Create application via edge function
      const { data, error } = await supabase.functions.invoke("apply-job", {
        body: {
          job_id: job.id,
          job_title: job.title,
          resume_url: resumeUrl,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      onOpenChange(false);
      setResume(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Upload your resume to complete your application
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resume">Resume (Optional)</Label>
            <div className="mt-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
              {resume && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {resume.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
