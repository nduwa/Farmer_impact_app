import "text-encoding-polyfill";
import joi from "joi";

export const WeeklyReportSchema = joi.object({
  _kf_Staff: joi.string().required(),
  _kf_User: joi.string().required(),
  user_code: joi.string().required(),
  full_name: joi.string().required(),
  createdAt: joi.date(),
  trained_number: joi.string().regex(/^[0-9\s]+$/),
  men_attended: joi.string().regex(/^[0-9\s]+$/),
  women_attended: joi.string().regex(/^[0-9\s]+$/),
  planned_groups: joi.string().regex(/^[0-9\s]+$/),
  farm_inspected: joi.string().regex(/^[0-9\s]+$/),
  planned_inspected: joi.string().regex(/^[0-9\s]+$/),
  comments: joi.string().allow(null, ""),
});
