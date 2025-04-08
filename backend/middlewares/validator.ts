import Joi from "joi"
import { School } from '../models/school.model.ts';
import { Department } from '../models/department.model.ts';
import { Level } from '../models/levels.model.ts';


const userRegisterValidator = async (req, res, next) => {
    const userSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        fullname: Joi.string().required(),
        password: Joi.string().required(),
        phoneNumber: Joi.string().required(),
    });

    try {
        await userSchema.validateAsync(req.body, { abortEarly: false });

        // Fetch the school, department, and level details
        const schoolDoc = await School.findOne({ name: req.body.school.trim() });
        const departmentDoc = await Department.findOne({ name: req.body.department.trim() });
        const levelDoc = await Level.findOne({ name: req.body.level.trim() });

        if (!schoolDoc || !departmentDoc || !levelDoc) {
            return res.status(400).json({ message: "Invalid school, department, or level" });
        }

        // Store both ObjectId and name
        req.body.school = { _id: schoolDoc._id, name: schoolDoc.name };
        req.body.department = { _id: departmentDoc._id, name: departmentDoc.name };
        req.body.level = { _id: levelDoc._id, name: levelDoc.name };

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Validation error occurred", errors: error.message });
    }
};



const userLoginValidator = async (req, _res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().optional(),
        registrationNumber: Joi.string().optional(),
        password: Joi.string().required()
    }).or('email', 'registrationNumber');

    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
};


export {
    userLoginValidator,
    userRegisterValidator
}