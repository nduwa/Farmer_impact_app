import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const dropTableAsync = ({ tableName }) => {
  let query = `DROP TABLE IF EXISTS ${tableName};`;

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            resolve(result);
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
