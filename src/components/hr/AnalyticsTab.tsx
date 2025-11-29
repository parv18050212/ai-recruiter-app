// src/components/hr/AnalyticsTab.tsx
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, BrainCircuit, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface ChatMessage {
  role: 'human' | 'ai';
  content: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsTab = () => {
  // --- Metrics Query ---
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: api.getDashboardMetrics,
  });

  // --- Chat State ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: "Hello! I'm the database analyst. Ask me questions about your candidates, jobs, or feedback. (e.g., 'How many candidates applied for job ID 1?')"
    }
  ]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: (newQuestion: string) => {
      return api.getChatResponse(newQuestion, messages);
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    },
    onError: (err: Error) => {
      setMessages(prev => [...prev, { role: 'ai', content: `Sorry, I encountered an error: ${err.message}` }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'human', content: input }]);
    chatMutation.mutate(input);
    setInput('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prepare data for charts
  const pipelineData = metrics ? [
    { name: 'Screened', value: metrics.pipeline.screened },
    { name: 'Shortlisted', value: metrics.pipeline.shortlisted },
    { name: 'Interview Pending', value: metrics.pipeline.interview_pending },
    { name: 'Interview Scheduled', value: metrics.pipeline.interview_scheduled },
    { name: 'Rejected', value: metrics.pipeline.rejected },
  ] : [];

  const scoreData = metrics ? [
    { name: '0-20', count: metrics.score_distribution.range_0_20 },
    { name: '20-40', count: metrics.score_distribution.range_20_40 },
    { name: '40-60', count: metrics.score_distribution.range_40_60 },
    { name: '60-80', count: metrics.score_distribution.range_60_80 },
    { name: '80-100', count: metrics.score_distribution.range_80_100 },
  ] : [];

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto p-1">

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pipeline.total_candidates}</div>
            <p className="text-xs text-muted-foreground">Across all jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.job_metrics.open_jobs}</div>
            <p className="text-xs text-muted-foreground">Active requisitions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Candidates/Job</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.job_metrics.avg_candidates_per_job}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pipeline.interview_scheduled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Pipeline Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pipeline Status</CardTitle>
            <CardDescription>Candidate distribution by stage</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution Bar Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fit Score Distribution</CardTitle>
            <CardDescription>How well candidates match job descriptions</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Candidates" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <Card className="flex flex-col h-[500px]">
        <CardHeader>
          <CardTitle>Chat with Your Database</CardTitle>
          <CardDescription>
            Ask natural language questions about your recruitment data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 space-y-4 p-4 border rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 my-4 ${msg.role === 'human' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <BrainCircuit className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'human'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                    }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'human' && (
                  <span className="flex-shrink-0 h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-3 my-4 justify-start">
                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
                <div className="rounded-lg p-3 bg-muted">...</div>
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How many candidates passed the exam?"
              disabled={chatMutation.isPending}
            />
            <Button type="submit" disabled={chatMutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};