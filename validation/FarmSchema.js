import "text-encoding-polyfill";
import joi from "joi";

export const FarmSchema = joi.object({
  soil_slope: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  cropNameId: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
  farm_unit_area: joi.string().regex(/^[0-9]*(\.[0-9]+)?$/),
});
