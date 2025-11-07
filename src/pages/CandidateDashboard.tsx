import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { JobsTab } from '@/components/candidate/JobsTab';
import { ApplicationsTab } from '@/components/candidate/ApplicationsTab';

const CandidateDashboard = () => {
  const { user, signOut } = useAuth();

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Recruitment Manager
            </h1>
            <p className="text-sm text-muted-foreground">Candidate Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.full_name || 'Candidate'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <JobsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsTab />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">
                      {user?.user_metadata?.full_name || 'Candidate'}
                    </h3>
                    <Badge variant="secondary">Job Candidate</Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <p className="font-medium">
                      {user?.user_metadata?.full_name || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium leading-none ${className}`}>
    {children}
  </label>
);

export default CandidateDashboard;
