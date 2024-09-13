const ParallelReadDb = async (tablesQueryArray) => {
  return new Promise((resolve, reject) => {
    const results = {};

    db.transaction(
      (tx) => {
        // Loop through each table and its corresponding query
        tablesQueryArray.forEach(({ tableName, whereClause, whereArgs }) => {
          const query = `SELECT * FROM ${tableName} ${
            whereClause ? `WHERE ${whereClause}` : ""
          }`;

          // Execute the select query
          tx.executeSql(
            query,
            whereArgs || [],
            (_, { rows }) => {
              results[tableName] = rows._array; // Store the result in an object with the table name as key
            },
            (_, error) => {
              console.error(`Error retrieving data from ${tableName}:`, error);
              reject(error); // Reject if any select query fails
              return true; // Stops further execution
            }
          );
        });
      },
      (error) => {
        reject(error); // Reject if there was an error during the transaction
      },
      () => {
        resolve(results); // Resolve with the results once the transaction is successful
      }
    );
  });
};
