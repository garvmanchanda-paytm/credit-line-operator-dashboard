export const subStageErrors = {
  // BUREAU sub-stages
  BUREAU_SUCCESS: [
    { errorCode: 'BUREAU_PARTIAL_DATA', description: 'Bureau returned partial credit data', count: 420, pctOfFailures: 55.0, trendVsYesterday: 'stable' },
    { errorCode: 'BUREAU_STALE_RECORD', description: 'Bureau record >6 months old', count: 210, pctOfFailures: 27.5, trendVsYesterday: 'down' },
    { errorCode: 'BUREAU_SCORE_MISSING', description: 'Score field empty in response', count: 134, pctOfFailures: 17.5, trendVsYesterday: 'stable' },
  ],
  BUREAU_FAILED: [
    { errorCode: 'BUREAU_NO_HIT', description: 'No bureau record found for PAN', count: 1850, pctOfFailures: 53.2, trendVsYesterday: 'stable' },
    { errorCode: 'BUREAU_THIN_FILE', description: 'Thin file — insufficient credit history', count: 980, pctOfFailures: 28.2, trendVsYesterday: 'up' },
    { errorCode: 'BUREAU_FRAUD_ALERT', description: 'Bureau fraud alert on PAN', count: 412, pctOfFailures: 11.9, trendVsYesterday: 'stable' },
    { errorCode: 'BUREAU_PAN_MISMATCH', description: 'PAN details mismatch with bureau', count: 232, pctOfFailures: 6.7, trendVsYesterday: 'down' },
  ],
  BUREAU_ALTERNATE_MOBILE_NUMBER_REQUIRED: [
    { errorCode: 'PRIMARY_MOBILE_INVALID', description: 'Primary mobile not registered with bureau', count: 1680, pctOfFailures: 70.0, trendVsYesterday: 'stable' },
    { errorCode: 'MOBILE_MISMATCH', description: 'Mobile number mismatch in records', count: 719, pctOfFailures: 30.0, trendVsYesterday: 'up' },
  ],
  BUREAU_ADDITIONAL_DATA_REQUIRED: [
    { errorCode: 'ADDRESS_INCOMPLETE', description: 'Address fields incomplete', count: 640, pctOfFailures: 57.9, trendVsYesterday: 'stable' },
    { errorCode: 'EMPLOYER_MISSING', description: 'Employer details not provided', count: 465, pctOfFailures: 42.1, trendVsYesterday: 'stable' },
  ],
  BUREAU_OTP_REQUIRED: [
    { errorCode: 'OTP_EXPIRED', description: 'Bureau OTP expired before submission', count: 445, pctOfFailures: 55.7, trendVsYesterday: 'stable' },
    { errorCode: 'OTP_DELIVERY_FAIL', description: 'OTP SMS delivery failed', count: 234, pctOfFailures: 29.3, trendVsYesterday: 'up' },
    { errorCode: 'OTP_WRONG', description: 'Incorrect OTP entered', count: 120, pctOfFailures: 15.0, trendVsYesterday: 'stable' },
  ],
  BUREAU_REQUEST_FAILED: [
    { errorCode: 'BUREAU_5XX', description: 'Bureau API 5xx error', count: 22, pctOfFailures: 71.0, trendVsYesterday: 'alert' },
    { errorCode: 'BUREAU_TIMEOUT', description: 'Bureau API timeout (>10s)', count: 9, pctOfFailures: 29.0, trendVsYesterday: 'up' },
  ],
  // BRE sub-stages
  BRE_REQUESTED: [],
  BRE_COMPLETED: [
    { errorCode: 'BRE_LOW_SCORE', description: 'BRE score below threshold (<650)', count: 142500, pctOfFailures: 50.2, trendVsYesterday: 'stable' },
    { errorCode: 'BRE_POLICY_REJECT', description: 'Policy rule rejection (age/income)', count: 85400, pctOfFailures: 30.1, trendVsYesterday: 'stable' },
    { errorCode: 'BRE_DPD_FLAG', description: 'DPD flag in last 12 months', count: 42300, pctOfFailures: 14.9, trendVsYesterday: 'up' },
  ],
  BRE_REQUEST_FAILED: [
    { errorCode: 'BRE_API_TIMEOUT', description: 'BRE engine timeout', count: 2100, pctOfFailures: 59.5, trendVsYesterday: 'up' },
    { errorCode: 'BRE_5XX', description: 'BRE API 5xx error', count: 1432, pctOfFailures: 40.5, trendVsYesterday: 'stable' },
  ],
  BRE_COMPLETED_ALREADY_OFFER_EXIST: [
    { errorCode: 'DUPLICATE_OFFER', description: 'Duplicate offer already exists for user', count: 1890, pctOfFailures: 90.0, trendVsYesterday: 'stable' },
    { errorCode: 'OFFER_EXPIRED_RERUN', description: 'Expired offer triggered re-evaluation', count: 210, pctOfFailures: 10.0, trendVsYesterday: 'down' },
  ],
  LENDER_PAN_VALIDATION_FAILED: [
    { errorCode: 'PAN_FORMAT_INVALID', description: 'PAN format does not match NSDL pattern', count: 4200, pctOfFailures: 48.0, trendVsYesterday: 'stable' },
    { errorCode: 'PAN_INACTIVE', description: 'PAN marked inactive/deactivated by NSDL', count: 2800, pctOfFailures: 32.0, trendVsYesterday: 'up' },
    { errorCode: 'PAN_NAME_MISMATCH', description: 'Name on PAN does not match input', count: 1742, pctOfFailures: 20.0, trendVsYesterday: 'stable' },
  ],
  // SELFIE sub-stages
  SELFIE_REQUIRED: [],
  SELFIE_CAPTURED: [],
  RE_UPLOAD_SELFIE: [
    { errorCode: 'SELFIE_BLUR', description: 'Selfie image too blurry', count: 22400, pctOfFailures: 54.9, trendVsYesterday: 'stable' },
    { errorCode: 'FACE_NOT_DETECTED', description: 'No face detected in frame', count: 12300, pctOfFailures: 30.1, trendVsYesterday: 'up' },
    { errorCode: 'LOW_LIGHT', description: 'Image captured in low-light conditions', count: 6140, pctOfFailures: 15.0, trendVsYesterday: 'stable' },
  ],
  SELFIE_UPLOAD_SUCCESS: [],
  LIVELINESS_FAILURE: [
    { errorCode: 'SELFIE_UNCLEAR', description: 'Your selfie is not clear.', count: 25484, pctOfFailures: 57.3, trendVsYesterday: 'stable' },
    { errorCode: 'EYES_CLOSED', description: 'Please keep your eyes open', count: 11873, pctOfFailures: 26.7, trendVsYesterday: 'up' },
    { errorCode: 'BACKGROUND_PERSON', description: 'Someone else in background', count: 2422, pctOfFailures: 5.4, trendVsYesterday: 'stable' },
    { errorCode: 'TOO_FAR', description: 'Please move closer to the camera', count: 821, pctOfFailures: 1.8, trendVsYesterday: 'down' },
    { errorCode: 'MASK_DETECTED', description: 'Please remove your mask', count: 218, pctOfFailures: 0.5, trendVsYesterday: 'stable' },
  ],
  // DEDUPE & KYC sub-stages
  LENDER_RETAIL_DEDUPE_SUCCESS: [],
  LENDER_RETAIL_DEDUPE_FAILED: [
    { errorCode: 'EXISTING_CUSTOMER', description: 'Existing customer found in lender DB', count: 5200, pctOfFailures: 67.0, trendVsYesterday: 'stable' },
    { errorCode: 'DUPLICATE_APPLICATION', description: 'Duplicate application within 30 days', count: 2557, pctOfFailures: 33.0, trendVsYesterday: 'up' },
  ],
  INITIATE_KYC_VALIDATION_FAILED: [
    { errorCode: 'AADHAAR_API_DOWN', description: 'Aadhaar eKYC API unavailable', count: 2800, pctOfFailures: 68.0, trendVsYesterday: 'up' },
    { errorCode: 'AADHAAR_OTP_FAIL', description: 'Aadhaar OTP delivery failed', count: 1320, pctOfFailures: 32.0, trendVsYesterday: 'stable' },
  ],
  KYC_VALIDATION_SUCCESS: [],
  POST_KYC_ACTION_INITIATED: [],
  POST_KYC_ACTION_FAILED: [
    { errorCode: 'POST_KYC_TIMEOUT', description: 'Post-KYC action timed out', count: 1900, pctOfFailures: 69.1, trendVsYesterday: 'stable' },
    { errorCode: 'POST_KYC_5XX', description: 'Post-KYC action API 5xx', count: 850, pctOfFailures: 30.9, trendVsYesterday: 'up' },
  ],
  LENDER_AADHAAR_PAN_LINK_FAILED: [
    { errorCode: 'LINK_NOT_FOUND', description: 'Aadhaar-PAN link not found in NSDL', count: 3400, pctOfFailures: 60.7, trendVsYesterday: 'stable' },
    { errorCode: 'LINK_INACTIVE', description: 'Aadhaar-PAN link inactive/delinked', count: 2200, pctOfFailures: 39.3, trendVsYesterday: 'up' },
  ],
  LENDER_NAME_SIMILARITY_CHECK_SUCCESS: [],
  LENDER_NAME_SIMILARITY_CHECK_FAILED: [
    { errorCode: 'NAME_LOW_SCORE', description: 'Name similarity score below 70%', count: 4800, pctOfFailures: 69.7, trendVsYesterday: 'stable' },
    { errorCode: 'NAME_TRANSLITERATION', description: 'Transliteration mismatch (Hindi/English)', count: 2090, pctOfFailures: 30.3, trendVsYesterday: 'stable' },
  ],
  LENDER_FACE_SIMILARITY_CHECK_SUCCESS: [],
  LENDER_FACE_SIMILARITY_CHECK_FAILED: [
    { errorCode: 'FACE_LOW_SCORE', description: 'Face match score below threshold', count: 3200, pctOfFailures: 63.0, trendVsYesterday: 'stable' },
    { errorCode: 'FACE_QUALITY_POOR', description: 'Aadhaar photo quality too low for match', count: 1880, pctOfFailures: 37.0, trendVsYesterday: 'up' },
  ],
  KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: [],
  KYC_PINCODE_SERVICEABILITY_CHECK_FAILED: [
    { errorCode: 'PINCODE_NOT_SERVICEABLE', description: 'Pincode not in serviceable list', count: 65200, pctOfFailures: 77.1, trendVsYesterday: 'stable' },
    { errorCode: 'PINCODE_LENDER_MISMATCH', description: 'No lender for this pincode', count: 15800, pctOfFailures: 18.7, trendVsYesterday: 'stable' },
    { errorCode: 'PINCODE_API_TIMEOUT', description: 'Pincode API timeout', count: 3585, pctOfFailures: 4.2, trendVsYesterday: 'up' },
  ],
  // LENDER BRE sub-stages
  LENDER_BRE_INITIATED: [],
  LENDER_BRE_SUCCESS: [],
  LENDER_BRE_APPROVE_SUCCESS: [],
  LENDER_BRE_APPROVE_FAILED: [
    { errorCode: 'LENDER_POLICY_REJECT', description: 'Lender policy rejection', count: 15400, pctOfFailures: 70.7, trendVsYesterday: 'stable' },
    { errorCode: 'LENDER_LIMIT_LOW', description: 'Approved limit below minimum', count: 6371, pctOfFailures: 29.3, trendVsYesterday: 'stable' },
  ],
  LENDER_BRE_FAILURE: [
    { errorCode: 'LENDER_BRE_TIMEOUT', description: 'Lender BRE API timeout', count: 28000, pctOfFailures: 62.8, trendVsYesterday: 'up' },
    { errorCode: 'LENDER_BRE_5XX', description: 'Lender BRE 5xx error', count: 12300, pctOfFailures: 27.6, trendVsYesterday: 'stable' },
    { errorCode: 'LENDER_BRE_PARSE', description: 'Lender response parse failure', count: 4256, pctOfFailures: 9.6, trendVsYesterday: 'down' },
  ],
  CREDIT_LINE_OFFER_ACCEPTED: [],
  LENDER_BRE_LEAD_CREATION_POLLING_FAILURE: [
    { errorCode: 'POLL_TIMEOUT', description: 'Lead creation polling timed out', count: 1200, pctOfFailures: 63.5, trendVsYesterday: 'up' },
    { errorCode: 'POLL_MAX_RETRIES', description: 'Max polling retries exhausted', count: 690, pctOfFailures: 36.5, trendVsYesterday: 'stable' },
  ],
  // PENNY DROP sub-stages
  LENDER_PENNY_DROP_SUCCESS: [],
  BANK_VERIFICATION_FAILED: [
    { errorCode: 'BANK_ACC_INVALID', description: 'Bank account not found or invalid', count: 3400, pctOfFailures: 58.8, trendVsYesterday: 'stable' },
    { errorCode: 'IFSC_INVALID', description: 'IFSC code invalid or deprecated', count: 1580, pctOfFailures: 27.3, trendVsYesterday: 'stable' },
    { errorCode: 'ACC_FROZEN', description: 'Bank account frozen/blocked', count: 800, pctOfFailures: 13.9, trendVsYesterday: 'up' },
  ],
  LENDER_KYC_NAME_MATCH_CHECK_FAILED: [
    { errorCode: 'NAME_MISMATCH_BANK', description: 'Account holder name does not match KYC', count: 2100, pctOfFailures: 72.7, trendVsYesterday: 'stable' },
    { errorCode: 'JOINT_ACC_MISMATCH', description: 'Joint account — primary holder mismatch', count: 790, pctOfFailures: 27.3, trendVsYesterday: 'stable' },
  ],
  EMANDATE_REQUIRED: [],
  LENDER_NSDL_NAME_MATCH_CHECK_FAILED: [
    { errorCode: 'NSDL_NAME_MISMATCH', description: 'NSDL name does not match PAN record', count: 1020, pctOfFailures: 70.3, trendVsYesterday: 'stable' },
    { errorCode: 'NSDL_API_ERROR', description: 'NSDL name match API error', count: 430, pctOfFailures: 29.7, trendVsYesterday: 'up' },
  ],
  MAQUETTE_FRAUD_CHECK_FAILED: [
    { errorCode: 'FRAUD_DEVICE_FLAG', description: 'Device flagged for fraud patterns', count: 620, pctOfFailures: 55.2, trendVsYesterday: 'up' },
    { errorCode: 'FRAUD_VELOCITY', description: 'Too many applications from same device', count: 504, pctOfFailures: 44.8, trendVsYesterday: 'stable' },
  ],
  // MANDATE sub-stages
  MANDATE_SUCCESS: [],
  KFS_VIEWED: [],
  DEVICE_BINDING_CHECK_PASSED: [],
  DEVICE_BINDING_FAILED: [
    { errorCode: 'DEVICE_ROOTED', description: 'Rooted/jailbroken device detected', count: 980, pctOfFailures: 57.6, trendVsYesterday: 'stable' },
    { errorCode: 'DEVICE_EMULATOR', description: 'Emulator detected', count: 450, pctOfFailures: 26.5, trendVsYesterday: 'up' },
    { errorCode: 'DEVICE_INTEGRITY_FAIL', description: 'Play Integrity / SafetyNet fail', count: 270, pctOfFailures: 15.9, trendVsYesterday: 'stable' },
  ],
  // ESIGN sub-stages
  ESIGN_REQUIRED: [],
  ESIGN_SUCCESS: [],
  ESIGN_FAILED: [
    { errorCode: 'ESIGN_OTP_FAIL', description: 'eSign Aadhaar OTP delivery failed', count: 5840, pctOfFailures: 50.1, trendVsYesterday: 'stable' },
    { errorCode: 'ESIGN_TIMEOUT', description: 'eSign session timeout', count: 3420, pctOfFailures: 29.3, trendVsYesterday: 'stable' },
    { errorCode: 'ESIGN_DOC_ERROR', description: 'eSign document generation error', count: 2404, pctOfFailures: 20.6, trendVsYesterday: 'up' },
  ],
  POST_ESIGN_ACTION_IN_PROGRESS: [],
  POST_ESIGN_ACTION_FAILED: [
    { errorCode: 'POST_ESIGN_SYNC_FAIL', description: 'Post-eSign data sync failed', count: 320, pctOfFailures: 70.5, trendVsYesterday: 'up' },
    { errorCode: 'POST_ESIGN_TIMEOUT', description: 'Post-eSign action timeout', count: 134, pctOfFailures: 29.5, trendVsYesterday: 'stable' },
  ],
  // LAN CREATION sub-stages
  LENDER_CUSTOMER_CREATION_FAILED: [
    { errorCode: 'CUST_DUPLICATE', description: 'Customer already exists at lender', count: 200, pctOfFailures: 64.1, trendVsYesterday: 'stable' },
    { errorCode: 'CUST_API_FAIL', description: 'Customer creation API failure', count: 112, pctOfFailures: 35.9, trendVsYesterday: 'up' },
  ],
  LENDER_CUSTOMER_CREATION_SUCCESS: [],
  LENDER_CUSTOMER_MODIFICATION_FAILED: [
    { errorCode: 'MOD_CONFLICT', description: 'Concurrent modification conflict', count: 52, pctOfFailures: 58.4, trendVsYesterday: 'stable' },
    { errorCode: 'MOD_API_FAIL', description: 'Customer modification API failure', count: 37, pctOfFailures: 41.6, trendVsYesterday: 'stable' },
  ],
  LENDER_CUSTOMER_MODIFICATION_SUCCESS: [],
  LENDER_LAN_CREATION_SUCCESS: [],
  LENDER_LAN_CREATION_FAILED: [
    { errorCode: 'LAN_DUPLICATE', description: 'LAN already exists for customer', count: 220, pctOfFailures: 58.0, trendVsYesterday: 'stable' },
    { errorCode: 'LAN_API_FAIL', description: 'LAN creation API failure', count: 159, pctOfFailures: 42.0, trendVsYesterday: 'up' },
  ],
  // LMS sub-stages
  LMS_LAM_ACCOUNT_CREATION_SUCCESS: [],
  LMS_LAM_ACCOUNT_CREATION_FAILED: [
    { errorCode: 'LAM_DUPLICATE', description: 'LAM account already exists', count: 310, pctOfFailures: 58.6, trendVsYesterday: 'stable' },
    { errorCode: 'LAM_API_FAIL', description: 'LAM account creation API error', count: 219, pctOfFailures: 41.4, trendVsYesterday: 'up' },
  ],
  LMS_ONBOARDING_COMPLETED: [],
  CREDIT_LINE_LINKED: [],
  MPIN_SET: [],
  LINK_FAILURE: [
    { errorCode: 'LINK_TIMEOUT', description: 'Credit line linking timed out', count: 1800, pctOfFailures: 58.9, trendVsYesterday: 'stable' },
    { errorCode: 'LINK_PARTNER_FAIL', description: 'Partner API returned failure', count: 1254, pctOfFailures: 41.1, trendVsYesterday: 'up' },
  ],
  // BASIC DETAILS sub-stages
  PAN_PREFILL: [
    { errorCode: 'PAN_PREFILL_FAIL', description: 'PAN pre-fill API returned empty', count: 28540, pctOfFailures: 65.0, trendVsYesterday: 'stable' },
    { errorCode: 'PAN_PREFILL_TIMEOUT', description: 'PAN pre-fill API timeout', count: 15360, pctOfFailures: 35.0, trendVsYesterday: 'up' },
  ],
  EMAIL_PREFILL: [
    { errorCode: 'EMAIL_INVALID', description: 'Email validation failed', count: 22100, pctOfFailures: 78.0, trendVsYesterday: 'up' },
    { errorCode: 'EMAIL_PREFILL_EMPTY', description: 'Email pre-fill returned empty', count: 6230, pctOfFailures: 22.0, trendVsYesterday: 'stable' },
  ],
  BUREAU_SKIPPED_CIR_OFFER: [],
};

