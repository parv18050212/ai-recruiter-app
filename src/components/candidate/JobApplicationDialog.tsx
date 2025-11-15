import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// --- Removed ---
// import { supabase } from "@/integrations/supabase/client"; 
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface JobApplicationDialogProps {
  job: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- Added ---
// Define your backend URL
const API_URL = "http://127.0.0.1:8000";

export const JobApplicationDialog = ({ job, open, onOpenChange }: JobApplicationDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resume, setResume] = useState<File | null>(null);

  // --- Renamed and completely new mutation function ---
  const applyMutation = useMutation({
    mutationFn: async () => {
      // Your new API requires a resume, name, and email
      if (!job || !user || !resume) {
        throw new Error("Missing job, user, or resume file");
      }

      // Get name and email from the authenticated user
      // Assumes 'user.email' and 'user.user_metadata.full_name' exist
      const email = user.email;
      const name = user.user_metadata?.full_name || user.email; // Fallback to email if no name

      if (!email) {
        throw new Error("User email not found. Please log in again.");
      }

      // 1. Create FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("resume", resume); // 'resume' is the File object

      // 2. Call your FastAPI backend
      const response = await fetch(`${API_URL}/jobs/${job.id}/candidates`, {
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed; browser sets it for FormData
      });

      if (!response.ok) {
        // Try to parse error details from your FastAPI backend
        const errorBody = await response.json();
        throw new Error(errorBody.detail || `Failed to submit application: ${response.statusText}`);
      }

      // 3. Return the successful response
      return response.json();
    },
    onSuccess: (data) => {
      // 'data' is now the response from your FastAPI backend
      console.log("Application successful:", data);
      toast.success(`Application submitted! Fit score: ${data.fit_score.toFixed(2)}`);
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
    // --- Added ---
    // Add check to ensure resume is selected
    if (!resume) {
      toast.error("Please upload a resume to apply.");
      return;
    }
    applyMutation.mutate();
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
            {/* --- Updated Label --- */}
            <Label htmlFor="resume">Resume</Label>
            <div className="mt-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                // --- Added ---
                required 
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
              // --- Updated ---
              disabled={applyMutation.isPending} 
            >
              Cancel
            </Button>
            {/* --- Updated --- */}
            <Button type="submit" disabled={applyMutation.isPending}>
              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};