const allLenderData = [
  { stage: 'APPLICATION_LOADED', displayLabel: 'Landing Page View', count: 5871842, conversionRate: null, lmtdCount: 7630557, lmtdConvRate: null },
  { stage: 'BASIC_DETAILS_CAPTURED', displayLabel: 'Basic Details', count: 2270601, conversionRate: 38.7, lmtdCount: 3151670, lmtdConvRate: 41.3 },
  { stage: 'BUREAU_IN_PROGRESS', displayLabel: 'Bureau Check', count: 2020328, conversionRate: 88.9, lmtdCount: 2801195, lmtdConvRate: 88.8 },
  { stage: 'BRE_COMPLETED', displayLabel: 'BRE Complete', count: 692424, conversionRate: 34.3, lmtdCount: 977169, lmtdConvRate: 34.9 },
  { stage: 'LENDER_PAN_VALIDATION', displayLabel: 'PAN Validation', count: 685200, conversionRate: 98.9, lmtdCount: 968100, lmtdConvRate: 99.1 },
  { stage: 'SELFIE_CAPTURED', displayLabel: 'Selfie Done', count: 496238, conversionRate: 72.4, lmtdCount: 692489, lmtdConvRate: 71.5 },
  { stage: 'KYC_VALIDATION_SUCCESS', displayLabel: 'KYC Pass', count: 337864, conversionRate: 68.1, lmtdCount: 471891, lmtdConvRate: 68.1 },
  { stage: 'LENDER_RETAIL_DEDUPE', displayLabel: 'Retail Dedupe', count: 330107, conversionRate: 97.7, lmtdCount: 462180, lmtdConvRate: 97.9 },
  { stage: 'LENDER_AADHAAR_PAN_LINK', displayLabel: 'Aadhaar-PAN Link', count: 324500, conversionRate: 98.3, lmtdCount: 454200, lmtdConvRate: 98.5 },
  { stage: 'LENDER_NAME_SIMILARITY_CHECK', displayLabel: 'Name Similarity', count: 318039, conversionRate: 98.0, lmtdCount: 445500, lmtdConvRate: 98.1 },
  { stage: 'LENDER_FACE_SIMILARITY_CHECK', displayLabel: 'Face Similarity', count: 312983, conversionRate: 98.4, lmtdCount: 438200, lmtdConvRate: 98.4 },
  { stage: 'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', displayLabel: 'Pincode OK', count: 167985, conversionRate: 53.7, lmtdCount: 247399, lmtdConvRate: 56.5 },
  { stage: 'LENDER_BRE_INITIATED', displayLabel: 'Lender BRE Started', count: 167985, conversionRate: 100.0, lmtdCount: 247399, lmtdConvRate: 100.0 },
  { stage: 'LENDER_BRE_APPROVE_SUCCESS', displayLabel: 'Lender BRE OK', count: 123429, conversionRate: 73.5, lmtdCount: 150069, lmtdConvRate: 60.7 },
  { stage: 'CREDIT_LINE_OFFER_ACCEPTED', displayLabel: 'Offer Accepted (CL)', count: 119206, conversionRate: 96.6, lmtdCount: 145100, lmtdConvRate: 96.7 },
  { stage: 'LENDER_PENNY_DROP_SUCCESS', displayLabel: 'Penny Drop OK', count: 48125, conversionRate: 40.4, lmtdCount: 62700, lmtdConvRate: 43.2 },
  { stage: 'MAQUETTE_FRAUD_CHECK', displayLabel: 'Fraud Check', count: 47001, conversionRate: 97.7, lmtdCount: 61500, lmtdConvRate: 98.1 },
  { stage: 'MANDATE_SUCCESS', displayLabel: 'Mandate Done', count: 84445, conversionRate: 179.7, lmtdCount: 101457, lmtdConvRate: 165.0 },
  { stage: 'REVIEW_OFFER_ACCEPTED', displayLabel: 'Offer Accepted', count: 72918, conversionRate: 86.3, lmtdCount: 87073, lmtdConvRate: 85.8 },
  { stage: 'ESIGN_SUCCESS', displayLabel: 'eSign Done', count: 61254, conversionRate: 84.0, lmtdCount: 72713, lmtdConvRate: 83.5 },
  { stage: 'DEVICE_BINDING_CHECK', displayLabel: 'Device Binding', count: 60800, conversionRate: 99.3, lmtdCount: 72100, lmtdConvRate: 99.2 },
  { stage: 'LEAD_SUCCESSFULLY_CLOSED', displayLabel: 'Onboarding Complete', count: 61029, conversionRate: 100.4, lmtdCount: 72162, lmtdConvRate: 100.1 },
];

function scaleLender(data, factor, convNoise) {
  return data.map((row) => ({
    ...row,
    count: Math.round(row.count * factor),
    lmtdCount: Math.round(row.lmtdCount * factor),
    conversionRate: row.conversionRate != null ? parseFloat((row.conversionRate + convNoise).toFixed(1)) : null,
    lmtdConvRate: row.lmtdConvRate != null ? parseFloat((row.lmtdConvRate + convNoise * 0.5).toFixed(1)) : null,
  }));
}

export const funnelByLender = {
  ALL: allLenderData,
  SSFB: scaleLender(allLenderData, 0.65, -1.2),
  JANA: scaleLender(allLenderData, 0.35, 0.8),
};

export const LENDER_OPTIONS = ['ALL', 'SSFB', 'JANA'];

// Default export for backward compatibility
export const funnelMTD = allLenderData;
