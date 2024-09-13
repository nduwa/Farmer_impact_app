import "text-encoding-polyfill";
import joi from "joi";

export const FarmerDetailsSchema = joi.object({
  station_name: joi.string().required(),
  farmer_name: joi
    .string()
    .regex(/^[a-zA-Z \s]+$/)
    .required(),
  farmer_id: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  group_id: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  national_id: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(16)
    .required(),
  year_of_birth: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  gender: joi.string().required(),
  phone: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(10)
    .required(),
});

export const FarmDetailsSchema = joi.object({
  latitude: joi.number().required(),
  longitude: joi.number().required(),
  coffee_trees: joi.number().required(),
});

export const HouseholdDetailsSchema = joi.object({
  child_1_to_20_yrs: joi.number().required(),
  child_20_to_30_yrs: joi.number().required(),
  income_source_main: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
});

/*  year 1st = 2021,
    year 2nd = 2022,
    year 3rd = 2023,
    year 4th = 2024
*/

export const TreeDetailsASchema = joi.object({
  seedlings_year_1st: joi.number().required(),
  seedlings_year_2nd: joi.number().required(),
  seedlings_year_3rd: joi.number().required(),
  rejuvenated_year_3rd: joi.number().required(),
  rejuvenated_year_4th: joi.number().required(),
});

export const TreeDetailsBSchema = joi.object({
  trees_less_than_10: joi.number().required(),
  trees_10_20: joi.number().required(),
  other_crops_in_farm: joi.string().required(),
  other_crops_in_coffee_farm: joi.string().required(),
  shade_trees: joi.number().required(),
  natural_shade_trees: joi.number().required(),
  nitrogen_fixing_shade_trees: joi.number().required(),
  prod_est_year_4th: joi.number().required(),
  prod_est_year_3rd: joi.number().required(),
  coffee_farms: joi.number().required(),
  trees_20_more: joi.number().required(),
});
