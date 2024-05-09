export const dbQueries = {
  Q_HISTORY:
    "SELECT 'rtc_transactions' AS transactions, COUNT(*) AS num_records FROM rtc_transactions WHERE uploaded='1' AND created_at >= date('now', '-7 days')  UNION ALL SELECT 'rtc_inspections' AS inspections, COUNT(*) AS num_records FROM rtc_inspections WHERE uploaded='1' AND created_at >= date('now', '-7 days');",
  Q_TRAINING_LIST:
    "SELECT course.*,attendance.*,sheet.*,groups.ID_GROUP,COUNT(*) AS participants FROM rtc_training AS course INNER JOIN rtc_training_attendance AS attendance ON course.__kp_Course = attendance.training_course_id AND attendance.uploaded_at = '0000-00-00' INNER JOIN rtc_groups AS groups ON attendance.__kf_group = groups.__kp_Group INNER JOIN rtc_attendance_sheets AS sheet ON attendance.uuid = sheet.uuid GROUP BY attendance._kf_training;",
};
