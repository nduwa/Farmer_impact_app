import "text-encoding-polyfill";
import joi from "joi";

export const FarmerTressSchema = joi.object({
  _kf_Staff: joi.string().required(),
  _kf_User: joi.string().required(),
  Group_ID: joi.string().required(),
  farmer_ID: joi.string().required(),
  farmer_name: joi.string().required(),
  national_ID: joi.string().required(),
  full_name: joi.string().required(),
  created_at: joi.date(),
  received_seedling: joi.string().regex(/^[0-9\s]+$/),
  survived_seedling: joi.string().regex(/^[0-9\s]+$/),
  planted_year: joi.string().required(),
  old_trees: joi.string().regex(/^[0-9\s]+$/),
  old_trees_planted_year: joi.string().required(),
  coffee_plot: joi.string().regex(/^[0-9\s]+$/),
  nitrogen: joi.string().regex(/^[0-9\s]+$/),
  natural_shade: joi.string().regex(/^[0-9\s]+$/),
  shade_trees: joi.string().regex(/^[0-9\s]+$/),
});
