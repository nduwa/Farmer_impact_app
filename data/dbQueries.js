export const dbQueries = {
  Q_HISTORY:
    "SELECT 'rtc_transactions' AS transactions, COUNT(*) AS num_records FROM rtc_transactions WHERE uploaded='1' AND created_at >= date('now', '-7 days')  UNION ALL SELECT 'rtc_inspections' AS inspections, COUNT(*) AS num_records FROM rtc_inspections WHERE uploaded='1' AND created_at >= date('now', '-7 days');",
};
