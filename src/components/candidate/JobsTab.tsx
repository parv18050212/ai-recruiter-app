import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { Briefcase, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const JobsTab = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
    retry: 1,

    // --- THIS IS THE FIX ---
    // The 'select' option transforms the data after it's fetched.
    // We map the array and copy 'job_id' to a new 'id' property.
    select: (data) => {
      if (!Array.isArray(data)) {
        return []; // Return empty array if data is not as expected
      }
      return data.map(job => ({
        ...job,
        id: job.job_id, // Create the 'id' property
      }));
    },
    // --- END OF FIX ---
  });

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            {error.message.includes('timeout') 
              ? 'Backend server not responding. Please try again.' 
              : 'Failed to load jobs. Please check your connection.'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="ml-4"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No jobs available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job: any) => (
          // Now 'job.id' will be correctly populated from 'job.job_id'
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                {/* API docs show 'created_at', so this should be fine */}
                Posted: {new Date(job.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {job.description_text || "No description available"}
              </p>
              <Button onClick={() => handleApply(job)} className="w-full">
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <JobApplicationDialog
        job={selectedJob}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};