import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { Briefcase, Calendar } from "lucide-react";

export const JobsTab = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-jobs");
      if (error) throw error;
      return data;
    },
  });

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
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
