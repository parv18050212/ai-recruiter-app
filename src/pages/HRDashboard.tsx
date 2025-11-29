import { useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PendingApprovalsTab } from '@/components/hr/PendingApprovalsTab';
import { JobShortlistsTab } from '@/components/hr/JobShortlistsTab';
import { JobManagementTab } from '@/components/hr/JobManagementTab';
import { OverviewTab } from '@/components/hr/OverviewTab';
import { AnalyticsTab } from '@/components/hr/AnalyticsTab'; // <-- 1. IMPORT NEW TAB
const HRDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const renderContent = () => {
    switch (currentTab) {
      case 'pending':
        return <PendingApprovalsTab />;
      case 'shortlists':
        return <JobShortlistsTab />;
      case 'management':
        return <JobManagementTab />;
      default:
      case 'analytics': // <-- 2. ADD NEW CASE
        return <AnalyticsTab />; // <-- 3. RENDER NEW TAB
      case 'overview':http://127.0.0.1:8000
        return <OverviewTab />;
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AI Recruitment Manager
                </h1>
                <p className="text-sm text-muted-foreground">HR Control Panel</p>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HRDashboard;
