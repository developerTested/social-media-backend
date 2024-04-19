import { body } from 'express-validator';

const loginValidationRules = [
    body('email').notEmpty().trim().isEmail().withMessage('Email is required'),
    body('password').notEmpty().trim().withMessage('Password is required'),
];

const registerValidationRules = [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').notEmpty().trim().isEmail().withMessage('Email is required'),
    body('password').notEmpty().trim().withMessage('Password is required'),
    body('password').isLength({ min: 5 }),
    body('passwordConfirmation').equals('password')
];

export {
    loginValidationRules,
    registerValidationRules,
}