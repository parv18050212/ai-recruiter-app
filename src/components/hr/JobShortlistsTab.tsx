import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, XCircle } from "lucide-react";

export const JobShortlistsTab = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; candidateId: string | null }>({
    open: false,
    candidateId: null,
  });
  const [feedbackComment, setFeedbackComment] = useState("");
  const { toast } = useToast();

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
  });

  const { data: shortlist, isLoading: shortlistLoading } = useQuery({
    queryKey: ["shortlist", selectedJobId],
    queryFn: () => api.getJobShortlist(selectedJobId),
    enabled: !!selectedJobId,
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ candidateId, comment }: { candidateId: string; comment: string }) =>
      api.submitFeedback(selectedJobId, candidateId, "Rejected", comment),
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been recorded",
      });
      setFeedbackModal({ open: false, candidateId: null });
      setFeedbackComment("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const handleReject = (candidateId: string) => {
    setFeedbackModal({ open: true, candidateId });
  };

  const handleSubmitFeedback = () => {
    if (feedbackModal.candidateId && feedbackComment.trim()) {
      feedbackMutation.mutate({
        candidateId: feedbackModal.candidateId,
        comment: feedbackComment,
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Job Shortlists</CardTitle>
          <CardDescription>
            Review AI scoring and provide feedback on candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Job</label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
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

          {selectedJobId && (
            <>
              {shortlistLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !shortlist || shortlist.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No candidates in shortlist</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Fit Score</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortlist.map((candidate: any) => (
                        <TableRow key={candidate.candidate_id}>
                          <TableCell className="font-medium">
                            {candidate.name}
                          </TableCell>
                          <TableCell>{candidate.email}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              {(candidate.fit_score * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(candidate.candidate_id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={feedbackModal.open} onOpenChange={(open) => setFeedbackModal({ open, candidateId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Candidate</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this candidate
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Why are you rejecting this candidate?"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModal({ open: false, candidateId: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedbackComment.trim() || feedbackMutation.isPending}
            >
              {feedbackMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
