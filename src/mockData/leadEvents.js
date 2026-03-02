function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const STAGES_SEQUENCE = [
  { stage: 'APPLICATION_LOADED', substages: ['LANDING_PAGE_VIEW'] },
  { stage: 'BASIC_DETAILS_CAPTURED', substages: ['PAN_PREFILL', 'EMAIL_PREFILL'] },
  { stage: 'BUREAU_IN_PROGRESS', substages: ['BUREAU_SUCCESS', 'BUREAU_FAILED'] },
  { stage: 'BRE_COMPLETED', substages: ['BRE_REQUESTED', 'BRE_COMPLETED'] },
  { stage: 'LENDER_PAN_VALIDATION', substages: ['LENDER_PAN_VALIDATION_SUCCESS', 'LENDER_PAN_VALIDATION_FAILED'] },
  { stage: 'SELFIE_CAPTURED', substages: ['SELFIE_REQUIRED', 'SELFIE_CAPTURED', 'SELFIE_UPLOAD_SUCCESS'] },
  { stage: 'KYC_VALIDATION_SUCCESS', substages: ['KYC_VALIDATION_SUCCESS', 'LENDER_RETAIL_DEDUPE_SUCCESS'] },
  { stage: 'LENDER_BRE_APPROVE_SUCCESS', substages: ['LENDER_BRE_INITIATED', 'LENDER_BRE_SUCCESS', 'LENDER_BRE_APPROVE_SUCCESS'] },
  { stage: 'LENDER_PENNY_DROP_SUCCESS', substages: ['LENDER_PENNY_DROP_SUCCESS'] },
  { stage: 'MANDATE_SUCCESS', substages: ['KFS_VIEWED', 'MANDATE_SUCCESS'] },
  { stage: 'ESIGN_SUCCESS', substages: ['ESIGN_REQUIRED', 'ESIGN_SUCCESS'] },
  { stage: 'LEAD_SUCCESSFULLY_CLOSED', substages: ['LENDER_CUSTOMER_CREATION_SUCCESS', 'LENDER_LAN_CREATION_SUCCESS', 'LMS_ONBOARDING_COMPLETED'] },
];

const STATUS_OPTIONS = ['SUCCESS', 'FAILURE', 'PENDING', 'IN_PROGRESS'];

function generateLeadEvents(leadId, seed) {
  const baseTime = new Date('2026-02-22T08:00:00Z').getTime();
  const events = [];
  const maxStageIdx = Math.min(STAGES_SEQUENCE.length, 5 + Math.floor(seededRandom(seed) * 8));

  for (let i = 0; i <= maxStageIdx && i < STAGES_SEQUENCE.length; i++) {
    const stg = STAGES_SEQUENCE[i];
    stg.substages.forEach((sub, j) => {
      const isLast = i === maxStageIdx && j === stg.substages.length - 1;
      const isFailed = isLast && seededRandom(seed + i + j * 3) > 0.7;
      const timeOffset = (i * 3600 + j * 600 + Math.floor(seededRandom(seed + i * 10 + j) * 300)) * 1000;
      events.push({
        domain: 'ONBOARDING',
        stage: stg.stage,
        substage: sub,
        status: isFailed ? 'FAILURE' : 'SUCCESS',
        created: new Date(baseTime + timeOffset).toISOString(),
      });
    });
  }
  return events;
}

const LEAD_IDS = [
  'PTM-826401927', 'PTM-731950284', 'PTM-645283017', 'PTM-518392746',
  'PTM-402917385', 'PTM-337261049', 'PTM-291048372', 'PTM-183920461',
  'PTM-109273648', 'PTM-082716394', 'PTM-974201835', 'PTM-863027149',
  'PTM-752918064', 'PTM-648103927', 'PTM-539274018', 'PTM-421089375',
  'PTM-318920467', 'PTM-207183946', 'PTM-190482735', 'PTM-083791624',
];

export const leadEventsMap = {};
LEAD_IDS.forEach((id, idx) => {
  leadEventsMap[id] = generateLeadEvents(id, idx * 137 + 42);
});

export const SAMPLE_LEAD_IDS = LEAD_IDS;

export function getLeadsBySubStage(parentStage, subStage) {
  const matching = [];
  Object.entries(leadEventsMap).forEach(([leadId, events]) => {
    const hit = events.find(e =>
      e.stage === parentStage && e.substage === subStage
    );
    if (hit) {
      const lastEvent = events[events.length - 1];
      matching.push({
        leadId,
        stage: lastEvent.stage,
        substage: lastEvent.substage,
        status: lastEvent.status,
      });
    }
  });
  return matching.slice(0, 10);
}
