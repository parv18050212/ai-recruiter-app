import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

export const PendingApprovalsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["pendingInterviews"],
    queryFn: api.getPendingInterviews,
  });

  const approveMutation = useMutation({
    mutationFn: (interviewId: string) => api.approveInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingInterviews"] });
      toast({
        title: "Success!",
        description: "Interview approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve interview",
        variant: "destructive",
      });
    },
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Interview Approvals</CardTitle>
        <CardDescription>
          Review and approve interviews prepared by the AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!interviews || interviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No pending approvals at the moment</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Summary</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Job ID</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview: any) => (
                  <TableRow key={interview.interview_id}>
                    <TableCell className="font-medium">
                      {interview.summary}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(interview.proposed_start_time)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {interview.job_id}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(interview.interview_id)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
