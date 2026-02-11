import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record' }), { status: 400, headers: corsHeaders });
    }

    const lines: string[] = [];
    lines.push(`🆕 New ${record.type || 'unknown'} signup!`);
    if (record.full_name) lines.push(`Name: ${record.full_name}`);
    if (record.email) lines.push(`Email: ${record.email}`);
    if (record.gpu_models) lines.push(`GPU: ${record.gpu_models}`);
    else if (record.hardware_type?.length) lines.push(`Hardware: ${record.hardware_type.join(', ')}`);
    if (record.location_city) lines.push(`Location: ${record.location_city}`);
    if (record.heard_from) lines.push(`Source: ${record.heard_from}`);
    if (record.company) lines.push(`Company: ${record.company}`);
    if (record.use_case) lines.push(`Use Case: ${record.use_case}`);
    if (record.monthly_budget) lines.push(`Budget: ${record.monthly_budget}`);

    const text = lines.join('\n');
    const token = Deno.env.get('TELEGRAM_BOT_TOKEN');

    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN not set');
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 500, headers: corsHeaders });
    }

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: -5275672778,
        text,
        parse_mode: 'HTML',
      }),
    });

    const result = await telegramRes.json();
    console.log('Telegram response:', JSON.stringify(result));

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
