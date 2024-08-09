import "text-encoding-polyfill";
import joi from "joi";

export const updateFarmerSchema = joi.object({
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
  education_level: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  Gender: joi.string().required(),
  Marital_Status: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  farmer_name: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  national_ID: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(16)
    .required(),
  Phone: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(10)
    .required(),
  Trees_Producing: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  Reading_Skills: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  Trees: joi.string().regex(/^[0-9\s]+$/),
  number_of_plots_with_coffee: joi.string().regex(/^[0-9\s]+$/),
  Group_ID: joi.string().allow(null, ""),
});
