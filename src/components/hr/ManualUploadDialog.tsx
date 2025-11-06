import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, UserPlus } from "lucide-react";

interface ManualUploadDialogProps {
  jobs: any[];
}

export const ManualUploadDialog = ({ jobs }: ManualUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedJobForUpload, setSelectedJobForUpload] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadCandidateMutation = useMutation({
    mutationFn: () => {
      if (!resumeFile) throw new Error("No file selected");
      return api.uploadCandidate(selectedJobForUpload, candidateName, candidateEmail, resumeFile);
    },
    onSuccess: () => {
      toast({
        title: "Candidate Added!",
        description: "Resume uploaded successfully",
      });
      setCandidateName("");
      setCandidateEmail("");
      setResumeFile(null);
      setSelectedJobForUpload("");
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload candidate",
        variant: "destructive",
      });
    },
  });

  const handleUploadResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJobForUpload && candidateName.trim() && candidateEmail.trim() && resumeFile) {
      uploadCandidateMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Candidate Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            Upload Candidate Resume
          </DialogTitle>
          <DialogDescription>
            Manually add a candidate to a job posting. This is useful for candidates from referrals, career fairs, or direct outreach.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUploadResume} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Job</label>
            <Select value={selectedJobForUpload} onValueChange={setSelectedJobForUpload}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Choose a job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs?.map((job: any) => (
                  <SelectItem key={job.job_id} value={job.job_id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Candidate Name</label>
            <Input
              placeholder="Full Name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Candidate Email</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Resume File</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              required
              className="focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (max 10MB)</p>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] hover:opacity-90 transition-opacity"
            disabled={uploadCandidateMutation.isPending}
          >
            {uploadCandidateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Resume
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
