import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@env";

// Open or create the database
const db = SQLite.openDatabase(DB_NAME);

export const ParallelInsertToDb = async (tablesDataArray, notifyFn) => {
  db.transaction((tx) => {
    // Start the transaction
    tx.executeSql(
      "BEGIN TRANSACTION;",
      [],
      () => {
        // Loop through each table and its corresponding data (bulk records)
        tablesDataArray.forEach(({ tableName, records }) => {
          if (records.length === 0) return; // Skip if no records

          // Get columns from the first record (assuming all records have the same structure)
          const columns = Object.keys(records[0]).join(", ");

          // Create placeholders for each record
          const placeholders = records
            .map(
              () =>
                `(${new Array(Object.keys(records[0]).length)
                  .fill("?")
                  .join(", ")})`
            )
            .join(", ");

          // Flatten the values of all records into one array
          const values = records.flatMap(Object.values);

          // Construct the SQL query for bulk insert
          const sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${placeholders}`;

          // Execute the bulk insert
          tx.executeSql(
            sqlQuery,
            values,
            () => {
              console.log(`Inserted into ${tableName}`);
              notifyFn(`Inserted into ${tableName}`);
            },
            (_, error) => {
              console.error(`Error inserting into ${tableName}:`, error);
              tx.executeSql("ROLLBACK;", []); // Rollback if any insert fails
              return true; // Stops further execution
            }
          );
        });

        // Commit if all inserts succeed
        tx.executeSql(
          "COMMIT;",
          [],
          () => console.log("Transaction committed successfully"),
          (_, error) => {
            console.error("Error during commit:", error);
            tx.executeSql("ROLLBACK;", []); // Rollback if commit fails
          }
        );
      },
      (error) => {
        console.error("Error starting transaction:", error);
      }
    );
  });
};
