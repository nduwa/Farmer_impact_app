import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const updateDBdata = ({ id, query, setCurrentJob, msgYes, msgNo }) => {
  try {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            if (result.rowsAffected > 0 || result.rows.length > 0) {
              setCurrentJob(msgYes);
            } else {
              setCurrentJob(msgNo);
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
      }
    );
  } catch (error) {
    console.log("Error updating data: ", error);
  }
};