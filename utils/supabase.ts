import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vpmkrhyfgioqidclalpg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwbWtyaHlmZ2lvcWlkY2xhbHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjM2NzMsImV4cCI6MjA0ODQzOTY3M30.GMrPempAHg2ktjQDoAgy_FYVqUGcEAGpwIpH0KmkPPk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
