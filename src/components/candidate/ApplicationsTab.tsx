import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ApplicationsTab = () => {
  const { user } = useAuth();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user?.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
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

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{application.job_title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  Applied: {new Date(application.applied_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant={getStatusColor(application.status)}>
                {application.status}
              </Badge>
            </div>
          </CardHeader>
          {application.resume_url && (
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(application.resume_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Resume
              </Button>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
