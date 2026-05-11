import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wuteulmhktfysmrpvnpp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGV1bG1oa3RmeXNtcnB2bnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODIxMzAsImV4cCI6MjA4Njc1ODEzMH0.iBDkcrO7lqtSClkY1q2hWM6dQ8tO3EmA79H-afNUD38";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
