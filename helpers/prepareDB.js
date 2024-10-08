import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

// Open or create the database
const db = SQLite.openDatabase(DB_NAME);

export const prepareTables = async () => {
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
        __kp_Farmer varchar(255) NOT NULL UNIQUE,
        _kf_Group varchar(255) NOT NULL,
        _kf_Household varchar(255) NOT NULL,
        _kf_Location varchar(255),
        _kf_Supplier varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        Year_Birth int(11) NOT NULL,
        Gender varchar(255) NOT NULL,
        farmerid varchar(255),
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
        type VARCHAR(255) NOT NULL CHECK (type IN ('new','updated','offline','online','deleted')),
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
        recordid int(11) NOT NULL,
        deleted int(11) NOT NULL,
        deleted_by varchar(255) NOT NULL,
        deleted_at varchar(255) NOT NULL,
        sync int(11) NOT NULL
    )`,
      [],
      () => console.log(`Table rtc_farmers created successfully`),
      (_, error) => console.error(`Error creating rtc_farmers table:`, error)
    );

    //households
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_households (
        id int(11) NOT NULL UNIQUE,
        __kp_Household varchar(255) NOT NULL UNIQUE,
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
        cafeId varchar(255) NOT NULL,
        InspectionStatus varchar(255) NOT NULL,
        sync int(11) NOT NULL
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
      (_, error) =>
        console.error(`Error creating rtc_inspections table:`, error)
    );

    //training attendance
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_training_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at datetime NOT NULL,
      training_course_id varchar(100) NOT NULL,
      __kf_farmer varchar(100) NOT NULL,
      __kf_group varchar(100) NOT NULL,
      status int(11) NOT NULL,
      __kf_attendance varchar(100) NOT NULL,
      username varchar(100) NOT NULL,
      password varchar(100) NOT NULL,
      uuid varchar(100) NOT NULL,
      uploaded_at datetime NOT NULL DEFAULT '0000-00-00',
      _kf_training varchar(100) NOT NULL,
      lo double NOT NULL,
      la double NOT NULL
    )`,
      [],
      () => console.log(`Table rtc_training_attendance created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_training_attendance table:`, error)
    );

    //attendance sheets
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_attendance_sheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at datetime NOT NULL,
      uuid varchar(100) NOT NULL,
      filepath varchar(100) NOT NULL,
      status int(11) NOT NULL,
      uploaded_at datetime NOT NULL DEFAULT '0000-00-00'
    )`,
      [],
      () => console.log(`Table rtc_attendance_sheets created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_attendance_sheets table:`, error)
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
      (_, error) =>
        console.error(`Error creating rtc_transactions table:`, error)
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

    //access modules
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_mobile_app_modules (
     id integer primary key,
     created_at datetime NOT NULL,
     module_name varchar(100) NOT NULL,
     platform varchar(45) NOT NULL
    )`,
      [],
      () => console.log(`Table rtc_mobile_app_modules created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_mobile_app_modules table:`, error)
    );

    //assigned modules
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_mobile_app_access_control (
      id integer primary key,
      created_at datetime NOT NULL,
      moduleid int(11) NOT NULL,
      userid int(11) NOT NULL,
      view_record int(11) NOT NULL,
      add_record int(11) NOT NULL,
      delete_record int(11) NOT NULL,
      edit_record int(11) NOT NULL,
      platform varchar(45) NOT NULL,
      active integer NOT NULL
    )`,
      [],
      () =>
        console.log(`Table rtc_mobile_app_access_control created successfully`),
      (_, error) =>
        console.error(
          `Error creating rtc_mobile_app_access_control table:`,
          error
        )
    );

    //temp assign groups
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_farmer_group_assignment (
      id integer primary key AUTOINCREMENT,
      created_at datetime NOT NULL,
      _kf_farmer varchar(255) NOT NULL,
      farmerid varchar(255) NOT NULL,
      farmer_name varchar(255) NOT NULL,
      kf_group_old varchar(255) NOT NULL,
      group_name_old varchar(255) NOT NULL,
      group_id_old varchar(255) NOT NULL,
      kf_group_new varchar(255) NOT NULL,
      group_name_new varchar(255) NOT NULL,
      group_id_new varchar(255) NOT NULL,
      _kf_station varchar(255) NOT NULL,
      station_name varchar(255) NOT NULL,
      station_id varchar(255) NOT NULL,
      _kf_supplier varchar(255) NOT NULL,
      _kf_Household varchar(255) NOT NULL,
      assigned_by varchar(45) NOT NULL,
      status integer NOT NULL,
      uploaded integer NOT NULL
    )`,
      [],
      () =>
        console.log(`Table tmp_farmer_group_assignment created successfully`),
      (_, error) =>
        console.error(
          `Error creating tmp_farmer_group_assignment table:`,
          error
        )
    );

    //temp activate groups
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_group_activate (
      id integer primary key AUTOINCREMENT,
      created_at datetime NOT NULL,
      _kf_Group varchar(255) NOT NULL,
      _kf_station varchar(255) NOT NULL,
      active integer NOT NULL,
      username varchar(45) NOT NULL,
      uploaded integer NOT NULL
    )`,
      [],
      () => console.log(`Table tmp_group_activate created successfully`),
      (_, error) =>
        console.error(`Error creating tmp_group_activate table:`, error)
    );

    // field farmers
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_field_farmers (
       id integer primary key AUTOINCREMENT,
       _kf_Supplier varchar(255) NOT NULL,
       _kf_Staff varchar(255) NOT NULL,
       _kf_User varchar(255) NOT NULL,
       user_code varchar(255) NOT NULL,
       _kf_Station varchar(255) NOT NULL,
       CW_Name varchar(255) NOT NULL,
       farmer_name varchar(255) NOT NULL,
       Gender varchar(255) NOT NULL,
       Year_Birth int NOT NULL,
       phone varchar(255) NOT NULL,
       National_ID varchar(255) NOT NULL,
       Marital_Status varchar(255) NOT NULL,
       Group_ID varchar(255) NOT NULL,
       village varchar(255) NOT NULL,
       cell varchar(255) NOT NULL,
       sector varchar(255) NOT NULL,
       Trees double NOT NULL,
       Trees_Producing double NOT NULL,
       number_of_plots double NOT NULL,
       Skills varchar(255) NOT NULL,
       Math_Skills varchar(255) NOT NULL,
       education_level varchar(255) NOT NULL,
       created_at datetime NOT NULL,
       full_name varchar(255) NOT NULL,
       farm_GPS varchar(255) NOT NULL,
       uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table rtc_field_farmers created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_field_farmers table:`, error)
    );

    // field reports
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_field_weekly_report (
       id integer primary key AUTOINCREMENT,
       _kf_Staff varchar(222) NOT NULL,
       _kf_User varchar(222) NOT NULL,
       _kf_Station varchar(222) NOT NULL,
       _kf_Supplier varchar(255) NOT NULL,
       CW_Name varchar(255) NOT NULL,
       full_name varchar(255) NOT NULL,
       user_code varchar(255) NOT NULL,
       trained_number varchar(255) NOT NULL,
       men_attended varchar(255) NOT NULL,
       women_attended varchar(255) NOT NULL,
       planned_groups varchar(255) NOT NULL,
       farm_inspected varchar(255) NOT NULL,
       planned_inspected varchar(255) NOT NULL,
       comments varchar(2505) NOT NULL,
       createdAt datetime NOT NULL,
       uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table rtc_field_weekly_report created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_field_weekly_report table:`, error)
    );

    // household trees
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS rtc_household_trees (
        id integer primary key AUTOINCREMENT,
        full_name varchar(222) NOT NULL,
        _kf_Staff varchar(222) NOT NULL,
        _kf_User varchar(222) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        CW_Name varchar(255) NOT NULL,
        Group_ID varchar(255) NOT NULL,
        farmer_ID varchar(255) NOT NULL,
        farmer_name varchar(255) NOT NULL,
        national_ID varchar(255) NOT NULL,
        received_seedling varchar(255) NOT NULL,
        survived_seedling varchar(255) NOT NULL,
        planted_year varchar(255) NOT NULL,
        old_trees varchar(255) NOT NULL,
        old_trees_planted_year varchar(255) NOT NULL,
        coffee_plot varchar(255) NOT NULL,
        nitrogen varchar(255) NOT NULL,
        natural_shade varchar(255) NOT NULL,
        shade_trees varchar(255) NOT NULL,
        created_at datetime NOT NULL,
        uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table rtc_household_trees created successfully`),
      (_, error) =>
        console.error(`Error creating rtc_household_trees table:`, error)
    );

    // farm details
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_farm_details (
        id integer primary key AUTOINCREMENT,
        _kf_Staff varchar(222) NOT NULL,
        _kf_User varchar(222) NOT NULL,
        user_code varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        _kf_Supplier varchar(255) NOT NULL,
        CW_Name varchar(255) NOT NULL,
        farmer_ID varchar(255) NOT NULL,
        farmer_name varchar(255) NOT NULL,
        national_ID varchar(255) NOT NULL,
        longitude double NOT NULL,
        latitude double NOT NULL,
        status int(11) NOT NULL,
        uploaded_at datetime NOT NULL DEFAULT '0000-00-00',
        cropNameId int(11) NOT NULL,
        farm_unit_area double NOT NULL,
        soil_slope double NOT NULL,
        uuid varchar(45) NOT NULL,
        created_at datetime NOT NULL,
        created_by varchar(45) NOT NULL,
        full_name varchar(45) NOT NULL,
        uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table tmp_farm_details created successfully`),
      (_, error) =>
        console.error(`Error creating tmp_farm_details table:`, error)
    );

    // farmer updates
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_farmer_updates (
        id integer primary key AUTOINCREMENT,
        __kp_Farmer varchar(255) NOT NULL,
        _kf_Group varchar(255) NOT NULL,
        _kf_Staff varchar(222) NOT NULL,
        user_code varchar(255) NOT NULL,
        _kf_Station varchar(255) NOT NULL,
        Year_Birth int(11) NOT NULL,
        Gender varchar(255) NOT NULL,
        CW_Name varchar(255) NOT NULL,
        farmer_ID varchar(255) NOT NULL,
        farmer_name varchar(255) NOT NULL,
        national_ID varchar(255) NOT NULL,
        Phone varchar(255) NOT NULL,
        Position varchar(255) NOT NULL,
        Marital_Status varchar(255) NOT NULL,
        Reading_Skills varchar(255) NOT NULL,
        Math_Skills varchar(255) NOT NULL,
        education_level varchar(255) NOT NULL,
        cell varchar(255) NOT NULL,
        village varchar(255) NOT NULL,
        Trees double NOT NULL,
        Trees_Producing double NOT NULL,
        number_of_plots_with_coffee double NOT NULL,
        status varchar(45) NOT NULL,
        created_at datetime NOT NULL,
        full_name varchar(45) NOT NULL,
        uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table tmp_farmer_updates created successfully`),
      (_, error) =>
        console.error(`Error creating tmp_farmer_updates table:`, error)
    );

    //census survey
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_census_survey (
      id integer primary key AUTOINCREMENT,
      created_at datetime NOT NULL,
      farmer_ID varchar(255) NOT NULL,
      farmer_name varchar(255) NOT NULL,
      phone varchar(255) NOT NULL,
      group_id varchar(255) NOT NULL,
      filepath varchar(255) NOT NULL,
      uploaded integer NOT NULL
    )`,
      [],
      () => console.log(`Table tmp_census_survey created successfully`),
      (_, error) =>
        console.error(`Error creating tmp_census_survey table:`, error)
    );

    //wetmill audit
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_wetmill_audit (
      id integer primary key AUTOINCREMENT,
      created_at datetime NOT NULL,
      filepath varchar(255) NOT NULL,
      station_name varchar(255) NOT NULL,
      user_name varchar(255) NOT NULL,
      uploaded integer NOT NULL
      )`,
      [],
      () => console.log(`Table tmp_wetmill_audit created successfully`),
      (_, error) =>
        console.error(`Error creating tmp_wetmill_audit table:`, error)
    );

    //user sessions
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tmp_sessions (
      __kp_user varchar(255) UNIQUE primary key,
      synced integer NOT NULL
    )`,
      [],
      () => console.log(`Table tmp_sessions created successfully`),
      (_, error) => console.error(`Error creating tmp_sessions table:`, error)
    );
  });
};

export const addColumnIfNotExists = ({
  tableName,
  columnName,
  columnType,
  defaultValue,
}) => {
  db.transaction((tx) => {
    // Query to check if the column exists
    tx.executeSql(
      `PRAGMA table_info(${tableName});`,
      [],
      (_, { rows }) => {
        const columnExists = rows._array.some((row) => row.name === columnName);
        if (!columnExists) {
          // Column does not exist, add the column
          tx.executeSql(
            `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType} DEFAULT '${defaultValue}';`,
            [],
            () => {
              console.log(`Column ${columnName} added to ${tableName} table.`);
            },
            (_, error) => {
              console.error("Error adding column:", error);
              return false;
            }
          );
        } else {
          console.log(
            `Column ${columnName} already exists in ${tableName} table.`
          );
        }
      },
      (_, error) => {
        console.error("Error checking column:", error);
        return false;
      }
    );
  });
};
