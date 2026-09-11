export function simulateRunwayAndARR({
  initialCash,
  initialMRR,
  initialGrossBurn,
  headcount,
  newHiresPerMonth,
  avgSalaryPerEmployee = 11000, // Monthly fully-burdened cost
  growthRatePct, // Monthly revenue growth %
  marketingSpendDelta = 0,
  arpuDeltaPct = 0,
  newCapitalInfusion = 0,
  infusionMonth = 6,
  simulationMonths = 24,
}) {
  const timeline = [];
  let currentCash = initialCash;
  let currentMRR = initialMRR * (1 + arpuDeltaPct / 100);
  let currentHeadcount = headcount;
  let currentGrossBurn = initialGrossBurn;
  let zeroCashMonth = null;
  let breakEvenMonth = null;

  for (let m = 1; m <= simulationMonths; m++) {
    // Add new hires to burn
    currentHeadcount += newHiresPerMonth;
    const additionalPayrollBurn = (currentHeadcount - headcount) * avgSalaryPerEmployee;
    const monthMarketingBurn = marketingSpendDelta;
    currentGrossBurn = initialGrossBurn + additionalPayrollBurn + monthMarketingBurn;

    // Compound MRR growth
    currentMRR = currentMRR * (1 + growthRatePct / 100);
    const monthlyNetBurn = currentGrossBurn - currentMRR;

    // Check if capital injection happened this month
    if (m === infusionMonth && newCapitalInfusion > 0) {
      currentCash += newCapitalInfusion;
    }

    currentCash = currentCash - monthlyNetBurn;

    if (currentCash <= 0 && zeroCashMonth === null) {
      zeroCashMonth = m;
    }

    if (monthlyNetBurn <= 0 && breakEvenMonth === null) {
      breakEvenMonth = m;
    }

    const date = new Date();
    date.setMonth(date.getMonth() + m);
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    timeline.push({
      month: m,
      monthLabel,
      cash: Math.max(0, Math.round(currentCash)),
      rawCash: Math.round(currentCash),
      mrr: Math.round(currentMRR),
      arr: Math.round(currentMRR * 12),
      grossBurn: Math.round(currentGrossBurn),
      netBurn: Math.round(monthlyNetBurn),
      headcount: currentHeadcount,
      isCapitalMonth: m === infusionMonth && newCapitalInfusion > 0,
    });
  }

  // Calculate Next Round Valuation multiple (typically 8x - 18x ARR depending on growth rate)
  const finalARR = timeline[simulationMonths - 1]?.arr || initialMRR * 12;
  const valuationMultiple = growthRatePct >= 15 ? 16 : growthRatePct >= 10 ? 12 : growthRatePct >= 5 ? 8 : 5;
  const estimatedValuation = Math.round(finalARR * valuationMultiple);

  return {
    timeline,
    zeroCashMonth,
    breakEvenMonth,
    finalMRR: timeline[simulationMonths - 1]?.mrr,
    finalARR,
    finalCash: timeline[simulationMonths - 1]?.cash,
    estimatedValuation,
    valuationMultiple,
  };
}
