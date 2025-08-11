import Joi from 'joi';
// Register Validator
const userRegisterValidator = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        fullname: Joi.string().min(3).required(),
        username: Joi.string().alphanum().min(3).required(),
        password: Joi.string().min(6).required(),
        phoneNumber: Joi.string().required(),
    });
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.details.map((e) => e.message) });
    }
};
// Login Validator
const userLoginValidator = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().required()
    }).xor('email', 'username'); // Either email OR username is required
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.details.map((e) => e.message) });
    }
};
export { userRegisterValidator, userLoginValidator };
//# sourceMappingURL=validator.js.map