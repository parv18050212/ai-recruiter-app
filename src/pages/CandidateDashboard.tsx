import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Calendar, CheckCircle2, XCircle } from "lucide-react";

const CandidateDashboard = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const { toast } = useToast();

  const handleCheckStatus = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await api.getCandidateStatus(email);
      setStatus(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusView = () => {
    if (!status) return null;

    switch (status.status) {
      case "Applied":
        return (
          <Alert className="border-primary bg-primary/5">
            <Mail className="h-5 w-5 text-primary" />
            <AlertDescription className="ml-2">
              We have received your application for the <strong>'{status.job_title}'</strong> position. 
              We are currently reviewing it.
            </AlertDescription>
          </Alert>
        );
      
      case "Scheduled":
        return (
          <Alert className="border-accent bg-accent/5">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <AlertDescription className="ml-2">
              Congratulations! Your interview is scheduled for{" "}
              <strong>{new Date(status.interview_time).toLocaleString()}</strong>. 
              Please check your email for the calendar invite and Google Meet link.
            </AlertDescription>
          </Alert>
        );
      
      case "Rejected":
        return (
          <Alert className="border-muted">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <AlertDescription className="ml-2">
              Thank you for your interest. After careful review, we have decided to move 
              forward with other candidates at this time.
            </AlertDescription>
          </Alert>
        );
      
      default:
        return (
          <Alert>
            <AlertDescription>
              Status: {status.status}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Check Application Status</CardTitle>
          <CardDescription>
            Enter your email to view your recruitment status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCheckStatus()}
            />
            <Button onClick={handleCheckStatus} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Status"
              )}
            </Button>
          </div>

          {renderStatusView()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
