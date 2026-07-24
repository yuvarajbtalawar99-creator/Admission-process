import Joi from 'joi';

export const submitGrievanceSchema = Joi.object({
  category: Joi.string().required().messages({
    'any.required': 'Category is required.',
  }),
  subject: Joi.string().min(5).max(255).required().messages({
    'string.min': 'Subject must be at least 5 characters.',
    'any.required': 'Subject is required.',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters.',
    'any.required': 'Description is required.',
  }),
});
