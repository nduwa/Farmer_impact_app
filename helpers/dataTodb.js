import React from "react";
import * as SQLite from "expo-sqlite";
import { SyncQueries } from "../data/SyncQueries";

// Open or create the database
const db = SQLite.openDatabase("DB_farmerim_rtc2.db");

db.transaction((tx) => {
  // groups
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_groups (
        id INTEGER int(11) NOT NULL UNIQUE,
        created_at datetime NOT NULL,
        __kp_Group varchar(255) NOT NULL,
        _kf_Location varchar(255) NOT NULL,
        _kf_Quality varchar(255) NOT NULL,
        _kf_Staff varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        _kf_Type varchar(255) NOT NULL,
        _kf_User_g varchar(255) NOT NULL,
        Area_Big varchar(255) NOT NULL,
        Area_Biggest varchar(255) NOT NULL,
        Area_Medium varchar(255) NOT NULL,
        Coordinates varchar(255) NOT NULL,
        ID_GROUP varchar(255) NOT NULL,
        Name varchar(255) NOT NULL,
        Notes varchar(255) NOT NULL,
        Status_Program varchar(255) NOT NULL,
        Year_Started_Program int(11) NOT NULL,
        sync_farmers int(11) NOT NULL,
        sync_households int(11) NOT NULL,
        last_update_at datetime NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_groups created successfully`),
    (_, error) => console.error(`Error creating rtc_groups table:`, error)
  );

  //   farmers
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_farmers (
        id int(11) NOT NULL UNIQUE,
        __kp_Farmer varchar(255) NOT NULL,
        _kf_Group varchar(255) NOT NULL,
        _kf_Household varchar(255) NOT NULL,
        _kf_Location varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        Year_Birth int(11) NOT NULL,
        Gender varchar(255) NOT NULL,
        farmerid varchar(255) NOT NULL,
        Name varchar(255) NOT NULL,
        National_ID_t varchar(255) NOT NULL,
        Phone varchar(255) NOT NULL,
        Position varchar(255) NOT NULL,
        CAFE_ID varchar(255) NOT NULL,
        SAN_ID varchar(255) NOT NULL,
        UTZ_ID varchar(255) NOT NULL,
        Marital_Status varchar(255) NOT NULL,
        Reading_Skills varchar(255) NOT NULL,
        Math_Skills varchar(255) NOT NULL,
        created_at datetime NOT NULL,
        created_by varchar(255) NOT NULL,
        registered_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        type VARCHAR(255) NOT NULL CHECK (type IN ('new', 'offline')),
        sync_farmers int(11) NOT NULL,
        uploaded int(11) NOT NULL,
        uploaded_at datetime DEFAULT NULL,
        Area_Small varchar(255) NOT NULL,
        Area_Smallest varchar(255) NOT NULL,
        Trees double NOT NULL,
        Trees_Producing double NOT NULL,
        number_of_plots_with_coffee double NOT NULL,
        STP_Weight varchar(255) NOT NULL,
        education_level varchar(255) NOT NULL,
        latitude double NOT NULL,
        longitude double NOT NULL,
        householdid varchar(255) NOT NULL,
        seasonal_goal double NOT NULL,
        recordid int(11) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_farmers created successfully`),
    (_, error) => console.error(`Error creating rtc_farmers table:`, error)
  );

  //households
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_households (
        id int(11) NOT NULL UNIQUE,
        __kp_Household varchar(255) NOT NULL,
        _kf_Group varchar(255) NOT NULL,
        _kf_Location varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        Area_Small varchar(255) NOT NULL,
        Area_Smallest varchar(255) NOT NULL,
        householdid varchar(255) NOT NULL,
        z_Farmer_Primary varchar(255) NOT NULL,
        created_at datetime NOT NULL,
        type VARCHAR(255) NOT NULL CHECK (type IN ('new', 'offline')),
        farmerid varchar(255) NOT NULL,
        group_id varchar(255) NOT NULL,
        STP_Weight double NOT NULL,
        number_of_plots_with_coffee varchar(255) NOT NULL,
        Trees_Producing varchar(255) NOT NULL,
        Trees varchar(255) NOT NULL,
        Longitude varchar(255) NOT NULL,
        Latitude varchar(255) NOT NULL,
        Children varchar(255) NOT NULL,
        Childen_gender varchar(255) NOT NULL,
        Childen_below_18 varchar(255) NOT NULL,
        recordid int(11) NOT NULL,
        status varchar(255) NOT NULL,
        inspectionId varchar(255) NOT NULL,
        cafeId varchar(255) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_households created successfully`),
    (_, error) => console.error(`Error creating rtc_households table:`, error)
  );

  //stations
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_station (
        id int(11) NOT NULL UNIQUE,
        created_at datetime NOT NULL,
        __kp_Station varchar(255) NOT NULL,
        _kf_Location varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        Area_Big varchar(255) NOT NULL,
        Area_Biggest varchar(255) NOT NULL,
        Area_Medium varchar(255) NOT NULL,
        Area_Small varchar(255) NOT NULL,
        Area_Smallest varchar(255) NOT NULL,
        Certification varchar(255) NOT NULL,
        StationID varchar(255) NOT NULL,
        Name varchar(255) NOT NULL,
        Prefix varchar(255) NOT NULL,
        RTC_Owned varchar(255) NOT NULL,
        synced_price int(11) NOT NULL,
        sync_roles int(11) NOT NULL,
        updated_at datetime NOT NULL,
        updated int(11) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_station created successfully`),
    (_, error) => console.error(`Error creating rtc_station table:`, error)
  );

  //training
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_training (
        id int(11) NOT NULL UNIQUE,
        __kp_Course varchar(255) NOT NULL,
        Duration int(11) NOT NULL,
        ID_COURSE varchar(255) NOT NULL,
        Name varchar(255) NOT NULL,
        Name_rw varchar(255) NOT NULL,
        Name_fr varchar(255) NOT NULL,
        created_at datetime NOT NULL,
        status int(11) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_training created successfully`),
    (_, error) => console.error(`Error creating rtc_training table:`, error)
  );
});

const generateBulkValueString = (tableName, totalRows, data) => {
  if (tableName === "stations") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        ${data[i].id},'${data[i].created_at}','${data[i].__kp_Station}','${data[i]._kf_Location}','${data[i]._kf_Supplier}','${data[i].Area_Big}','${data[i].Area_Biggest}','${data[i].Area_Medium}','${data[i].Area_Small}','${data[i].Area_Smallest}','${data[i].Certification}','${data[i].StationID}','${data[i].Name}','${data[i].Prefix}','${data[i].RTC_Owned}',${data[i].synced_price},${data[i].sync_roles},'${data[i].updated_at}','${data[i].updated}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  }
};

export const dataTodb = ({
  tableName,
  setProgress,
  setCurrentJob,
  syncData,
  setIsSyncing,
  setSyncList,
}) => {
  try {
    if (!syncData) {
      console.log("data to db: no data provided", syncData);
      return;
    }
    const limit = 10; // 10 rows per insert to avoid parser stack overflow
    const totalRows = syncData.length;
    const totalPages = Math.ceil(totalRows / limit); // pagination logic

    let insertedRows = 0;

    if (tableName === "groups") {
      db.transaction((tx) => {
        syncData.forEach((data) => {
          tx.executeSql(
            SyncQueries.RTC_GROUPS,
            [
              data.id,
              data.created_at,
              data._kp_Group,
              data._kf_Location,
              data._kf_Quality,
              data._kf_Staff,
              data._kf_Station,
              data._kf_Supplier,
              data._kf_Type,
              data._kf_User_g,
              data.Area_Big,
              data.Area_Biggest,
              data.Area_Medium,
              data.Coordinates,
              data.ID_GROUP,
              data.Name,
              data.Notes,
              data.Status_Program,
              data.Year_Started_Program,
              data.sync_farmers,
              data.sync_households,
              data.last_update_at,
            ],
            () => {
              insertedRows++;
              const progress = (insertedRows / totalRows) * 100;
              setProgress(progress);
            },
            (_, error) => console.error("Error inserting groups: ", error)
          );
        });
      });
    } else if (tableName === "farmers") {
      db.transaction((tx) => {
        syncData.forEach((data) => {
          tx.executeSql(
            SyncQueries.RTC_FARMERS,
            [
              data.id,
              data.__kp_Farmer,
              data._kf_Group,
              data._kf_Household,
              data._kf_Location,
              data._kf_Supplier,
              data._kf_Station,
              data.Year_Birth,
              data.Gender,
              data.farmerid,
              data.Name,
              data.National_ID_t,
              data.Phone,
              data.Position,
              data.CAFE_ID,
              data.SAN_ID,
              data.UTZ_ID,
              data.Marital_Status,
              data.Reading_Skills,
              data.Math_Skills,
              data.created_at,
              data.created_by,
              data.registered_at,
              data.updated_at,
              data.type,
              data.sync_farmers,
              data.uploaded,
              data.uploaded_at,
              data.Area_Small,
              data.Area_Smallest,
              data.Trees,
              data.Trees_Producing,
              data.number_of_plots_with_coffee,
              data.STP_Weight,
              data.education_level,
              data.latitude,
              data.longitude,
              data.householdid,
              data.seasonal_goal,
              data.recordid,
            ],
            () => {
              insertedRows++;
              const progress = (insertedRows / totalRows) * 100;
              setProgress(progress);
            },
            (_, error) => console.error("Error inserting farmers: ", error)
          );
        });
      });
    } else if (tableName === "households") {
      db.transaction((tx) => {
        syncData.forEach((data) => {
          tx.executeSql(
            SyncQueries.RTC_HOUSEHOLD,
            [
              data.id,
              data.__kp_Household,
              data._kf_Group,
              data._kf_Location,
              data._kf_Station,
              data._kf_Supplier,
              data.Area_Small,
              data.Area_Smallest,
              data.householdid,
              data.z_Farmer_Primary,
              data.created_at,
              data.type,
              data.farmerid,
              data.group_id,
              data.STP_Weight,
              data.number_of_plots_with_coffee,
              data.Trees_Producing,
              data.Trees,
              data.Longitude,
              data.Latitude,
              data.Children,
              data.Childen_gender,
              data.Childen_below_18,
              data.recordid,
              data.status,
              data.inspectionId,
              data.cafeId,
            ],
            () => {
              insertedRows++;
              const progress = (insertedRows / totalRows) * 100;
              setProgress(progress);
            },
            (_, error) => console.error("Error inserting households: ", error)
          );
        });
      });
    } else if (tableName === "stations") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(tableName, totalRows, data);

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_STATIONS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100
                  ? `...data batch ${page} completed`
                  : "...completed";

              setProgress(+progress.toFixed(2));
              setCurrentJob(jobString);
              if (progress >= 100) {
                setIsSyncing(false);
                setSyncList((prevSyncList) => {
                  const updatedSyncList = [...prevSyncList];
                  updatedSyncList[0] = {
                    ...updatedSyncList[0],
                    status: true,
                  };
                  // Return the updated array
                  return updatedSyncList;
                });
              }
            },
            (_, error) => {
              console.log("Error inserting stations: ", error);
              return true;
            }
          );
        });
      }
    } else if (tableName === "trainingModules") {
      db.transaction((tx) => {
        syncData.forEach((data) => {
          tx.executeSql(
            SyncQueries.RTC_TRAINING,
            [
              data.id,
              data.__kp_Course,
              data.Duration,
              data.ID_COURSE,
              data.Name,
              data.Name_rw,
              data.Name_fr,
              data.created_at,
              data.status,
            ],
            () => {
              insertedRows++;
              const progress = (insertedRows / totalRows) * 100;
              setProgress(progress);
            },
            (_, error) => console.error("Error inserting training: ", error)
          );
        });
      });
    } else {
      console.log("Invalid table");
    }
  } catch (error) {
    console.error(`Error inserting ${tableName} data: `, error);
  }
};
