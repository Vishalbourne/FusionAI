import Joi from 'joi';

const validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(), // Name is required
    users: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(), // Users should be an array of valid ObjectId strings
  });

  return schema.validate(data);
};

export default validateProject;
