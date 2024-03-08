import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase(process.env.DB_NAME);

export const retrieveDBdata = ({
  stationId = null,
  groupID = null,
  tableName,
  setData,
}) => {
  let query = "";

  if (tableName === "rtc_groups") {
    query = `SELECT * FROM ${tableName} WHERE _kf_Station='${stationId}'`;
  } else if (tableName === "rtc_farmers") {
    query = `SELECT * FROM ${tableName} WHERE _kf_Station='${stationId}' AND _kf_Group='${groupID}'`;
  } else if (tableName === "rtc_supplier") {
    query = `SELECT * FROM ${tableName}`;
  }

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
      },
      (_, error) => {
        console.error("Error retrieving data:", error);
      }
    );
  });
};
