export function getConversionRAG(currentConv, lmtdConv) {
  if (currentConv == null || lmtdConv == null) return 'gray';
  const delta = currentConv - lmtdConv;
  if (delta >= -0.5) return 'green';
  if (delta >= -2.0) return 'amber';
  return 'red';
}

export function getDailyCountRAG(currentCount, lmsdCount) {
  if (!currentCount || !lmsdCount) return 'gray';
  const pctChange = ((currentCount - lmsdCount) / lmsdCount) * 100;
  if (pctChange >= -5) return 'green';
  if (pctChange >= -15) return 'amber';
  return 'red';
}

export function getSubStageRAG(currentRate, historicalAvg) {
  if (!currentRate || !historicalAvg) return 'green';
  const ratio = currentRate / historicalAvg;
  if (ratio < 1.2) return 'green';
  if (ratio < 1.5) return 'amber';
  return 'red';
}

export function getApiHealthRAG(error5xxRate) {
  if (error5xxRate == null) return 'gray';
  if (error5xxRate < 0.1) return 'green';
  if (error5xxRate < 0.5) return 'amber';
  return 'red';
}

export function getDeltaColor(deltaPP) {
  if (deltaPP == null) return 'gray';
  if (deltaPP >= 0.5) return 'green';
  if (deltaPP <= -0.5) return 'red';
  return 'gray';
}

export function getDeltaBold(deltaPP) {
  if (deltaPP == null) return false;
  return Math.abs(deltaPP) > 2;
}

export const RAG_COLORS = {
  green: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  amber: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  red: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  gray: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
};

export function formatNumber(num) {
  if (num == null) return '—';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatDelta(delta) {
  if (delta == null) return '—';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}pp`;
}
