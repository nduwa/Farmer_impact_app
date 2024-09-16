import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

const db = SQLite.openDatabase(DB_NAME);

export const runQuery = async ({
  query,
  tableName = null,
  setActivityFn = null,
  activity = null,
}) => {
  if (!query) return;

  if (setActivityFn && activity) setActivityFn(`${activity}...`);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        () => {
          if (setActivityFn && activity) setActivityFn(`${activity} completed`);

          if (tableName) console.log(`data inserted into ${tableName}`);
        },
        (_, error) => {
          console.error("Error inserting data: ", error);
          return;
        }
      );
    });
  });
};

export const runQueriesSequentially = async (queries) => {
  try {
    for (const query of queries) {
      await runQuery({ query });
    }
    console.log("All queries executed successfully.");
  } catch (error) {
    console.error("Error executing queries:", error);
  }
};
