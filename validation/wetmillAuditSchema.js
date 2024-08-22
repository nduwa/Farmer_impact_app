import "text-encoding-polyfill";
import joi from "joi";

export const cherriesSchema = joi.object({
  cherries_sms: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  cherries_books: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_perc_cherries: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_kgs_cherries: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_reason_cherries: joi.string().required(),
});

export const parchSchema = joi.object({
  parch_delivered: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  parch_tables: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  parch_tanks: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  parch_theory: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  parch_total: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  parch_storehouse: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_perc_parch: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_kgs_parch: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_reason_parch: joi.string().required(),
});

export const pricingSchema = joi.object({
  vol_participant: joi.string().required(),
  buckets_actual: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  buckets_theory: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_perc_pricing: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_buckets_pricing: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_reason_pricing: joi.string().required(),
});

export const expenseSchema = joi.object({
  std_price: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  std_total_paid: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  expected_std_cherries: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_perc_expenses: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  discrepancy_kgs_expenses: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
});

export const staffSchema = joi.object({
  std_salary_expense: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  salary_cost_kg: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  std_fuel_expense: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  fuel_cost_kg: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  std_other_expense: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  other_cost_kg: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
});

export const leftBeansSchema = joi.object({
  manpower_count: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  parch_person_day_manpower: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  handsorter_count: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  parch_person_day_handsorter: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
});

export const QalQatSchema = joi.object({
  leftover_beans: joi.string().required(),
  leftover_comment: joi.string().required(),
  leftover_photo: joi.string().required(),
});

export const appearanceSchema = joi.object({
  water_quality: joi.string().required(),
  water_quality_comment: joi.string().required(),
  water_quality_photo: joi.string().required(),
  water_suffient: joi.string().required(),
  water_suffient_comment: joi.string().required(),
  water_suffient_photo: joi.string().required(),
});

export const congestionSchema = joi.object({
  color_smell_tanks: joi.string().required(),
  color_smell_tanks_photo: joi.string().required(),
  parchment_appearance: joi.string().required(),
  parchment_appearance_photo: joi.string().required(),
});

export const conclusionSchema = joi.object({
  drying_congestion: joi.string().required(),
  drying_congestion_comment: joi.string().required(),
  drying_congestion_photo1: joi.string().required(),
  drying_congestion_photo2: joi.string().required(),
  drying_congestion_comment2: joi.string().required(),
});

export const approvalSchema = joi.object({
  approve: joi.string().required(),
  approve_comment: joi.string().required(),
});
