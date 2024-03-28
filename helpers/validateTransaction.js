import { retrieveDBdataAsync } from "./retrieveDBdataAsync";
import { FARMER_TREE_WEIGHT_RATIO } from "@env";

export const validateTransaction = async ({
  farmerid,
  kgsGood,
  kgsBad,
  currentSeasonWeight,
  setValid,
  setCurrentJob,
  setError,
}) => {
  try {
    if (farmerid === "") {
      setValid(true);
      return;
    }

    let maxWeight = 0;
    let trees = 0;
    let weight1 = parseFloat(kgsBad) || 0;
    let weight2 = parseFloat(kgsGood) || 0;
    let transactionWeightTotal = weight1 + weight2; // total weight of the current transaction
    let newWeightTotal = currentSeasonWeight + transactionWeightTotal; // overall season weight if the current transaction is completed

    retrieveDBdataAsync({
      filterValue: farmerid,
      tableName: "rtc_households",
    })
      .then((result) => {
        trees = parseInt(result.Trees);
        maxWeight = trees * FARMER_TREE_WEIGHT_RATIO;

        if (newWeightTotal <= maxWeight) {
          setValid(true);
        } else {
          setValid(false);
          let difference = newWeightTotal - maxWeight;
          setCurrentJob("Maximum weight allowed exceeded");
          setError({
            message: `Maximum weight of ${maxWeight} Kg(s) has exceeded by ${difference} Kg(s)`,
            type: "weight",
          });
        }
      })
      .catch((error) => {
        console.log("Failed to retrieve household: ", error);
      });
  } catch (error) {
    console.log(error);
  }
};
