import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const detectNewUser = ({ user_key }) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM tmp_sessions WHERE __kp_user='${user_key}'`,
          [],
          (_, result) => {
            if (result.rows.length < 1) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.log("Error finding user: ", error);
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
