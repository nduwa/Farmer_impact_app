import "text-encoding-polyfill";
import joi from "joi";

export const CoffeePurchaseSchema = joi.object({
  farmerName: joi
    .string()
    .regex(/^[a-zA-Z \s]+$/)
    .required(),
  farmerID: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  certification: joi.string().required(),
  coffeeType: joi.string().required(),
  phone: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(10)
    .allow([""])
    .optional(),
  receiptNumber: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  cashTotal: joi.number().min(1).required(),
  cashTotalMobile: joi.number().optional(),
  kgGood: joi.number().optional(),
  priceGood: joi.number().optional(),
  totalGood: joi.optional(),
  kgBad: joi.number().optional(),
  priceBad: joi.number().optional(),
  totalBad: joi.optional(),
  transactionDate: joi.date().required(),
  deliveredGender: joi.string().valid("F", "M").required(),
  deliveredName: joi.string().optional(),
  deliveredPhone: joi.string().optional(),
});
