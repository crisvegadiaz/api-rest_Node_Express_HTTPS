import joi from "joi";

export const verifyData = (data, isUpdate = false) => {
  const schema = joi.object({
    username: joi
      .string()
      .min(3)
      .max(30)
      .when("$isUpdate", {
        is: true,
        then: joi.optional(),
        otherwise: joi.required(),
      })
      .messages({
        "string.empty": "Username cannot be empty.",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username cannot exceed 30 characters.",
        "any.required": "Username is required.",
      }),
    email: joi
      .string()
      .email()
      .when("$isUpdate", {
        is: true,
        then: joi.optional(),
        otherwise: joi.required(),
      })
      .messages({
        "string.email": "Email format is invalid.",
        "string.empty": "Email cannot be empty.",
        "any.required": "Email is required.",
      }),
    password_hash: joi
      .string()
      .min(8)
      .when("$isUpdate", {
        is: true,
        then: joi.optional(),
        otherwise: joi.required(),
      })
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.empty": "Password cannot be empty.",
        "any.required": "Password is required.",
      }),
    last_login: joi.date().optional().messages({
      "date.base": "Last login must be a valid date.",
    }),
  });

  return schema.validate(data, { abortEarly: false, context: { isUpdate } });
};

export const verifyID = (id) => {
  return isNaN(id) || Number(id) < 0 || !/^\d+$/.test(id);
}
