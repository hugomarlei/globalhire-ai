export const retentionConfig = {
  generationsDays: Number(process.env.RETENTION_GENERATIONS_DAYS || 180),
  documentsDays: Number(process.env.RETENTION_DOCUMENTS_DAYS || 365),
  cleanupEnabled: process.env.RETENTION_CLEANUP_ENABLED === "true"
};

export function retentionCutoff(days: number) {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 180;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - safeDays);
  return cutoff.toISOString();
}

export function shouldRunRetentionCleanup() {
  return retentionConfig.cleanupEnabled;
}
