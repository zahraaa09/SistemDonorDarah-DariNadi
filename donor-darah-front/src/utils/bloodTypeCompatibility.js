const COMPATIBILITY_MATRIX = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"], 
};

/**
 * Mengecek apakah donor blood type kompatibel dengan patient blood type
 * @param {string} donorBlood 
 * @param {string} patientBlood 
 * @returns {object} 
 */
export function isCompatible(donorBlood, patientBlood) {
  if (!donorBlood || !patientBlood) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: "Data golongan darah tidak lengkap",
    };
  }

  const normalizedDonor = donorBlood.trim().toUpperCase();
  const normalizedPatient = patientBlood.trim().toUpperCase();

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

  const compatibleRecipients = COMPATIBILITY_MATRIX[normalizedDonor];
  const isCompatible = compatibleRecipients.includes(normalizedPatient);

  if (!isCompatible) {
    return {
      isCompatible: false,
      needsConfirmation: false,
      reason: `${normalizedDonor} tidak dapat diberikan kepada ${normalizedPatient}`,
    };
  }

  const donorRhesus = normalizedDonor.slice(-1); 
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
 * @param {string} donorBlood 
 * @returns {array} 
 */
export function getCompatibleRecipients(donorBlood) {
  const normalized = donorBlood?.trim().toUpperCase();
  return COMPATIBILITY_MATRIX[normalized] || [];
}

/**
 * Helper function: Check apakah blood type adalah universal donor (O-)
 * @param {string} bloodType
 * @returns {boolean}
 */
export function isUniversalDonor(bloodType) {
  return bloodType?.trim().toUpperCase() === "O-";
}

/**
 * Helper function: Check apakah blood type adalah universal recipient (AB+)
 * @param {string} bloodType 
 * @returns {boolean}
 */
export function isUniversalRecipient(bloodType) {
  return bloodType?.trim().toUpperCase() === "AB+";
}
