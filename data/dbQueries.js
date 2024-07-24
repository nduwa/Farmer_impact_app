export const dbQueries = {
  Q_HISTORY:
    "SELECT 'rtc_transactions' AS transactions, COUNT(*) AS num_records FROM rtc_transactions WHERE uploaded='1' AND created_at >= date('now', '-7 days')  UNION ALL SELECT 'rtc_inspections' AS inspections, COUNT(*) AS num_records FROM rtc_inspections WHERE uploaded='1' AND created_at >= date('now', '-7 days');",
  Q_TRAINING_LIST:
    "SELECT course.*,attendance.*,sheet.*,groups.ID_GROUP,COUNT(*) AS participants FROM rtc_training AS course INNER JOIN rtc_training_attendance AS attendance ON course.__kp_Course = attendance.training_course_id AND attendance.uploaded_at = '0000-00-00' INNER JOIN rtc_groups AS groups ON attendance.__kf_group = groups.__kp_Group INNER JOIN rtc_attendance_sheets AS sheet ON attendance.uuid = sheet.uuid GROUP BY attendance._kf_training;",
  Q_TMP_GRP_ASSIGN:
    "INSERT INTO tmp_farmer_group_assignment(created_at,farmerid,farmer_name,_kf_farmer,kf_group_old,group_name_old,group_id_old,kf_group_new,group_name_new,group_id_new,_kf_station,station_name,station_id,_kf_supplier,_kf_Household,assigned_by,status,uploaded) VALUES",
  Q_TMP_GRP_ACTVT:
    "INSERT INTO tmp_group_activate(created_at,_kf_Group,_kf_station,active,username,uploaded) VALUES",
  Q_TMP_GRP_ACTVT_LIST:
    "SELECT SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) AS active_count,SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) AS inactive_count,DATE(created_at) AS insertion_date,COUNT(*) OVER (PARTITION BY DATE(created_at)) AS record_count FROM tmp_group_activate WHERE uploaded = 0 GROUP BY insertion_date ORDER BY insertion_date;",
  Q_TMP_GRP_ASSIGN_LIST:
    "SELECT DATE(created_at) as insertion_date,COUNT(DATE(created_at)) AS record_count FROM tmp_farmer_group_assignment WHERE uploaded = 0 GROUP BY insertion_date",
};
