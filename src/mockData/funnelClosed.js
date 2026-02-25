const allLenderData = [
  { stage: 'BASIC_DETAILS_CAPTURED', displayLabel: 'Started', count: 884533, conversionRate: null, lmtdCount: 1021000, lmtdConvRate: null },
  { stage: 'BRE_REQUESTED', displayLabel: 'Bureau Pass', count: 787324, conversionRate: 89.0, lmtdCount: 875800, lmtdConvRate: 85.8 },
  { stage: 'BRE_COMPLETED', displayLabel: 'BRE Done', count: 268654, conversionRate: 34.1, lmtdCount: 464800, lmtdConvRate: 53.1 },
  { stage: 'SELFIE_REQUIRED', displayLabel: 'Selfie Step', count: 268622, conversionRate: 100.0, lmtdCount: 268600, lmtdConvRate: 57.8 },
  { stage: 'SELFIE_CAPTURED', displayLabel: 'Selfie Done', count: 181815, conversionRate: 67.7, lmtdCount: 203300, lmtdConvRate: 75.7 },
  { stage: 'KYC_VALIDATION_SUCCESS', displayLabel: 'KYC Pass', count: 120635, conversionRate: 66.4, lmtdCount: 132600, lmtdConvRate: 65.2 },
  { stage: 'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', displayLabel: 'Pincode OK', count: 59437, conversionRate: 49.3, lmtdCount: 47000, lmtdConvRate: 35.4 },
  { stage: 'LENDER_BRE_APPROVE_SUCCESS', displayLabel: 'Lender BRE OK', count: 43671, conversionRate: 73.5, lmtdCount: 46300, lmtdConvRate: 98.5 },
  { stage: 'LENDER_PENNY_DROP_SUCCESS', displayLabel: 'Penny Drop OK', count: 32369, conversionRate: 74.1, lmtdCount: 35400, lmtdConvRate: 76.5 },
  { stage: 'MANDATE_SUCCESS', displayLabel: 'Mandate Done', count: 24555, conversionRate: 75.9, lmtdCount: 23900, lmtdConvRate: 67.5 },
  { stage: 'REVIEW_OFFER_ACCEPTED', displayLabel: 'Offer Accepted', count: 22052, conversionRate: 89.8, lmtdCount: 22300, lmtdConvRate: 93.3 },
  { stage: 'ESIGN_SUCCESS', displayLabel: 'eSign Done', count: 18635, conversionRate: 84.5, lmtdCount: 19200, lmtdConvRate: 86.1 },
  { stage: 'LEAD_SUCCESSFULLY_CLOSED', displayLabel: 'Onboarding Complete', count: 18485, conversionRate: 99.2, lmtdCount: 18400, lmtdConvRate: 95.8 },
  { stage: 'CREDIT_LINE_LINKED', displayLabel: 'Limit Activated', count: 8501, conversionRate: 46.0, lmtdCount: 22900, lmtdConvRate: 124.5 },
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

export const closedByLender = {
  ALL: allLenderData,
  SSFB: scaleLender(allLenderData, 0.62, -0.8),
  JANA: scaleLender(allLenderData, 0.38, 1.1),
};

// Default export for backward compatibility
export const funnelClosed = allLenderData;
