import "text-encoding-polyfill";
import joi from "joi";

export const newFarmerSchema = joi.object({
  _kf_User: joi.string().required(),
  _kf_Staff: joi.string().required(),
  user_code: joi.string().required(),
  Math_Skills: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  Year_Birth: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  cell: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  village: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  sector: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  education_level: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  created_at: joi.date(),
  Gender: joi.string().required(),
  Marital_Status: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  farmer_name: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  full_name: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  National_ID: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(16)
    .required(),
  phone: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(10)
    .required(),
  Trees_Producing: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  Skills: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  Trees: joi.string().regex(/^[0-9\s]+$/),
  number_of_plots: joi.string().regex(/^[0-9\s]+$/),
  Group_ID: joi.string().allow(null, ""),
  farm_GPS: joi.string().allow(null, ""),
});
