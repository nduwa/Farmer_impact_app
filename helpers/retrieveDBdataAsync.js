import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const retrieveDBdataAsync = ({
  stationId = null,
  filterValue = null,
  filterCol = "site_day_lot",
  tableName = null,
  customQuery = null,
}) => {
  let query = "";

  if (tableName === "rtc_station") {
    query = `SELECT * FROM rtc_station  WHERE __kp_Station='${stationId}'`;
  } else if (tableName === "rtc_seasons") {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    query = `SELECT * FROM rtc_seasons`; // WHERE z_Year=${currentYear}`;
  } else if (tableName === "rtc_supplier") {
    query =
      "SELECT supplier.* FROM rtc_station AS station INNER JOIN rtc_supplier AS supplier ON station._kf_Supplier = supplier.__kp_Supplier;";
  } else if (tableName === "rtc_transactions") {
    query = `SELECT * FROM rtc_transactions WHERE ${filterCol}='${filterValue}';`;
  } else if (tableName === "rtc_households") {
    query = `SELECT households.* FROM rtc_farmers AS farmers JOIN rtc_households AS households ON farmers._kf_Household = households.__kp_Household WHERE farmers.farmerid = '${filterValue}';`;
  }

  if (customQuery) query = customQuery;

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            let data = result.rows;
            if (result.rows.length < 1) {
              resolve([]);
            } else {
              if (tableName === "rtc_transactions") {
                resolve(data._array);
              }
              resolve(data._array[0]);
            }
          },
          (_, error) => {
            console.log("Error: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Error: ", error);
        reject(error);
      }
    );
  });
};
