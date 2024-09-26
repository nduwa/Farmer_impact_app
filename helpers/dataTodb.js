import * as SQLite from "expo-sqlite";
import { SyncQueries } from "../data/SyncQueries";
import { DB_NAME } from "@env";
import { dbQueries } from "../data/dbQueries";

// Open or create the database
const db = SQLite.openDatabase(DB_NAME);

const generateBulkValueString = (
  tableName,
  totalRows,
  data,
  extraVal = null,
  extraValArr = []
) => {
  if (tableName === "stations") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        ${data[i].id},'${data[i].created_at}','${data[i].__kp_Station}','${data[i]._kf_Location}','${data[i]._kf_Supplier}','${data[i].Area_Big}','${data[i].Area_Biggest}','${data[i].Area_Medium}','${data[i].Area_Small}','${data[i].Area_Smallest}','${data[i].Certification}','${data[i].StationID}','${data[i].Name}','${data[i].Prefix}','${data[i].RTC_Owned}',${data[i].synced_price},${data[i].sync_roles},'${data[i].updated_at}','${data[i].updated}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "groups") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        ${data[i].id},'${data[i].created_at}','${data[i].__kp_Group}','${
        data[i]._kf_Location
      }','${data[i]._kf_Quality}','${data[i]._kf_Staff}','${
        data[i]._kf_Station
      }','${data[i]._kf_Supplier}','${data[i]._kf_Type}','${
        data[i]._kf_User_g
      }','${data[i].Area_Big}','${data[i].Area_Biggest}','${
        data[i].Area_Medium
      }','${data[i].Coordinates}','${data[i].ID_GROUP}','${data[i].Name}','${
        data[i].Notes
      }','${data[i].Status_Program}','${data[i].Year_Started_Program}','${
        data[i].sync_farmers
      }','${data[i].sync_households}','${data[i].last_update_at}','${
        data[i].active || 0
      }')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "farmers") {
    let bulkValues = "";

    for (let i = 0; i < data.length; i++) {
      let name = data[i].Name || "";
      let math_skills = data[i].Math_Skills || "";
      const sanitizedName = name.replace(/'/g, ""); // names like Jean D'arc will be Jean D arc for sql syntax reasons
      const sanitizedMathSkillStr = math_skills.replace(/['’]/g, "");

      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Farmer}','${data[i]._kf_Group}','${data[i]._kf_Household}','${data[i]._kf_Location}','${data[i]._kf_Supplier}','${data[i]._kf_Station}','${data[i].Year_Birth}','${data[i].Gender}','${data[i].farmerid}','${sanitizedName}','${data[i].National_ID_t}','${data[i].Phone}','${data[i].Position}','${data[i].CAFE_ID}','${data[i].SAN_ID}','${data[i].UTZ_ID}','${data[i].Marital_Status}','${data[i].Reading_Skills}','${sanitizedMathSkillStr}','${data[i].created_at}','${data[i].created_by}','${data[i].registered_at}','${data[i].updated_at}','${data[i].type}',${data[i].sync_farmers},${data[i].uploaded},'${data[i].uploaded_at}','${data[i].Area_Small}','${data[i].Area_Smallest}',${data[i].Trees},${data[i].Trees_Producing},${data[i].number_of_plots_with_coffee},'${data[i].STP_Weight}','${data[i].education_level}',${data[i].latitude},${data[i].longitude},'${data[i].householdid}','${data[i].seasonal_goal}',${data[i].recordid},0,"","0000-00-00 00:00:0","1")`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "households") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      const z_Farmer_Primary = data[i].z_Farmer_Primary || "";
      const sanitizedValue = z_Farmer_Primary.replace(/'/g, "");
      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Household}','${data[i]._kf_Group}','${
        data[i]._kf_Location
      }','${data[i]._kf_Station}','${data[i]._kf_Supplier}','${
        data[i].Area_Small
      }','${data[i].Area_Smallest}','${
        data[i].householdid
      }','${sanitizedValue}','${data[i].created_at}','${data[i].type}','${
        data[i].farmerid
      }','${data[i].group_id}','${data[i].STP_Weight}','${
        data[i].number_of_plots_with_coffee
      }','${data[i].Trees_Producing}','${data[i].Trees}','${
        data[i].Longitude
      }','${data[i].Latitude}','${data[i].Children}','${
        data[i].Childen_gender
      }','${data[i].Childen_below_18}','${data[i].recordid}','${
        data[i].status
      }','${data[i].inspectionId}','${data[i].cafeId}','${
        data[i].InspectionStatus
      }',${data[i].sync || 0})`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "trainingModules") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      const Name_rw = data[i].Name_rw || "";
      const sanitizedValue = Name_rw.replace(/'/g, "");

      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Course}','${data[i].Duration}','${data[i].ID_COURSE}','${data[i].Name}','${sanitizedValue}','${data[i].Name_fr}','${data[i].created_at}','${data[i].status}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "inspectionQuestions") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      let kinyStr = data[i].Kiny_phrase || "";
      let engStr = data[i].Eng_phrase || "";

      const sanitizedKinyStr = kinyStr.replace(/'/g, "");
      const sanitizedEngStr = engStr.replace(/'/g, "");

      bulkValues += `(
        ${data[i].id},'${data[i].updated_at}','${data[i].__kp_Evaluation}','${data[i].evaluation_id}','${data[i].evaluation_mode}','${sanitizedEngStr}','${sanitizedKinyStr}','${data[i].award}','${data[i].priority}','${data[i]._kf_Course}','${data[i].Answer}','${data[i].status}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "inspectionAnswers") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      let str = data[i].Kiny_answer || "";
      const sanitizedStr = str.replace(/'/g, "");

      bulkValues += `(
        ${data[i].id},'${data[i].created_at}','${data[i].Eng_answer}','${sanitizedStr}','${data[i].question_id}','${data[i].priority}','${data[i].status}','${data[i].created_by}','${data[i].score}','${data[i].__kp_Option}','${data[i]._kf_Evaluation}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "inspections") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        '${data[i].created_at}','${data[i].Score_n}','${data[i]._kf_Course}','${extraVal}','${data[i].__kp_Inspection}','${data[i]._kf_Station}','${data[i]._kf_Supplier}','${data[i].created_by}','${data[i].inspection_at}','${data[i].uploaded}','${data[i].uploaded_at}','${data[i].longitude}','${data[i].latitude}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "inspectionResponses") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${extraVal}','${data[i].inspection_answer_id}','${data[i].answer_explanaition}','${data[i].compliance_date}','${data[i].deleted}','${data[i].__kp_InspectionLog}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "suppliers") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        ${data[i].id},'${data[i]._kf_Quality}','${data[i]._kf_Type}','${data[i].__kp_Supplier}','${data[i]._kf_Location}','${data[i]._kf_User_g}','${data[i].Area_Big}','${data[i].Area_Biggest}','${data[i].Area_Medium}','${data[i].Area_Small}','${data[i].Area_Smallest}','${data[i].Certification}','${data[i].Name}','${data[i].Status}','${data[i].Ratio_CP}','${data[i].Relationship}','${data[i].Report}','${data[i].Supplier_ID_t}','${data[i].created_at}','${data[i].z_recCreateTimestamp}','${data[i].z_recModifyTimestamp}','${data[i]._kf_User}','${data[i]._kf_Season}','${data[i].deleted}')`;
      if (i < data.length - 1) bulkValues += ",";
    }
    return bulkValues;
  } else if (tableName === "transactions") {
    let bulkValues = "";

    for (let i = 0; i < data.length; i++) {
      const isoDate = data[i].transaction_date;
      const formattedDateString = isoDate
        .replace("T", " ")
        .replace(/\.\d{3}Z$/, "");

      bulkValues += `('${formattedDateString}','${data[i].farmerid}','${data[i].farmername}','${data[i].coffee_type}','${data[i].kilograms}','${data[i].unitprice}','${data[i].lotnumber}','${formattedDateString}','${data[i].certification}','${data[i]._kf_Staff}','${data[i]._kf_Station}','${data[i]._kf_Supplier}','${data[i].uploaded}','${data[i].uploaded_at}','${data[i].site_day_lot}','${data[i].paper_receipt}','${data[i].certified}','${data[i].edited}','${data[i].cash_paid}','${data[i].cherry_lot_id}','${data[i].parchment_lot_id}','${data[i].traceable}','${data[i].total_mobile_money_payment}','${data[i].bad_unit_price}','${data[i].bad_kilograms}','${data[i].bad_cherry_lot_id}','${data[i].bad_parch_lot_id}','${data[i]._kf_Season}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "seasons") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Season}','${data[i]._kf_Location}','${data[i].End_d}','${data[i].Label}','${data[i].Start_d}','${data[i].z_recCreateAccountName}','${data[i].z_recCreateTimestamp}','${data[i].z_recModifyAccountName}','${data[i].Default}','${data[i].z_Year}','${data[i].Label_Short}','${data[i].z_recModifyTimestamp}','${data[i].Location}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "attandanceSheets") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${data[i].uuid}','${data[i].filepath}','${data[i].status}','${data[i].uploaded_at}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "trainingAttendance") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${data[i].training_course_id}','${data[i].__kf_farmer}','${data[i].__kf_group}','${data[i].status}','${data[i].__kf_attendance}','${data[i].username}','${data[i].password}','${data[i].uuid}','${data[i].uploaded_at}','${data[i]._kf_training}','${data[i].lo}','${data[i].la}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "mobileModules") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].id}','${data[i].created_at}','${data[i].module_name}','${data[i].platform}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "assignedModules") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].id}','${data[i].created_at}','${data[i].moduleid}','${data[i].userid}','${data[i].view_record}','${data[i].add_record}','${data[i].delete_record}','${data[i].edit_record}','${data[i].platform}','1')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "groupAssign") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${data[i].farmerid}','${data[i].farmer_name}','${data[i]._kf_farmer}','${data[i].kf_group_old}','${data[i].group_name_old}','${data[i].group_id_old}','${data[i].kf_group_new}','${data[i].group_name_new}','${data[i].group_id_new}','${extraValArr[0]}','${extraValArr[1]}','${extraValArr[2]}','${data[i]._kf_Supplier}','${data[i]._kf_Household}','${data[i].assigned_by}','${data[i].status}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }
    /* extraValArr[0] -> kf station 
       extraValArr[1] -> station name
       extraValArr[2] -> station id
    */
    return bulkValues;
  } else if (tableName === "groupActive") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${data[i].__kp_Group}','${data[i]._kf_Station}','${data[i].active}','${extraVal}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "fieldFarmers") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${extraValArr[0]}','${data[i]._kf_Staff}','${data[i]._kf_User}','${data[i].user_code}','${extraValArr[1]}','${extraValArr[2]}','${data[i].farmer_name}','${data[i].Gender}','${data[i].Year_Birth}','${data[i].phone}','${data[i].National_ID}','${data[i].Marital_Status}','${extraValArr[3]}','${data[i].village}','${data[i].cell}','${data[i].sector}','${data[i].Trees}','${data[i].Trees_Producing}','${data[i].number_of_plots}','${data[i].Skills}','${data[i].Math_Skills}','${data[i].education_level}','${data[i].created_at}','${data[i].full_name}','${data[i].farm_GPS}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    /* extraValArr[0] -> kf supplier 
       extraValArr[1] -> kf station
       extraValArr[2] -> station name
       extraValArr[3] -> group id
    */

    return bulkValues;
  } else if (tableName === "weeklyReports") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i]._kf_Staff}','${data[i]._kf_User}','${extraValArr[0]}','${extraValArr[1]}','${extraValArr[2]}','${data[i].full_name}','${data[i].user_code}','${data[i].trained_number}','${data[i].men_attended}','${data[i].women_attended}','${data[i].planned_groups}','${data[i].farm_inspected}','${data[i].planned_inspected}','${data[i].comments}','${data[i].createdAt}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    /* extraValArr[0] -> _kf_Station
       extraValArr[1] -> _kf_Supplier
       extraValArr[2] -> CW_Name
    */

    return bulkValues;
  } else if (tableName === "householdTrees") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].full_name}','${data[i]._kf_Staff}','${data[i]._kf_User}','${extraValArr[0]}','${extraValArr[1]}','${extraValArr[2]}','${data[i].Group_ID}','${data[i].farmer_ID}','${data[i].farmer_name}','${data[i].national_ID}','${data[i].received_seedling}','${data[i].survived_seedling}','${data[i].planted_year}','${data[i].old_trees}','${data[i].old_trees_planted_year}','${data[i].coffee_plot}','${data[i].nitrogen}','${data[i].natural_shade}','${data[i].shade_trees}','${data[i].created_at}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    /* extraValArr[0] -> _kf_Station
       extraValArr[1] -> _kf_Supplier
       extraValArr[2] -> CW_Name
    */

    return bulkValues;
  } else if (tableName === "farmDetails") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${extraValArr[0]}','${data[i]._kf_Staff}','${data[i]._kf_User}','${data[i].user_code}','${extraValArr[1]}','${extraValArr[2]}','${data[i].farmer_name}','${data[i].farmer_ID}','${data[i].national_ID}','${data[i].latitude}','${data[i].longitude}','${data[i].status}','${data[i].uploaded_at}','${data[i].cropNameId}','${data[i].farm_unit_area}','${data[i].soil_slope}','${data[i].uuid}','${data[i].created_at}','${data[i].created_by}','${data[i].full_name}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    /* extraValArr[0] -> _kf_Supplier
       extraValArr[1] -> _kf_Station
       extraValArr[2] -> CW_Name
    */

    return bulkValues;
  } else if (tableName === "farmUpdates") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].__kp_Farmer}','${data[i]._kf_Group}','${data[i]._kf_Staff}','${data[i].user_code}','${data[i]._kf_Station}','${extraValArr[0]}','${data[i].Year_Birth}','${data[i].Gender}','${data[i].farmer_ID}','${data[i].farmer_name}','${data[i].national_ID}','${data[i].Phone}','${data[i].Position}','${data[i].Marital_Status}','${data[i].Reading_Skills}','${data[i].Math_Skills}','${data[i].education_level}','${data[i].cell}','${data[i].village}','${data[i].Trees}','${data[i].Trees_Producing}','${data[i].number_of_plots_with_coffee}','${data[i].created_at}','${data[i].full_name}','${data[i].status}','0')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    /* 
      extraValArr[0] -> CW_Name
    */

    return bulkValues;
  } else if (tableName === "censusSurvey") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].created_at}','${data[i].farmer_ID}','${data[i].farmer_name}','${data[i].phone}','${data[i].group_id}','${data[i].filepath}',0)`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "session") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      bulkValues += `('${data[i].__kp_user}',${data[i].synced || 0})`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  }
};

