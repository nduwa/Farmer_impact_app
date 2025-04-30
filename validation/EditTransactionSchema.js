import "text-encoding-polyfill";
import joi from "joi";

export const EditTransactionSchema = joi.object({
  certification: joi.string().required(),
  certified: joi.number().required(),
  edited: joi.number().required(),
  coffee_type: joi.string().required(),
  cash_paid: joi.number().min(1).required(),
  total_mobile_money_payment: joi.number().optional(),
  kilograms: joi.number().optional(),
  unitprice: joi.number().optional(),
  bad_kilograms: joi.number().optional(),
  bad_unit_price: joi.number().optional(),
  deliveredBy_gender: joi.string().valid("F", "M").required(),
});