export const logErrors = {
  APPLICATION_LOADED: [
    { errorCode: 'APP_TIMEOUT', description: 'App load timeout — JS bundle >5s', count: 14520, pctOfFailures: 42.1, trendVsYesterday: 'stable' },
    { errorCode: 'CDN_FAIL', description: 'CDN resource fetch failed', count: 8930, pctOfFailures: 25.9, trendVsYesterday: 'up' },
    { errorCode: 'WEBVIEW_CRASH', description: 'WebView crash on older Android', count: 7200, pctOfFailures: 20.9, trendVsYesterday: 'stable' },
    { errorCode: 'AUTH_TOKEN_EXPIRED', description: 'Auth token expired before load', count: 3850, pctOfFailures: 11.1, trendVsYesterday: 'down' },
  ],
  BASIC_DETAILS_CAPTURED: [
    { errorCode: 'PAN_PREFILL_FAIL', description: 'PAN pre-fill API returned empty', count: 28540, pctOfFailures: 38.2, trendVsYesterday: 'stable' },
    { errorCode: 'EMAIL_INVALID', description: 'Email validation failed', count: 22100, pctOfFailures: 29.6, trendVsYesterday: 'up' },
    { errorCode: 'DOB_MISMATCH', description: 'DOB mismatch with PAN records', count: 15800, pctOfFailures: 21.2, trendVsYesterday: 'stable' },
    { errorCode: 'FORM_ABANDONED', description: 'User abandoned form mid-entry', count: 8200, pctOfFailures: 11.0, trendVsYesterday: 'down' },
  ],
  BUREAU_IN_PROGRESS: [
    { errorCode: 'CIBIL_TIMEOUT', description: 'CIBIL API timeout (>10s)', count: 1820, pctOfFailures: 52.4, trendVsYesterday: 'up' },
    { errorCode: 'BUREAU_NO_HIT', description: 'No bureau record found for PAN', count: 985, pctOfFailures: 28.3, trendVsYesterday: 'stable' },
    { errorCode: 'OTP_EXPIRED', description: 'Bureau OTP expired', count: 445, pctOfFailures: 12.8, trendVsYesterday: 'stable' },
    { errorCode: 'BUREAU_5XX', description: 'Bureau API 5xx error', count: 224, pctOfFailures: 6.5, trendVsYesterday: 'alert' },
  ],
  BRE_COMPLETED: [
    { errorCode: 'BRE_LOW_SCORE', description: 'BRE score below threshold (<650)', count: 142500, pctOfFailures: 50.2, trendVsYesterday: 'stable' },
    { errorCode: 'BRE_POLICY_REJECT', description: 'Policy rule rejection (age/income)', count: 85400, pctOfFailures: 30.1, trendVsYesterday: 'stable' },
    { errorCode: 'BRE_DPD_FLAG', description: 'DPD flag in last 12 months', count: 42300, pctOfFailures: 14.9, trendVsYesterday: 'up' },
    { errorCode: 'BRE_FRAUD_FLAG', description: 'Fraud flag from bureau data', count: 13600, pctOfFailures: 4.8, trendVsYesterday: 'stable' },
  ],
  SELFIE_CAPTURED: [
    { errorCode: 'SELFIE_UNCLEAR', description: 'Your selfie is not clear.', count: 25484, pctOfFailures: 57.3, trendVsYesterday: 'stable' },
    { errorCode: 'EYES_CLOSED', description: 'Please keep your eyes open and capture the selfie', count: 11873, pctOfFailures: 26.7, trendVsYesterday: 'up' },
    { errorCode: 'BACKGROUND_PERSON', description: 'Please ensure there\'s no one else in the background', count: 2422, pctOfFailures: 5.4, trendVsYesterday: 'stable' },
    { errorCode: 'TOO_FAR', description: 'Please move closer to the camera', count: 821, pctOfFailures: 1.8, trendVsYesterday: 'down' },
    { errorCode: 'MASK_DETECTED', description: 'Please remove your mask', count: 218, pctOfFailures: 0.5, trendVsYesterday: 'stable' },
    { errorCode: 'RATE_LIMIT', description: 'Rate limit exceeded (API)', count: 8, pctOfFailures: 0.02, trendVsYesterday: 'alert' },
  ],
  KYC_VALIDATION_SUCCESS: [
    { errorCode: 'KYC_AADHAAR_MISMATCH', description: 'Aadhaar name does not match PAN', count: 4850, pctOfFailures: 38.5, trendVsYesterday: 'stable' },
    { errorCode: 'KYC_FACE_MISMATCH', description: 'Face similarity below threshold', count: 3920, pctOfFailures: 31.1, trendVsYesterday: 'up' },
    { errorCode: 'KYC_DOC_EXPIRED', description: 'Aadhaar document expired or invalid', count: 2340, pctOfFailures: 18.6, trendVsYesterday: 'stable' },
    { errorCode: 'KYC_API_ERROR', description: 'KYC vendor API error', count: 1490, pctOfFailures: 11.8, trendVsYesterday: 'down' },
  ],
  KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: [
    { errorCode: 'PINCODE_NOT_SERVICEABLE', description: 'Pincode not in serviceable list', count: 65200, pctOfFailures: 77.1, trendVsYesterday: 'stable' },
    { errorCode: 'PINCODE_LENDER_MISMATCH', description: 'No lender available for this pincode', count: 15800, pctOfFailures: 18.7, trendVsYesterday: 'stable' },
    { errorCode: 'PINCODE_API_TIMEOUT', description: 'Pincode serviceability API timeout', count: 3585, pctOfFailures: 4.2, trendVsYesterday: 'up' },
  ],
  LENDER_BRE_APPROVE_SUCCESS: [
    { errorCode: 'LENDER_BRE_REJECT', description: 'Lender BRE policy rejection', count: 32400, pctOfFailures: 72.7, trendVsYesterday: 'stable' },
    { errorCode: 'LENDER_LIMIT_LOW', description: 'Approved limit below minimum threshold', count: 8900, pctOfFailures: 20.0, trendVsYesterday: 'stable' },
    { errorCode: 'LENDER_API_FAIL', description: 'Lender BRE API failure', count: 3256, pctOfFailures: 7.3, trendVsYesterday: 'up' },
  ],
  LENDER_PENNY_DROP_SUCCESS: [
    { errorCode: 'BANK_ACC_INVALID', description: 'Bank account not found or invalid', count: 5780, pctOfFailures: 39.7, trendVsYesterday: 'stable' },
    { errorCode: 'PENNY_DROP_TIMEOUT', description: 'Penny drop API timeout', count: 3215, pctOfFailures: 22.1, trendVsYesterday: 'up' },
    { errorCode: 'NAME_MISMATCH_BANK', description: 'Account holder name does not match', count: 2890, pctOfFailures: 19.8, trendVsYesterday: 'stable' },
    { errorCode: 'IFSC_INVALID', description: 'IFSC code invalid or deprecated', count: 2680, pctOfFailures: 18.4, trendVsYesterday: 'stable' },
  ],
  MANDATE_SUCCESS: [
    { errorCode: 'EMANDATE_BANK_REJECT', description: 'Bank rejected eMandate registration', count: 6245, pctOfFailures: 56.0, trendVsYesterday: 'stable' },
    { errorCode: 'MANDATE_TIMEOUT', description: 'Mandate registration timeout', count: 2870, pctOfFailures: 25.7, trendVsYesterday: 'stable' },
    { errorCode: 'FRAUD_CHECK_FAIL', description: 'Fraud check failed during mandate', count: 1124, pctOfFailures: 10.1, trendVsYesterday: 'up' },
    { errorCode: 'UPI_MANDATE_FAIL', description: 'UPI mandate creation failed', count: 918, pctOfFailures: 8.2, trendVsYesterday: 'down' },
  ],
  REVIEW_OFFER_ACCEPTED: [
    { errorCode: 'OFFER_EXPIRED', description: 'Offer expired before acceptance', count: 8420, pctOfFailures: 59.5, trendVsYesterday: 'stable' },
    { errorCode: 'USER_DECLINED', description: 'User explicitly declined offer', count: 4100, pctOfFailures: 29.0, trendVsYesterday: 'stable' },
    { errorCode: 'OFFER_RENDER_FAIL', description: 'Offer page failed to render', count: 1635, pctOfFailures: 11.5, trendVsYesterday: 'up' },
  ],
  ESIGN_SUCCESS: [
    { errorCode: 'ESIGN_OTP_FAIL', description: 'eSign Aadhaar OTP delivery failed', count: 5840, pctOfFailures: 50.1, trendVsYesterday: 'stable' },
    { errorCode: 'ESIGN_TIMEOUT', description: 'eSign session timeout', count: 3420, pctOfFailures: 29.3, trendVsYesterday: 'stable' },
    { errorCode: 'ESIGN_DOC_ERROR', description: 'eSign document generation error', count: 2404, pctOfFailures: 20.6, trendVsYesterday: 'up' },
  ],
  LEAD_SUCCESSFULLY_CLOSED: [
    { errorCode: 'LMS_SYNC_FAIL', description: 'LMS sync failed after eSign', count: 225, pctOfFailures: 48.4, trendVsYesterday: 'stable' },
    { errorCode: 'CREDIT_LINE_DELAY', description: 'Credit line activation delayed >24h', count: 158, pctOfFailures: 34.0, trendVsYesterday: 'stable' },
    { errorCode: 'MPIN_SET_FAIL', description: 'MPIN setting failed', count: 82, pctOfFailures: 17.6, trendVsYesterday: 'down' },
  ],
};
