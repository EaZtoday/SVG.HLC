import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- Save and close

**Step 3: Create the .env file**
- Go back to the main `SVG.HLC` folder
- Right-click → New → Text Document
- Name it: `.env` (just dot-env, no txt)
- Windows might warn you - click Yes to confirm
- Open it with Notepad
- Paste this:
```
VITE_SUPABASE_URL=https://cbemnpwwbjrqekanjsou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZW1ucHd3YmpycWVrYW5qc291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzA4ODMsImV4cCI6MjA4NTIwNjg4M30.EOKX0tSo7w5RPHL5tq7lJ0dcBRnGBCaRuqji2uqkoZE