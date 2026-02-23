function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateTrend(baseConv, seed) {
  const days = [];
  for (let d = 14; d <= 20; d++) {
    const variance = (seededRandom(seed + d * 7) - 0.5) * 4;
    days.push({
      date: `Feb ${d}`,
      value: parseFloat((baseConv + variance).toFixed(1)),
    });
  }
  return days;
}

function genApiRows(apiDefs, seed) {
  return apiDefs.map((api, i) => {
    const s = seed + i * 31;
    const base5xx = 0.01 + seededRandom(s) * 0.5;
    const baseLatency = 100 + Math.round(seededRandom(s + 1) * 4000);
    const baseSuccess = parseFloat((100 - base5xx - seededRandom(s + 2) * 0.4).toFixed(1));

    return {
      apiName: api.name,
      sequence: api.seq,
      't-1': {
        successRate: parseFloat((baseSuccess + (seededRandom(s + 10) - 0.5) * 0.6).toFixed(1)),
        latency: Math.round(baseLatency * (0.9 + seededRandom(s + 11) * 0.2)),
        errorRate: parseFloat((base5xx + (seededRandom(s + 12) - 0.5) * 0.1).toFixed(2)),
      },
      '7d': {
        successRate: baseSuccess,
        latency: baseLatency,
        errorRate: parseFloat(base5xx.toFixed(2)),
      },
      '15d': {
        successRate: parseFloat((baseSuccess - (seededRandom(s + 20) - 0.5) * 0.3).toFixed(1)),
        latency: Math.round(baseLatency * (0.95 + seededRandom(s + 21) * 0.1)),
        errorRate: parseFloat((base5xx + (seededRandom(s + 22) - 0.5) * 0.08).toFixed(2)),
      },
    };
  });
}

