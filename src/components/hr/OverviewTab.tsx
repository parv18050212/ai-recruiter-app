import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, Users, ClipboardCheck, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const OverviewTab = () => {
  const { data: jobs, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: api.getJobs,
    retry: 1,
  });

  const { data: pendingInterviews, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = useQuery({
    queryKey: ['pendingInterviews'],
    queryFn: api.getPendingInterviews,
    retry: 1,
  });

  const stats = [
    {
      title: 'Active Jobs',
      value: jobs?.length || 0,
      icon: Briefcase,
      description: 'Open positions',
      color: 'text-primary',
    },
    {
      title: 'Pending Approvals',
      value: pendingInterviews?.length || 0,
      icon: ClipboardCheck,
      description: 'Interviews to review',
      color: 'text-warning',
    },
    {
      title: 'Total Candidates',
      value: '-',
      icon: Users,
      description: 'This month',
      color: 'text-accent',
    },
    {
      title: 'Avg Fit Score',
      value: '-',
      icon: TrendingUp,
      description: 'Overall performance',
      color: 'text-success',
    },
  ];

  if (jobsLoading || pendingLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (jobsError || pendingError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Key metrics and insights for your recruitment pipeline
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {(jobsError?.message || pendingError?.message || '').includes('timeout')
                ? 'Backend server not responding. Please try again.'
                : 'Failed to load dashboard data. Please check your connection.'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchJobs();
                refetchPending();
              }}
              className="ml-4"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Key metrics and insights for your recruitment pipeline
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInterviews && pendingInterviews.length > 0 ? (
                pendingInterviews.slice(0, 5).map((interview: any) => (
                  <div key={interview.interview_id} className="flex items-start space-x-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {interview.summary}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Job ID: {interview.job_id}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/hr?tab=management" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium text-sm">Create New Job</p>
                <p className="text-xs text-muted-foreground">Post a new position</p>
              </a>
              <a href="/hr?tab=pending" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium text-sm">Review Approvals</p>
                <p className="text-xs text-muted-foreground">
                  {pendingInterviews?.length || 0} pending
                </p>
              </a>
              <a href="/hr?tab=shortlists" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium text-sm">View Shortlists</p>
                <p className="text-xs text-muted-foreground">Check candidate rankings</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
