/**
 * Blood Type Compatibility Utility
 * Menentukan kompatibilitas golongan darah donor dengan pasien
 * Berdasarkan standar medis internasional
 */

/**
 * Compatibility matrix: Donor blood type -> Array of compatible recipient blood types
 */
const COMPATIBILITY_MATRIX = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"], // Universal recipient (tapi hanya bisa terima dari AB+)
};

/**
 * Mengecek apakah donor blood type kompatibel dengan patient blood type
 * @param {string} donorBlood - Golongan darah donor (contoh: "O+", "A-", "AB+")
 * @param {string} patientBlood - Golongan darah pasien (contoh: "A+")
 * @returns {object} { isCompatible: boolean, needsConfirmation: boolean, reason: string }
 */
export function isCompatible(donorBlood, patientBlood) {
  // Validasi input
  if (!donorBlood || !patientBlood) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: "Data golongan darah tidak lengkap",
    };
  }

  // Normalisasi input (hapus spasi, uppercase)
  const normalizedDonor = donorBlood.trim().toUpperCase();
  const normalizedPatient = patientBlood.trim().toUpperCase();

  // Check apakah golongan darah valid
  if (!COMPATIBILITY_MATRIX[normalizedDonor]) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: `Golongan darah donor '${donorBlood}' tidak valid`,
    };
  }

  if (!COMPATIBILITY_MATRIX[normalizedPatient]) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: `Golongan darah pasien '${patientBlood}' tidak valid`,
    };
  }

  // Check kompatibilitas dari matrix
  const compatibleRecipients = COMPATIBILITY_MATRIX[normalizedDonor];
  const isCompatible = compatibleRecipients.includes(normalizedPatient);

  if (!isCompatible) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: `${normalizedDonor} tidak dapat diberikan kepada ${normalizedPatient}`,
    };
  }

  // Check apakah ada perbedaan Rhesus (+ vs -)
  const donorRhesus = normalizedDonor.slice(-1); // Ambil karakter terakhir (+/-)
  const patientRhesus = normalizedPatient.slice(-1);
  const needsConfirmation = donorRhesus !== patientRhesus;

  return {
    isCompatible: true,
    needsConfirmation,
    reason: needsConfirmation
      ? `Golongan darah cocok, tapi perlu konfirmasi karena Rhesus berbeda (${normalizedDonor} → ${normalizedPatient})`
      : `${normalizedDonor} sesuai dengan ${normalizedPatient}`,
  };
}

/**
 * Helper function: Dapatkan recipient blood types yang kompatibel untuk donor tertentu
 * @param {string} donorBlood - Golongan darah donor
 * @returns {array} Array dari golongan darah pasien yang kompatibel
 */
export function getCompatibleRecipients(donorBlood) {
  const normalized = donorBlood?.trim().toUpperCase();
  return COMPATIBILITY_MATRIX[normalized] || [];
}

/**
 * Helper function: Check apakah blood type adalah universal donor (O-)
 * @param {string} bloodType - Golongan darah
 * @returns {boolean}
 */
export function isUniversalDonor(bloodType) {
  return bloodType?.trim().toUpperCase() === "O-";
}

/**
 * Helper function: Check apakah blood type adalah universal recipient (AB+)
 * @param {string} bloodType - Golongan darah
 * @returns {boolean}
 */
export function isUniversalRecipient(bloodType) {
  return bloodType?.trim().toUpperCase() === "AB+";
}
