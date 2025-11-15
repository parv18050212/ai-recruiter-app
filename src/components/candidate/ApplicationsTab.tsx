import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, ExternalLink, Link as LinkIcon, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define your backend URL
const API_URL = "http://127.0.0.1:8000";

// --- 1. Define the data structure from our new endpoint ---
interface Job {
  job_id: number;
  title: string;
}

interface Interview {
  interview_id: number;
  summary: string;
  proposed_start_time: string;
  proposed_end_time: string;
  status: 'pending' | 'approved' | 'scheduled' | 'rejected' | 'error';
  meet_link?: string;
}

interface Application {
  candidate_id: number;
  job: Job;
  interview?: Interview; // This can be null
  created_at: string; // From Candidate table
  fit_score: number;
}

// --- 2. API fetch function ---
const fetchMyApplications = async (email: string): Promise<Application[]> => {
  const response = await fetch(`${API_URL}/my-applications/${email}`);
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  return response.json();
};

export const ApplicationsTab = () => {
  const { user } = useAuth();

  // --- 3. Update useQuery to call our new function ---
  const { data: applications, isLoading } = useQuery({
    queryKey: ["myApplications", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("User not logged in");
      return fetchMyApplications(user.email);
    },
    enabled: !!user?.email,
  });

  // --- 4. Update status colors ---
  const getStatusInfo = (app?: Application): { text: string, variant: "default" | "destructive" | "secondary" | "outline" } => {
    if (!app?.interview) {
      return { text: "Pending Review", variant: "secondary" };
    }
    switch (app.interview.status) {
      case "scheduled":
        return { text: "Interview Scheduled", variant: "default" };
      case "approved":
        return { text: "Awaiting Schedule", variant: "default" };
      case "pending":
        return { text: "Pending HR Approval", variant: "secondary" };
      case "rejected":
        return { text: "Rejected", variant: "destructive" };
      default:
        return { text: app.interview.status, variant: "outline" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You haven't applied to any jobs yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- 5. Update the render logic ---
  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const status = getStatusInfo(app);
        const interviewTime = app.interview?.proposed_start_time
          ? new Date(app.interview.proposed_start_time).toLocaleString()
          : null;

        return (
          <Card key={app.candidate_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{app.job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={status.variant}>
                  {status.text}
                </Badge>
              </div>
            </CardHeader>
            
            {/* Show schedule details if the interview is scheduled */}
            {app.interview && app.interview.status === 'scheduled' && (
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <strong>Time:</strong> {interviewTime}
                </div>
                {app.interview.meet_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(app.interview!.meet_link, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Google Meet
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};