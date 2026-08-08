import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error("VITE_SUPABASE_URL is missing");
}

if (!url.startsWith("https://")) {
  throw new Error(`Invalid URL value: ${url}`);
}

export const supabase = createClient(url, key);