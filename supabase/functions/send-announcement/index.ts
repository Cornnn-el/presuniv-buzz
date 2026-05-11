import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

console.log("RESEND KEY:", Deno.env.get("RESEND_API_KEY"));
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const { emails, title, content } = body;

    const { data, error } = await resend.emails.send({
      from: "Synapse <onboarding@resend.dev>",
      to: ["70crlouis02@gmail.com"],
      subject: `New Announcement: ${title}`,
      html: `<h2>${title}</h2><p>${content}</p>`,
    });

    if (error) {
      return new Response(JSON.stringify(error), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: corsHeaders,
    });
  }
});