import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingApprovalsTab } from "@/components/hr/PendingApprovalsTab";
import { JobShortlistsTab } from "@/components/hr/JobShortlistsTab";
import { JobManagementTab } from "@/components/hr/JobManagementTab";
import { ClipboardCheck, Users, Briefcase } from "lucide-react";

const HRDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            AI Recruitment Manager
          </h1>
          <p className="text-muted-foreground mt-1">HR Control Panel</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger value="shortlists" className="gap-2">
              <Users className="h-4 w-4" />
              Job Shortlists
            </TabsTrigger>
            <TabsTrigger value="management" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Job Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <PendingApprovalsTab />
          </TabsContent>

          <TabsContent value="shortlists">
            <JobShortlistsTab />
          </TabsContent>

          <TabsContent value="management">
            <JobManagementTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HRDashboard;
