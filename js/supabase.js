// Импорт клиента Supabase через CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://wcgxcviktjaaabtwqwem.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ3hjdmlrdGphYWFidHdxd2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTIyMTcsImV4cCI6MjA4NDM4ODIxN30.5xM0Lj5W-o99Prhg4YL4skxLr88wDMOurosFemX6zrM";

// Создаём и экспортируем клиент
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
