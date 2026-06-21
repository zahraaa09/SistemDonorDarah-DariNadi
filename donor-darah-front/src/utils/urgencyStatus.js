// Utility untuk standarisasi tampilan urgensi permintaan donor.
// Icon assets yang direkomendasikan untuk ditaruh di src/assets:
// - status-siaga.svg
// - status-darurat.svg
// - status-kritis.svg

export const URGENCY_DEFAULT = "Siaga";

export const urgencyLevels = {
  Siaga: {
    label: "Siaga",
    colorClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    assetName: "status-siaga.svg",
  },
  Darurat: {
    label: "Darurat",
    colorClass: "bg-amber-50 text-amber-700 border border-amber-100",
    assetName: "status-darurat.svg",
  },
  Kritis: {
    label: "Kritis",
    colorClass: "bg-red-50 text-red-600 border border-red-100",
    assetName: "status-kritis.svg",
  },
};

export const normalizeUrgency = (rawValue) => {
  if (!rawValue) return URGENCY_DEFAULT;
  const value = rawValue.toString().trim().toLowerCase();
  if (value === "darurat") return "Darurat";
  if (value === "kritis") return "Kritis";
  return URGENCY_DEFAULT;
};

export const getUrgencyStatus = (rawValue) => {
  const normalized = normalizeUrgency(rawValue);
  return urgencyLevels[normalized] || urgencyLevels[URGENCY_DEFAULT];
};
