import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FacebookEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string;
    fn?: string;
    external_id?: string;
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_name, user_data, custom_data } = await req.json();
    
    const pixel_id = Deno.env.get('FB_PIXEL_ID');
    const access_token = Deno.env.get('FB_ACCESS_TOKEN');

    if (!pixel_id || !access_token) {
      throw new Error('Missing Facebook configuration');
    }

    const event: FacebookEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      user_data,
      custom_data
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixel_id}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          data: [event],
          test_event_code: 'TEST12345' // Remover en producción
        }),
      }
    );

    const result = await response.json();
    console.log('Facebook event result:', result);

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending Facebook event:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});