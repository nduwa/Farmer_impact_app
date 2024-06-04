import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const updateDBdataAsync = ({ id, query }) => {
  if (!query || !id) return;

  console.log(query);

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            if (result.rowsAffected > 0 || result.rows.length > 0) {
              resolve({ success: true, updatedRecord: id });
            } else {
              resolve({ success: false });
            }
          },
          (_, error) => {
            if (!error) db.closeSync(); // Close the database connection
            console.log("Error: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        if (!error) db.closeSync(); // Close the database connection
        console.log("Error: ", error);
        reject(error);
      }
    );
  });
};
