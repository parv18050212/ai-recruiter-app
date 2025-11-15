// src/pages/ExamPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ExamPage = () => {
  const { token } = useParams<{ token: string }>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: examData, isLoading, isError } = useQuery({
    queryKey: ['exam', token],
    queryFn: () => api.getExamQuestions(token!),
    enabled: !!token,
  });

  const submitMutation = useMutation({
    mutationFn: () => { // <-- THIS IS THE FIX
      if (!token) throw new Error("No exam token found");
      return api.submitExamAnswers(token, answers);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Exam submitted successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit exam");
    },
  });

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`question_${questionIndex}`]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !examData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This exam link is invalid or has expired. Please contact your recruiter.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <CardTitle className="mt-4">Submission Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Thank you! Your answers have been submitted. Your recruiter will be in touch soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Technical Assessment</CardTitle>
              <CardDescription>Job: {examData.job_title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {examData.questions.map((q: any, index: number) => (
                <div key={index} className="space-y-3">
                  <Label className="text-base font-semibold">
                    {index + 1}. {q.question_text}
                  </Label>
                  
                  {q.question_type === 'multiple-choice' && (
                    <RadioGroup
                      onValueChange={(value) => handleAnswerChange(index, value)}
                      className="space-y-2"
                    >
                      {q.options.map((opt: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt} id={`q${index}-opt${optIndex}`} />
                          <Label htmlFor={`q${index}-opt${optIndex}`} className="font-normal">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  
                  {q.question_type === 'short-answer' && (
                    <Textarea
                      placeholder="Your answer..."
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  )}
                  
                  {q.question_type === 'coding' && (
                    <Textarea
                      placeholder="Your code..."
                      className="font-mono"
                      rows={5}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Exam
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ExamPage;