// src/components/hr/AnalyticsTab.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, BrainCircuit, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  role: 'human' | 'ai';
  content: string;
}

export const AnalyticsTab = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: "Hello! I'm the database analyst. Ask me questions about your candidates, jobs, or feedback. (e.g., 'How many candidates applied for job ID 1?')"
    }
  ]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: (newQuestion: string) => {
      // Send the new question and the existing history
      return api.getChatResponse(newQuestion, messages);
    },
    onSuccess: (data) => {
      // Add the AI's answer to the chat
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: data.answer }
      ]);
    },
    onError: (err: Error) => {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: `Sorry, I encountered an error: ${err.message}` }
      ]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user's question to the chat
    setMessages(prev => [
      ...prev,
      { role: 'human', content: input }
    ]);
    
    // Call the mutation
    chatMutation.mutate(input);
    setInput('');
  };

  return (
    <Card className="h-full flex flex-col max-h-[80vh]">
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
                className={`rounded-lg p-3 max-w-[80%] ${
                  msg.role === 'human'
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
  );
};