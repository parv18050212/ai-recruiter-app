import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, XCircle, Sparkles, ThumbsUp, CheckCircle2, Briefcase, GraduationCap, AlertTriangle, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- 1. ANALYSIS MODAL (The Deep Dive) ---
const AnalysisModal = ({ candidate }: { candidate: any }) => {
  const [open, setOpen] = useState(false);
  const { data: analysis, isLoading } = useQuery({
    queryKey: ["detailedAnalysis", candidate.candidate_id],
    queryFn: () => api.getDetailedAnalysis(candidate.candidate_id),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            AI Deep Dive: <span className="text-primary">{candidate.name}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of skills, experience, and fit score.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : analysis ? (
          <Tabs defaultValue="summary" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4 pr-4">
              {/* --- TAB 1: SUMMARY --- */}
              <TabsContent value="summary" className="space-y-6">
                <div className="flex items-start gap-6 p-4 bg-muted/30 rounded-xl border">
                  <div className="text-center min-w-[100px]">
                    <div className="text-4xl font-bold text-primary">{analysis.detailed_score}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Fit Score</div>
                  </div>
                  <div className="flex-1 border-l pl-6">
                    <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" /> Scoring Logic
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.detailed_validation}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" /> AI Recommendation
                  </h4>
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900 text-sm leading-relaxed">
                    {analysis.detailed_recommendation}
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB 2: SKILLS --- */}
              <TabsContent value="skills" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2 bg-green-50 p-2 rounded-md">
                      <CheckCircle2 className="h-4 w-4" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.similar_skills?.length > 0 ? (
                        analysis.similar_skills.map((skill: any, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                            {skill.name}
                          </Badge>
                        ))
                      ) : <p className="text-sm text-muted-foreground italic">No direct matches found.</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2 bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4" /> Missing / Gaps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills?.length > 0 ? (
                        analysis.missing_skills.map((skill: any, i: number) => (
                          <Badge key={i} variant="outline" className="border-red-200 text-red-700 bg-white">
                            {skill.name}
                          </Badge>
                        ))
                      ) : <p className="text-sm text-muted-foreground italic">No missing skills detected.</p>}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB 3: EXPERIENCE --- */}
              <TabsContent value="experience" className="space-y-6">
                <div className="space-y-4">
                  {analysis.experiences?.length > 0 ? (
                    analysis.experiences.map((exp: any, i: number) => (
                      <div key={i} className="flex justify-between items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h5 className="font-semibold text-base">{exp.title}</h5>
                          <p className="text-sm text-muted-foreground">{exp.organization}</p>
                        </div>
                        <Badge variant="secondary">{exp.years}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No relevant experience extracted.</p>
                    </div>
                  )}
                </div>

                {analysis.education?.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Education
                    </h4>
                    <ul className="space-y-2">
                      {analysis.education.map((edu: any, i: number) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="font-medium">{edu.degree}</span>
                          {edu.completion_year && <span className="text-muted-foreground">({edu.completion_year})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Analysis data not available.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// --- 2. MAIN COMPONENT ---
export const JobShortlistsTab = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    candidateId: string | null;
    type: "Approved" | "Rejected";
  }>({ open: false, candidateId: null, type: "Approved" });
  const [feedbackComment, setFeedbackComment] = useState("");

  const queryClient = useQueryClient();

  // Fetch Jobs for the dropdown
  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
  });

  // Fetch Candidates for the selected job
  const { data: candidates, isLoading } = useQuery({
    queryKey: ["shortlist", selectedJobId],
    queryFn: () => api.getJobShortlist(selectedJobId),
    enabled: !!selectedJobId,
  });

  // Feedback Mutation
  const feedbackMutation = useMutation({
    mutationFn: () => {
      if (!feedbackModal.candidateId) throw new Error("No candidate selected");
      return api.submitFeedback(
        selectedJobId,
        feedbackModal.candidateId,
        feedbackModal.type.toLowerCase(),
        feedbackComment
      );
    },
    onSuccess: () => {
      toast.success(`Candidate ${feedbackModal.type.toLowerCase()} successfully`);
      setFeedbackModal({ open: false, candidateId: null, type: "Approved" });
      setFeedbackComment("");
      queryClient.invalidateQueries({ queryKey: ["shortlist", selectedJobId] });
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const handleSubmitFeedback = () => {
    if (feedbackComment.trim()) {
      feedbackMutation.mutate();
    }
  };

  const openFeedbackModal = (candidateId: string, type: "Approved" | "Rejected") => {
    setFeedbackModal({ open: true, candidateId, type });
    setFeedbackComment("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Job Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Shortlists</h2>
          <p className="text-muted-foreground">Review top candidates and AI analysis</p>
        </div>
        <div className="w-full md:w-[300px]">
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job to view candidates" />
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
      </div>

      {/* Main Content */}
      {!selectedJobId ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Job Selected</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Please select a job from the dropdown above to view the AI-ranked shortlist of candidates.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : !candidates || candidates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Candidates Found</h3>
            <p className="text-muted-foreground mt-2">
              There are no candidates applied or shortlisted for this job yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ranked Candidates</CardTitle>
            <CardDescription>
              Candidates sorted by AI Fit Score. Review the deep dive analysis before making a decision.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Fit Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate: any, index: number) => (
                  <TableRow key={candidate.candidate_id}>
                    <TableCell className="font-medium text-muted-foreground">
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground">{candidate.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={
                          candidate.fit_score >= 80 ? "bg-green-100 text-green-800" : 
                          candidate.fit_score >= 60 ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }
                      >
                        {candidate.fit_score}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{candidate.status || "Pending"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <AnalysisModal candidate={candidate} />
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openFeedbackModal(candidate.candidate_id, "Approved")}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openFeedbackModal(candidate.candidate_id, "Rejected")}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* FEEDBACK MODAL - RESTORED TO MAIN COMPONENT */}
      <Dialog 
        open={feedbackModal.open} 
        onOpenChange={(isOpen) => !isOpen && setFeedbackModal(prev => ({ ...prev, open: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feedbackModal.type === "Approved" ? "Confirm Good Match" : "Reject Candidate"}</DialogTitle>
            <DialogDescription>
              {feedbackModal.type === "Approved" 
                ? "Help the AI learn by confirming why this candidate is a good fit."
                : "Please provide a reason for rejecting this candidate to improve future scoring."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={feedbackModal.type === "Approved" ? "e.g., Strong React skills, relevant experience..." : "e.g., Missing required Python experience..."}
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModal(prev => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedbackComment.trim() || feedbackMutation.isPending}
              variant={feedbackModal.type === "Approved" ? "default" : "destructive"}
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
    </div>
  );
};