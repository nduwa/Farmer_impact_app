import "text-encoding-polyfill";
import joi from "joi";

export const newFarmerSchema = joi.object({
  __kp_Farmer: joi.string().required(),
  _kf_Group: joi.string().required(),
  _kf_Household: joi.string().required(),
  __kp_Household: joi.string().required(),
  _kf_Location: joi.string().allow(null, ""),
  _kf_Station: joi.string().required(),
  _kf_Supplier: joi.string().required(),
  Math_Skills: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  Year_Birth: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  Area_Small: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  Area_Smallest: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  education_level: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  farmerid: joi.string().allow(null, ""),
  householdid: joi.string().allow(null, ""),
  seasonal_goal: joi.string().allow(null, ""),
  recordid: joi.string().allow(null, ""),
  type: joi.string().allow(null, ""),
  sync_farmers: joi.string().allow(null, ""),
  uploaded: joi.string().allow(null, ""),
  CAFE_ID: joi.string().allow(null, ""),
  SAN_ID: joi.string().allow(null, ""),
  UTZ_ID: joi.string().allow(null, ""),
  Children: joi.string().allow(null, ""),
  Childen_gender: joi.string().allow(null, ""),
  Childen_below_18: joi.string().allow(null, ""),
  created_at: joi.date(),
  registered_at: joi.date(),
  updated_at: joi.string().allow(null, ""),
  uploaded_at: joi.string().allow(null, ""),
  created_by: joi.string().required(),
  Gender: joi.string().required(),
  Marital_Status: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  Name: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  National_ID_t: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(16)
    .required(),
  Phone: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .length(10)
    .required(),
  Position: joi
    .string()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .required(),
  Trees_Producing: joi
    .string()
    .regex(/^[0-9\s]+$/)
    .required(),
  Reading_Skills: joi
    .string()
    .regex(/^[a-zA-Z0-9 \s]+$/)
    .required(),
  STP_Weight: joi.string().allow(null, ""),
  latitude: joi.number().allow(null, ""),
  longitude: joi.number().allow(null, ""),
  Trees: joi.string().regex(/^[0-9\s]+$/),
  number_of_plots_with_coffee: joi.string().regex(/^[0-9\s]+$/),
  z_Farmer_Primary: joi.string().allow(null, ""),
  group_id: joi.string().allow(null, ""),
  status: joi.string().allow(null, ""),
  inspectionId: joi.string().allow(null, ""),
  cafeId: joi.string().allow(null, ""),
  InspectionStatus: joi.string().allow(null, ""),
  sync: joi.string().allow(null, ""),
});
