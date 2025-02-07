export const generateID = ({
  type,
  staffId = null,
  supplierId = null,
  username = null,
  userID = null,
  date = null,
}) => {
  try {
    let id;
    const currentDate = date || new Date();
    const twoDigitYear = currentDate.getFullYear().toString().slice(-2);
    const twoDigitMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const twoDigitDay = ("0" + currentDate.getDate()).slice(-2);
    const maxDigits = 9999;

    if (type === "lotnumber") {
      if (!staffId) return;
      const randomNumber = Math.floor(Math.random() * (maxDigits + 1));
      id = `FTR${twoDigitYear}${twoDigitDay}${twoDigitMonth}${staffId}${randomNumber}`;
    } else if (type === "site_day_lot") {
      if (!staffId) return;
      id = `SCJ${staffId}${twoDigitYear}${twoDigitDay}${twoDigitMonth}`;
    } else if (type === "cherry_lot_id") {
      if (!supplierId) return;
      id = `${twoDigitYear}${supplierId}CH${twoDigitDay}${twoDigitMonth}`;
    } else if (type === "parchment_lot_id") {
      if (!supplierId) return;
      id = `${twoDigitYear}${supplierId}P${twoDigitDay}${twoDigitMonth}`;
    } else if (type === "bad_cherry_lot_id") {
      if (!supplierId) return;
      id = `${twoDigitYear}${supplierId}CH${twoDigitDay}${twoDigitMonth}F`;
    } else if (type === "bad_parch_lot_id") {
      if (!supplierId) return;
      id = `${twoDigitYear}${supplierId}P${twoDigitDay}${twoDigitMonth}F`;
    } else if (type === "day_lot_number") {
      id = `${twoDigitDay}${twoDigitMonth}${twoDigitYear}`;
    } else if (type === "uuid") {
      const timestamp = Math.floor(Date.now() / 1000);
      id = `${username}${timestamp}${userID}`;
    } else if (type === "fm_uuid") {
      const segment = () =>
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);

      return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`;
    }

    return id;
  } catch (error) {
    console.log(error);
  }
};
