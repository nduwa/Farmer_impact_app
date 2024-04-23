import * as SQLite from "expo-sqlite";
import { SyncQueries } from "../data/SyncQueries";
import { DB_NAME } from "@env";

// Open or create the database
const db = SQLite.openDatabase(DB_NAME);

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

  // farmers
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
        updated_at datetime NULL,
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

  //inspection questions
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS inspection_questions (
      id int(11) NOT NULL UNIQUE,
      updated_at datetime NOT NULL,
      __kp_Evaluation varchar(100) NOT NULL,
      evaluation_id varchar(45) NOT NULL,
      evaluation_mode varchar(45) NOT NULL,
      Eng_phrase text NOT NULL,
      Kiny_phrase text NOT NULL,
      award varchar(45) NOT NULL,
      priority int(11) NOT NULL,
      _kf_Course varchar(100) NOT NULL,
      Answer text NOT NULL,
      status int(11) NOT NULL
    )`,
    [],
    () => console.log(`Table inspection_questions created successfully`),
    (_, error) =>
      console.error(`Error creating inspection_questions table:`, error)
  );

  //inspection answers
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS inspection_answers (
      id int(11) NOT NULL UNIQUE,
      created_at datetime NOT NULL,
      Eng_answer text NOT NULL,
      Kiny_answer text NOT NULL,
      question_id varchar(45) NOT NULL,
      priority int(11) NOT NULL,
      status int(11) NOT NULL,
      created_by varchar(100) NOT NULL,
      score int(11) NOT NULL,
      __kp_Option varchar(100) NOT NULL,
      _kf_Evaluation varchar(100) NOT NULL
    )`,
    [],
    () => console.log(`Table inspection_answers created successfully`),
    (_, error) =>
      console.error(`Error creating inspection_answers table:`, error)
  );

  //inspection responses
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS inspection_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at datetime NOT NULL,
      rtc_inspections_id int(11) NOT NULL,
      inspection_answer_id int(11) NOT NULL,
      deleted int(11) NOT NULL,
      __kp_InspectionLog varchar(45) NOT NULL
    )`,
    [],
    () => console.log(`Table inspection_responses created successfully`),
    (_, error) =>
      console.error(`Error creating inspection_responses table:`, error)
  );

  //inspections
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at datetime NOT NULL,
      Score_n varchar(45) NOT NULL,
      _kf_Course varchar(100) NOT NULL,
      _kf_Household varchar(100) NOT NULL,
      __kp_Inspection varchar(100) NOT NULL,
      _kf_Station varchar(100) NOT NULL,
      _kf_Supplier varchar(100) NOT NULL,
      created_by varchar(100) NOT NULL,
      inspection_at datetime NOT NULL,
      uploaded int(11) NOT NULL,
      uploaded_at datetime NOT NULL,
      longitude double NOT NULL,
      latitude double NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_inspections created successfully`),
    (_, error) => console.error(`Error creating rtc_inspections table:`, error)
  );

  //transactions
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_transactions (
      id integer primary key AUTOINCREMENT,
      created_at datetime NOT NULL,
      farmerid varchar(45) NOT NULL,
      farmername varchar(100) NOT NULL,
      coffee_type varchar(45) NOT NULL,
      kilograms double NOT NULL,
      unitprice double NOT NULL,
      lotnumber varchar(45) NOT NULL,
      transaction_date date NOT NULL,
      certification varchar(45) NOT NULL,
      _kf_Staff varchar(100) NOT NULL,
      _kf_Station varchar(100) NOT NULL,
      _kf_Supplier varchar(45) NOT NULL,
      uploaded int(11) NOT NULL,
      uploaded_at datetime NOT NULL DEFAULT '0000-00-00',
      site_day_lot varchar(45) NOT NULL,
      paper_receipt varchar(45) NOT NULL UNIQUE,
      certified int(11) NOT NULL,
      edited int(11) NOT NULL,
      cash_paid double NOT NULL,
      cherry_lot_id varchar(45) NOT NULL,
      parchment_lot_id varchar(45) NOT NULL,
      traceable int(11) NOT NULL DEFAULT 1,
      total_mobile_money_payment double NOT NULL,
      bad_unit_price double NOT NULL,
      bad_kilograms double NOT NULL,
      bad_cherry_lot_id varchar(45) NOT NULL,
      bad_parch_lot_id varchar(45) NOT NULL,
      _kf_Season varchar(45) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_transactions created successfully`),
    (_, error) => console.error(`Error creating rtc_transactions table:`, error)
  );

  //supplier
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_supplier (
      id int(11) NOT NULL,
      _kf_Quality varchar(100) NOT NULL,
      _kf_Type varchar(100) NOT NULL,
      __kp_Supplier varchar(100) NOT NULL,
      _kf_Location varchar(100) NOT NULL,
      _kf_User_g varchar(100) NOT NULL,
      Area_Big varchar(100) NOT NULL,
      Area_Biggest varchar(100) NOT NULL,
      Area_Medium varchar(100) NOT NULL,
      Area_Small varchar(100) NOT NULL,
      Area_Smallest varchar(100) NOT NULL,
      Certification varchar(45) NOT NULL,
      Name varchar(100) NOT NULL,
      Status varchar(45) NOT NULL,
      Ratio_CP double NOT NULL,
      Relationship varchar(45) NOT NULL,
      Report varchar(45) NOT NULL,
      Supplier_ID_t varchar(45) NOT NULL,
      created_at datetime NOT NULL,
      z_recCreateTimestamp datetime NOT NULL,
      z_recModifyTimestamp datetime NOT NULL,
      _kf_User varchar(45) NOT NULL,
      _kf_Season varchar(45) NOT NULL,
      deleted int(11) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_supplier created successfully`),
    (_, error) => console.error(`Error creating rtc_supplier table:`, error)
  );

  //seasons
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS rtc_seasons (
      id int(11) NOT NULL,
      __kp_Season varchar(100) NOT NULL,
      _kf_Location varchar(100) NOT NULL,
      End_d varchar(45) NOT NULL,
      Label varchar(45) NOT NULL,
      Start_d varchar(45) NOT NULL,
      z_recCreateAccountName varchar(45) NOT NULL,
      z_recCreateTimestamp datetime NOT NULL,
      z_recModifyAccountName varchar(45) NOT NULL,
      DefaultState int(11) NOT NULL,
      z_Year int(11) NOT NULL,
      Label_Short varchar(45) NOT NULL,
      z_recModifyTimestamp datetime NOT NULL,
      Location varchar(45) NOT NULL
    )`,
    [],
    () => console.log(`Table rtc_seasons created successfully`),
    (_, error) => console.error(`Error creating rtc_seasons table:`, error)
  );
});

const generateBulkValueString = (
  tableName,
  totalRows,
  data,
  extraVal = null
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
        ${data[i].id},'${data[i].created_at}','${data[i].__kp_Group}','${data[i]._kf_Location}','${data[i]._kf_Quality}','${data[i]._kf_Staff}','${data[i]._kf_Station}','${data[i]._kf_Supplier}','${data[i]._kf_Type}','${data[i]._kf_User_g}','${data[i].Area_Big}','${data[i].Area_Biggest}','${data[i].Area_Medium}','${data[i].Coordinates}','${data[i].ID_GROUP}','${data[i].Name}','${data[i].Notes}','${data[i].Status_Program}','${data[i].Year_Started_Program}','${data[i].sync_farmers}','${data[i].sync_households}','${data[i].last_update_at}')`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "farmers") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      let name = data[i].Name || "";
      const sanitizedName = name.replace(/'/g, ""); // names like Jean D'arc will be Jean D arc for sql syntax reasons
      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Farmer}','${data[i]._kf_Group}','${data[i]._kf_Household}','${data[i]._kf_Location}','${data[i]._kf_Supplier}','${data[i]._kf_Station}','${data[i].Year_Birth}','${data[i].Gender}','${data[i].farmerid}','${sanitizedName}','${data[i].National_ID_t}','${data[i].Phone}','${data[i].Position}','${data[i].CAFE_ID}','${data[i].SAN_ID}','${data[i].UTZ_ID}','${data[i].Marital_Status}','${data[i].Reading_Skills}','${data[i].Math_Skills}','${data[i].created_at}','${data[i].created_by}','${data[i].registered_at}','${data[i].updated_at}','${data[i].type}',${data[i].sync_farmers},${data[i].uploaded},'${data[i].uploaded_at}','${data[i].Area_Small}','${data[i].Area_Smallest}',${data[i].Trees},${data[i].Trees_Producing},${data[i].number_of_plots_with_coffee},'${data[i].STP_Weight}','${data[i].education_level}',${data[i].latitude},${data[i].longitude},'${data[i].householdid}',${data[i].seasonal_goal},${data[i].recordid})`;
      if (i < data.length - 1) bulkValues += ",";
    }

    return bulkValues;
  } else if (tableName === "households") {
    let bulkValues = "";
    for (let i = 0; i < data.length; i++) {
      const z_Farmer_Primary = data[i].z_Farmer_Primary || "";
      const sanitizedValue = z_Farmer_Primary.replace(/'/g, "");
      bulkValues += `(
        ${data[i].id},'${data[i].__kp_Household}','${data[i]._kf_Group}','${data[i]._kf_Location}','${data[i]._kf_Station}','${data[i]._kf_Supplier}','${data[i].Area_Small}','${data[i].Area_Smallest}','${data[i].householdid}','${sanitizedValue}','${data[i].created_at}','${data[i].type}','${data[i].farmerid}','${data[i].group_id}',${data[i].STP_Weight},'${data[i].number_of_plots_with_coffee}','${data[i].Trees_Producing}','${data[i].Trees}','${data[i].Longitude}','${data[i].Latitude}','${data[i].Children}','${data[i].Childen_gender}','${data[i].Childen_below_18}','${data[i].recordid}','${data[i].status}','${data[i].inspectionId}',${data[i].cafeId})`;
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
      bulkValues += `('${data[i].created_at}','${extraVal}','${data[i].inspection_answer_id}','${data[i].deleted}','${data[i].__kp_InspectionLog}')`;
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
            `${SyncQueries.RTC_FARMERS} ${bulkValues}`,
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
            `${SyncQueries.RTC_HOUSEHOLD} ${bulkValues}`,
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
    } else {
      console.log("Invalid table");
    }
  } catch (error) {
    console.error(`Error inserting ${tableName} data: `, error);
  }
};
