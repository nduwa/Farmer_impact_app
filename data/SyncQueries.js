export const SyncQueries = {
  RTC_GROUPS:
    "INSERT OR REPLACE INTO rtc_groups (id,created_at,__kp_Group, _kf_Location,_kf_Quality,_kf_Staff,_kf_Station,_kf_Supplier,_kf_Type,_kf_User_g,Area_Big,Area_Biggest,Area_Medium,Coordinates,ID_GROUP,Name,Notes,Status_Program,Year_Started_Program,sync_farmers,sync_households,last_update_at,active) VALUES",
  RTC_FARMERS:
    "INSERT OR REPLACE INTO rtc_farmers (id,__kp_Farmer,_kf_Group,_kf_Household,_kf_Location,_kf_Supplier,_kf_Station,Year_Birth,Gender,farmerid,Name,National_ID_t,Phone,Position,CAFE_ID,SAN_ID,UTZ_ID,Marital_Status,Reading_Skills,Math_Skills,created_at,created_by,registered_at,updated_at,type,sync_farmers,uploaded,uploaded_at,Area_Small,Area_Smallest,Trees,Trees_Producing,number_of_plots_with_coffee,STP_Weight,education_level,latitude,longitude,householdid,seasonal_goal,recordid,deleted,deleted_by,deleted_at,sync) VALUES",
  RTC_HOUSEHOLD:
    "INSERT OR REPLACE INTO rtc_households (id,__kp_Household,_kf_Group,_kf_Location,_kf_Station,_kf_Supplier,Area_Small,Area_Smallest,householdid,z_Farmer_Primary,created_at,type,farmerid,group_id,STP_Weight,number_of_plots_with_coffee,Trees_Producing,Trees,Longitude,Latitude,Children,Childen_gender,Childen_below_18,recordid,status,inspectionId,cafeId,InspectionStatus,sync) VALUES",
  RTC_STATIONS:
    "INSERT OR REPLACE INTO rtc_station (id,created_at,__kp_Station,_kf_Location,_kf_Supplier,Area_Big,Area_Biggest,Area_Medium,Area_Small,Area_Smallest,Certification,StationID,Name,Prefix,RTC_Owned,synced_price,sync_roles,updated_at,updated) VALUES",
  RTC_TRAINING:
    "INSERT OR REPLACE INTO rtc_training (id,__kp_Course,Duration,ID_COURSE,Name,Name_rw,Name_fr,created_at,status) VALUES",
  RTC_INSPECTIONQNS:
    "INSERT OR REPLACE INTO inspection_questions(id,updated_at,__kp_Evaluation,evaluation_id,evaluation_mode,Eng_phrase,Kiny_phrase,award,priority,_kf_Course,Answer,status) VALUES",
  RTC_TRANSACTIONS:
    "INSERT OR REPLACE INTO rtc_transactions(created_at,farmerid,farmername,coffee_type,kilograms,unitprice,lotnumber,transaction_date,certification,_kf_Staff,_kf_Station,_kf_Supplier,uploaded,uploaded_at,site_day_lot,paper_receipt,certified,edited,cash_paid,cherry_lot_id,parchment_lot_id,traceable,total_mobile_money_payment,bad_unit_price,bad_kilograms,bad_cherry_lot_id,bad_parch_lot_id,_kf_Season) VALUES",
  RTC_SUPPLIER:
    "INSERT OR REPLACE INTO rtc_supplier (id, _kf_Quality, _kf_Type, __kp_Supplier, _kf_Location, _kf_User_g, Area_Big, Area_Biggest, Area_Medium, Area_Small, Area_Smallest, Certification, Name, Status, Ratio_CP, Relationship, Report, Supplier_ID_t, created_at, z_recCreateTimestamp, z_recModifyTimestamp, _kf_User, _kf_Season, deleted) VALUES",
  RTC_SEASONS:
    "INSERT OR REPLACE INTO rtc_seasons (id, __kp_Season, _kf_Location, End_d, Label, Start_d, z_recCreateAccountName, z_recCreateTimestamp, z_recModifyAccountName, DefaultState, z_Year, Label_Short, z_recModifyTimestamp, Location) VALUES",
  RTC_INSPECTION_ANS:
    "INSERT OR REPLACE INTO inspection_answers (id,created_at,Eng_answer,Kiny_answer,question_id,priority,status,created_by,score,__kp_Option,_kf_Evaluation) VALUES",
  RTC_INSPECTION_RESP:
    "INSERT OR REPLACE INTO inspection_responses (created_at, rtc_inspections_id, inspection_answer_id, deleted, __kp_InspectionLog) VALUES",
  RTC_INSPECTIONS:
    "INSERT OR REPLACE INTO rtc_inspections (created_at, Score_n, _kf_Course, _kf_Household, __kp_Inspection, _kf_Station, _kf_Supplier, created_by, inspection_at, uploaded, uploaded_at, longitude, latitude) VALUES",
  RTC_ATTENDANCE_SHEETS:
    "INSERT OR REPLACE INTO rtc_attendance_sheets (created_at,uuid,filepath,status,uploaded_at) VALUES",
  RTC_TRAINING_ATTENDANCE:
    "INSERT OR REPLACE INTO rtc_training_attendance (created_at,training_course_id,__kf_farmer,__kf_group,status,__kf_attendance,username,password,uuid,uploaded_at,_kf_training,lo,la) VALUES",
  RTC_MOBILE_MODULES:
    "INSERT OR REPLACE INTO rtc_mobile_app_modules (id,created_at,module_name,platform) VALUES",
  RTC_ASSIGNED_MODULES:
    "INSERT OR REPLACE INTO rtc_mobile_app_access_control (id,created_at,moduleid,userid,view_record,add_record,delete_record,edit_record,platform,active) VALUES",
  RTC_FIELD_FARMERS:
    "INSERT OR REPLACE INTO rtc_field_farmers (_kf_Supplier, _kf_Staff, _kf_User, user_code, _kf_Station, CW_Name, farmer_name, Gender, Year_Birth, phone, National_ID, Marital_Status, Group_ID, village, cell, sector, Trees, Trees_Producing, number_of_plots, Skills, Math_Skills, education_level, created_at, full_name, farm_GPS, uploaded) VALUES",
  RTC_WEEKLY_REPORTS:
    "INSERT OR REPLACE INTO rtc_field_weekly_report (_kf_Staff, _kf_User, _kf_Station, _kf_Supplier, CW_Name, full_name, user_code, trained_number, men_attended, women_attended, planned_groups, farm_inspected, planned_inspected, comments, createdAt,uploaded) VALUES",
};
