import { createClient } from '@supabase/supabase-js'

// 1. Initialize your Supabase client with the credentials you found in Step 2
const supabaseUrl = https://qjiwirnetqvynraphzfg.supabase.co/rest/v1/;
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXdpcm5ldHF2eW5yYXBoemZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzM4ODQsImV4cCI6MjA5Nzc0OTg4NH0.NCUuxVSxOnLLMK6g6k2FX3krYM-p1VaiL7gEhX6Unb4;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Smart Text Parser Engine
 * Takes a raw user sentence and extracts structured data fields.
 */
function parseSmartVehicleInput(rawText) {
    const cleaned = rawText.trim();
    
    // Regex patterns to identify key information segments
    const yearMatch = cleaned.match(/\b(19\d{2}|20\d{2})\b/); // Matches 4-digit years
    const engineMatch = cleaned.match(/\b(\d\.\d[L|l]|\d{3}[c|c_i_d])\b/i); // Matches "1.8L", "351c", etc.
    
    const year = yearMatch ? yearMatch[0] : null;
    const engine = engineMatch ? engineMatch[0] : null;
    
    // Everything else becomes tags or the primary display nickname
    return {
        nickname: cleaned, // Retains the exact friendly name the user wants
        smart_search_string: cleaned.toLowerCase(),
        custom_spec_fields: {
            detected_year: year,
            detected_engine: engine,
            status: "Active Tracking",
            last_updated: new Date().toISOString()
        }
    };
}

/**
 * Core Function: Process text and save straight to PostgreSQL
 */
async function handleSmartVehicleSubmit(householdId, userString) {
    console.log(`Parsing input: "${userString}"...`);
    
    // Parse the unstructured text into clean objects
    const vehiclePayload = parseSmartVehicleInput(userString);
    
    // Inject the necessary household routing ID
    const extendedPayload = {
        household_id: householdId,
        ...vehiclePayload
    };

    // Fire data straight into your Supabase project
    const { data, error } = await supabase
        .from('vehicles')
        .insert([extendedPayload])
        .select();

    if (error) {
        console.error("❌ Database insertion failed:", error.message);
        return null;
    }
    
    console.log("✅ Success! Vehicle saved via smart input string.");
    return data[0];
}

async function runSystemFunctionCheck() {
    console.log("🚀 Starting System Verification Loop...");

    // 1. Simulate creating a shared household asset container
    const { data: household, error: hError } = await supabase
        .from('households')
        .insert([{ name: "Main Project Garage" }])
        .select()
        .single();

    if (hError) return console.error("Household creation failed:", hError);
    console.log(`Step 1 OK: Household generated with ID [${household.id}]`);

    // 2. Simulate saving a vehicle using the zero-dropdown text parser
    // Test Input mimics a typical project car entry string
    const testInputString = "1969 Cougar 351c Restoration"; 
    const newVehicle = await handleSmartVehicleSubmit(household.id, testInputString);
    
    if (!newVehicle) return console.error("❌ Function check halted at vehicle creation.");
    console.log("Step 2 OK: Parsed Custom JSON Data:", JSON.stringify(newVehicle.custom_spec_fields));

    // 3. Simulate reading the asset database table back out to verify storage
    const { data: fetchVerification, error: fError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('household_id', household.id);

    if (fError || fetchVerification.length === 0) {
        return console.error("❌ Data retrieval consistency check failed:", fError);
    }
    
    console.log(`🎉 Success! Data accurately synced. Retained asset: "${fetchVerification[0].nickname}"`);
    console.log("👉 System is functional. Ready for Camera OCR pipeline configuration.");
}

// Execute the test script
runSystemFunctionCheck();
