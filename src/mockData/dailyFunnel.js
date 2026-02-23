const stages = [
  'APPLICATION_LOADED', 'BASIC_DETAILS_CAPTURED', 'BUREAU_IN_PROGRESS',
  'BRE_COMPLETED', 'SELFIE_CAPTURED', 'KYC_VALIDATION_SUCCESS',
  'KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS', 'LENDER_BRE_APPROVE_SUCCESS',
  'LENDER_PENNY_DROP_SUCCESS', 'MANDATE_SUCCESS', 'REVIEW_OFFER_ACCEPTED',
  'ESIGN_SUCCESS', 'LEAD_SUCCESSFULLY_CLOSED'
];

const baseCounts = {
  APPLICATION_LOADED: 370000,
  BASIC_DETAILS_CAPTURED: 100000,
  BUREAU_IN_PROGRESS: 89000,
  BRE_COMPLETED: 30500,
  SELFIE_CAPTURED: 22000,
  KYC_VALIDATION_SUCCESS: 15000,
  KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5500,
  LENDER_BRE_APPROVE_SUCCESS: 5400,
  LENDER_PENNY_DROP_SUCCESS: 2100,
  MANDATE_SUCCESS: 3700,
  REVIEW_OFFER_ACCEPTED: 3200,
  ESIGN_SUCCESS: 2700,
  LEAD_SUCCESSFULLY_CLOSED: 2680,
};

