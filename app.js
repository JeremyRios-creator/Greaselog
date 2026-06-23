import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://qjiwirnetqvynraphzfg.supabase.co/rest/v1/
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXdpcm5ldHF2eW5yYXBoemZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzM4ODQsImV4cCI6MjA5Nzc0OTg4NH0.NCUuxVSxOnLLMK6g6k2FX3krYM-p1VaiL7gEhX6Unb4
const supabase = createClient(supabaseUrl, supabaseKey)

// Example: How a user logs a vehicle without complex dropdown menus
async function quickAddVehicle(householdId, userTypedInput) {
  // Our smart parser logic will split "99 Civic" into fields later,
  // but for now, we pass the raw text directly into our flexible table layout:
  const { data, error } = await supabase
    .from('vehicles')
    .insert([
      { 
        household_id: householdId, 
        nickname: userTypedInput, // e.g., "The '69 Cougar Project"
        smart_search_string: userTypedInput.toLowerCase(),
        custom_spec_fields: { stage: "Teardown", motor: "351c" } // Instant custom fields!
      }
    ])
    
  if (error) console.error("Error logging vehicle:", error)
  else console.log("Vehicle created completely serverless:", data)
}
