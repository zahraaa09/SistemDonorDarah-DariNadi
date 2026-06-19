// 🧪 QUICK TESTING REFERENCE - Blood Type Compatibility

// ====================================================================
// 1. HOW TO TEST IN BROWSER CONSOLE
// ====================================================================

// Set up localStorage data (required for testing)
localStorage.setItem("user_blood_type", "A+");
localStorage.setItem("user_id", "1");
localStorage.setItem("active_request_id", "1");

// Or test different blood types:
localStorage.setItem("user_blood_type", "O+");   // Universal donor
localStorage.setItem("user_blood_type", "AB+");  // Universal recipient
localStorage.setItem("user_blood_type", "B-");   // Negative Rhesus


// ====================================================================
// 2. TEST CASES TO VERIFY
// ====================================================================

/*
Test Case 1: Kompatibilitas Sempurna
├─ Pasien: A+, Donor: A+ 
├─ Expected: Button ENABLED, text "Minta Donor"
└─ Action: Tombol bisa diklik → lanjut ke confirm pengiriman

Test Case 2: Tidak Kompatibel
├─ Pasien: A+, Donor: B-
├─ Expected: Button DISABLED, text "Tidak Cocok", gray color
└─ Action: Tombol tidak bisa diklik → alert muncul jika force click

Test Case 3: Kompatibel tapi Rhesus Beda
├─ Pasien: A+, Donor: O-
├─ Expected: Button ENABLED, text "Minta Donor"
└─ Action: Klik → Confirm dialog "⚠️ Rhesus berbeda..."

Test Case 4: Universal Donor O-
├─ Pasien: AB+ (atau any), Donor: O-
├─ Expected: Button ENABLED
└─ Action: Dapat langsung mengirim permintaan

Test Case 5: Missing Blood Type
├─ localStorage tidak punya user_blood_type
├─ Expected: Alert "Data golongan darah Anda tidak ditemukan"
└─ Action: User disuruh update profil
*/


// ====================================================================
// 3. COMPATIBILITY TABLE QUICK REFERENCE
// ====================================================================

/*
UNIVERSAL DONORS (dapat diberikan ke siapa saja):
  O- → O-, O+, A-, A+, B-, B+, AB-, AB+

UNIVERSAL RECIPIENTS (dapat menerima dari siapa saja):
  AB+ → dari O-, O+, A-, A+, B-, B+, AB-, AB+

SAME TYPE (most compatible):
  A+ ↔ A+, A- ↔ A-, B+ ↔ B+, B- ↔ B-, AB+ ↔ AB+, AB- ↔ AB-

INCOMPATIBLE EXAMPLES:
  B- → A+ ❌ (different types)
  A+ → B+ ❌ (different types)
  O+ → A- ❌ (Rh+ cannot give to Rh-)
  AB- → O+ ❌ (different types AND rhesus)
*/


// ====================================================================
// 4. DIRECT FUNCTION TESTING (if needed)
// ====================================================================

// Jika ingin test fungsi utility langsung:
import { isCompatible, getCompatibleRecipients } from "@/utils/bloodTypeCompatibility";

// Test isCompatible function
console.log(isCompatible("O-", "AB+"));    // { isCompatible: true, needsConfirmation: false, reason: "O- sesuai dengan AB+" }
console.log(isCompatible("B-", "A+"));     // { isCompatible: false, needsConfirmation: false, reason: "B- tidak dapat diberikan kepada A+" }
console.log(isCompatible("O-", "A+"));     // { isCompatible: true, needsConfirmation: true, reason: "Golongan darah cocok, tapi perlu konfirmasi karena Rhesus berbeda..." }

// Test getCompatibleRecipients function
console.log(getCompatibleRecipients("O-")); 
// Output: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

console.log(getCompatibleRecipients("A+"));
// Output: ["A+", "AB+"]


// ====================================================================
// 5. INSPECT COMPONENT STATE (React DevTools)
// ====================================================================

/*
Steps:
1. Install React DevTools browser extension (if not already)
2. Open app and navigate to donors page
3. In DevTools:
   - Find <HomeDonors> component
   - Check props: { onNavigate, ... }
   - Check state: donors, bloodFilter, radiusFilter, requestingId, etc.
4. Inspect specific donor button:
   - Console: $r.state.donors[0] (lihat blood_type)
   - Manually change donor blood_type value
   - Check if button styling berubah

Expected behavior changes:
  - blood_type: "A+" → button red "Minta Donor"
  - blood_type: "B-" → button gray "Tidak Cocok"
*/


// ====================================================================
// 6. API INTEGRATION VERIFICATION
// ====================================================================

/*
When sending direct request, verify API receives:
- id_user: patient ID
- id_donor: donor ID  
- id_request: active request ID
- blood_type: donor's blood type

Expected success response:
  {
    "message": "Permintaan berhasil terkirim...",
    "status": 200
  }

Common errors to watch for:
- 400: Blood type compatibility not checked in backend
- 401: User not authenticated
- 404: Active request ID not found
- 409: Duplicate request already sent
*/


// ====================================================================
// 7. DEBUGGING TIPS
// ====================================================================

// If button not showing correct state:
console.log(localStorage.getItem("user_blood_type")); // Check if set
console.log(donor.blood_type);                        // Check donor data

// If confirmation dialog not showing:
// → Check if needsConfirmation is true in compatibility object
// → Verify rhesus differs (+ vs -)

// If button styling broken:
// → Check Tailwind CSS is properly configured
// → Verify className conditional logic
// → Check CSS conflicts in App.css

// If API call fails after compatibility check passes:
// → Verify active_request_id exists in localStorage
// → Check backend CORS settings
// → Verify API endpoint path matches


// ====================================================================
// 8. QUICK SCENARIO TESTING
// ====================================================================

// Scenario A: O+ Pendonor, Pasien A+
localStorage.setItem("user_blood_type", "A+");
// Klik tombol O+ donor → Should show "⚠️ Rhesus berbeda..." confirm

// Scenario B: B- Pendonor, Pasien O+
localStorage.setItem("user_blood_type", "O+");
// B- donor button should show "Tidak Cocok" (disabled, gray)

// Scenario C: AB- Pendonor, Pasien AB+
localStorage.setItem("user_blood_type", "AB+");
// AB- donor button should be enabled → click → normal flow

// Scenario D: O- Pendonor, Any Pasien
localStorage.setItem("user_blood_type", "AB+"); // atau apapun
// O- donor always enabled (universal donor)
