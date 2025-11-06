import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Upload } from "lucide-react";

export const JobManagementTab = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobForUpload, setSelectedJobForUpload] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
  });

  const createJobMutation = useMutation({
    mutationFn: () => api.createJob(jobTitle, jobDescription),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Job Created!",
        description: "The job posting has been created successfully",
      });
      setJobTitle("");
      setJobDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    },
  });

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
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload candidate",
        variant: "destructive",
      });
    },
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobTitle.trim() && jobDescription.trim()) {
      createJobMutation.mutate();
    }
  };

  const handleUploadResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJobForUpload && candidateName.trim() && candidateEmail.trim() && resumeFile) {
      uploadCandidateMutation.mutate();
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
          <CardDescription>
            Add a new job posting to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Title</label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <Textarea
                placeholder="Enter job description, requirements, and qualifications..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createJobMutation.isPending}
            >
              {createJobMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Job
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Candidate Resume</CardTitle>
          <CardDescription>
            Manually add a candidate to a job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadResume} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Job</label>
              <Select value={selectedJobForUpload} onValueChange={setSelectedJobForUpload}>
                <SelectTrigger>
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
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Resume File</label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
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
        </CardContent>
      </Card>
    </div>
  );
};
