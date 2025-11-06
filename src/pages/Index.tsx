import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Briefcase, Users, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userRole) {
      if (userRole === 'hr_admin') {
        navigate('/hr');
      } else {
        navigate('/candidate');
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
      <div className="text-center space-y-12 p-8 max-w-4xl">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Briefcase className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            AI Recruitment Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your hiring process with intelligent candidate matching
            and automated interview scheduling
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-lg bg-card border">
            <Zap className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Smart candidate scoring and matching
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <Users className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Efficient</h3>
            <p className="text-sm text-muted-foreground">
              Automated workflows and approvals
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <Briefcase className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Organized</h3>
            <p className="text-sm text-muted-foreground">
              Centralized recruitment management
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="text-lg px-8"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/signup")}
            className="text-lg px-8"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
