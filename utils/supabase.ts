import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vlrdkncyagodenkwqjey.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscmRrbmN5YWdvZGVua3dxamV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NzAxOTQsImV4cCI6MjA0ODM0NjE5NH0.Qo4TnlV9In-W-Jc6z3SY9OJ_ThDyGje2B_xxkvXum34";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
