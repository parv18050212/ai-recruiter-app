import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { job_id, job_title, resume_url } = await req.json();

    if (!job_id || !job_title) {
      throw new Error('Missing required fields: job_id and job_title');
    }

    console.log(`User ${user.id} applying for job ${job_id}`);

    // Check if user already applied for this job
    const { data: existingApplication } = await supabaseClient
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('job_id', job_id)
      .single();

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    // Create the application
    const { data: application, error: insertError } = await supabaseClient
      .from('applications')
      .insert({
        user_id: user.id,
        job_id,
        job_title,
        resume_url,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating application:', insertError);
      throw insertError;
    }

    console.log('Application created successfully:', application.id);

    return new Response(JSON.stringify(application), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in apply-job function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: errorMessage === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
