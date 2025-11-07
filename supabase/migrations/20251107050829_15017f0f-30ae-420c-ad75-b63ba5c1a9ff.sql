-- Create applications table for candidate job applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Candidates can create their own applications
CREATE POLICY "Users can create own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Candidates can view their own applications
CREATE POLICY "Users can view own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

-- HR admins can view all applications
CREATE POLICY "HR can view all applications"
ON public.applications
FOR SELECT
USING (public.has_role(auth.uid(), 'hr_admin'));

-- HR admins can update application status
CREATE POLICY "HR can update applications"
ON public.applications
FOR UPDATE
USING (public.has_role(auth.uid(), 'hr_admin'));

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Users can upload their own resumes
CREATE POLICY "Users can upload own resumes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own resumes, HR can view all
CREATE POLICY "Users can view own resumes, HR can view all"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   public.has_role(auth.uid(), 'hr_admin'))
);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_applications_updated_at();