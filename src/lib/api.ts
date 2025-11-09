const API_BASE_URL = " http://127.0.0.1:8000";

// Timeout helper to prevent hanging
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend server not responding');
    }
    throw error;
  }
};

export const api = {
  // Pending Approvals
  getPendingInterviews: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/pending-interviews`);
    if (!response.ok) throw new Error("Failed to fetch pending interviews");
    return response.json();
  },

  approveInterview: async (interviewId: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/pending-interviews/${interviewId}/approve`,
      { method: "POST" }
    );
    if (!response.ok) throw new Error("Failed to approve interview");
    return response.json();
  },

  // Jobs
  getJobs: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  createJob: async (title: string, description: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description_text: description }),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  },

  // Shortlists
  getJobShortlist: async (jobId: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs/${jobId}/shortlist`);
    if (!response.ok) throw new Error("Failed to fetch shortlist");
    return response.json();
  },

  submitFeedback: async (
    jobId: string,
    candidateId: string,
    decision: string,
    comments: string
  ) => {
    const response = await fetchWithTimeout(
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

  // Candidates
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

    const response = await fetchWithTimeout(`${API_BASE_URL}/jobs/${jobId}/candidates`, {
      method: "POST",
      body: formData,
    }, 10000); // 10s timeout for file upload
    if (!response.ok) throw new Error("Failed to upload candidate");
    return response.json();
  },

  // Candidate Status
  getCandidateStatus: async (email: string) => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/candidate-status?email=${encodeURIComponent(email)}`
    );
    if (!response.ok) throw new Error("Failed to fetch candidate status");
    return response.json();
  },
};
