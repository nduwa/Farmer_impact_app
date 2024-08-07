import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const retrieveDBdata = ({
  stationId = null,
  groupID = null,
  queryArg = null,
  tableName,
  setData,
  setEmpty = null,
}) => {
  let query = "";

  if (tableName === "rtc_groups") {
    query =
      queryArg || `SELECT * FROM ${tableName} WHERE _kf_Station='${stationId}'`;
  } else if (tableName === "rtc_farmers") {
    query =
      queryArg ||
      `SELECT * FROM ${tableName} WHERE _kf_Station='${stationId}' AND _kf_Group='${groupID}' AND deleted = 0`;
  } else if (tableName === "rtc_supplier") {
    query = queryArg || `SELECT * FROM ${tableName}`;
  } else if (tableName === "rtc_transactions") {
    query = queryArg || `SELECT * FROM ${tableName}`;
  } else if (tableName === "rtc_households") {
    query =
      queryArg || `SELECT * FROM ${tableName} WHERE group_id='${groupID}'`;
  } else if (tableName === "rtc_inspections") {
    query = queryArg || "SELECT * FROM rtc_inspections WHERE uploaded=0 ;";
  }

  if (queryArg) query = queryArg;

  if (query.length < 1) return;

  console.log(query);

  let data = [];
  db.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows }) => {
        data = rows._array; // Retrieve the data from the result set
        console.log(`Retrieved data for ${tableName}`);
        setData(data);
        if (setEmpty && data.length == 0) setEmpty(true);
      },
      (_, error) => {
        console.error("Error retrieving data:", error);
      }
    );
  });
};
