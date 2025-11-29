// src/lib/api.ts
const API_BASE_URL = "http://127.0.0.1:8000"; // Or http://127.0.0.1:8000 for local dev

export const api = {
  // === HR Endpoints ===

  getPendingInterviews: async () => {
    const response = await fetch(`${API_BASE_URL}/pending-interviews`);
    if (!response.ok) throw new Error("Failed to fetch pending interviews");
    return response.json();
  },

  getAllCandidates: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/candidates`);
    if (!response.ok) throw new Error("Failed to fetch candidates");
    return response.json();
  },

  approveInterview: async (interviewId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/pending-interviews/${interviewId}/approve`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error("Failed to approve interview");
    return response.json();
  },

  getJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  createJob: async (title: string, description: string) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description_text: description }),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  },

  getJobShortlist: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/shortlist`);
    if (!response.ok) throw new Error("Failed to fetch shortlist");
    return response.json();
  },

  submitFeedback: async (
    jobId: string,
    candidateId: string,
    decision: string,
    comments: string
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${jobId}/candidates/${candidateId}/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hr_decision: decision,
          hr_comments: comments,
        }),
      }
    );
    if (!response.ok) throw new Error("Failed to submit feedback");
    return response.json();
  },

  // === NEW: Detailed Score (Grand Project) ===
  getDetailedAnalysis: async (candidateId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/candidates/${candidateId}/analysis`
    );
    if (!response.ok) throw new Error("Failed to fetch detailed analysis");
    return response.json();
  },

  // === NEW: Chat with SQL (Grand Project) ===
  getChatResponse: async (question: string, chatHistory: any[]) => {
    const response = await fetch(`${API_BASE_URL}/hr/chat-analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        chat_history: chatHistory,
      }),
    });
    if (!response.ok) throw new Error("Failed to get chat response");
    return response.json();
  },

  // === NEW: Get Candidate Exam Results (Grand Project) ===
  getCandidateExamResults: async (candidateId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/hr/candidate-exams/${candidateId}`
    );
    if (!response.ok) throw new Error("Failed to fetch exam results");
    return response.json();
  },

  // === Candidate & Public Endpoints ===

  uploadCandidate: async (
    jobId: string,
    name: string,
    email: string,
    resume: File
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", resume);

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/candidates`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload candidate");
    return response.json();
  },

  getCandidateStatus: async (email: string) => {
    // This endpoint still needs to be built on the backend
    const response = await fetch(
      `${API_BASE_URL}/candidate-status?email=${encodeURIComponent(email)}`
    );
    if (!response.ok) throw new Error("Failed to fetch candidate status");
    return response.json();
  },

  // === NEW: Exam Platform (Grand Project) ===
  getExamQuestions: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/exam/${token}`);
    if (!response.ok) throw new Error("Failed to fetch exam. Link may be invalid or expired.");
    return response.json();
  },

  submitExamAnswers: async (token: string, answers: any) => {
    const response = await fetch(`${API_BASE_URL}/exam/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answers }),
    });
    if (!response.ok) throw new Error("Failed to submit exam");
    return response.json();
  },

  // === NEW: Analytics Dashboard ===
  getDashboardMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`);
    if (!response.ok) throw new Error("Failed to fetch dashboard metrics");
    return response.json();
  },
};