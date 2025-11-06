import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, ClipboardCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            AI Recruitment Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your hiring process with AI-powered candidate screening and interview scheduling
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>HR Dashboard</CardTitle>
              <CardDescription>
                Manage job postings, review candidates, and approve AI-scheduled interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/hr">
                <Button className="w-full">
                  Access HR Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Candidate Portal</CardTitle>
              <CardDescription>
                Check your application status and view scheduled interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/candidate">
                <Button variant="secondary" className="w-full">
                  Check Application Status
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
