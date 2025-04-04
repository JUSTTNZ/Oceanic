import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Register Validator
const userRegisterValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    fullname: Joi.string().min(3).required(),
    username: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.details.map((e: any) => e.message) });
  }
};

// Login Validator
const userLoginValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string().required()
  }).xor('email', 'username'); // Either email OR username is required

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.details.map((e: any) => e.message) });
  }
};

export {
  userRegisterValidator,
  userLoginValidator
};
