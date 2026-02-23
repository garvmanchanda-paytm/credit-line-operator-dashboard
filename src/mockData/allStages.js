export const allStages = [
  // BASIC DETAILS
  { subStage: 'PAN_PREFILL', displayLabel: 'PAN Pre-fill', category: 'BASIC DETAILS', parentStage: 'BASIC_DETAILS_CAPTURED', mtdCount: 1985426, convRate: 87.4, lmtdDelta: 0.3, historicalAvg: 87.1 },
  { subStage: 'EMAIL_PREFILL', displayLabel: 'Email Pre-fill', category: 'BASIC DETAILS', parentStage: 'BASIC_DETAILS_CAPTURED', mtdCount: 1812481, convRate: 79.8, lmtdDelta: -0.5, historicalAvg: 80.3 },
  { subStage: 'BUREAU_SKIPPED_CIR_OFFER', displayLabel: 'Bureau Skipped as CIR Offer Available', category: 'BASIC DETAILS', parentStage: 'BASIC_DETAILS_CAPTURED', mtdCount: 250273, convRate: 11.0, lmtdDelta: 1.2, historicalAvg: 9.8 },

  // BUREAU
  { subStage: 'BUREAU_SUCCESS', displayLabel: 'Bureau Success', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 2015752, convRate: 99.8, lmtdDelta: 0.1, historicalAvg: 99.7 },
  { subStage: 'BUREAU_FAILED', displayLabel: 'Bureau Failed', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 3474, convRate: 0.17, lmtdDelta: 0.02, historicalAvg: 0.15 },
  { subStage: 'BUREAU_ALTERNATE_MOBILE_NUMBER_REQUIRED', displayLabel: 'Alt Mobile Number Required', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 2399, convRate: 0.12, lmtdDelta: -0.05, historicalAvg: 0.17 },
  { subStage: 'BUREAU_ADDITIONAL_DATA_REQUIRED', displayLabel: 'Additional Data Required', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 1105, convRate: 0.05, lmtdDelta: 0.01, historicalAvg: 0.04 },
  { subStage: 'BUREAU_OTP_REQUIRED', displayLabel: 'Bureau OTP Required', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 799, convRate: 0.04, lmtdDelta: -0.01, historicalAvg: 0.05 },
  { subStage: 'BUREAU_REQUEST_FAILED', displayLabel: 'Bureau Request Failed', category: 'BUREAU', parentStage: 'BUREAU_IN_PROGRESS', mtdCount: 31, convRate: 0.002, lmtdDelta: 0.001, historicalAvg: 0.001 },

  // BRE
  { subStage: 'BRE_REQUESTED', displayLabel: 'BRE Requested', category: 'BRE', parentStage: 'BRE_COMPLETED', mtdCount: 692000, convRate: 99.9, lmtdDelta: 0.0, historicalAvg: 99.9 },
  { subStage: 'BRE_COMPLETED', displayLabel: 'BRE Completed', category: 'BRE', parentStage: 'BRE_COMPLETED', mtdCount: 680150, convRate: 98.2, lmtdDelta: -0.3, historicalAvg: 98.5 },
  { subStage: 'BRE_REQUEST_FAILED', displayLabel: 'BRE Request Failed', category: 'BRE', parentStage: 'BRE_COMPLETED', mtdCount: 3532, convRate: 0.51, lmtdDelta: 0.12, historicalAvg: 0.39 },
  { subStage: 'BRE_COMPLETED_ALREADY_OFFER_EXIST', displayLabel: 'BRE Completed (Offer Already Exists)', category: 'BRE', parentStage: 'BRE_COMPLETED', mtdCount: 2100, convRate: 0.30, lmtdDelta: 0.05, historicalAvg: 0.25 },
  { subStage: 'LENDER_PAN_VALIDATION_FAILED', displayLabel: 'Lender PAN Validation Failed', category: 'BRE', parentStage: 'BRE_COMPLETED', mtdCount: 8742, convRate: 1.26, lmtdDelta: 0.18, historicalAvg: 1.08 },

  // SELFIE
  { subStage: 'SELFIE_REQUIRED', displayLabel: 'Selfie Required', category: 'SELFIE', parentStage: 'SELFIE_CAPTURED', mtdCount: 496238, convRate: 100.0, lmtdDelta: 0.0, historicalAvg: 100.0 },
  { subStage: 'SELFIE_CAPTURED', displayLabel: 'Selfie Captured', category: 'SELFIE', parentStage: 'SELFIE_CAPTURED', mtdCount: 455398, convRate: 91.8, lmtdDelta: -0.4, historicalAvg: 92.2 },
  { subStage: 'RE_UPLOAD_SELFIE', displayLabel: 'Re-Upload Selfie', category: 'SELFIE', parentStage: 'SELFIE_CAPTURED', mtdCount: 40840, convRate: 8.2, lmtdDelta: 0.4, historicalAvg: 7.8 },
  { subStage: 'SELFIE_UPLOAD_SUCCESS', displayLabel: 'Selfie Upload Success', category: 'SELFIE', parentStage: 'SELFIE_CAPTURED', mtdCount: 448920, convRate: 90.5, lmtdDelta: -0.5, historicalAvg: 91.0 },
  { subStage: 'LIVELINESS_FAILURE', displayLabel: 'Liveliness Failure', category: 'SELFIE', parentStage: 'SELFIE_CAPTURED', mtdCount: 44826, convRate: 9.0, lmtdDelta: 1.5, historicalAvg: 7.5 },

  // DEDUPE & KYC (Sequential or parallel)
  { subStage: 'LENDER_RETAIL_DEDUPE_SUCCESS', displayLabel: 'Retail Dedupe Success', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 330107, convRate: 97.7, lmtdDelta: 0.1, historicalAvg: 97.6 },
  { subStage: 'LENDER_RETAIL_DEDUPE_FAILED', displayLabel: 'Retail Dedupe Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 7757, convRate: 2.3, lmtdDelta: -0.1, historicalAvg: 2.4 },
  { subStage: 'INITIATE_KYC_VALIDATION_FAILED', displayLabel: 'KYC Validation Init Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 4120, convRate: 1.2, lmtdDelta: 0.3, historicalAvg: 0.9 },
  { subStage: 'KYC_VALIDATION_SUCCESS', displayLabel: 'KYC Validation Success', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 325550, convRate: 96.4, lmtdDelta: -0.2, historicalAvg: 96.6 },
  { subStage: 'POST_KYC_ACTION_INITIATED', displayLabel: 'Post KYC Action Initiated', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 322800, convRate: 95.5, lmtdDelta: -0.1, historicalAvg: 95.6 },
  { subStage: 'POST_KYC_ACTION_FAILED', displayLabel: 'Post KYC Action Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 2750, convRate: 0.8, lmtdDelta: 0.1, historicalAvg: 0.7 },
  { subStage: 'LENDER_AADHAAR_PAN_LINK_FAILED', displayLabel: 'Aadhaar-PAN Link Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 5600, convRate: 1.7, lmtdDelta: 0.2, historicalAvg: 1.5 },
  { subStage: 'LENDER_NAME_SIMILARITY_CHECK_SUCCESS', displayLabel: 'Name Similarity Check OK', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 318039, convRate: 94.1, lmtdDelta: 0.0, historicalAvg: 94.1 },
  { subStage: 'LENDER_NAME_SIMILARITY_CHECK_FAILED', displayLabel: 'Name Similarity Check Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 6890, convRate: 2.0, lmtdDelta: -0.1, historicalAvg: 2.1 },
  { subStage: 'LENDER_FACE_SIMILARITY_CHECK_SUCCESS', displayLabel: 'Face Similarity Check OK', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 312983, convRate: 92.6, lmtdDelta: -0.3, historicalAvg: 92.9 },
  { subStage: 'LENDER_FACE_SIMILARITY_CHECK_FAILED', displayLabel: 'Face Similarity Check Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_VALIDATION_SUCCESS', mtdCount: 5080, convRate: 1.5, lmtdDelta: 0.2, historicalAvg: 1.3 },
  { subStage: 'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', displayLabel: 'Pincode Serviceability OK', category: 'DEDUPE & KYC', parentStage: 'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', mtdCount: 167985, convRate: 49.7, lmtdDelta: -2.7, historicalAvg: 52.4 },
  { subStage: 'KYC_PINCODE_SERVICEABILITY_CHECK_FAILED', displayLabel: 'Pincode Serviceability Failed', category: 'DEDUPE & KYC', parentStage: 'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', mtdCount: 84600, convRate: 25.0, lmtdDelta: 1.5, historicalAvg: 23.5 },

  // LENDER BRE
  { subStage: 'LENDER_BRE_INITIATED', displayLabel: 'Lender BRE Initiated', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 167985, convRate: 100.0, lmtdDelta: 0.0, historicalAvg: 100.0 },
  { subStage: 'LENDER_BRE_SUCCESS', displayLabel: 'Lender BRE Success', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 145200, convRate: 86.4, lmtdDelta: 1.2, historicalAvg: 85.2 },
  { subStage: 'LENDER_BRE_APPROVE_SUCCESS', displayLabel: 'Lender BRE Approve', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 123429, convRate: 73.5, lmtdDelta: 12.8, historicalAvg: 60.7 },
  { subStage: 'LENDER_BRE_APPROVE_FAILED', displayLabel: 'Lender BRE Approve Failed', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 21771, convRate: 13.0, lmtdDelta: -1.2, historicalAvg: 14.2 },
  { subStage: 'LENDER_BRE_FAILURE', displayLabel: 'Lender BRE Failure', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 44556, convRate: 26.5, lmtdDelta: -12.8, historicalAvg: 39.3 },
  { subStage: 'CREDIT_LINE_OFFER_ACCEPTED', displayLabel: 'Credit Line Offer Accepted', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 119206, convRate: 96.6, lmtdDelta: 0.4, historicalAvg: 96.2 },
  { subStage: 'LENDER_BRE_LEAD_CREATION_POLLING_FAILURE', displayLabel: 'Lead Creation Polling Failure', category: 'LENDER BRE', parentStage: 'LENDER_BRE_APPROVE_SUCCESS', mtdCount: 1890, convRate: 1.1, lmtdDelta: 0.3, historicalAvg: 0.8 },

  // PENNY DROP (bank account > Lender API)
  { subStage: 'LENDER_PENNY_DROP_SUCCESS', displayLabel: 'Penny Drop Success', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 48125, convRate: 64.1, lmtdDelta: -1.8, historicalAvg: 65.9 },
  { subStage: 'BANK_VERIFICATION_FAILED', displayLabel: 'Bank Verification Failed', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 5780, convRate: 7.7, lmtdDelta: 1.2, historicalAvg: 6.5 },
  { subStage: 'LENDER_KYC_NAME_MATCH_CHECK_FAILED', displayLabel: 'KYC Name Match Check Failed', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 2890, convRate: 3.8, lmtdDelta: -0.2, historicalAvg: 4.0 },
  { subStage: 'EMANDATE_REQUIRED', displayLabel: 'eMandate Required', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 95612, convRate: 100.0, lmtdDelta: 0.0, historicalAvg: 100.0 },
  { subStage: 'LENDER_NSDL_NAME_MATCH_CHECK_FAILED', displayLabel: 'NSDL Name Match Failed', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 1450, convRate: 1.9, lmtdDelta: 0.4, historicalAvg: 1.5 },
  { subStage: 'MAQUETTE_FRAUD_CHECK_FAILED', displayLabel: 'Maquette Fraud Check Failed', category: 'PENNY DROP', parentStage: 'LENDER_PENNY_DROP_SUCCESS', mtdCount: 1124, convRate: 1.5, lmtdDelta: 0.3, historicalAvg: 1.2 },

  // MANDATE
  { subStage: 'MANDATE_SUCCESS', displayLabel: 'Mandate Success', category: 'MANDATE', parentStage: 'MANDATE_SUCCESS', mtdCount: 84445, convRate: 88.3, lmtdDelta: 1.2, historicalAvg: 87.1 },
  { subStage: 'KFS_VIEWED', displayLabel: 'KFS Viewed', category: 'MANDATE', parentStage: 'MANDATE_SUCCESS', mtdCount: 91200, convRate: 95.4, lmtdDelta: 0.2, historicalAvg: 95.2 },
  { subStage: 'DEVICE_BINDING_CHECK_PASSED', displayLabel: 'Device Binding Check Passed', category: 'MANDATE', parentStage: 'MANDATE_SUCCESS', mtdCount: 89500, convRate: 93.6, lmtdDelta: -0.3, historicalAvg: 93.9 },
  { subStage: 'DEVICE_BINDING_FAILED', displayLabel: 'Device Binding Failed', category: 'MANDATE', parentStage: 'MANDATE_SUCCESS', mtdCount: 1700, convRate: 1.8, lmtdDelta: 0.3, historicalAvg: 1.5 },

  // ESIGN
  { subStage: 'ESIGN_REQUIRED', displayLabel: 'eSign Required', category: 'ESIGN', parentStage: 'ESIGN_SUCCESS', mtdCount: 72918, convRate: 100.0, lmtdDelta: 0.0, historicalAvg: 100.0 },
  { subStage: 'ESIGN_SUCCESS', displayLabel: 'eSign Success', category: 'ESIGN', parentStage: 'ESIGN_SUCCESS', mtdCount: 61254, convRate: 84.0, lmtdDelta: 0.5, historicalAvg: 83.5 },
  { subStage: 'ESIGN_FAILED', displayLabel: 'eSign Failed', category: 'ESIGN', parentStage: 'ESIGN_SUCCESS', mtdCount: 11664, convRate: 16.0, lmtdDelta: -0.5, historicalAvg: 16.5 },
  { subStage: 'POST_ESIGN_ACTION_IN_PROGRESS', displayLabel: 'Post-eSign Action In Progress', category: 'ESIGN', parentStage: 'ESIGN_SUCCESS', mtdCount: 60800, convRate: 83.4, lmtdDelta: 0.1, historicalAvg: 83.3 },
  { subStage: 'POST_ESIGN_ACTION_FAILED', displayLabel: 'Post-eSign Action Failed', category: 'ESIGN', parentStage: 'ESIGN_SUCCESS', mtdCount: 454, convRate: 0.6, lmtdDelta: 0.1, historicalAvg: 0.5 },

  // LENDER LAN CREATION
  { subStage: 'LENDER_CUSTOMER_CREATION_FAILED', displayLabel: 'Customer Creation Failed', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 312, convRate: 0.5, lmtdDelta: 0.1, historicalAvg: 0.4 },
  { subStage: 'LENDER_CUSTOMER_CREATION_SUCCESS', displayLabel: 'Customer Creation Success', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 60717, convRate: 99.5, lmtdDelta: -0.1, historicalAvg: 99.6 },
  { subStage: 'LENDER_CUSTOMER_MODIFICATION_FAILED', displayLabel: 'Customer Modification Failed', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 89, convRate: 0.1, lmtdDelta: 0.0, historicalAvg: 0.1 },
  { subStage: 'LENDER_CUSTOMER_MODIFICATION_SUCCESS', displayLabel: 'Customer Modification Success', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 2450, convRate: 4.0, lmtdDelta: 0.2, historicalAvg: 3.8 },
  { subStage: 'LENDER_LAN_CREATION_SUCCESS', displayLabel: 'LAN Creation Success', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 60650, convRate: 99.4, lmtdDelta: -0.1, historicalAvg: 99.5 },
  { subStage: 'LENDER_LAN_CREATION_FAILED', displayLabel: 'LAN Creation Failed', category: 'LENDER LAN CREATION', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 379, convRate: 0.6, lmtdDelta: 0.1, historicalAvg: 0.5 },

  // LMS
  { subStage: 'LMS_LAM_ACCOUNT_CREATION_SUCCESS', displayLabel: 'LAM Account Created', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 60500, convRate: 99.1, lmtdDelta: 0.0, historicalAvg: 99.1 },
  { subStage: 'LMS_LAM_ACCOUNT_CREATION_FAILED', displayLabel: 'LAM Account Creation Failed', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 529, convRate: 0.9, lmtdDelta: 0.0, historicalAvg: 0.9 },
  { subStage: 'LMS_ONBOARDING_COMPLETED', displayLabel: 'LMS Onboarding Completed', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 61029, convRate: 99.6, lmtdDelta: 0.1, historicalAvg: 99.5 },
  { subStage: 'CREDIT_LINE_LINKED', displayLabel: 'Credit Line Linked', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 58975, convRate: 96.6, lmtdDelta: -0.2, historicalAvg: 96.8 },
  { subStage: 'MPIN_SET', displayLabel: 'MPIN Set', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 45792, convRate: 75.0, lmtdDelta: -1.0, historicalAvg: 76.0 },
  { subStage: 'LINK_FAILURE', displayLabel: 'Link Failure', category: 'LMS', parentStage: 'LEAD_SUCCESSFULLY_CLOSED', mtdCount: 3054, convRate: 5.0, lmtdDelta: 0.8, historicalAvg: 4.2 },
];
