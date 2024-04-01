import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const detectNewUser = ({ newStationId }) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM rtc_station WHERE __kp_Station='${newStationId}'`,
          [],
          (_, result) => {
            if (result.rows.length < 1) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.log("Error finding station: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Transaction error: ", error);
        reject(error);
      }
    );
  });
};
