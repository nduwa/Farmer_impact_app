export const SyncQueries = {
  RTC_GROUPS:
    "INSERT OR REPLACE INTO houses rtc_groups (id,created_at,_kp_Group, _kf_Location,_kf_Quality,_kf_Staff,_kf_Station,_kf_Supplier,_kf_Type,_kf_User_g,Area_Big,Area_Biggest,Area_Medium,Coordinates,ID_GROUP,Name,Notes,Status_Program,Year_Started_Program,sync_farmers,sync_households,last_update_at) VALUES",
  RTC_FARMERS:
    "INSERT OR REPLACE INTO rtc_farmers (id,__kp_Farmer,_kf_Group,_kf_Household,_kf_Location,_kf_Supplier,_kf_Station,Year_Birth,Gender,farmerid,Name,National_ID_t,Phone,Position,CAFE_ID,SAN_ID,UTZ_ID,Marital_Status,Reading_Skills,Math_Skills,created_at,created_by,registered_at,updated_at,type,sync_farmers,uploaded,uploaded_at,Area_Small,Area_Smallest,Trees,Trees_Producing,number_of_plots_with_coffee,STP_Weight,education_level,latitude,longitude,householdid,seasonal_goal,recordid) VALUES",
  RTC_HOUSEHOLD:
    "INSERT OR REPLACE INTO rtc_households (id,__kp_Household,_kf_Group,_kf_Location,_kf_Station,_kf_Supplier,Area_Small,Area_Smallest,householdid,z_Farmer_Primary,created_at,type,farmerid,group_id,STP_Weight,number_of_plots_with_coffee,Trees_Producing,Trees,Longitude,Latitude,Children,Childen_gender,Childen_below_18,recordid,status,inspectionId,cafeId) VALUES",
  RTC_STATIONS:
    "INSERT OR REPLACE INTO rtc_station (id,created_at,__kp_Station,_kf_Location,_kf_Supplier,Area_Big,Area_Biggest,Area_Medium,Area_Small,Area_Smallest,Certification,StationID,Name,Prefix,RTC_Owned,synced_price,sync_roles,updated_at,updated) VALUES",
  RTC_TRAINING:
    "INSERT OR REPLACE INTO rtc_training (id,__kp_Course,Duration,ID_COURSE,Name,Name_rw,Name_fr,created_at,status) VALUES",
  DUMMY: "INSERT OR REPLACE INTO dummy(id,hehe) VALUES",
};