const knownDays = {
  '2026-02-15': { APPLICATION_LOADED: 347504, BASIC_DETAILS_CAPTURED: 92530, BUREAU_IN_PROGRESS: 82578, BRE_COMPLETED: 28615, SELFIE_CAPTURED: 21151, KYC_VALIDATION_SUCCESS: 14614, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5165, LENDER_BRE_APPROVE_SUCCESS: 5165, LENDER_PENNY_DROP_SUCCESS: 2130, MANDATE_SUCCESS: 3482, REVIEW_OFFER_ACCEPTED: 3010, ESIGN_SUCCESS: 2530, LEAD_SUCCESSFULLY_CLOSED: 2520 },
  '2026-02-16': { APPLICATION_LOADED: 385446, BASIC_DETAILS_CAPTURED: 108565, BUREAU_IN_PROGRESS: 97539, BRE_COMPLETED: 32212, SELFIE_CAPTURED: 23564, KYC_VALIDATION_SUCCESS: 15830, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5380, LENDER_BRE_APPROVE_SUCCESS: 5380, LENDER_PENNY_DROP_SUCCESS: 2050, MANDATE_SUCCESS: 3714, REVIEW_OFFER_ACCEPTED: 3215, ESIGN_SUCCESS: 2700, LEAD_SUCCESSFULLY_CLOSED: 2690 },
  '2026-02-17': { APPLICATION_LOADED: 401496, BASIC_DETAILS_CAPTURED: 110991, BUREAU_IN_PROGRESS: 98874, BRE_COMPLETED: 33190, SELFIE_CAPTURED: 24270, KYC_VALIDATION_SUCCESS: 16094, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5762, LENDER_BRE_APPROVE_SUCCESS: 5762, LENDER_PENNY_DROP_SUCCESS: 2217, MANDATE_SUCCESS: 4019, REVIEW_OFFER_ACCEPTED: 3480, ESIGN_SUCCESS: 2920, LEAD_SUCCESSFULLY_CLOSED: 2910 },
  '2026-02-18': { APPLICATION_LOADED: 380134, BASIC_DETAILS_CAPTURED: 101993, BUREAU_IN_PROGRESS: 90551, BRE_COMPLETED: 31031, SELFIE_CAPTURED: 22157, KYC_VALIDATION_SUCCESS: 14998, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5523, LENDER_BRE_APPROVE_SUCCESS: 5523, LENDER_PENNY_DROP_SUCCESS: 2179, MANDATE_SUCCESS: 3836, REVIEW_OFFER_ACCEPTED: 3320, ESIGN_SUCCESS: 2790, LEAD_SUCCESSFULLY_CLOSED: 2780 },
  '2026-02-19': { APPLICATION_LOADED: 375834, BASIC_DETAILS_CAPTURED: 97401, BUREAU_IN_PROGRESS: 86175, BRE_COMPLETED: 29977, SELFIE_CAPTURED: 21981, KYC_VALIDATION_SUCCESS: 14799, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5445, LENDER_BRE_APPROVE_SUCCESS: 5445, LENDER_PENNY_DROP_SUCCESS: 2147, MANDATE_SUCCESS: 3810, REVIEW_OFFER_ACCEPTED: 3298, ESIGN_SUCCESS: 2770, LEAD_SUCCESSFULLY_CLOSED: 2760 },
  '2026-02-20': { APPLICATION_LOADED: 211087, BASIC_DETAILS_CAPTURED: 89872, BUREAU_IN_PROGRESS: 78955, BRE_COMPLETED: 28328, SELFIE_CAPTURED: 20385, KYC_VALIDATION_SUCCESS: 13800, KYC_PINCODE_SERVICEABILITY_CHECK_SUCCESS: 5135, LENDER_BRE_APPROVE_SUCCESS: 5135, LENDER_PENNY_DROP_SUCCESS: 2025, MANDATE_SUCCESS: 3436, REVIEW_OFFER_ACCEPTED: 2975, ESIGN_SUCCESS: 2500, LEAD_SUCCESSFULLY_CLOSED: 2490 },
};

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailyData() {
  const data = [];

  for (let day = 1; day <= 22; day++) {
    const dateStr = `2026-02-${String(day).padStart(2, '0')}`;

    if (knownDays[dateStr]) {
      const dayData = { date: dateStr };
      stages.forEach(stage => {
        const count = knownDays[dateStr][stage];
        const prevStageIdx = stages.indexOf(stage) - 1;
        let conv = null;
        if (prevStageIdx >= 0) {
          const prevCount = knownDays[dateStr][stages[prevStageIdx]];
          conv = prevCount > 0 ? parseFloat(((count / prevCount) * 100).toFixed(1)) : 0;
        }
        dayData[stage] = { count, conversion: conv };
      });
      data.push(dayData);
    } else if (day <= 20) {
      const dayData = { date: dateStr };
      const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
      const weekendFactor = isWeekend ? 0.75 : 1.0;

      stages.forEach((stage, idx) => {
        const base = baseCounts[stage];
        const variance = seededRandom(day * 100 + idx) * 0.2 - 0.1;
        const count = Math.round(base * (1 + variance) * weekendFactor);
        let conv = null;
        if (idx > 0) {
          const prevStage = stages[idx - 1];
          const prevCount = dayData[prevStage]?.count || 1;
          conv = parseFloat(((count / prevCount) * 100).toFixed(1));
        }
        dayData[stage] = { count, conversion: conv };
      });
      data.push(dayData);
    }
  }

  return data;
}

export const dailyFunnel = generateDailyData();

export const lmsdData = (() => {
  const data = [];
  for (let day = 1; day <= 22; day++) {
    const dateStr = `2026-01-${String(day).padStart(2, '0')}`;
    const dayData = { date: dateStr };
    const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
    const weekendFactor = isWeekend ? 0.78 : 1.0;

    stages.forEach((stage, idx) => {
      const base = Math.round(baseCounts[stage] * 1.3);
      const variance = seededRandom(day * 200 + idx) * 0.15 - 0.075;
      const count = Math.round(base * (1 + variance) * weekendFactor);
      let conv = null;
      if (idx > 0) {
        const prevStage = stages[idx - 1];
        const prevCount = dayData[prevStage]?.count || 1;
        conv = parseFloat(((count / prevCount) * 100).toFixed(1));
      }
      dayData[stage] = { count, conversion: conv };
    });
    data.push(dayData);
  }
  return data;
})();
