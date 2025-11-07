import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Fetching jobs from external API...');
    
    // Fetch jobs from the local backend API
    const response = await fetch('http://3.108.237.107:8000/jobs');
    
    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }
    
    const jobs = await response.json();
    console.log(`Successfully fetched ${jobs.length || 0} jobs`);
    
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
