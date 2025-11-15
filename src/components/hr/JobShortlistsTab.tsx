import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Using Sonner for notifications
import { Loader2, XCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// --- NEW: Analysis Modal Component ---
// This modal opens to show the detailed Nirmaan.HR analysis
const AnalysisModal = ({ candidate }: { candidate: any }) => {
  const [open, setOpen] = useState(false);

  // Lazy-load the detailed analysis only when the user clicks
  const { data: analysis, isLoading } = useQuery({
    queryKey: ["detailedAnalysis", candidate.candidate_id],
    queryFn: () => api.getDetailedAnalysis(candidate.candidate_id),
    enabled: open, // Only fetch when the modal is open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-1" />
          View AI Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deep Analysis for {candidate.name}</DialogTitle>
          <DialogDescription>
            Detailed scoring and recommendation from the Nirmaan.HR logic.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : analysis ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Detailed Score</Label>
              <p className="text-3xl font-bold text-primary">{analysis.detailed_score || 'N/A'}</p>
            </div>
            <div>
              <Label>Scoring Validation</Label>
              <p className="text-sm p-3 bg-muted rounded-md">{analysis.detailed_validation || 'N/A'}</p>
            </div>
            <div>
              <Label>AI Recommendation</Label>
              <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">{analysis.detailed_recommendation || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p>Could not load analysis.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component: JobShortlistsTab ---
export const JobShortlistsTab = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; candidateId: string | null }>({
    open: false,
    candidateId: null,
  });
  const [feedbackComment, setFeedbackComment] = useState("");
  const queryClient = useQueryClient();

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
      toast.success("Feedback Submitted", {
        description: "Your feedback has been recorded",
      });
      setFeedbackModal({ open: false, candidateId: null });
      setFeedbackComment("");
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to submit feedback",
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
  
  // Helper to render the Analysis Button, Spinner, or Error
  const renderAnalysisStatus = (candidate: any) => {
    switch (candidate.deep_analysis_status) {
      case 'complete':
        return <AnalysisModal candidate={candidate} />;
      case 'pending':
        return (
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Analyzing...
          </Button>
        );
      case 'failed':
        return <Badge variant="destructive">Analysis Failed</Badge>;
      default:
        return null;
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
            <Label>Select Job</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={jobsLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs?.map((job: any) => (
                  <SelectItem key={job.job_id} value={job.job_id.toString()}>
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
                        <TableHead>Vector Score</TableHead>
                        <TableHead>Detailed Score</TableHead>
                        <TableHead>AI Analysis</TableHead>
                        <TableHead className="text-right">Feedback</TableHead>
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
                            <span className="font-semibold text-muted-foreground">
                              {(candidate.fit_score * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-primary">
                              {candidate.detailed_score || '--'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {renderAnalysisStatus(candidate)}
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
              Please provide a reason for rejecting this candidate. This feedback will be used to train the agent.
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

// Helper component
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium mb-2 block ${className}`}>
    {children}
  </label>
);