const cleanInspectionQns = (data) => {
  let passedData = data.filter(
    (item) => item.Kiny_phrase.length > 0 && item.Eng_phrase.length > 0
  );

  return passedData;
};

const cleanInspectionCourses = (data) => {
  let passedData = data.filter((item) => item.__kp_Course.length > 0);

  return passedData;
};

export const dataTodb = ({
  tableName,
  setProgress = null,
  setCurrentJob = null,
  syncData,
  setIsSyncing = null,
  setSyncList = null,
  setInsertId = null,
  extraVal = null,
  extraValArr = [],
}) => {
  try {
    if (!syncData) {
      console.log("data to db: no data provided", syncData);
      return;
    }

    if (tableName === "inspectionQuestions") {
      syncData = cleanInspectionQns(syncData);
    }

    if (tableName === "trainingModules") {
      syncData = cleanInspectionCourses(syncData);
    }

    const limit = 10; // 10 rows per insert to avoid parser stack overflow
    const totalRows = syncData.length;
    const totalPages = Math.ceil(totalRows / limit); // pagination logic

    let insertedRows = 0;

    if (tableName === "groups") {
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
            `${SyncQueries.RTC_GROUPS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));

              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[1] = {
                      ...updatedSyncList[1],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting groups: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "farmers") {
      if (extraValArr.length < 1 && tableName === "farmers_new") {
        setCurrentJob("some IDs are not provided");
        return;
      }

      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_FARMERS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;

              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (progress >= 100 && !setIsSyncing)
                setCurrentJob("Farmer details saved");

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[2] = {
                      ...updatedSyncList[2],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting farmers: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "households") {
      if (extraValArr.length < 1 && tableName === "households_new") {
        setCurrentJob("some IDs are not provided");
        return;
      }
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_HOUSEHOLD} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (progress >= 100 && !setIsSyncing)
                setCurrentJob("Household details saved");

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[3] = {
                      ...updatedSyncList[3],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting households: ", error);
              return;
            }
          );
        });
      }
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
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
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
              }
            },
            (_, error) => {
              console.log("Error inserting stations: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "trainingModules") {
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
            `${SyncQueries.RTC_TRAINING} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[5] = {
                      ...updatedSyncList[5],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting training: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "inspectionQuestions") {
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
            `${SyncQueries.RTC_INSPECTIONQNS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[6] = {
                      ...updatedSyncList[6],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting inspection questions: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "inspectionAnswers") {
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
            `${SyncQueries.RTC_INSPECTION_ANS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[7] = {
                      ...updatedSyncList[7],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.error("Error inserting inspection answers: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "inspectionResponses") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          extraVal
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_INSPECTION_RESP} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (progress >= 100) setCurrentJob("Responses saved");
            },
            (_, error) => {
              console.error("Error inserting inspection responses: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "inspections") {
      if (!extraVal) {
        setCurrentJob("Household ID not provided");
        return;
      }
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          extraVal
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_INSPECTIONS} ${bulkValues}`,
            [],
            (_, result) => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (progress >= 100) {
                setCurrentJob("Inspection submitted");
                setInsertId && setInsertId(result.insertId);
              }
            },

            (_, error) => {
              console.error("Error inserting inspections: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "suppliers") {
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
            `${SyncQueries.RTC_SUPPLIER} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[9] = {
                      ...updatedSyncList[9],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.log("Error inserting suppliers: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "transactions") {
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

        db.transactionAsync((tx) => {
          tx.executeSqlAsync(
            `${SyncQueries.RTC_TRANSACTIONS} ${bulkValues}`,
            []
          )
            .then((result) => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100 ? `Saving Transaction...` : "Transaction saved!";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("Transaction saved!");
            })
            .catch((error) => {
              console.log("Error inserting transactions: ", error);
              if (setCurrentJob) setCurrentJob("failed");
              return;
            });
        });
      }
    } else if (tableName === "seasons") {
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
            `${SyncQueries.RTC_SEASONS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;
              let jobString =
                progress < 100 ? `data batch ${page} completed` : "completed";

              if (setProgress) setProgress(+progress.toFixed(2));
              if (setCurrentJob) setCurrentJob(jobString);

              if (setIsSyncing && setSyncList) {
                if (progress >= 100) {
                  setIsSyncing(false);
                  setSyncList((prevSyncList) => {
                    const updatedSyncList = [...prevSyncList];
                    updatedSyncList[10] = {
                      ...updatedSyncList[10],
                      status: true,
                    };
                    // Return the updated array
                    return updatedSyncList;
                  });
                }
              }
            },
            (_, error) => {
              console.log("Error inserting seasons: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "attandanceSheets") {
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
            `${SyncQueries.RTC_ATTENDANCE_SHEETS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (progress >= 100) setCurrentJob("Attendance sheet saved");
            },
            (_, error) => {
              console.log("Error inserting Attendance sheet: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "trainingAttendance") {
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
            `${SyncQueries.RTC_TRAINING_ATTENDANCE} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (progress >= 100) setCurrentJob("Training details saved");
            },
            (_, error) => {
              console.log("Error inserting Training details: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "mobileModules") {
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
            `${SyncQueries.RTC_MOBILE_MODULES} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (setProgress) setProgress(+progress.toFixed(2));
              if (progress >= 100 && setCurrentJob)
                setCurrentJob("modules inserted");
            },
            (_, error) => {
              console.error("Error inserting modules: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "assignedModules") {
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
            `${SyncQueries.RTC_ASSIGNED_MODULES} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              if (setProgress) setProgress(+progress.toFixed(2));
              if (progress >= 100 && setCurrentJob)
                setCurrentJob("modules assigned");
            },
            (_, error) => {
              console.error("Error assigning modules: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "groupAssign") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${dbQueries.Q_TMP_GRP_ASSIGN} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Group assignments Saving...`
                  : "Group assignments saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("Group assignments saved");
            },
            (_, error) => {
              setCurrentJob("Error assigning groups");
              console.error("Error assigning groups: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "groupActive") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          extraVal
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${dbQueries.Q_TMP_GRP_ACTVT} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Groups changes Saving...`
                  : "Groups changes saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("Groups changes saved");
            },
            (_, error) => {
              setCurrentJob("Error saving groups changes");
              console.error("Error saving groups changes: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "fieldFarmers") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_FIELD_FARMERS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Saving Farmer information...`
                  : "Farmer information saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("Farmer information saved");
            },
            (_, error) => {
              setCurrentJob("Error saving Farmer information");
              console.error("Error saving Farmer information: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "weeklyReports") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_WEEKLY_REPORTS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100 ? `Saving report...` : "Report saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("Report saved");
            },
            (_, error) => {
              setCurrentJob("Error saving Report");
              console.error("Error saving Report: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "householdTrees") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${SyncQueries.RTC_HOUSEHOLD_TREES} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Saving tree details...`
                  : "tree details saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("tree details saved");
            },
            (_, error) => {
              setCurrentJob("Error saving tree details");
              console.error("Error saving tree details: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "farmDetails") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${dbQueries.Q_TMP_FARM_DETAILS} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Saving farm details...`
                  : "farm details saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("farm details saved");
            },
            (_, error) => {
              setCurrentJob("Error saving farm details");
              console.error("Error saving farm details: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "farmUpdates") {
      for (let i = 0; i < totalPages; i++) {
        let page = i + 1;
        let start = (page - 1) * limit; // the starting index
        let end = start + limit; // the last index
        let data = syncData.slice(
          start,
          end
        ); /* on the last page when the rows aren't 10, it won't throw array index errors because of how slice() handles last index parameter */
        let activeRows = data.length;

        let bulkValues = generateBulkValueString(
          tableName,
          totalRows,
          data,
          null,
          extraValArr
        );

        db.transaction((tx) => {
          tx.executeSql(
            `${dbQueries.Q_TMP_FARMER_UPDATES} ${bulkValues}`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Saving farmer details...`
                  : "farmer details saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("farmer details saved");
            },
            (_, error) => {
              setCurrentJob("Error saving farmer details");
              console.error("Error saving farmer details: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "censusSurvey") {
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
            `${dbQueries.Q_TMP_CENSUS_SURVEY} ${bulkValues};`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100 ? `Saving survey data...` : "survey data saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("survey saved");
            },
            (_, error) => {
              setCurrentJob("Error saving survey");
              console.error("Error saving survey: ", error);
              return;
            }
          );
        });
      }
    } else if (tableName === "session") {
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
          console.log(`${dbQueries.Q_TMP_SESSIONS} ${bulkValues};`);
          tx.executeSql(
            `${dbQueries.Q_TMP_SESSIONS} ${bulkValues};`,
            [],
            () => {
              insertedRows += activeRows;
              const progress = (insertedRows / totalRows) * 100;

              let jobString =
                progress < 100
                  ? `Saving session data...`
                  : "session data saved";

              if (setCurrentJob) setCurrentJob(jobString);

              console.log("session saved");
            },
            (_, error) => {
              setCurrentJob("Error saving session");
              console.error("Error saving session: ", error);
              return;
            }
          );
        });
      }
    } else {
      console.log("Invalid table");
    }
  } catch (error) {
    console.error(`Error inserting ${tableName} data: `, error);
  }
};
