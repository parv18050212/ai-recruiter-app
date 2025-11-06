import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Briefcase, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ManualUploadDialog } from "./ManualUploadDialog";

export const JobManagementTab = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
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

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobTitle.trim() && jobDescription.trim()) {
      createJobMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Job Management</h2>
          <p className="text-white/90">Create and manage job postings to attract top talent</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-gradient-to-br from-[hsl(var(--gradient-card-start))] to-[hsl(var(--gradient-card-end))] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-gradient-to-br from-[hsl(var(--gradient-card-start))] to-[hsl(var(--gradient-card-end))] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-accent-start))] to-[hsl(var(--gradient-accent-end))] flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-gradient-to-br from-[hsl(var(--gradient-card-start))] to-[hsl(var(--gradient-card-end))] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Fit Score</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Job Form - Takes 2 columns */}
        <Card className="lg:col-span-2 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--gradient-card-start))] to-[hsl(var(--gradient-card-end))]">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              Create New Job
            </CardTitle>
            <CardDescription>
              Add a new job posting to start receiving applications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Job Description</label>
                <Textarea
                  placeholder="Enter job description, requirements, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  required
                  className="focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(var(--gradient-primary-start))] to-[hsl(var(--gradient-primary-end))] hover:opacity-90 transition-opacity text-white shadow-md hover:shadow-lg"
                disabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Job Posting
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Jobs List - 1 column */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--gradient-card-start))] to-[hsl(var(--gradient-card-end))]">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-accent-start))] to-[hsl(var(--gradient-accent-end))] flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              Active Jobs
            </CardTitle>
            <CardDescription>
              Currently open positions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {jobs && jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <div
                    key={job.job_id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-[hsl(var(--gradient-card-start))] to-card hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="ml-2 border-accent/30 text-accent bg-accent/10"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No jobs posted yet</p>
                  <p className="text-xs mt-1">Create your first job to get started</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <ManualUploadDialog jobs={jobs || []} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
