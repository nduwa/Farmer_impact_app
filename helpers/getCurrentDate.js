export const getCurrentDate = (dateStr = null) => {
  let date = dateStr || new Date();
  let formattedDate = date.toISOString().split("T")[0];
  let formattedTime = date.toISOString().split("T")[1].split(".")[0];

  return `${formattedDate} ${formattedTime}`;
};
