import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().min(3).optional(),
  googleId: Joi.string().optional()
});

export const loginUserSchema = Joi.object({
      email: Joi.string().email().required().messages({
          'string.empty': 'Email is required',
          'string.email': 'Email must be a valid email address',
      }),
      password: Joi.string().min(3).required().messages({
          'string.empty': 'Password is required',
          'string.min': 'Password must be at least 6 characters long',
      }),
  });
  
