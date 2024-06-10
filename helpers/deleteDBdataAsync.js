import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const deleteDBdataAsync = ({
  tableName,
  targetCol = "paper_receipt",
  targetId = null,
  customQuery = null,
}) => {
  let query = `DELETE FROM ${tableName} WHERE ${targetCol}='${targetId}'`;

  if (customQuery) query = customQuery;

  console.log(query);

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [],
          (_, result) => {
            if (result.rowsAffected > 0 || result.rows.length > 0) {
              resolve({ success: true, deletedTransaction: targetId });
            } else {
              resolve({ success: false });
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
