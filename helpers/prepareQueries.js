export const PrepareQueries = (tablesDataArray, setQueryStateFn) => {
  let queries = [];
  for (const { tableName, records } of tablesDataArray) {
    if (records.length === 0) continue;

    // Extract columns from the first record
    const columns = Object.keys(records[0]).join(", ");

    // Construct the values part of the query for all records
    const valuesString = records
      .map((record) => {
        return (
          "(" +
          Object.values(record)
            .map((value) => {
              if (value === null || value === undefined) {
                return "NULL";
              } else if (typeof value === "number") {
                return value; // No quotes for numbers
              } else if (typeof value === "boolean") {
                return value ? 1 : 0; // Convert booleans to 1 or 0
              } else {
                return `'${value.replace(/'/g, "''")}'`; // Escape single quotes for strings
              }
            })
            .join(", ") +
          ")"
        );
      })
      .join(", ");

    let sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${valuesString}`;

    queries.push(sqlQuery);
  }

  setQueryStateFn(queries);
};
