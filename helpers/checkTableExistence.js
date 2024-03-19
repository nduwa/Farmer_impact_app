import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase(process.env.DB_NAME);

export const checkTableExistence = async () => {
  try {
    const tables = [
      { name: "rtc_station", storageKey: "rtc-sync-stations" },
      { name: "rtc_groups", storageKey: "rtc-sync-groups" },
      { name: "rtc_farmers", storageKey: "rtc-sync-farmers" },
      { name: "rtc_households", storageKey: "rtc-sync-households" },
      { name: "rtc_training", storageKey: "rtc-sync-trainingModules" },
      {
        name: "inspection_questions",
        storageKey: "rtc-sync-inspectionQuestions",
      },
      { name: "rtc_supplier", storageKey: "rtc-sync-suppliers" },
      { name: "rtc_seasons", storageKey: "rtc-sync-seasons" },
    ];

    const results = await Promise.all(
      tables.map(async (table) => {
        return new Promise((resolve, reject) => {
          const query = `SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='${table.name}'`;
          db.transaction((tx) => {
            tx.executeSql(
              query,
              [],
              (_, { rows }) => {
                const count = rows.item(0).count;
                const exists = count > 0;
                resolve({ table, exists });
              },
              (_, error) => {
                console.error(error);
                reject(error);
              }
            );
          });
        });
      })
    );

    for (const result of results) {
      if (!result.exists) {
        await SecureStore.setItemAsync(result.table.storageKey, "0");
      }
    }

    console.log("Table existence check: DONE");

    const tableData = await Promise.all(
      results.map(async (result) => {
        return new Promise((resolve, reject) => {
          let data = [];
          if (result.exists) {
            const query = `SELECT * FROM ${result.table.name}`;

            db.transaction((tx) => {
              tx.executeSql(
                query,
                [],
                (_, { rows }) => {
                  data = rows._array;
                  console.log(`${result.table.name}: `, data);

                  resolve({
                    table: result.table.storageKey,
                    dataExists: data.length > 0,
                  });
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          } else {
            return { table: result.table.storageKey, dataExists: false };
          }
        });
      })
    );

    for (const item of tableData) {
      if (item.dataExists) {
        await SecureStore.setItemAsync(item.table, "1");
      } else {
        await SecureStore.setItemAsync(item.table, "0");
      }
    }

    console.log("Check for Table data: DONE");
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