const API_DEFS = {
  BUREAU_SUCCESS:               [{ name: 'CIBIL Bureau Pull', seq: 1 }, { name: 'Bureau Score Parse', seq: 2 }],
  BUREAU_FAILED:                [{ name: 'CIBIL Bureau Pull', seq: 1 }],
  BUREAU_ALTERNATE_MOBILE_NUMBER_REQUIRED: [{ name: 'Bureau Alt Mobile API', seq: 1 }],
  BUREAU_ADDITIONAL_DATA_REQUIRED: [{ name: 'Bureau Supplementary API', seq: 1 }],
  BUREAU_OTP_REQUIRED:          [{ name: 'Bureau OTP Send', seq: 1 }, { name: 'Bureau OTP Verify', seq: 2 }],
  BUREAU_REQUEST_FAILED:        [{ name: 'CIBIL Bureau Pull', seq: 1 }],
  BRE_REQUESTED:                [{ name: 'BRE Engine Submit', seq: 1 }],
  BRE_COMPLETED:                [{ name: 'BRE Engine Submit', seq: 1 }, { name: 'BRE Score Evaluate', seq: 2 }],
  BRE_REQUEST_FAILED:           [{ name: 'BRE Engine Submit', seq: 1 }],
  BRE_COMPLETED_ALREADY_OFFER_EXIST: [{ name: 'BRE Engine Submit', seq: 1 }, { name: 'Offer Lookup', seq: 2 }],
  LENDER_PAN_VALIDATION_FAILED: [{ name: 'PAN Validation API', seq: 1 }],
  SELFIE_REQUIRED:              [{ name: 'Selfie Init API', seq: 1 }],
  SELFIE_CAPTURED:              [{ name: 'Selfie Capture API', seq: 1 }, { name: 'Liveliness Check', seq: 2 }],
  RE_UPLOAD_SELFIE:             [{ name: 'Selfie Capture API', seq: 1 }, { name: 'Liveliness Check', seq: 2 }],
  SELFIE_UPLOAD_SUCCESS:        [{ name: 'Selfie Upload S3', seq: 1 }, { name: 'Selfie Quality Check', seq: 2 }],
  LIVELINESS_FAILURE:           [{ name: 'Liveliness Check', seq: 1 }],
  LENDER_RETAIL_DEDUPE_SUCCESS: [{ name: 'Retail Dedupe API', seq: 1 }],
  LENDER_RETAIL_DEDUPE_FAILED:  [{ name: 'Retail Dedupe API', seq: 1 }],
  INITIATE_KYC_VALIDATION_FAILED: [{ name: 'KYC Init API', seq: 1 }],
  KYC_VALIDATION_SUCCESS:       [{ name: 'KYC Aadhaar Verify', seq: 1 }, { name: 'KYC NSDL Verify', seq: 2 }],
  POST_KYC_ACTION_INITIATED:    [{ name: 'Post-KYC Action API', seq: 1 }],
  POST_KYC_ACTION_FAILED:       [{ name: 'Post-KYC Action API', seq: 1 }],
  LENDER_AADHAAR_PAN_LINK_FAILED: [{ name: 'Aadhaar-PAN Link API', seq: 1 }],
  LENDER_NAME_SIMILARITY_CHECK_SUCCESS: [{ name: 'Name Similarity API', seq: 1 }],
  LENDER_NAME_SIMILARITY_CHECK_FAILED: [{ name: 'Name Similarity API', seq: 1 }],
  LENDER_FACE_SIMILARITY_CHECK_SUCCESS: [{ name: 'Face Match API', seq: 1 }],
  LENDER_FACE_SIMILARITY_CHECK_FAILED: [{ name: 'Face Match API', seq: 1 }],
  KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: [{ name: 'Pincode Serviceability', seq: 1 }],
  KYC_PINCODE_SERVICEABILITY_CHECK_FAILED: [{ name: 'Pincode Serviceability', seq: 1 }],
  LENDER_BRE_INITIATED:         [{ name: 'Lender BRE Submit', seq: 1 }],
  LENDER_BRE_SUCCESS:           [{ name: 'Lender BRE Submit', seq: 1 }, { name: 'Lender BRE Evaluate', seq: 2 }],
  LENDER_BRE_APPROVE_SUCCESS:   [{ name: 'Lender BRE Submit', seq: 1 }, { name: 'Lender BRE Evaluate', seq: 2 }, { name: 'Approval Finalize', seq: 3 }],
  LENDER_BRE_APPROVE_FAILED:    [{ name: 'Lender BRE Submit', seq: 1 }, { name: 'Lender BRE Evaluate', seq: 2 }],
  LENDER_BRE_FAILURE:           [{ name: 'Lender BRE Submit', seq: 1 }],
  CREDIT_LINE_OFFER_ACCEPTED:   [{ name: 'Offer Accept API', seq: 1 }],
  LENDER_BRE_LEAD_CREATION_POLLING_FAILURE: [{ name: 'Lead Creation Poll', seq: 1 }],
  LENDER_PENNY_DROP_SUCCESS:    [{ name: 'Penny Drop Verify', seq: 1 }, { name: 'Bank Name Match', seq: 2 }],
  BANK_VERIFICATION_FAILED:     [{ name: 'Bank Account Verify', seq: 1 }],
  LENDER_KYC_NAME_MATCH_CHECK_FAILED: [{ name: 'KYC Name Match API', seq: 1 }],
  EMANDATE_REQUIRED:            [{ name: 'eMandate Init', seq: 1 }],
  LENDER_NSDL_NAME_MATCH_CHECK_FAILED: [{ name: 'NSDL Name Match', seq: 1 }],
  MAQUETTE_FRAUD_CHECK_FAILED:  [{ name: 'Maquette Fraud API', seq: 1 }],
  MANDATE_SUCCESS:              [{ name: 'Mandate Register', seq: 1 }, { name: 'Mandate Confirm', seq: 2 }],
  KFS_VIEWED:                   [{ name: 'KFS Render API', seq: 1 }],
  DEVICE_BINDING_CHECK_PASSED:  [{ name: 'Device Binding API', seq: 1 }],
  DEVICE_BINDING_FAILED:        [{ name: 'Device Binding API', seq: 1 }],
  ESIGN_REQUIRED:               [{ name: 'eSign Session Init', seq: 1 }],
  ESIGN_SUCCESS:                [{ name: 'eSign Session Init', seq: 1 }, { name: 'Aadhaar OTP Send', seq: 2 }, { name: 'eSign Finalize', seq: 3 }],
  ESIGN_FAILED:                 [{ name: 'eSign Session Init', seq: 1 }, { name: 'Aadhaar OTP Send', seq: 2 }],
  POST_ESIGN_ACTION_IN_PROGRESS: [{ name: 'Post-eSign Action', seq: 1 }],
  POST_ESIGN_ACTION_FAILED:     [{ name: 'Post-eSign Action', seq: 1 }],
  LENDER_CUSTOMER_CREATION_FAILED: [{ name: 'Customer Create API', seq: 1 }],
  LENDER_CUSTOMER_CREATION_SUCCESS: [{ name: 'Customer Create API', seq: 1 }],
  LENDER_CUSTOMER_MODIFICATION_FAILED: [{ name: 'Customer Modify API', seq: 1 }],
  LENDER_CUSTOMER_MODIFICATION_SUCCESS: [{ name: 'Customer Modify API', seq: 1 }],
  LENDER_LAN_CREATION_SUCCESS:  [{ name: 'LAN Create API', seq: 1 }, { name: 'LAN Activate', seq: 2 }],
  LENDER_LAN_CREATION_FAILED:   [{ name: 'LAN Create API', seq: 1 }],
  LMS_LAM_ACCOUNT_CREATION_SUCCESS: [{ name: 'LAM Account API', seq: 1 }],
  LMS_LAM_ACCOUNT_CREATION_FAILED: [{ name: 'LAM Account API', seq: 1 }],
  LMS_ONBOARDING_COMPLETED:     [{ name: 'LMS Onboard API', seq: 1 }, { name: 'LMS Sync', seq: 2 }],
  CREDIT_LINE_LINKED:           [{ name: 'Credit Line Link API', seq: 1 }],
  MPIN_SET:                     [{ name: 'MPIN Set API', seq: 1 }],
  LINK_FAILURE:                 [{ name: 'Credit Line Link API', seq: 1 }],
  PAN_PREFILL:                  [{ name: 'PAN Pre-fill API', seq: 1 }],
  EMAIL_PREFILL:                [{ name: 'Email Pre-fill API', seq: 1 }],
  BUREAU_SKIPPED_CIR_OFFER:    [{ name: 'CIR Offer Lookup', seq: 1 }],
};

export const subStageApiHealth = {};
Object.entries(API_DEFS).forEach(([subStage, apis], idx) => {
  subStageApiHealth[subStage] = genApiRows(apis, idx * 100 + 42);
});

export function getSubStageTrend(subStage, convRate) {
  const seed = subStage.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return generateTrend(convRate, seed);
}
