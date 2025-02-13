import { createClient } from '@supabase/supabase-js';

// TODO: Reemplazar con las nuevas credenciales del proyecto
const supabaseUrl = 'https://afjjqienulzsdwlfysex.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjkyMjcsImV4cCI6MjA1NDgwNTIyN30.lxuBnemIVO9Y8NQzkHnJKn4NVxwWhEmj7-vogGqky64';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});